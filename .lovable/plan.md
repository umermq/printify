

# Replace Emoji Placeholders with Professional Images + Update WhatsApp Number

## Changes

### 1. Add professional product images to `src/data/products.ts`

Replace empty `image` fields and emoji `preview` fields with high-quality Unsplash URLs for each product and category:

- **Categories** — add proper `image` URLs:
  - Photo Books → elegant photo book on marble surface
  - Custom Mugs → styled ceramic mug with photo
  - T-Shirts → custom printed t-shirt flat lay
  - Gift Items → photo cushion/keychain styled shot

- **Products** — add `image` field URLs and keep theme previews as text labels (since themes represent design options, not photos):
  - `pb-1` Classic Photo Book → hardcover photo book image
  - `pb-2` Wedding Album → luxury wedding album image
  - `mug-1` Photo Mug → ceramic mug product shot
  - `mug-2` Magic Mug → color-changing mug image
  - `ts-1` Custom T-Shirt → custom printed tee image
  - `gift-1` Photo Cushion → custom cushion image
  - `gift-2` Photo Keychain → acrylic keychain image

### 2. Update `src/pages/Products.tsx`

Replace the emoji placeholder in the product card image area (line 83-87) with an `<img>` tag that uses `product.image`, falling back to a styled placeholder div if no image exists.

### 3. Update `src/pages/Index.tsx`

- **Category cards** (line 133-134): Replace `{cat.icon}` emoji with `<img src={cat.image}>` 
- **Best Sellers** (line 204-208): Replace emoji placeholder with `<img src={product.image}>`

### 4. Update `src/pages/ProductDetail.tsx`

Replace the main product image emoji (the large centered span) and theme thumbnail emojis with the product image. Main gallery shows `product.image`, thumbnails remain as theme selectors with text labels.

### 5. Update WhatsApp number across 3 files

Change `923001234567` → `923334442957` and display number `+92 42 3456 7890` → `+92 42 3334442957` in:

- `src/components/WhatsAppButton.tsx` (line 5)
- `src/components/Layout.tsx` (lines 193-194)
- `src/pages/cms/ContactPage.tsx` (lines 84-88)

### Files Modified (6 files)

| File | Change |
|---|---|
| `src/data/products.ts` | Add Unsplash image URLs to all products and categories |
| `src/pages/Products.tsx` | Render `<img>` instead of emoji in product cards |
| `src/pages/Index.tsx` | Render `<img>` in category cards and best sellers |
| `src/pages/ProductDetail.tsx` | Render `<img>` in main gallery |
| `src/components/WhatsAppButton.tsx` | Update WhatsApp number |
| `src/components/Layout.tsx` | Update phone/WhatsApp number in footer |
| `src/pages/cms/ContactPage.tsx` | Update phone/WhatsApp number |

