-- Create anonymous photos bucket for temporary photo uploads
-- Run this in your Supabase SQL editor

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'anon-photos',
  'anon-photos', 
  true, -- Public bucket for anonymous access
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow anonymous uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous deletes" ON storage.objects;

-- Create RLS policies for anonymous bucket

-- 1. Allow anyone to upload to anon-photos bucket
CREATE POLICY "Allow anonymous uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'anon-photos'
);

-- 2. Allow anyone to read from anon-photos bucket (since it's public)
CREATE POLICY "Allow anonymous reads"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'anon-photos'
);

-- 3. Optional: Allow deletion of own uploads within session (based on path pattern)
-- This is optional and can be skipped if you don't want to allow deletions
CREATE POLICY "Allow anonymous deletes"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'anon-photos'
  -- You could add additional conditions here like time-based deletion
  -- For example: AND created_at > now() - interval '1 hour'
);

-- Note: Anonymous photos should be cleaned up periodically
-- Consider setting up a scheduled job to delete files older than 24 hours
-- Example cleanup query (run as a scheduled job):
-- DELETE FROM storage.objects 
-- WHERE bucket_id = 'anon-photos' 
-- AND created_at < now() - interval '24 hours';

-- Verify the bucket was created
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'anon-photos';

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%anonymous%';