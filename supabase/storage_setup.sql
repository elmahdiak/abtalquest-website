-- ==============================================================================
-- AbtalQuest: Supabase Storage Automatic Provisioning & Access Policies
-- Script: supabase/storage_setup.sql
-- 
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
--
-- This script:
-- 1. Creates the public 'product-images' bucket (and 'blog-images' bucket)
-- 2. Grants appropriate schema and table permissions to anon and authenticated roles
-- 3. Configures Row Level Security (RLS) policies for public reading and admin uploading
-- 4. Ensures idempotency: safe to run multiple times without errors or conflicts
-- ==============================================================================

-- 1. PROVISION STORAGE BUCKETS
-- Insert 'product-images' bucket for marketplace product covers and gallery media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760, -- 10MB maximum file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];

-- Also ensure 'blog-images' bucket exists for article banners and editorial uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  10485760, -- 10MB maximum file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];


-- 2. ENABLE ROW LEVEL SECURITY
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;


-- 3. GRANT TABLE & SCHEMA PERMISSIONS
GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role;
GRANT ALL ON TABLE storage.buckets TO anon, authenticated, service_role;
GRANT ALL ON TABLE storage.objects TO anon, authenticated, service_role;


-- 4. BUCKET DISCOVERY POLICIES (Allow clients to inspect bucket status)
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


-- 5. PRODUCT IMAGES POLICIES (storage.objects for 'product-images')
DROP POLICY IF EXISTS "Allow public read on product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload on product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on product images" ON storage.objects;

-- Allow anyone (visitors, customers, search indexers) to read product images
CREATE POLICY "Allow public read on product images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Allow admins, managers, and authorized users to upload product media
CREATE POLICY "Allow upload on product images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow updating and overwriting product images
CREATE POLICY "Allow update on product images"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

-- Allow deleting product images
CREATE POLICY "Allow delete on product images"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'product-images');


-- 6. BLOG IMAGES POLICIES (storage.objects for 'blog-images')
DROP POLICY IF EXISTS "Allow public read on blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload on blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on blog images" ON storage.objects;

-- Allow public read of blog images
CREATE POLICY "Allow public read on blog images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'blog-images');

-- Allow upload of blog images
CREATE POLICY "Allow upload on blog images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'blog-images');

-- Allow updating blog images
CREATE POLICY "Allow update on blog images"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');

-- Allow deleting blog images
CREATE POLICY "Allow delete on blog images"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'blog-images');


-- 7. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
