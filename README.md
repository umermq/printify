# PixelCraft

A custom photo printing platform for the Pakistan market — photo books, prints, mugs, t-shirts, and gift items, with Cash on Delivery checkout, a customer storefront, an admin panel, and a print shop dashboard.

## Tech stack

- **Frontend**: React + TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Supabase (Postgres, Auth, Storage, Edge Functions, Row Level Security)

## Roles

- **Customer** — browses the catalog, places orders, tracks status
- **Admin** — manages categories, products, orders, print shops, and SEO metadata
- **Print Shop** — views and updates orders assigned to their shop

## Development

You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd printify
npm i
npm run dev
```

Copy `.env` and set your own Supabase project's URL and publishable key:

```
VITE_SUPABASE_PROJECT_ID="..."
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="..."
```

Database schema and RLS policies live in `supabase/migrations/`. Apply them to a linked Supabase project with:

```sh
supabase link --project-ref <your-project-ref>
supabase db push
```

## Shipping a change

One command takes a clean checkout of `main` all the way to a deployed site —
pull, install, link, migrate, verify the catalog, build and deploy — stopping at
the first step that fails:

```sh
./scripts/ship.sh
```

It needs the [Supabase CLI](https://supabase.com/docs/guides/local-development)
(`brew install supabase/tap/supabase`) and a wrangler login. Anonymous sign-ins
stay a manual dashboard switch; the script says why when it finishes.

## Checking the Supabase connection

If the storefront renders but the collections are empty, run the connectivity check. It
probes the live project anonymously — exactly as a visitor's browser does — and reports
whether each catalog table exists, is readable, and has rows:

```sh
npm run check:supabase
```

An empty catalog almost always means the migrations were never pushed to the project the
`.env` points at, or the deployed bundle was built without those `.env` values (Vite inlines
them at build time, so `npm run deploy` must run from a checkout that has them).
