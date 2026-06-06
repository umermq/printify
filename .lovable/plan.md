## Goal
Add an **SEO / AEO / GEO** admin page (matches the screenshot reference) where you can view, edit, AI-generate, and bulk-optimize meta titles & descriptions for every product. Will also feed these into the live product pages so search engines + AI engines pick them up.

## What gets built

### 1. New admin page: `/admin/seo`
Sidebar link "SEO / AEO / GEO" added to `AdminLayout`.

Layout (matching your reference):
- **Top stats bar**: Total products • Optimized • Missing • Coverage %
- **"Optimize all missing (N)"** button — runs AI generation in batch for every product missing meta fields
- **Search box** + **All / Missing only** filter pills
- **Table**: Product · Meta title · Meta description · Status (Optimized / Missing) · Actions (Edit, Regenerate)
- **Edit dialog**: editable Meta title, Meta description, Focus keyword, Geo target (city/country for GEO), AEO Q&A snippet (for AI answer engines), plus "Regenerate with AI" button
- **Per-row Regenerate** = single AI call to refresh that product's meta

### 2. Data model
Extend the `Product` interface with optional SEO fields:
```
seo?: {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  geoTarget?: string;     // e.g. "Lahore, Pakistan"
  aeoSnippet?: string;    // 1-2 sentence direct answer for AI engines
  updatedAt?: string;
}
```
Stored in the existing `ProductContext` (localStorage today, same as products). `updateProduct` already handles persistence — no schema migration needed.

### 3. AI generation (Lovable AI Gateway — no API key required)
A single edge function `seo-generate` that takes `{ product }` and returns the SEO block. Uses `google/gemini-2.5-flash` (fast + cheap, good quality for meta copy). Prompt is tuned for:
- **SEO**: keyword-rich meta title (≤ 60 chars) + meta description (≤ 160 chars)
- **AEO**: a short direct-answer snippet optimized for ChatGPT / Perplexity / Google AI Overview
- **GEO**: localizes to Pakistan market (PKR pricing context, city mentions when relevant)

Frontend calls `supabase.functions.invoke("seo-generate", { body: { product } })`. Batch "Optimize all missing" loops sequentially with a small delay to respect rate limits and shows progress (`Optimizing 5/23…`).

### 4. Live SEO output on product pages
`ProductDetail.tsx` already uses `SEOHead`. Update it to prefer `product.seo.metaTitle` / `product.seo.metaDescription` when present, and inject the AEO snippet into the Product JSON-LD as a `description` + a small `FAQPage` schema when `aeoSnippet` exists. GEO target gets added to JSON-LD `areaServed`.

## Files touched

| File | Change |
|---|---|
| `src/data/products.ts` | Add optional `seo` field to `Product` interface |
| `src/contexts/ProductContext.tsx` | No structural change — uses existing update flow |
| `src/pages/admin/AdminLayout.tsx` | Add "SEO / AEO / GEO" sidebar link (Sparkles icon) |
| `src/pages/admin/SEOPage.tsx` | NEW — full page (stats, table, filters, edit dialog) |
| `src/App.tsx` | Register `/admin/seo` route |
| `src/pages/ProductDetail.tsx` | Use `product.seo.*` when available; richer JSON-LD |
| `supabase/functions/seo-generate/index.ts` | NEW — calls Lovable AI Gateway, returns SEO block |
| `supabase/config.toml` | Register the new function with `verify_jwt = false` |

## Out of scope (can add later if you want)
- SEO for category pages and CMS pages (this round = products only, matching your screenshot)
- Scheduled re-optimization / cron
- Sitemap auto-regeneration from SEO data
- Multilingual (en/ur) meta — current pass = English only

Want me to build it as scoped, or also include categories + CMS pages in the same page?
