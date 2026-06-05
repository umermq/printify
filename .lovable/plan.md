## Full Printy-Style Rebrand (Warm Playful Palette)

Replace the luxury beige/gold theme with a warm, playful, Printy-inspired look across the storefront. Keep the **PixelCraft** name, drop gold + Cormorant Garamond, and rebuild the homepage with the four chosen Printy sections.

### New Design System

**Palette** (warm playful)
- Primary `#FF6B35` (vivid orange) — buttons, accents
- Secondary `#F7931E` (amber) — gradients, highlights
- Soft accent `#FFC9B5` (coral cream) — decorative blobs, badges
- Background `#FFF8F2` (warm cream) — base canvas
- Foreground `#1A1A1A` charcoal; muted warm gray

**Typography** — switch to playful sans
- Headings: **Poppins** (700/800) — bold, rounded
- Body: **Inter** (400/500)
- Remove Cormorant Garamond import

**Shapes & motion**
- Pill-shaped buttons (`rounded-full`), large CTAs
- Soft gradient hero (orange → coral)
- Floating decorative SVG shapes (circles, squiggles, blurred blobs) absolutely positioned in hero
- Soft shadows with warm orange tint
- Subtle float / fade-in animations on scroll

### Files to change

| File | Change |
|---|---|
| `src/index.css` | Replace HSL tokens (background, primary, accent, gold→orange), swap font imports to Poppins+Inter, update `.btn-luxury`/`.btn-gold` to pill warm-orange variants, update gradients, shadows, `.section-label` color |
| `tailwind.config.ts` | Update `fontFamily` (sans: Inter, display: Poppins), add `primary-glow`, `coral`, `cream` tokens |
| `src/components/Logo.tsx` | Replace 2x2 gold grid with colorful daisy/burst mark (orange + coral + amber petals), Poppins wordmark |
| `src/components/Layout.tsx` | Header: pill nav, rounded cart badge in orange; Footer: cream-on-charcoal already OK — restyle accent links to orange; remove gold class usage |
| `src/components/PageHero.tsx` | Convert luxury hero pattern to playful: gradient bg, blob decorations, large Poppins headline with single coral-highlighted word |
| `src/pages/Index.tsx` | Rebuild homepage with 4 sections: (1) **Hero** — split layout, model/product image in circular gradient frame, floating product card + decorative SVG shapes; (2) **What we offer** — 4-icon feature grid with rounded cards; (3) **Product grid** — hover-lift cards with pill price tags; (4) **Process steps** — 3-4 numbered steps with illustrations |
| `src/components/WhatsAppButton.tsx` | Keep green (brand standard) but match new shadow style |
| `src/pages/Products.tsx`, `src/pages/ProductDetail.tsx`, `src/pages/Cart.tsx` | Restyle buttons/cards to new tokens (no structural change — tokens cascade) |
| `src/pages/cms/*`, `src/pages/Login.tsx`, `src/pages/ResetPassword.tsx` | Inherit new tokens automatically; spot-fix any hardcoded gold classes |

### Decorative assets

Generate 3 lightweight SVG/PNG decorations into `src/assets/`:
- Soft orange blur blob
- Coral squiggle line
- Small geometric shapes set (circle, triangle, square)

### Hero image

Generate one new hero product image: a person holding a custom-printed photo book/mug against a soft gradient circle, transparent background — saved to `src/assets/hero-printy.png`.

### Out of scope (admin stays luxury-functional)
- `src/pages/admin/*` and `src/pages/PrintShopDashboard.tsx` — these stay on current SaaS look; only minor token-cascade changes
- No backend / data changes
- No new routes

### Memory updates
- Update `mem://style/color-palette` → warm orange + coral + cream (replace gold)
- Update `mem://style/logo` → colorful daisy mark + Poppins wordmark
- Update Core memory: headings Poppins, not Cormorant Garamond
- Update `mem://style/design-principles` → playful, decorative shapes allowed, pill buttons, warm gradients OK

### Result
Homepage and all storefront pages match the Printy energy — bright, warm, friendly, with floating decor and pill CTAs — while keeping PixelCraft as the brand name and Pakistan/COD context intact.