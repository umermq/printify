-- ============================================================
-- Core schema: categories, products, print shops, orders, images
-- Builds on the existing app_role enum + has_role() from the
-- previous migration (20260706071700_...).
-- ============================================================

-- ---------- Categories & products ----------

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_days TEXT,
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  seo JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size_label TEXT NOT NULL,
  finish TEXT,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.product_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  preview TEXT,
  image_url TEXT,
  price_modifier NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Print shops ----------
-- owner_user_id links a print-shop login (role = 'print_shop') to their shop row.

CREATE TABLE public.print_shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  contact_number TEXT,
  city TEXT,
  agreement_status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Orders ----------

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  print_shop_id UUID REFERENCES public.print_shops(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Pending Confirmation',
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'COD',
  city TEXT,
  address TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  theme_id UUID REFERENCES public.product_themes(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  album_addon BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- storage_key_preview / storage_key_print hold the object keys in
-- Cloudflare R2 (or Supabase Storage) — the app never stores raw files
-- in the database itself, only references.
CREATE TABLE public.order_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  storage_key_preview TEXT,
  storage_key_print TEXT,
  source TEXT NOT NULL DEFAULT 'device', -- device | google_drive | onedrive | manual_export
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Keep updated_at fresh on orders
CREATE OR REPLACE FUNCTION public.touch_order_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_orders_touch_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_order_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Catalog: public read, admin write
CREATE POLICY "Catalog is publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Variants are publicly readable" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Admins manage variants" ON public.product_variants FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Themes are publicly readable" ON public.product_themes FOR SELECT USING (true);
CREATE POLICY "Admins manage themes" ON public.product_themes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Print shops: admin sees/manages all; a print-shop user sees only their own row
CREATE POLICY "Admins manage print shops" ON public.print_shops FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Print shop users view their own shop" ON public.print_shops FOR SELECT TO authenticated
  USING (owner_user_id = auth.uid());

-- Orders: customer sees/creates their own; admin sees/manages all;
-- print-shop user sees only orders assigned to their shop
CREATE POLICY "Customers view their own orders" ON public.orders FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Customers create their own orders" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins manage all orders" ON public.orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Print shops view assigned orders" ON public.orders FOR SELECT TO authenticated
  USING (print_shop_id IN (SELECT id FROM public.print_shops WHERE owner_user_id = auth.uid()));
CREATE POLICY "Print shops update assigned orders" ON public.orders FOR UPDATE TO authenticated
  USING (print_shop_id IN (SELECT id FROM public.print_shops WHERE owner_user_id = auth.uid()))
  WITH CHECK (print_shop_id IN (SELECT id FROM public.print_shops WHERE owner_user_id = auth.uid()));

-- Order items / images / history: access follows the parent order
CREATE POLICY "Access order items via parent order" ON public.order_items FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = order_id AND (
      o.user_id = auth.uid()
      OR public.has_role(auth.uid(), 'admin')
      OR o.print_shop_id IN (SELECT id FROM public.print_shops WHERE owner_user_id = auth.uid())
    )
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = order_id AND (
      o.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
    )
  ));

CREATE POLICY "Access order images via parent order" ON public.order_images FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = order_id AND (
      o.user_id = auth.uid()
      OR public.has_role(auth.uid(), 'admin')
      OR o.print_shop_id IN (SELECT id FROM public.print_shops WHERE owner_user_id = auth.uid())
    )
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = order_id AND (
      o.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
    )
  ));

CREATE POLICY "Access status history via parent order" ON public.order_status_history FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders o WHERE o.id = order_id AND (
      o.user_id = auth.uid()
      OR public.has_role(auth.uid(), 'admin')
      OR o.print_shop_id IN (SELECT id FROM public.print_shops WHERE owner_user_id = auth.uid())
    )
  ));
CREATE POLICY "Admins and print shops log status changes" ON public.order_status_history FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.orders o WHERE o.id = order_id
      AND o.print_shop_id IN (SELECT id FROM public.print_shops WHERE owner_user_id = auth.uid())
    )
  );

GRANT SELECT ON public.categories, public.products, public.product_variants, public.product_themes TO anon, authenticated;
GRANT ALL ON public.categories, public.products, public.product_variants, public.product_themes,
  public.print_shops, public.orders, public.order_items, public.order_images, public.order_status_history
  TO service_role;
