#!/usr/bin/env node
/**
 * Supabase connectivity check.
 *
 * Reads .env (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY) and probes the
 * live project the same way the browser does: anonymous PostgREST reads on the
 * catalog tables the storefront renders from.
 *
 *   node scripts/check-supabase.mjs
 *
 * Every check prints PASS / FAIL with the HTTP status, so an empty storefront
 * can be told apart from a missing table, a rejected key, or a blocked network.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readEnv() {
  const env = { ...process.env };
  try {
    for (const line of readFileSync(resolve(root, ".env"), "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env — fall back to process env */
  }
  return env;
}

const env = readEnv();
const URL_BASE = (env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
const KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function request(path, { method = "GET", headers = {} } = {}) {
  const res = await fetch(`${URL_BASE}${path}`, {
    method,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, ...headers },
  });
  const body = await res.text();
  return { status: res.status, ok: res.ok, body, headers: res.headers };
}

console.log(`\nProject: ${URL_BASE || "(not set)"}\n`);

// ---- 1. Environment ----
record("VITE_SUPABASE_URL is set", Boolean(URL_BASE), URL_BASE || "missing from .env");
record(
  "VITE_SUPABASE_PUBLISHABLE_KEY is set",
  Boolean(KEY),
  KEY ? `${KEY.slice(0, 18)}… (${KEY.length} chars)` : "missing from .env"
);
if (!URL_BASE || !KEY) {
  console.log("\nCannot continue without both values in .env.\n");
  process.exit(1);
}

// ---- 2. Reachability & key ----
try {
  const health = await request("/auth/v1/health");
  record("Project reachable (auth health)", health.ok, `HTTP ${health.status}`);
} catch (err) {
  record("Project reachable (auth health)", false, `network error: ${err.message}`);
  console.log("\nThe host could not be reached at all — DNS, firewall, or a paused/deleted project.\n");
  process.exit(1);
}

const restRoot = await request("/rest/v1/");
record(
  "API key accepted by PostgREST",
  restRoot.status !== 401 && restRoot.status !== 403,
  `HTTP ${restRoot.status}${restRoot.status === 401 ? " — key rejected (wrong key, or publishable keys disabled on this project)" : ""}`
);

// ---- 3. Catalog tables, as an anonymous visitor ----
const tables = ["categories", "products", "product_variants", "product_themes"];
const counts = {};
for (const table of tables) {
  const res = await request(`/rest/v1/${table}?select=*&limit=1`, {
    headers: { Prefer: "count=exact", Range: "0-0" },
  });
  const range = res.headers.get("content-range") ?? "";
  const total = range.includes("/") ? range.split("/")[1] : "?";
  counts[table] = res.ok ? Number(total) : null;

  if (res.status === 404) {
    record(`Table public.${table} exists`, false, "HTTP 404 — table not found; migrations were never applied (supabase db push)");
  } else if (res.status === 401 || res.status === 403) {
    record(`Anon can read public.${table}`, false, `HTTP ${res.status} — blocked by RLS or a rejected key: ${res.body.slice(0, 160)}`);
  } else if (!res.ok) {
    record(`Read public.${table}`, false, `HTTP ${res.status}: ${res.body.slice(0, 160)}`);
  } else {
    record(`Anon can read public.${table}`, Number(total) > 0, `HTTP 200, ${total} row(s)${Number(total) === 0 ? " — table is empty, seed migration not applied" : ""}`);
  }
}

// ---- 4. What the storefront will actually render ----
if (counts.products !== null && counts.products > 0) {
  const active = await request("/rest/v1/products?select=slug,name,featured&is_active=eq.true");
  if (active.ok) {
    const rows = JSON.parse(active.body);
    record("Products visible to visitors (is_active = true)", rows.length > 0, `${rows.length} product(s)`);
    record("Featured products for the homepage", rows.some((r) => r.featured), `${rows.filter((r) => r.featured).length} featured`);
  }
}

// ---- 5. Storage bucket ----
// order-images is private by design, so an anonymous key cannot inspect it.
// Whatever comes back here is information, never a verdict — counting it as a
// failure would fail a perfectly healthy project.
const bucket = await request("/storage/v1/bucket/order-images");
console.log(
  `INFO  Storage bucket 'order-images' — HTTP ${bucket.status}` +
    (bucket.ok ? " (readable with this key)" : " (private buckets need a service key to inspect; this is expected)")
);

// ---- Summary ----
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
if (failed.length) {
  console.log("\nFailed:");
  for (const f of failed) console.log(`  • ${f.name} — ${f.detail}`);
  console.log(
    "\nMost common causes, in order:\n" +
      "  1. Migrations never pushed  → supabase link --project-ref <ref> && supabase db push\n" +
      "  2. Tables exist but empty   → the seed migration (20260823000200_seed_catalog.sql) did not run\n" +
      "  3. HTTP 401 on every table  → the publishable key in .env does not belong to this project\n" +
      "  4. Live site empty, checks pass here → the deployed bundle was built without .env (npm run deploy from a checkout that has it)\n"
  );
  process.exit(1);
}
console.log("\nEverything the storefront needs is reachable and populated.\n");
