

# Fix Download: Customer Photos with Batch Number (Not HTML Sheet)

## Problem
The current "Download" button generates a full HTML order sheet. The user wants to **download the actual customer photos** individually, with filenames that include the batch/order number so they can match prints to orders easily.

## What changes

### `src/pages/admin/OrdersPage.tsx`

1. **Replace `handleDownloadOrder`** — instead of generating an HTML file, it downloads each customer-uploaded image individually. Each image is named like `ORD-916223-55_photo_1.jpg`, `ORD-916223-55_photo_2.jpg`, etc.

2. **Add per-image download buttons** — on each image thumbnail in the detail dialog, add a small download icon overlay so the user can download individual photos.

3. **"Download All" button** — the main Download button fetches all customer images and triggers individual downloads named with the batch number prefix.

4. **Remove the HTML order sheet generation** — remove `generateOrderHTML` and the HTML download logic. Keep the Print button for the order sheet if they still want to print metadata.

### Download naming format
```
{orderId}_photo_{index}.{ext}
e.g. ORD-916223-55_photo_1.jpg
     ORD-916223-55_photo_2.jpg
```

## Files to modify

| File | Change |
|---|---|
| `src/pages/admin/OrdersPage.tsx` | Replace HTML download with image downloads; add per-image download; keep Print for order sheet |

