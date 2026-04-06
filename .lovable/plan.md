

# Add Photo Prints Product Category (Photobox-inspired)

Inspired by the Photobox reference, add a new "Photo Prints" category and product to PixelCraft. Instead of themes, this product uses a **Material** selector (Glossy / Matte) since photo prints are about the finish, not a design theme.

---

## What changes

### 1. Add "Photo Prints" category and product to `src/data/products.ts`

**New category:**
- slug: `photo-prints`, name: "Photo Prints", icon: "🖼️", image from Unsplash (photo prints style)

**New product:**
- id: `pp-1`, name: "Photo Prints", category: "Photo Prints", categorySlug: `photo-prints`
- description: "High-quality photo prints on premium paper. Choose your size and finish for vibrant, true-to-life prints."
- sizes: `4x6` (PKR 150) and `5x7` (PKR 250)
- themes array repurposed as material/finish options: `Glossy` and `Matte` (with appropriate Unsplash images)
- deliveryDays: "2-4 days", featured: true

### 2. Update `src/pages/ProductDetail.tsx` — dynamic label for Theme/Material

The current product detail page hardcodes "Theme" as the selector label. For photo prints, this should say "Material / Finish" instead.

Add a simple check: if the product's `categorySlug === "photo-prints"`, show "Material / Finish" as the heading; otherwise keep "Theme". This avoids needing a new data field.

### 3. Add navigation link for Photo Prints

Update header navigation in `src/components/Layout.tsx` (or wherever nav links are defined) to include a "Photo Prints" category link pointing to `/products?category=photo-prints`.

---

## Files to modify

| File | Change |
|---|---|
| `src/data/products.ts` | Add photo-prints category + photo prints product |
| `src/pages/ProductDetail.tsx` | Show "Material / Finish" label for photo-prints category |
| `src/components/Layout.tsx` | Add Photo Prints nav link (if nav is here) |

No new packages. No structural changes to existing components.

