

# Fix Product Data Persistence + Sync Across App

## Problem

The admin Products page stores product edits only in React component state (`useState`). When you change a price, add a product, or edit any field and click "Save Changes", the data updates in the admin table but:
- It is lost on page refresh (no localStorage persistence)
- The storefront pages (`Products.tsx`, `ProductDetail.tsx`, `Index.tsx`) import directly from `@/data/products.ts` and never see admin edits

This is the same pattern that was already fixed for Settings and Orders.

## Solution

Create a **ProductContext** (similar to OrderContext) that:
1. Initializes from `localStorage`, falling back to the hardcoded product data
2. Persists every change to `localStorage`
3. Syncs across tabs via `storage` event listener
4. Is consumed by both admin and storefront pages

## Files to change

| File | Change |
|---|---|
| `src/contexts/ProductContext.tsx` | **New file.** Context provider with `products`, `categories`, `addProduct`, `updateProduct`, `deleteProduct`, `addCategory`, `updateCategory`, `deleteCategory`. localStorage-backed with cross-tab sync. |
| `src/App.tsx` | Wrap app in `ProductProvider` |
| `src/pages/admin/ProductsPage.tsx` | Replace `useState(initialProductData)` with `useProducts()` context. Call context mutations instead of local state setters. |
| `src/pages/admin/CategoriesPage.tsx` | Replace `useState(initialCats)` with `useProducts()` context for categories. |
| `src/pages/Products.tsx` | Import `products`/`categories` from context instead of static data file |
| `src/pages/ProductDetail.tsx` | Import `products` from context instead of static data file |
| `src/pages/Index.tsx` | Import `categories`/`products` from context instead of static data file |

## Technical details

```text
Admin edits product
  -> updateProduct() in ProductContext
  -> saves to localStorage("pixelcraft_products")
  -> all pages using useProducts() see updated data
  -> survives refresh, syncs across tabs
```

The static `products` array in `data/products.ts` remains as the initial seed data only.

