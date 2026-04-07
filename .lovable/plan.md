

# Downloadable Orders with Batch Numbers + Enable Lovable Cloud Auth

## What needs to change

### 1. Downloadable order with batch number = order number
Currently the "Print Order Sheet" opens a browser print dialog. The user wants:
- A **download button** that saves the order as a file (PDF-style HTML or printable page)
- A **batch number** displayed prominently on the order sheet that **matches the order ID** (e.g., `ORD-123456-42`)
- This removes confusion when matching printed sheets to orders in the system

Changes in `src/pages/admin/OrdersPage.tsx`:
- Add a **"Download Order"** button (using `Download` icon) next to the existing Print button
- The download generates an HTML file with the batch number = order ID shown as a large header
- The print sheet also gets the batch number prominently displayed
- Both the order table and detail dialog show "Batch #" as a label synonym for order ID

Changes in `src/pages/Cart.tsx`:
- No change needed — the order ID generated at checkout (`ORD-XXXXXX-XX`) already serves as the batch number

### 2. Enable Lovable Cloud for authentication
This requires enabling the Supabase integration via Lovable Cloud. I'll guide through:
- Setting up Lovable Cloud (Supabase backend)
- This will replace the current toast message "Enable Lovable Cloud to activate authentication" on the login page with real auth

**Note:** Enabling Lovable Cloud is a user action — I can set up the code but the user needs to enable it through the Lovable UI.

## Files to modify

| File | Change |
|---|---|
| `src/pages/admin/OrdersPage.tsx` | Add download button, add batch number to order sheet and detail view |

## For Lovable Cloud auth
This is a separate step — after approving this plan, I recommend enabling Lovable Cloud through the Lovable interface (Cloud tab in the left panel). Once enabled, I can wire up real authentication with email/password signup and login.

