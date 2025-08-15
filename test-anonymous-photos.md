# Testing Anonymous Photo Uploads

## Prerequisites
1. Run `setup-anonymous-bucket.sql` in your Supabase SQL Editor
2. Verify the `anon-photos` bucket exists in Storage → Buckets
3. Ensure the dev server is running on http://localhost:3003

## Test Scenarios

### Test 1: Anonymous User Photo Upload
1. Open browser in incognito mode
2. Navigate to http://localhost:3003
3. Fill in property details
4. **Add 2-3 photos** using the photo upload button
5. Click "Generate your preview"
6. **Expected Results:**
   - Photos upload successfully
   - Toast message: "All photos uploaded successfully"
   - Console shows: "[uploadPhotos] Starting upload" with bucket: "anon-photos"
   - AI analyzes photos and includes insights in generated content

### Test 2: Verify Anonymous Photos in Supabase
1. After Test 1, go to Supabase Dashboard
2. Navigate to Storage → Buckets → anon-photos
3. **Expected:** See uploaded photos with paths like:
   ```
   anon-1234567890-abc123/1234567890-0-filename.jpg
   anon-1234567890-abc123/1234567890-1-filename.jpg
   ```

### Test 3: Public URL Access
1. In Supabase Storage, click on any anonymous photo
2. Copy the public URL
3. Open URL in a new browser tab
4. **Expected:** Photo loads without authentication

### Test 4: Logged-In User Photo Upload
1. Sign in to the application
2. Upload photos
3. Check Supabase Storage
4. **Expected:** Photos go to regular `photos` bucket, NOT `anon-photos`

### Test 5: Error Handling - Bucket Not Created
1. If you haven't run the SQL script yet, try uploading as anonymous
2. **Expected:** Error message about bucket configuration
3. Console shows helpful error about running setup script

## Console Logs to Watch

```javascript
// Anonymous upload
[uploadPhotos] Starting upload {
  bucket: "anon-photos",
  isAnonymous: true,
  userId: "anonymous",
  fileCount: 2
}

// Successful anonymous generation
[api/generate] anonymous request { anonId: "anon-1234567890-abc123" }
[api/generate] Photo analysis enabled {
  isAnonymous: true,
  message: "Anonymous photo analysis (limited)"
}
```

## Verification Checklist

- [ ] Anonymous users can upload photos
- [ ] Photos stored in `anon-photos` bucket
- [ ] Photos are publicly accessible
- [ ] AI analyzes anonymous photos
- [ ] Photo insights appear in generated content
- [ ] Logged-in users use regular `photos` bucket
- [ ] Error messages are helpful when bucket missing

## Common Issues

### Issue: "Bucket not found" error
**Solution:** Run `setup-anonymous-bucket.sql` in Supabase SQL Editor

### Issue: "Row-level security policy" error
**Solution:** Check that RLS policies were created correctly

### Issue: Photos upload but don't appear in AI analysis
**Solution:** Verify public URLs are accessible and being passed to AI

### Issue: Anonymous photos not cleaning up
**Solution:** Set up scheduled cleanup job as described in ANONYMOUS_PHOTOS_SETUP.md

## Success Metrics

✅ Anonymous users can generate content with photo analysis
✅ No authentication errors during anonymous upload
✅ Photos successfully analyzed by AI
✅ Conversion tracking: anonymous users with photos → sign-ups