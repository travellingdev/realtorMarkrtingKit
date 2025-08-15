-- Fix Supabase Storage Policies for Photos Bucket
-- Run these commands in your Supabase SQL Editor

-- 1. Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Users can upload their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- 3. Create upload policy for authenticated users
CREATE POLICY "Users can upload their own photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Create select policy for users to view their own photos
CREATE POLICY "Users can view their own photos" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Create delete policy for users to delete their own photos
CREATE POLICY "Users can delete their own photos" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. Update bucket to ensure it's public (for URL access)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'photos';

-- 7. Verify the setup
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 8. Check bucket configuration
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'photos';