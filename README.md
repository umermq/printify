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
