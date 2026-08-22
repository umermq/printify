-- ============================================================
-- Seed catalog data
-- Mirrors the placeholder catalog currently hardcoded in
-- src/data/products.ts, so the DB-backed catalog matches what's
-- already shown in the UI once it's wired up to Supabase.
-- ============================================================

INSERT INTO public.categories (slug, name, description, icon, image_url, sort_order) VALUES
  ('photo-prints', 'Photo Prints', 'High-quality prints in glossy or matte finish', '🖼️', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80&auto=format&fit=crop', 1),
  ('photo-books', 'Photo Books', 'Premium hardcover & softcover photo books', '📖', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80&auto=format&fit=crop', 2),
  ('mugs', 'Custom Mugs', 'Ceramic mugs with your favorite photos', '☕', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80&auto=format&fit=crop', 3),
  ('t-shirts', 'T-Shirts', 'Custom printed t-shirts in all sizes', '👕', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop', 4),
  ('gifts', 'Gift Items', 'Photo cushions, keychains & more', '🎁', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80&auto=format&fit=crop', 5);

INSERT INTO public.products (category_id, slug, name, description, base_price, delivery_days, image_url, featured) VALUES
  ((SELECT id FROM public.categories WHERE slug = 'photo-prints'), 'photo-prints', 'Photo Prints', 'High-quality photo prints on premium paper. Choose your size and finish for vibrant, true-to-life prints. Perfect for framing, gifting, or preserving your favourite memories.', 150, '2-4 days', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80&auto=format&fit=crop', true),
  ((SELECT id FROM public.categories WHERE slug = 'photo-books'), 'classic-photo-book', 'Classic Photo Book', 'A beautiful hardcover photo book with premium glossy pages. Perfect for weddings, birthdays, and family memories.', 2500, '5-7 days', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80&auto=format&fit=crop', true),
  ((SELECT id FROM public.categories WHERE slug = 'photo-books'), 'wedding-album', 'Wedding Album', 'Luxurious wedding album with leather cover and lay-flat pages.', 5000, '7-10 days', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format&fit=crop', true),
  ((SELECT id FROM public.categories WHERE slug = 'mugs'), 'photo-mug-classic', 'Photo Mug - Classic', '11oz ceramic mug with your photo printed in vibrant colors. Dishwasher safe.', 800, '3-5 days', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80&auto=format&fit=crop', true),
  ((SELECT id FROM public.categories WHERE slug = 'mugs'), 'magic-mug', 'Magic Mug', 'Heat-sensitive color-changing mug. Pour hot water and watch your photo appear!', 1200, '3-5 days', 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80&auto=format&fit=crop', false),
  ((SELECT id FROM public.categories WHERE slug = 't-shirts'), 'custom-photo-tshirt', 'Custom Photo T-Shirt', 'Premium cotton t-shirt with full-color photo print. Available in all sizes.', 1500, '3-5 days', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop', true),
  ((SELECT id FROM public.categories WHERE slug = 'gifts'), 'photo-cushion', 'Photo Cushion', 'Soft velvet cushion with custom photo print. Great for home decor and gifts.', 1800, '5-7 days', 'https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=800&q=80&auto=format&fit=crop', true),
  ((SELECT id FROM public.categories WHERE slug = 'gifts'), 'photo-keychain', 'Photo Keychain', 'Acrylic photo keychain. Compact and durable. Perfect personalized gift.', 500, '3-5 days', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80&auto=format&fit=crop', false);

INSERT INTO public.product_variants (product_id, size_label, price) VALUES
  ((SELECT id FROM public.products WHERE slug = 'photo-prints'), '4x6 inches', 150),
  ((SELECT id FROM public.products WHERE slug = 'photo-prints'), '5x7 inches', 250),
  ((SELECT id FROM public.products WHERE slug = 'classic-photo-book'), '8x8 (20 pages)', 2500),
  ((SELECT id FROM public.products WHERE slug = 'classic-photo-book'), '10x10 (30 pages)', 3500),
  ((SELECT id FROM public.products WHERE slug = 'classic-photo-book'), '12x12 (40 pages)', 5000),
  ((SELECT id FROM public.products WHERE slug = 'wedding-album'), '10x10 (30 pages)', 5000),
  ((SELECT id FROM public.products WHERE slug = 'wedding-album'), '12x12 (50 pages)', 8000),
  ((SELECT id FROM public.products WHERE slug = 'photo-mug-classic'), '11oz Standard', 800),
  ((SELECT id FROM public.products WHERE slug = 'photo-mug-classic'), '15oz Large', 1000),
  ((SELECT id FROM public.products WHERE slug = 'magic-mug'), '11oz', 1200),
  ((SELECT id FROM public.products WHERE slug = 'custom-photo-tshirt'), 'S', 1500),
  ((SELECT id FROM public.products WHERE slug = 'custom-photo-tshirt'), 'M', 1500),
  ((SELECT id FROM public.products WHERE slug = 'custom-photo-tshirt'), 'L', 1500),
  ((SELECT id FROM public.products WHERE slug = 'custom-photo-tshirt'), 'XL', 1600),
  ((SELECT id FROM public.products WHERE slug = 'photo-cushion'), '12"x12"', 1800),
  ((SELECT id FROM public.products WHERE slug = 'photo-cushion'), '16"x16"', 2200),
  ((SELECT id FROM public.products WHERE slug = 'photo-keychain'), 'Rectangle', 500),
  ((SELECT id FROM public.products WHERE slug = 'photo-keychain'), 'Heart Shape', 600);

INSERT INTO public.product_themes (product_id, name, preview, image_url) VALUES
  ((SELECT id FROM public.products WHERE slug = 'photo-prints'), 'Glossy', '✨', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'photo-prints'), 'Matte', '🎨', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'classic-photo-book'), 'Classic White', '🤍', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'classic-photo-book'), 'Rustic Wood', '🪵', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'classic-photo-book'), 'Modern Dark', '🖤', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'wedding-album'), 'Elegant Gold', '✨', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'wedding-album'), 'Romantic Blush', '🌸', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'wedding-album'), 'Royal Navy', '💎', 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'photo-mug-classic'), 'Full Wrap', '🔄', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'photo-mug-classic'), 'Heart Frame', '❤️', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'photo-mug-classic'), 'Photo Collage', '🖼️', 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'magic-mug'), 'Photo Reveal', '✨', 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'magic-mug'), 'Message Reveal', '💬', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'custom-photo-tshirt'), 'Front Print', '👕', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'custom-photo-tshirt'), 'Back Print', '🔙', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'custom-photo-tshirt'), 'Front & Back', '✌️', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'photo-cushion'), 'Single Photo', '📷', 'https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'photo-cushion'), '4 Photo Collage', '🖼️', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80&auto=format&fit=crop'),
  ((SELECT id FROM public.products WHERE slug = 'photo-keychain'), 'Single Photo', '📷', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&q=80&auto=format&fit=crop');
