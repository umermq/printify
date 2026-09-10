#!/usr/bin/env bash
#
# Takes main from a fresh pull all the way to a deployed site.
#
#   ./scripts/ship.sh
#
# Stops at the first step that fails rather than carrying on and leaving the
# frontend deployed against a database that never got its migrations. Every
# step is idempotent, so re-running after a fix is safe.
#
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

step() { printf '\n\033[1;36m▶ %s\033[0m\n' "$1"; }
fail() { printf '\n\033[1;31m✗ %s\033[0m\n' "$1" >&2; exit 1; }

PROJECT_REF="$(sed -n 's/^project_id *= *"\(.*\)"/\1/p' supabase/config.toml)"
[ -n "$PROJECT_REF" ] || fail "Could not read project_id from supabase/config.toml"

# ---------- Preflight ----------
step "Checking tools and working tree"
command -v npm >/dev/null || fail "npm not found. Install Node.js first."
command -v supabase >/dev/null || fail "supabase CLI not found. Install it with:
    brew install supabase/tap/supabase"

if [ -n "$(git status --porcelain)" ]; then
  git status --short
  fail "You have uncommitted changes. Commit or stash them, then run this again."
fi
echo "npm $(npm --version) · supabase $(supabase --version) · working tree clean"

# ---------- Code ----------
step "Pulling the latest main"
git checkout main
git pull origin main

step "Installing dependencies"
npm install --no-audit --no-fund

# ---------- Database ----------
step "Linking the Supabase project ($PROJECT_REF)"
supabase link --project-ref "$PROJECT_REF"

step "Pushing migrations"
supabase db push

step "Checking the live catalog through the anon key"
npm run check:supabase

# ---------- Frontend ----------
# .env is what Vite inlines into the bundle at build time, so a build without
# it ships a site that cannot reach Supabase at all.
[ -f .env ] || fail ".env is missing — the build would ship without Supabase credentials."

step "Building and deploying to Cloudflare"
npm run deploy

printf '\n\033[1;32m✓ Shipped.\033[0m\n'

cat <<'NOTE'

One switch this script deliberately leaves alone — turn it on once, by hand:

  Supabase dashboard → Authentication → Sign In / Providers
  → enable Anonymous sign-ins

Guest checkout needs it: a guest has no auth.uid(), and every orders policy
and the storage bucket's RLS are written against one. `supabase config push`
could set it, but this repo's config.toml carries only project_id, so pushing
it would reset every other auth setting on the live project to a default.
Not a trade worth making for one switch.
NOTE
