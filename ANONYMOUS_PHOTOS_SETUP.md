# Anonymous Photo Upload Setup

This guide explains how to enable photo uploads for anonymous users using a separate Supabase storage bucket.

## Why Anonymous Photo Uploads?

- **Better User Experience**: Users can test the full power of the AI, including photo analysis, before signing up
- **Higher Conversion**: Showing AI photo analysis capabilities increases sign-up rates
- **Security**: Separate bucket with different policies keeps authenticated user photos secure

## Setup Instructions

### 1. Run the SQL Script in Supabase

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Create a new query
4. Copy and paste the contents of `setup-anonymous-bucket.sql`
5. Click **Run** to execute the script

The script will:
- Create a new public bucket called `anon-photos`
- Set a 10MB file size limit
- Allow common image formats (JPEG, PNG, GIF, WebP, HEIC)
- Create RLS policies for anonymous uploads and reads

### 2. Verify the Setup

After running the script, you should see:
- A new bucket named `anon-photos` in Storage → Buckets
- The bucket should be marked as "Public"
- Three new policies in Authentication → Policies → storage.objects

### 3. Test Anonymous Uploads

1. Open your app in an incognito/private browser window
2. Try uploading photos without signing in
3. Check the Supabase Storage dashboard to see uploads in `anon-photos` bucket

## How It Works

### Frontend Flow
```javascript
// Anonymous users use the anon-photos bucket
const isAnonymous = !isLoggedIn;
const uploadUserId = isAnonymous ? `anon-${timestamp}` : user.id;
await uploadPhotos(sb, photos, uploadUserId, isAnonymous);
```

### Backend Flow
```javascript
// API accepts anonymous requests with temporary IDs
if (!user) {
  userId = request.anonymousId;
  userTier = 'ANONYMOUS';
  isAnonymous = true;
}
```

### Storage Structure
```
anon-photos/
├── anon-1234567890-abc123/
│   ├── 1234567890-0-kitchen.jpg
│   ├── 1234567890-1-living_room.jpg
│   └── 1234567890-2-exterior.jpg
└── anon-1234567891-def456/
    └── 1234567891-0-bedroom.jpg
```

## Security Considerations

1. **Temporary Storage**: Anonymous photos should be deleted periodically
2. **Rate Limiting**: Consider implementing rate limits for anonymous uploads
3. **File Size**: Limited to 10MB per file
4. **Public Access**: All files in anon-photos are publicly accessible

## Cleanup Strategy (Recommended)

Set up a scheduled job to clean old anonymous photos:

### Option 1: Supabase Edge Function (Recommended)
Create an edge function that runs daily to delete photos older than 24 hours:

```sql
-- Run as a scheduled job
DELETE FROM storage.objects 
WHERE bucket_id = 'anon-photos' 
AND created_at < now() - interval '24 hours';
```

### Option 2: Database Trigger
Create a trigger that automatically deletes old files:

```sql
CREATE OR REPLACE FUNCTION cleanup_old_anon_photos()
RETURNS void AS $$
BEGIN
  DELETE FROM storage.objects
  WHERE bucket_id = 'anon-photos'
  AND created_at < now() - interval '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Schedule with pg_cron (if available)
SELECT cron.schedule('cleanup-anon-photos', '0 2 * * *', 'SELECT cleanup_old_anon_photos();');
```

## Monitoring

Monitor the anonymous bucket usage:

```sql
-- Check bucket size and file count
SELECT 
  COUNT(*) as file_count,
  pg_size_pretty(SUM(metadata->>'size')::bigint) as total_size,
  MIN(created_at) as oldest_file,
  MAX(created_at) as newest_file
FROM storage.objects
WHERE bucket_id = 'anon-photos';
```

## Troubleshooting

### Photos not uploading for anonymous users?
1. Check that the `anon-photos` bucket exists
2. Verify the bucket is marked as public
3. Check RLS policies are enabled
4. Look for errors in browser console

### Getting RLS policy errors?
1. Ensure you ran the full SQL script
2. Check that RLS is enabled for storage.objects table
3. Verify the policies are active in the dashboard

### Anonymous photos not being analyzed?
1. Check that photo URLs are being passed to the AI
2. Verify the photos are accessible via public URL
3. Check API logs for photo analysis errors

## Benefits

- ✅ Anonymous users can test full AI capabilities
- ✅ Higher conversion rate from preview to sign-up
- ✅ No authentication required for uploads
- ✅ Separate from authenticated user photos
- ✅ Easy cleanup of temporary files
- ✅ Public URLs work with AI photo analysis

## Next Steps

After setting up anonymous photo uploads:

1. Test the feature in incognito mode
2. Monitor bucket usage regularly
3. Set up automated cleanup
4. Consider adding rate limiting for heavy usage
5. Track conversion metrics (anonymous → signed up)

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard → Logs
2. Review browser console for upload errors
3. Verify bucket permissions in Storage settings
4. Check RLS policies in Authentication → Policies