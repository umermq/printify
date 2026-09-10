-- ============================================================
-- Customer contact details on orders
--
-- Checkout collects a name, phone and address, but orders had nowhere
-- to keep them: contact details lived only in auth.users, which a guest
-- (anonymous) checkout never populates. Admin and print-shop views need
-- them to actually reach the customer.
-- ============================================================

ALTER TABLE public.orders
  ADD COLUMN customer_name  TEXT,
  ADD COLUMN customer_phone TEXT,
  ADD COLUMN customer_email TEXT;
