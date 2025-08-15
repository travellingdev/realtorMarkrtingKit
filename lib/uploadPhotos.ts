import type { SupabaseClient } from '@supabase/supabase-js';

interface UploadError {
  fileName: string;
  index: number;
  error: string;
  attempts: number;
}

interface UploadResult {
  urls: string[];
  errors: UploadError[];
  successRate: number;
}

export async function uploadPhotos(
  sb: SupabaseClient,
  files: File[],
  userId: string,
  isAnonymous: boolean = false
): Promise<string[]> {
  const result = await uploadPhotosWithRetry(sb, files, userId, isAnonymous);
  
  // Log detailed results for debugging
  if (result.errors.length > 0) {
    console.warn('[uploadPhotos] Some uploads failed:', {
      successful: result.urls.length,
      failed: result.errors.length,
      successRate: `${Math.round(result.successRate * 100)}%`,
      failures: result.errors.map(e => ({ file: e.fileName, error: e.error })),
      isAnonymous
    });
  }
  
  return result.urls;
}

export async function uploadPhotosWithRetry(
  sb: SupabaseClient,
  files: File[],
  userId: string,
  isAnonymous: boolean = false,
  maxRetries: number = 2
): Promise<UploadResult> {
  const urls: string[] = [];
  const errors: UploadError[] = [];
  // Use different bucket for anonymous users
  const bucket = isAnonymous ? 'anon-photos' : 'photos';
  const timestamp = Date.now(); // Add timestamp to prevent conflicts
  
  console.log('[uploadPhotos] Starting upload', {
    bucket,
    isAnonymous,
    userId: isAnonymous ? 'anonymous' : userId,
    fileCount: files.length
  });

  const uploadWithRetry = async (file: File, index: number): Promise<string | null> => {
    const baseFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
    const path = `${userId}/${timestamp}-${index}-${baseFileName}`;
    let lastError = '';

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('File too large (max 10MB)');
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`Invalid file type: ${file.type}`);
        }

        const { error: uploadError, data: uploadData } = await sb.storage
          .from(bucket)
          .upload(path, file, {
            upsert: true,
            contentType: file.type
          });

        if (uploadError) {
          // Special handling for anonymous bucket not existing
          if (bucket === 'anon-photos' && uploadError.message.includes('not found')) {
            throw new Error('Anonymous photo uploads not configured. Please run setup-anonymous-bucket.sql in Supabase.');
          }
          throw new Error(uploadError.message);
        }

        const { data: urlData } = sb.storage.from(bucket).getPublicUrl(path);
        
        if (!urlData?.publicUrl) {
          throw new Error('Failed to get public URL');
        }

        // Verify upload by checking if URL is accessible
        try {
          const verifyResponse = await fetch(urlData.publicUrl, { method: 'HEAD' });
          if (!verifyResponse.ok) {
            throw new Error(`Upload verification failed: ${verifyResponse.status}`);
          }
        } catch (verifyError) {
          console.warn(`[uploadPhotos] Upload verification failed for ${path}:`, verifyError);
          // Continue anyway - verification failure doesn't mean upload failed
        }

        return urlData.publicUrl;

      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        console.warn(`[uploadPhotos] Attempt ${attempt}/${maxRetries} failed for ${file.name}:`, lastError);
        
        // Don't retry on certain errors
        if (lastError.includes('File too large') || 
            lastError.includes('Invalid file type') ||
            lastError.includes('Quota exceeded')) {
          break;
        }
        
        // Wait before retrying
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    errors.push({ 
      fileName: file.name, 
      index, 
      error: lastError, 
      attempts: maxRetries 
    });
    return null;
  };

  // Process uploads sequentially to avoid overwhelming Supabase
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const url = await uploadWithRetry(file, i);
    
    if (url) {
      urls.push(url);
    }
    
    // Small delay between uploads
    if (i < files.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return {
    urls,
    errors,
    successRate: files.length > 0 ? urls.length / files.length : 0
  };
}
