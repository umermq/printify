

# Hero Banners + PixelCraft Logo Redesign

Rebrand from "PrintPK" to "PixelCraft" with a designed SVG logo and add elegant hero banners to every page that currently lacks one.

---

## 1. PixelCraft Logo

Create an inline SVG logo component (`src/components/Logo.tsx`) featuring:
- A minimal geometric mark: 4 small squares arranged in a 2x2 pixel grid pattern (referencing "pixel") with matte gold color
- "PixelCraft" wordmark in Cormorant Garamond, tracking-widest
- Used everywhere: header, footer, login page, mobile drawer

## 2. Brand Name Update

Search-and-replace "PrintPK" with "PixelCraft" across all files: Layout header/footer, Index page, SEO titles, CMS content, meta tags in index.html, sitemap, About page, Contact page, FAQ page, etc.

## 3. Hero Banners for All Pages

Currently only the homepage and products page have headers. Add a consistent luxury hero banner to every customer-facing page:

**Shared `PageHero` component** (`src/components/PageHero.tsx`):
- Full-width section with `bg-card` background
- Gold section label (uppercase, tracking-widest)
- Large serif heading
- Optional subtitle in muted text
- Optional Unsplash background image with warm overlay
- Breadcrumbs integrated below the heading
- Consistent padding: `py-20`

**Pages to update:**
| Page | Label | Heading | Background Image |
|---|---|---|---|
| Products | Category or "ALL PRODUCTS" | Dynamic title | Soft print studio image |
| About | "OUR STORY" | "About PixelCraft" | Workshop/studio image |
| Contact | "GET IN TOUCH" | "Contact Us" | Elegant desk image |
| FAQs | "HELP CENTER" | "Frequently Asked Questions" | — |
| Privacy Policy | "LEGAL" | "Privacy Policy" | — |
| Terms | "LEGAL" | "Terms & Conditions" | — |
| Refund Policy | "POLICIES" | "Refund Policy" | — |
| Shipping Policy | "POLICIES" | "Shipping Policy" | — |
| Return Policy | "POLICIES" | "Return Policy" | — |
| Cart | "YOUR CART" | "Shopping Cart" | — |
| Login | "ACCOUNT" | "Welcome Back" | — |

## 4. Files Summary

| File | Change |
|---|---|
| `src/components/Logo.tsx` | **New** — SVG logo component |
| `src/components/PageHero.tsx` | **New** — reusable hero banner |
| `src/components/Layout.tsx` | Use Logo component, rename to PixelCraft |
| `src/pages/Index.tsx` | Rename brand references |
| `src/pages/Products.tsx` | Use PageHero instead of plain header |
| `src/pages/ProductDetail.tsx` | Brand name update |
| `src/pages/Cart.tsx` | Add PageHero |
| `src/pages/Login.tsx` | Add PageHero, use Logo |
| `src/pages/cms/AboutPage.tsx` | Add PageHero |
| `src/pages/cms/ContactPage.tsx` | Add PageHero, update brand |
| `src/pages/cms/FAQsPage.tsx` | Add PageHero |
| `src/pages/cms/PolicyPages.tsx` | Add PageHero |
| `src/data/cms-content.ts` | Replace PrintPK → PixelCraft in content |
| `index.html` | Update title and meta tags |
| `public/sitemap.xml` | Update brand name |
| `src/components/SEOHead.tsx` | No structural change |
| `src/components/WhatsAppButton.tsx` | Brand name if referenced |

**New files: 2. Modified files: ~14. No new packages.**

