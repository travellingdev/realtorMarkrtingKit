import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClients';
import { processHeroImage, processHeroImageStreaming, type HeroImageOptions } from '@/lib/ai/heroImage';
import { getTierConfig, canUseFeature } from '@/lib/tiers';

interface PhotoDownloadError {
  url: string;
  attempts: number;
  lastError: string;
}

interface PhotoDownloadResult {
  photoBuffers: Buffer[];
  errors: PhotoDownloadError[];
}

// Download photos with exponential backoff retry logic
async function downloadPhotosWithRetry(
  photoUrls: string[], 
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<PhotoDownloadResult> {
  const photoBuffers: Buffer[] = [];
  const errors: PhotoDownloadError[] = [];

  const downloadWithRetry = async (url: string): Promise<Buffer | null> => {
    let lastError = '';
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'RealtorMarketing/1.0'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        if (arrayBuffer.byteLength === 0) {
          throw new Error('Empty response body');
        }
        
        return Buffer.from(arrayBuffer);
        
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        console.warn(`[downloadPhotos] Attempt ${attempt}/${maxRetries} failed for ${url}:`, lastError);
        
        // Don't retry on certain errors
        if (lastError.includes('404') || lastError.includes('403') || lastError.includes('401')) {
          break;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    errors.push({ url, attempts: maxRetries, lastError });
    return null;
  };

  // Download photos concurrently but with controlled parallelism
  const batchSize = 3; // Download 3 at a time to avoid overwhelming servers
  for (let i = 0; i < photoUrls.length; i += batchSize) {
    const batch = photoUrls.slice(i, i + batchSize);
    const batchPromises = batch.map(url => downloadWithRetry(url));
    const batchResults = await Promise.allSettled(batchPromises);
    
    for (const result of batchResults) {
      if (result.status === 'fulfilled' && result.value) {
        photoBuffers.push(result.value);
      }
    }
    
    // Small delay between batches to be respectful to servers
    if (i + batchSize < photoUrls.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return { photoBuffers, errors };
}

export async function POST(req: Request) {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'auth' }, { status: 401 });
  }

  // Check user tier and hero image permissions
  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  const userTier = profile?.plan || 'FREE';
  
  if (!canUseFeature(userTier, 'heroImages')) {
    return NextResponse.json({ 
      error: 'feature_locked', 
      details: {
        feature: 'heroImages',
        tier: userTier,
        upgradeRequired: true,
        message: 'Hero image generation requires Professional tier or higher'
      }
    }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { kitId, options = {} } = body as { 
      kitId: string; 
      options?: HeroImageOptions 
    };

    // Get kit data with photo URLs
    const { data: kit, error: kitError } = await sb
      .from('kits')
      .select('*')
      .eq('id', kitId)
      .eq('user_id', user.id)
      .single();

    if (kitError || !kit) {
      return NextResponse.json({ error: 'kit_not_found' }, { status: 404 });
    }

    // Get photo URLs from payload
    const photoUrls = kit.payload?.photos || [];
    if (!photoUrls.length) {
      return NextResponse.json({ error: 'no_photos' }, { status: 400 });
    }

    // Download photo buffers with retry logic and proper error handling
    const { photoBuffers, errors } = await downloadPhotosWithRetry(photoUrls.slice(0, 10));

    if (!photoBuffers.length) {
      console.error('[api/hero] No photos could be downloaded', { 
        totalUrls: photoUrls.length, 
        errors: errors.length,
        errorDetails: errors.map(e => ({ url: e.url, attempts: e.attempts, lastError: e.lastError }))
      });
      return NextResponse.json({ 
        error: 'photos_unavailable',
        details: {
          totalPhotos: photoUrls.length,
          failedDownloads: errors.length,
          message: 'All photo downloads failed after retries'
        }
      }, { status: 400 });
    }

    // Log partial failures for debugging
    if (errors.length > 0) {
      console.warn('[api/hero] Some photos failed to download', {
        successful: photoBuffers.length,
        failed: errors.length,
        successRate: `${Math.round((photoBuffers.length / photoUrls.slice(0, 10).length) * 100)}%`
      });
    }

    // Get photo insights if available
    const photoInsights = kit.photo_insights;

    // Generate hero image variants with memory optimization
    const heroResult = await processHeroImageStreaming(
      photoBuffers,
      photoInsights,
      options
    );

    // Upload variants to Supabase storage
    const variants = [];
    for (const variant of heroResult.variants) {
      try {
        const fileName = `hero/${kitId}/${variant.name}.jpg`;
        
        const { data: uploadData, error: uploadError } = await sb.storage
          .from('generated-images')
          .upload(fileName, variant.buffer, {
            contentType: 'image/jpeg',
            upsert: true
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        const { data: { publicUrl } } = sb.storage
          .from('generated-images')
          .getPublicUrl(fileName);

        variants.push({
          name: variant.name,
          platform: variant.platform,
          width: variant.width,
          height: variant.height,
          url: publicUrl,
          description: variant.description
        });
      } catch (error) {
        console.error('Failed to process variant:', variant.name, error);
      }
    }

    // Update kit with hero image data
    const { error: updateError } = await sb
      .from('kits')
      .update({
        hero_images: {
          selectedIndex: heroResult.selectedIndex,
          reason: heroResult.reason,
          variants,
          generatedAt: new Date().toISOString()
        }
      })
      .eq('id', kitId);

    if (updateError) {
      console.error('Failed to update kit with hero images:', updateError);
    }

    return NextResponse.json({
      success: true,
      heroImages: {
        selectedIndex: heroResult.selectedIndex,
        reason: heroResult.reason,
        variants
      }
    });

  } catch (error) {
    console.error('[api/hero] Error:', error);
    return NextResponse.json({ 
      error: 'internal_error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}