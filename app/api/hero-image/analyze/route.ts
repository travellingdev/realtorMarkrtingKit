import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { scorePhotosForHero } from '@/lib/features/heroImage/scorer';
import { HERO_IMAGE_CONFIG, isHeroImageEnabled } from '@/lib/features/heroImage/config';

export async function POST(req: Request) {
  try {
    // Check if feature is enabled
    if (!HERO_IMAGE_CONFIG.enabled) {
      return NextResponse.json({ error: 'Feature disabled' }, { status: 403 });
    }
    
    // Get user and check permissions
    const sb = supabaseServer();
    const { data: { user } } = await sb.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user profile for tier
    const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
    const userTier = profile?.plan || 'FREE';
    
    // Check if user can access hero images
    if (!isHeroImageEnabled(userTier)) {
      const tierConfig = HERO_IMAGE_CONFIG.tiers[userTier as keyof typeof HERO_IMAGE_CONFIG.tiers];
      return NextResponse.json({ 
        error: 'Feature not available', 
        message: 'message' in tierConfig ? tierConfig.message : 'Upgrade to access hero images'
      }, { status: 403 });
    }
    
    // Parse request body
    const body = await req.json();
    const { photoAnalyses, propertyData } = body;
    
    if (!photoAnalyses || !Array.isArray(photoAnalyses) || photoAnalyses.length === 0) {
      return NextResponse.json({ error: 'No photos provided' }, { status: 400 });
    }
    
    // Score photos for hero selection
    const analysis = await scorePhotosForHero(photoAnalyses, propertyData || {});
    
    // Log usage for analytics
    console.log('[hero-image/analyze]', {
      userId: user.id,
      tier: userTier,
      photoCount: photoAnalyses.length,
      bestScore: analysis.bestPhoto.totalScore,
    });
    
    return NextResponse.json({
      success: true,
      analysis,
    });
    
  } catch (error) {
    console.error('[hero-image/analyze] Error:', error);
    return NextResponse.json({ 
      error: 'Analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}