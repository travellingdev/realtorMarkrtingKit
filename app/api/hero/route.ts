import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClients';
import { processHeroImage, type HeroImageOptions } from '@/lib/ai/heroImage';
import { getTierConfig, canUseFeature } from '@/lib/tiers';

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

    // Download photo buffers
    const photoBuffers: Buffer[] = [];
    for (const url of photoUrls.slice(0, 10)) { // Limit to 10 photos
      try {
        const response = await fetch(url);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          photoBuffers.push(Buffer.from(arrayBuffer));
        }
      } catch (error) {
        console.warn('Failed to download photo:', url, error);
      }
    }

    if (!photoBuffers.length) {
      return NextResponse.json({ error: 'photos_unavailable' }, { status: 400 });
    }

    // Get photo insights if available
    const photoInsights = kit.photo_insights;

    // Generate hero image variants
    const heroResult = await processHeroImage(
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