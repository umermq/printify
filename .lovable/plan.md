
# Admin Panel - Full Module Build

Currently the admin panel is a single component (`AdminDashboard.tsx`) that only renders the Dashboard overview page. Clicking any sidebar link (Orders, Products, Categories, etc.) does nothing meaningful since there are no sub-pages. This plan builds out all 7 remaining admin modules as fully functional UI pages with mock data, proper routing, and CRUD interactions.

---

## Architecture

The current `AdminDashboard.tsx` will be refactored into a **layout shell** with nested routing. Each sidebar link will render its own page component inside the main content area.

```text
src/pages/admin/
  AdminLayout.tsx        -- sidebar + header + <Outlet />
  DashboardPage.tsx      -- existing stats/recent orders (moved here)
  OrdersPage.tsx         -- full order management table
  ProductsPage.tsx       -- product CRUD with add/edit dialogs
  CategoriesPage.tsx     -- category management
  CustomersPage.tsx      -- customer list with details
  PrintShopsPage.tsx     -- print shop user management
  ReportsPage.tsx        -- charts (recharts) for revenue, orders
  SettingsPage.tsx       -- admin settings form
```

The existing `AdminDashboard.tsx` will become a thin wrapper that imports `AdminLayout`.

---

## Module Details

### 1. AdminLayout (Shell)
- Extract the sidebar and top header from `AdminDashboard.tsx` into a reusable layout
- Use React Router `<Outlet />` to render child pages
- Sidebar highlights active route using `useLocation`
- Collapsible sidebar (existing behavior preserved)

### 2. Dashboard Page (existing, relocated)
- Move the stats cards and recent orders table into `DashboardPage.tsx`
- No logic changes, just file reorganization

### 3. Orders Page
- Full-width table showing all orders with columns: Order ID, Customer, Product, Status, Amount, Date, Payment Method, Actions
- Status filter tabs (All, Pending, Confirmed, In Design, Shipped, Delivered, Cancelled)
- Search bar for order ID or customer name
- Click an order row to open a **detail dialog** showing:
  - Order info and customer details
  - Uploaded images (placeholder thumbnails)
  - Status update dropdown (admin can change status through the workflow)
  - Assign to Print Shop dropdown
  - Tracking number input
  - Cancel order button
- Mock data: 15-20 sample orders covering all statuses

### 4. Products Page
- Grid/table view of all products with image placeholder, name, category, price, stock status
- "Add Product" button opens a dialog/form with fields: name, category (select), description, base price, sizes (dynamic add/remove), themes (dynamic add/remove), delivery days, featured toggle
- Edit button on each row opens same form pre-filled
- Delete button with confirmation dialog
- Category filter dropdown
- Uses existing `products` data as initial mock state managed via `useState`

### 5. Categories Page
- Card grid showing each category with icon, name, description, product count
- "Add Category" dialog with: name, slug (auto-generated), description, icon picker (emoji input)
- Edit and delete actions on each card
- Uses existing `categories` data as initial mock state

### 6. Customers Page
- Table with columns: Name, Email, Phone, City, Orders Count, Total Spent, Status (Active/Inactive), Joined Date
- Search by name/email
- Click row to see customer detail dialog showing: profile info, order history list, account status toggle (activate/deactivate)
- Mock data: 10-12 sample customers

### 7. Print Shops Page
- Table listing print shop users: Name, Email, Location, Assigned Jobs, Completed Jobs, Rejection Rate, Status
- "Add Print Shop" dialog with: name, email, phone, location, password
- Edit/delete actions
- Click to view performance: completed vs rejected jobs count
- Mock data: 4-5 sample print shops

### 8. Reports Page
- Revenue chart (line chart, monthly) using recharts (already installed)
- Orders by category (bar chart)
- COD vs Online payment ratio (pie chart)
- Orders by city (bar chart)
- Date range filter (this month / last 3 months / this year)
- Summary stat cards at the top: Total Revenue, Total Orders, Average Order Value, Top Category

### 9. Settings Page
- Simple form with sections:
  - **Store Info**: Store name, contact email, phone, address
  - **Delivery Settings**: Default delivery time, shipping fee
  - **Payment Settings**: Toggle COD, toggle JazzCash, toggle Easypaisa
  - **Notifications**: Toggle email notifications, toggle WhatsApp alerts
- Save button (shows toast on save)

---

## Routing Changes

Update `App.tsx` to use nested routes:

```text
/admin           -> AdminLayout wrapping DashboardPage
/admin/orders    -> OrdersPage
/admin/products  -> ProductsPage
/admin/categories -> CategoriesPage
/admin/customers -> CustomersPage
/admin/print-shops -> PrintShopsPage
/admin/reports   -> ReportsPage
/admin/settings  -> SettingsPage
```

---

## Technical Details

- **State Management**: Each page uses local `useState` with mock data (no backend yet). CRUD operations update local state and show toast notifications.
- **UI Components Used**: Dialog, Table, Input, Select, Badge, Tabs, Switch, Button, Card -- all from existing shadcn/ui library already installed.
- **Charts**: recharts (already installed) for Reports page -- LineChart, BarChart, PieChart.
- **Animations**: framer-motion for page enter animations (consistent with existing dashboard style).
- **Files created**: 9 new files in `src/pages/admin/`
- **Files modified**: `AdminDashboard.tsx` (simplified to import layout), `App.tsx` (nested routing)
- **No new dependencies needed** -- everything uses already-installed packages.
