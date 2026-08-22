-- ============================================================
-- Storage: order images bucket
-- Private bucket. Object path convention: {order_id}/{filename}
-- so RLS can resolve the parent order for access checks, the
-- same pattern used for order_items/order_images/order_status_history.
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('order-images', 'order-images', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Order owners upload their order images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'order-images'
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id::text = (storage.foldername(name))[1]
      AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Access order images via parent order"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'order-images'
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id::text = (storage.foldername(name))[1]
      AND (
        o.user_id = auth.uid()
        OR public.has_role(auth.uid(), 'admin')
        OR o.print_shop_id IN (SELECT id FROM public.print_shops WHERE owner_user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Order owners and admins delete order images"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'order-images'
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id::text = (storage.foldername(name))[1]
      AND (o.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );
