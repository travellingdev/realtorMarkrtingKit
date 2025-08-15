import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClients';

interface GenerateRequest {
  kitId: string;
  photoUrl: string;
  photoIndex: number;
  enhancement: {
    type: 'brightness' | 'twilight' | 'staging' | 'seasonal' | 'sky';
    intensity?: number;
    options?: Record<string, any>;
  };
  overlays?: {
    badge?: string;
    price?: string;
    bedsBaths?: string;
    agentInfo?: {
      name: string;
      phone?: string;
      logo?: string;
    };
  };
  platforms?: string[];
}

// Platform-specific configurations
const PLATFORM_CONFIGS = {
  mls: {
    width: 1024,
    height: 768,
    quality: 85,
    overlays: {
      badge: { position: 'top-left', style: 'ribbon' },
      price: { position: 'bottom-left', style: 'elegant' },
      agent: { position: 'bottom', style: 'professional' }
    }
  },
  instagram: {
    width: 1080,
    height: 1080,
    quality: 80,
    overlays: {
      badge: { position: 'top-left', style: 'modern' },
      price: { position: 'bottom-left', style: 'minimal' },
      swipe: { position: 'bottom-right', text: 'Swipe for more →' }
    }
  },
  instagram_story: {
    width: 1080,
    height: 1920,
    quality: 80,
    overlays: {
      badge: { position: 'top-center', style: 'sticker' },
      price: { position: 'middle', style: 'bold' },
      cta: { position: 'bottom', text: 'Link in bio' }
    }
  },
  facebook: {
    width: 1200,
    height: 630,
    quality: 85,
    overlays: {
      badge: { position: 'top-left', style: 'banner' },
      price: { position: 'bottom-left', style: 'detailed' },
      agent: { position: 'bottom-right', style: 'compact' }
    }
  },
  email: {
    width: 600,
    height: 400,
    quality: 70,
    overlays: {
      price: { position: 'bottom-left', style: 'simple' },
      cta: { position: 'bottom-right', text: 'View Details' }
    }
  }
};

// Enhancement presets
const ENHANCEMENT_PRESETS = {
  brightness: {
    brightness: 1.15,
    contrast: 1.1,
    saturation: 1.08,
    vibrance: 1.1
  },
  twilight: {
    brightness: 0.95,
    contrast: 1.2,
    saturation: 1.15,
    colorTemperature: 2800, // Warm golden hour
    skyGradient: ['#FF6B6B', '#4ECDC4', '#2C3E50']
  },
  sky: {
    skyReplacement: 'blue_clear',
    brightness: 1.1,
    contrast: 1.05,
    saturation: 1.1
  },
  staging: {
    // This would integrate with an AI staging API
    style: 'modern',
    density: 'medium',
    colorScheme: 'neutral'
  },
  seasonal: {
    targetSeason: 'spring',
    foliageColor: '#90EE90',
    brightness: 1.1
  }
};

async function applyEnhancement(
  imageUrl: string,
  enhancement: GenerateRequest['enhancement']
): Promise<string> {
  // For MVP, we'll create enhanced URLs with query parameters
  // In production, this would use Sharp.js or an image processing service
  
  const preset = ENHANCEMENT_PRESETS[enhancement.type];
  const params = new URLSearchParams();
  
  // Add enhancement parameters based on type
  if ('brightness' in preset && preset.brightness) {
    params.append('brightness', preset.brightness.toString());
  }
  if ('contrast' in preset && preset.contrast) {
    params.append('contrast', preset.contrast.toString());
  }
  if ('saturation' in preset && preset.saturation) {
    params.append('saturation', preset.saturation.toString());
  }
  
  // Add enhancement type marker
  params.append('enhanced', enhancement.type);
  params.append('intensity', (enhancement.intensity || 100).toString());
  
  // For now, return the original URL with parameters
  // In production, this would process and store the enhanced image
  return `${imageUrl}?${params.toString()}`;
}

async function addOverlays(
  imageUrl: string,
  overlays: GenerateRequest['overlays'],
  platform: string
): Promise<string> {
  if (!overlays) return imageUrl;
  
  const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
  if (!config) return imageUrl;
  
  // Build overlay parameters
  const params = new URLSearchParams(imageUrl.split('?')[1] || '');
  
  if (overlays.badge) {
    params.append('badge', overlays.badge);
    if ('badge' in config.overlays) {
      params.append('badge_position', config.overlays.badge?.position || 'top-left');
      params.append('badge_style', config.overlays.badge?.style || 'ribbon');
    }
  }
  
  if (overlays.price) {
    params.append('price', overlays.price);
    if ('price' in config.overlays) {
      params.append('price_position', config.overlays.price?.position || 'bottom-left');
      params.append('price_style', config.overlays.price?.style || 'elegant');
    }
  }
  
  if (overlays.bedsBaths) {
    params.append('details', overlays.bedsBaths);
  }
  
  if (overlays.agentInfo) {
    params.append('agent_name', overlays.agentInfo.name);
    if (overlays.agentInfo.phone) params.append('agent_phone', overlays.agentInfo.phone);
  }
  
  params.append('platform', platform);
  params.append('width', config.width.toString());
  params.append('height', config.height.toString());
  
  // Return URL with overlay parameters
  const baseUrl = imageUrl.split('?')[0];
  return `${baseUrl}?${params.toString()}`;
}

async function storeEnhancedImage(
  kitId: string,
  originalUrl: string,
  enhancedUrl: string,
  enhancement: GenerateRequest['enhancement'],
  platform: string
): Promise<string> {
  // For MVP, we'll store enhanced images in the photo_insights field
  // since enhanced_images column doesn't exist yet
  
  // Skip database storage for temporary kits
  if (kitId.startsWith('temp-kit-')) {
    console.log('[hero-generate] Skipping storage for temporary kit');
    return enhancedUrl;
  }
  
  const sb = supabaseServer();
  
  // Fetch existing photo_insights
  const { data, error } = await sb
    .from('kits')
    .select('photo_insights')
    .eq('id', kitId)
    .maybeSingle();
  
  if (error) {
    console.error('[hero-generate] Failed to fetch kit:', error);
    // Don't throw error, just return the URL
    return enhancedUrl;
  }
  
  const photoInsights = data?.photo_insights || {};
  
  // Store enhanced images in photo_insights
  if (!photoInsights.enhancedImages) {
    photoInsights.enhancedImages = {};
  }
  
  if (!photoInsights.enhancedImages[platform]) {
    photoInsights.enhancedImages[platform] = [];
  }
  
  // Add new enhanced image
  photoInsights.enhancedImages[platform].push({
    url: enhancedUrl,
    enhancement: enhancement.type,
    created: new Date().toISOString(),
    original: originalUrl
  });
  
  // Update kit with enhanced images in photo_insights
  const { error: updateError } = await sb
    .from('kits')
    .update({
      photo_insights: photoInsights
    })
    .eq('id', kitId);
  
  if (updateError) {
    console.error('[hero-generate] Failed to update kit photo_insights:', updateError);
    // Don't throw error, just return the URL
  }
  
  return enhancedUrl;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    
    console.log('[hero-generate] Request received:', {
      kitId: body.kitId,
      enhancement: body.enhancement.type,
      platforms: body.platforms?.length || 1
    });
    
    // Validate required fields
    if (!body.kitId || !body.photoUrl || !body.enhancement) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Default to all platforms if not specified
    const platforms = body.platforms || ['mls', 'instagram', 'facebook', 'email'];
    
    // Process image for each platform
    const processedImages = [];
    const startTime = Date.now();
    
    for (const platform of platforms) {
      try {
        // Apply enhancement
        const enhancedUrl = await applyEnhancement(body.photoUrl, body.enhancement);
        
        // Add platform-specific overlays
        const finalUrl = await addOverlays(enhancedUrl, body.overlays, platform);
        
        // Store enhanced image
        const storedUrl = await storeEnhancedImage(
          body.kitId,
          body.photoUrl,
          finalUrl,
          body.enhancement,
          platform
        );
        
        const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS];
        
        processedImages.push({
          platform,
          url: storedUrl,
          dimensions: {
            width: config?.width || 1024,
            height: config?.height || 768
          },
          size: Math.floor(Math.random() * 500000) + 100000 // Mock file size
        });
        
      } catch (err) {
        console.error(`[hero-generate] Failed to process ${platform}:`, err);
        // Continue with other platforms even if one fails
      }
    }
    
    const processingTime = Date.now() - startTime;
    
    console.log('[hero-generate] Generation complete:', {
      kitId: body.kitId,
      platforms: processedImages.length,
      processingTime
    });
    
    return NextResponse.json({
      success: true,
      images: processedImages,
      processingTime
    });
    
  } catch (error) {
    console.error('[hero-generate] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate hero images' },
      { status: 500 }
    );
  }
}