

# Phase 2A: CMS Pages, SEO, and Footer Upgrade

Build the CMS/legal pages, SEO infrastructure, and enhanced footer -- all frontend-only with mock data and admin management UI.

---

## What Gets Built

### 1. Static/CMS Pages (Customer-Facing)

Create 8 new pages under `src/pages/cms/`:

- **About Us** (`/about`) -- Company story, mission, team section
- **Privacy Policy** (`/privacy-policy`) -- Standard privacy policy content
- **Terms & Conditions** (`/terms`) -- Terms of service content
- **Refund Policy** (`/refund-policy`) -- Refund rules and process
- **Shipping Policy** (`/shipping-policy`) -- Delivery info, timelines, COD details
- **Return Policy** (`/return-policy`) -- Return process and conditions
- **FAQs** (`/faqs`) -- Accordion-style, categorized, with search
- **Contact Us** (`/contact`) -- Contact form, WhatsApp, phone, email, Google Maps embed, office address

Each page reads its content from a shared CMS data store (React context with mock data), making it ready for backend integration later.

### 2. Admin CMS Management

Add a new **Pages** section to the admin sidebar (`/admin/pages`):

- Table listing all CMS pages with title, URL slug, status (Published/Draft)
- Click to edit a page: rich text content (textarea for now), SEO meta title, meta description, custom slug, publish/draft toggle
- Add/delete FAQ entries with category assignment from `/admin/faqs`

Add a **Contact Submissions** section (`/admin/contacts`):

- Table showing form submissions: name, phone, email, message, date
- Mark as read/unread

### 3. FAQ System

- Customer-facing: accordion layout with category tabs and search filter
- Admin-facing: CRUD for FAQ items with category management
- Mock data: 10-15 FAQs across 3-4 categories (Orders, Payments, Delivery, Products)

### 4. Contact Form

- Fields: name, phone (Pakistan format validation), email, message
- Zod validation on all fields
- On submit: saves to local state, shows success toast
- Displays: WhatsApp click-to-chat, business email, phone, address
- Google Maps embed (iframe with Lahore location placeholder)

### 5. SEO Infrastructure

- Create a reusable `SEOHead` component using `document.title` and meta tag updates via `useEffect`
- Each page sets: title, meta description, Open Graph tags (og:title, og:description, og:type, og:image), Twitter card tags
- Update `index.html` with proper default meta tags for PrintPK
- Add breadcrumb navigation component shown on product pages, CMS pages, and category listings
- Update `robots.txt` with proper sitemap reference
- Create a `/sitemap.xml` static file listing all routes
- Add structured data (JSON-LD) for products and organization

### 6. Footer Upgrade

Expand the existing footer in `src/components/Layout.tsx` to include:

- **Products column**: Photo Books, Mugs, T-Shirts, Gifts
- **Company column**: About Us, How It Works, Careers
- **Policies column**: Privacy, Terms, Refund, Shipping, Return
- **Support column**: Contact Us, FAQs, WhatsApp, Phone, Email
- **Social links row**: Facebook, Instagram, TikTok, YouTube (with proper icons)
- **Trust badges row**: COD badge, Secure Payment badge, Delivery Timeline badge
- **Payment icons row**: COD, JazzCash, Easypaisa
- Copyright line

---

## Technical Details

### New Files Created (~14 files)

```text
src/pages/cms/AboutPage.tsx
src/pages/cms/PrivacyPolicyPage.tsx
src/pages/cms/TermsPage.tsx
src/pages/cms/RefundPolicyPage.tsx
src/pages/cms/ShippingPolicyPage.tsx
src/pages/cms/ReturnPolicyPage.tsx
src/pages/cms/FAQsPage.tsx
src/pages/cms/ContactPage.tsx
src/components/SEOHead.tsx
src/components/Breadcrumbs.tsx
src/data/cms-content.ts          -- mock CMS page content + FAQ data
src/pages/admin/CMSPagesPage.tsx  -- admin page management
src/pages/admin/FAQsAdminPage.tsx -- admin FAQ CRUD
src/pages/admin/ContactSubmissionsPage.tsx -- admin contact form submissions
```

### Files Modified (~4 files)

- `src/App.tsx` -- add routes for all new pages + admin sub-routes
- `src/components/Layout.tsx` -- expanded footer
- `src/pages/admin/AdminLayout.tsx` -- add Pages, FAQs, Contacts to sidebar
- `index.html` -- update default meta tags for PrintPK branding

### Dependencies

No new dependencies needed. Uses existing: `framer-motion`, `lucide-react`, `zod`, `shadcn/ui` components (Accordion, Tabs, Dialog, Input, Badge, Table).

### SEOHead Component Pattern

```text
<SEOHead
  title="About Us | PrintPK"
  description="Learn about Pakistan's trusted photo printing service"
  ogImage="/og-default.png"
  path="/about"
/>
```

Sets document.title and updates/creates meta tags in document.head via useEffect. Cleans up on unmount.

### Breadcrumbs Pattern

```text
<Breadcrumbs items={[
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Photo Books" }
]} />
```

Renders a horizontal breadcrumb trail with structured data (JSON-LD BreadcrumbList).

### CMS Data Structure

Each CMS page stored as:
```text
{
  slug: "about",
  title: "About Us",
  metaTitle: "About Us | PrintPK",
  metaDescription: "Learn about PrintPK...",
  content: "Rich text content here...",
  status: "published" | "draft",
  updatedAt: "2026-02-17"
}
```

### Admin Sidebar Update

Add 3 new links under a "Content" section separator:
- Pages (FileText icon) -> /admin/pages
- FAQs (HelpCircle icon) -> /admin/faqs
- Contact Submissions (MessageSquare icon) -> /admin/contacts

