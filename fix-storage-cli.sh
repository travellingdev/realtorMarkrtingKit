#!/bin/bash

# Fix storage policies using Supabase CLI
# Run this if you have CLI access with admin privileges

echo "Creating storage policies for photos bucket..."

# Create upload policy
supabase storage policy create \
  --table objects \
  --name "Users can upload their own photos" \
  --operation INSERT \
  --target authenticated \
  --with-check "bucket_id = 'photos' AND (storage.foldername(name))[1] = auth.uid()::text"

# Create select policy
supabase storage policy create \
  --table objects \
  --name "Users can view their own photos" \
  --operation SELECT \
  --target authenticated \
  --using "bucket_id = 'photos' AND (storage.foldername(name))[1] = auth.uid()::text"

# Create delete policy
supabase storage policy create \
  --table objects \
  --name "Users can delete their own photos" \
  --operation DELETE \
  --target authenticated \
  --using "bucket_id = 'photos' AND (storage.foldername(name))[1] = auth.uid()::text"

echo "Storage policies created successfully!"
echo "Test your photo uploads now."