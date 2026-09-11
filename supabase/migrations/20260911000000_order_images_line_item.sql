-- ============================================================
-- Link each uploaded photo to the line item it belongs to
--
-- order_images only referenced the order, so an order of five photos
-- at two different sizes recorded which photos were sent and which
-- sizes were bought, but not which photo goes on which size. The print
-- shop could not act on it.
--
-- Nullable on purpose: rows written before this, and any flow that
-- attaches a photo to the order as a whole, stay valid.
-- ============================================================

ALTER TABLE public.order_images
  ADD COLUMN order_item_id UUID REFERENCES public.order_items(id) ON DELETE SET NULL;

CREATE INDEX order_images_order_item_id_idx
  ON public.order_images (order_item_id);
