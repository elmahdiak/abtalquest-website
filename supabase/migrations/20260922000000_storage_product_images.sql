-- Migration: 20260922000000_storage_product_images.sql
-- Description: Provision 'product-images' and 'blog-images' storage buckets with RLS policies

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];

-- 2. Enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Grants
GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role;
GRANT ALL ON TABLE storage.buckets TO anon, authenticated, service_role;
GRANT ALL ON TABLE storage.objects TO anon, authenticated, service_role;

-- 4. Buckets Policies
DROP POLICY IF EXISTS "Allow public read on storage buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public insert on storage buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public update on storage buckets" ON storage.buckets;

CREATE POLICY "Allow public read on storage buckets"
  ON storage.buckets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert on storage buckets"
  ON storage.buckets FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update on storage buckets"
  ON storage.buckets FOR UPDATE
  TO anon, authenticated
  USING (true);

-- 5. Product Images Policies
DROP POLICY IF EXISTS "Allow public read on product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload on product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on product images" ON storage.objects;

CREATE POLICY "Allow public read on product images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow upload on product images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow update on product images"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow delete on product images"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- 6. Blog Images Policies
DROP POLICY IF EXISTS "Allow public read on blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload on blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on blog images" ON storage.objects;

CREATE POLICY "Allow public read on blog images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'blog-images');

CREATE POLICY "Allow upload on blog images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Allow update on blog images"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Allow delete on blog images"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'blog-images');

NOTIFY pgrst, 'reload schema';
