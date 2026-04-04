

# Fix Cart Image Preview + 404 Routes

## Two Issues Found

### Issue 1: Cart shows raw URLs instead of images
In `src/pages/Cart.tsx` line 78, `{item.image}` renders the Unsplash URL as plain text. It needs to be an `<img>` tag.

### Issue 2: `/print-shops`, `/settings`, `/reports` give 404
The user is navigating to `/print-shops` (top-level) but these routes only exist under `/admin/print-shops`. The `/print-shop/*` route (for the Print Shop Dashboard) uses a wildcard but only renders the `PrintShopDashboard` component — there's no `/print-shops` route at the top level.

The user is on `/print-shops` (plural) which matches neither `/print-shop/*` nor `/admin/print-shops`. This hits the `*` catch-all and shows NotFound.

**Most likely cause**: The user is clicking links that point to `/print-shops`, `/settings`, `/reports` without the `/admin` prefix — possibly from the PrintShopDashboard sidebar or direct URL entry.

---

## Changes

### 1. Fix cart item image display (`src/pages/Cart.tsx`)

Replace line 77-79 (the `{item.image}` text render) with a proper `<img>` tag:
- If `item.image` starts with `http`, render `<img src={item.image} className="h-20 w-20 object-cover rounded-lg" />`
- Otherwise fall back to a placeholder icon

### 2. Clarify 404 routes

The admin routes (`/admin/print-shops`, `/admin/settings`, `/admin/reports`) already work. The issue is that the user is typing `/print-shops` (without `/admin` prefix) in the URL bar. Two options:

**Option A** — Add redirect routes from `/print-shops` → `/admin/print-shops`, `/settings` → `/admin/settings`, `/reports` → `/admin/reports`

**Option B** — The routes are correct as-is; the user just needs to navigate via `/admin` sidebar

I'll implement **Option A** with `<Navigate>` redirects for convenience.

---

## Files Modified

| File | Change |
|---|---|
| `src/pages/Cart.tsx` | Render `<img>` instead of raw URL text for cart items |
| `src/App.tsx` | Add redirect routes for `/print-shops`, `/settings`, `/reports` to their `/admin/` equivalents |

