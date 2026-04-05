
# Fix Order Visibility + Link Orders Across Admin + Prepare Images for Printing

## What I found

There are 3 separate problems causing the confusion:

1. **Orders are only partially connected**
   - `Cart.tsx` does call `addOrder(...)`
   - `OrdersPage.tsx` does read from `useOrders()`
   - But `DashboardPage.tsx` and `CustomersPage.tsx` still use **hardcoded sample data**
   - So even when orders exist, the dashboard and customers sections do not reflect them

2. **Order persistence is fragile**
   - `OrderContext.tsx` reads from `localStorage` only once with `useState(loadOrders)`
   - It has no sync/re-hydration logic for route changes, refresh edge cases, or multiple tabs
   - New orders can appear to “disappear” if the stored data and in-memory state drift

3. **Uploaded customer images are not print-safe**
   - `ProductDetail.tsx` stores uploads as `URL.createObjectURL(file)`
   - Those are temporary browser blob URLs, not permanent files
   - They may display briefly in the same session, but they are not reliable for backend viewing, later access, or printing

---

## Implementation plan

### 1. Harden the order store
Update `src/contexts/OrderContext.tsx` to make order data reliable:
- Initialize safely from `localStorage`
- Re-save whenever orders change
- Listen for storage changes so admin pages stay in sync
- Add a derived helper layer for:
  - recent orders
  - customer summaries from orders
  - dashboard stats from live order data

This will make the context the single source of truth instead of mixing live data and mock arrays.

### 2. Make Order Management always show placed orders
Update `src/pages/admin/OrdersPage.tsx` to:
- use the shared order store only
- sort newest orders first
- show a clearer empty state only when truly no orders exist
- improve image preview handling for missing/broken images
- add a stronger order detail view for backend staff

### 3. Link Dashboard “Recent Orders” and KPIs to real orders
Update `src/pages/admin/DashboardPage.tsx` to replace static `stats` and `recentOrders` with live values from `useOrders()`:
- total revenue from delivered/approved orders as appropriate
- today’s order count
- pending order count
- completed count
- recent orders table from latest real orders

### 4. Link Customers page to actual order history
Refactor `src/pages/admin/CustomersPage.tsx` so customers are derived from real orders:
- group by email/phone/name
- compute order count
- compute total spent
- show recent orders per customer
- keep customer search working

This will connect storefront orders with customers automatically.

### 5. Improve backend image handling in orders
Update the order detail modal in `src/pages/admin/OrdersPage.tsx` to support fulfillment better:
- larger preview thumbnails
- click-to-open bigger image preview dialog/lightbox
- clear labels like “Customer Uploaded Images”
- add a browser print action for order artwork / order sheet

## Important limitation about printing images

Right now uploaded customer photos are temporary blob URLs, so they are **not dependable for real backend printing**.

### Short-term fix
I can make admin users:
- preview images better
- open them full size
- print the order sheet / visible preview in the browser

### Proper production fix
For real printing workflow, uploaded images must be stored permanently in cloud storage:
- upload customer images to **Lovable Cloud / Supabase Storage**
- save permanent file URLs in the cart/order record
- then admin can reliably view, download, and print them later from any device

Without that storage step, the backend cannot safely depend on customer-uploaded images.

---

## Files to update

| File | Change |
|---|---|
| `src/contexts/OrderContext.tsx` | Make orders persistent, synchronized, and expose derived live data |
| `src/pages/admin/OrdersPage.tsx` | Improve real order listing, previews, and print-ready order details |
| `src/pages/admin/DashboardPage.tsx` | Replace mock recent orders and KPIs with live order data |
| `src/pages/admin/CustomersPage.tsx` | Build customer records from actual orders |
| `src/pages/ProductDetail.tsx` | Keep current behavior for now, but mark upload flow as temporary and prepare for storage-backed upgrade |

## Technical details

```text
Storefront checkout
  -> addOrder()
  -> OrderContext localStorage state
  -> Admin Orders page
  -> Admin Dashboard recent orders + KPIs
  -> Admin Customers aggregated from orders
```

For real printing:

```text
Customer uploads image
  -> upload to permanent storage
  -> save file URL in cart/order
  -> admin opens order
  -> preview / download / print original image
```

## Recommended next phase after this fix
After I wire the admin pages to live data, the next best improvement is:
- move image uploads from temporary blob URLs to permanent storage
- optionally add downloadable print files / print sheet per order
