import sharp from 'sharp';
import type { PhotoInsights, RoomAnalysis } from './photoAnalysis';
import { selectOptimalHero, type HeroSelectionResult } from './heroSelection';

export interface HeroImageOptions {
  overlay?: 'just_listed' | 'open_house' | 'price_reduced' | 'pending' | 'sold' | 'coming_soon';
  price?: string;
  bedsBaths?: string;
  openHouseDate?: string;
  openHouseTime?: string;
  agentBrand?: {
    logo?: string;
    name?: string;
    phone?: string;
    website?: string;
  };
  style?: 'modern' | 'luxury' | 'minimal' | 'bold';
}

export interface HeroImageVariant {
  name: string;
  buffer: Buffer;
  width: number;
  height: number;
  platform: string;
  description: string;
}

export interface HeroImageResult {
  original: Buffer;
  variants: HeroImageVariant[];
  selectedIndex: number;
  reason: string;
  photoInsights?: PhotoInsights;
}

// Platform specifications
const PLATFORM_SPECS = {
  facebook: { width: 1200, height: 630, name: 'Facebook Post' },
  instagram: { width: 1080, height: 1080, name: 'Instagram Feed' },
  story: { width: 1080, height: 1920, name: 'Instagram/Facebook Story' },
  email: { width: 600, height: 400, name: 'Email Header' },
  web: { width: 1920, height: 1080, name: 'Website Hero' },
  print: { width: 2550, height: 3300, name: 'Print Flyer (8.5x11)' }
} as const;

// Overlay styles
const OVERLAY_STYLES = {
  modern: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    textColor: 'white',
    fontSize: 48,
    fontWeight: '700',
    borderRadius: 8
  },
  luxury: {
    backgroundColor: 'rgba(212, 175, 55, 0.95)',
    textColor: 'white',
    fontSize: 44,
    fontWeight: '600',
    borderRadius: 0
  },
  minimal: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    textColor: 'black',
    fontSize: 40,
    fontWeight: '500',
    borderRadius: 12
  },
  bold: {
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    textColor: 'white',
    fontSize: 52,
    fontWeight: '800',
    borderRadius: 0
  }
} as const;

export async function selectHeroImage(
  photoBuffers: Buffer[],
  photoInsights?: PhotoInsights,
  propertyType?: string
): Promise<{ index: number; reason: string; score: number; alternatives: Array<{index: number; reason: string; score: number}> }> {
  // Use the unified hero selection logic
  const result = await selectOptimalHero(photoBuffers, photoInsights, propertyType);
  
  // Convert to legacy format for backward compatibility
  return {
    index: result.selectedIndex,
    reason: result.reason,
    score: result.confidence * 10, // Convert confidence to legacy score scale
    alternatives: result.alternatives.map(alt => ({
      index: alt.index,
      reason: alt.reason,
      score: alt.score
    }))
  };
}

// Note: Hero selection logic moved to unified heroSelection.ts
// The functions below are kept for overlay generation and other image processing

export async function generateHeroVariants(
  originalBuffer: Buffer,
  options: HeroImageOptions = {}
): Promise<HeroImageVariant[]> {
  const variants: HeroImageVariant[] = [];

  for (const [platform, specs] of Object.entries(PLATFORM_SPECS)) {
    try {
      const variant = await createPlatformVariant(
        originalBuffer,
        specs,
        platform,
        options
      );
      variants.push(variant);
    } catch (error) {
      console.error(`Failed to create ${platform} variant:`, error);
    }
  }

  return variants;
}

async function createPlatformVariant(
  buffer: Buffer,
  specs: { width: number; height: number; name: string },
  platform: string,
  options: HeroImageOptions
): Promise<HeroImageVariant> {
  let image = sharp(buffer);

  // Resize and crop for platform
  image = image.resize(specs.width, specs.height, {
    fit: 'cover',
    position: 'center'
  });

  // Add overlay if specified
  if (options.overlay) {
    const overlayBuffer = await createOverlay(
      specs.width,
      specs.height,
      options,
      platform
    );
    
    image = image.composite([{
      input: overlayBuffer,
      top: 0,
      left: 0
    }]);
  }

  const resultBuffer = await image.jpeg({ quality: 90 }).toBuffer();

  return {
    name: `hero_${platform}`,
    buffer: resultBuffer,
    width: specs.width,
    height: specs.height,
    platform: specs.name,
    description: `Optimized for ${specs.name}${options.overlay ? ` with ${options.overlay} overlay` : ''}`
  };
}

async function createOverlay(
  width: number,
  height: number,
  options: HeroImageOptions,
  platform: string
): Promise<Buffer> {
  const style = OVERLAY_STYLES[options.style || 'modern'];
  const overlayText = getOverlayText(options);
  
  // Scale font size based on platform
  const fontSize = Math.max(24, Math.min(style.fontSize, width / 20));
  const padding = Math.max(20, width / 40);

  // Create SVG overlay
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .overlay-text { 
            font-family: 'Arial', 'Helvetica', sans-serif; 
            font-weight: ${style.fontWeight};
            font-size: ${fontSize}px;
            fill: ${style.textColor};
            text-anchor: start;
          }
          .overlay-subtext { 
            font-family: 'Arial', 'Helvetica', sans-serif; 
            font-weight: 500;
            font-size: ${fontSize * 0.6}px;
            fill: ${style.textColor};
            text-anchor: start;
            opacity: 0.9;
          }
        </style>
      </defs>
      
      <!-- Main overlay background -->
      <rect x="${padding}" y="${padding}" 
            width="${Math.min(width - padding * 2, overlayText.main.length * fontSize * 0.6)}" 
            height="${fontSize + padding}"
            fill="${style.backgroundColor}" 
            rx="${style.borderRadius}" />
      
      <!-- Main text -->
      <text x="${padding * 1.5}" y="${padding + fontSize * 0.75}" class="overlay-text">
        ${escapeXml(overlayText.main)}
      </text>
      
      <!-- Subtext if available -->
      ${overlayText.sub ? `
        <rect x="${padding}" y="${padding * 2 + fontSize}" 
              width="${Math.min(width - padding * 2, overlayText.sub.length * fontSize * 0.4)}" 
              height="${fontSize * 0.6 + padding * 0.5}"
              fill="${style.backgroundColor}" 
              rx="${style.borderRadius}" />
        <text x="${padding * 1.5}" y="${padding * 2.5 + fontSize * 1.2}" class="overlay-subtext">
          ${escapeXml(overlayText.sub)}
        </text>
      ` : ''}
      
      <!-- Agent branding (bottom right) -->
      ${options.agentBrand?.name ? `
        <rect x="${width - padding - 200}" y="${height - padding - 40}" 
              width="190" height="30"
              fill="rgba(0, 0, 0, 0.7)" 
              rx="4" />
        <text x="${width - padding - 195}" y="${height - padding - 20}" 
              class="overlay-subtext" style="font-size: ${fontSize * 0.4}px; fill: white;">
          ${escapeXml(options.agentBrand.name)}
          ${options.agentBrand.phone ? ` • ${options.agentBrand.phone}` : ''}
        </text>
      ` : ''}
    </svg>
  `;

  return Buffer.from(svg);
}

function getOverlayText(options: HeroImageOptions): { main: string; sub?: string } {
  switch (options.overlay) {
    case 'just_listed':
      return {
        main: 'JUST LISTED',
        sub: options.price ? `${options.price}${options.bedsBaths ? ` • ${options.bedsBaths}` : ''}` : options.bedsBaths
      };
    case 'open_house':
      return {
        main: 'OPEN HOUSE',
        sub: options.openHouseDate && options.openHouseTime 
          ? `${options.openHouseDate} ${options.openHouseTime}`
          : options.openHouseDate || options.openHouseTime
      };
    case 'price_reduced':
      return {
        main: 'PRICE REDUCED',
        sub: options.price
      };
    case 'pending':
      return {
        main: 'PENDING',
        sub: 'Under Contract'
      };
    case 'sold':
      return {
        main: 'SOLD',
        sub: options.price ? `Sold for ${options.price}` : undefined
      };
    case 'coming_soon':
      return {
        main: 'COMING SOON',
        sub: 'Contact agent for details'
      };
    default:
      return { main: '' };
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function processHeroImage(
  photoBuffers: Buffer[],
  photoInsights?: PhotoInsights,
  options: HeroImageOptions = {}
): Promise<HeroImageResult> {
  // Select best hero image
  const selection = await selectHeroImage(photoBuffers, photoInsights);
  const heroBuffer = photoBuffers[selection.index];

  // Generate variants for all platforms
  const variants = await generateHeroVariants(heroBuffer, options);

  return {
    original: heroBuffer,
    variants,
    selectedIndex: selection.index,
    reason: selection.reason,
    photoInsights
  };
}

/**
 * Memory-optimized hero image processing
 * Processes variants one at a time to minimize memory usage
 */
export async function processHeroImageStreaming(
  photoBuffers: Buffer[],
  photoInsights?: PhotoInsights,
  options: HeroImageOptions = {}
): Promise<HeroImageResult> {
  // Select best hero image (already uses streaming approach)
  const selection = await selectHeroImage(photoBuffers, photoInsights);
  const heroBuffer = photoBuffers[selection.index];

  // Generate variants with streaming approach
  const variants = await generateHeroVariantsStreaming(heroBuffer, options);

  return {
    original: heroBuffer,
    variants,
    selectedIndex: selection.index,
    reason: selection.reason,
    photoInsights
  };
}

/**
 * Memory-optimized variant generation
 * Processes one platform at a time and cleans up immediately
 */
async function generateHeroVariantsStreaming(
  originalBuffer: Buffer,
  options: HeroImageOptions = {}
): Promise<HeroImageVariant[]> {
  const variants: HeroImageVariant[] = [];

  for (const [platform, specs] of Object.entries(PLATFORM_SPECS)) {
    try {
      console.log(`[generateHeroVariantsStreaming] Processing ${platform} variant`);
      
      const variant = await createPlatformVariantStreaming(
        originalBuffer,
        specs,
        platform,
        options
      );
      
      variants.push(variant);
      
      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      console.error(`[generateHeroVariantsStreaming] Failed to create ${platform} variant:`, error);
      // Continue with other variants instead of failing completely
    }
  }

  return variants;
}

/**
 * Memory-optimized platform variant creation
 * Cleans up Sharp instances immediately after use
 */
async function createPlatformVariantStreaming(
  buffer: Buffer,
  specs: { width: number; height: number; name: string },
  platform: string,
  options: HeroImageOptions
): Promise<HeroImageVariant> {
  let image = sharp(buffer);

  try {
    // Resize and crop for platform
    image = image.resize(specs.width, specs.height, {
      fit: 'cover',
      position: 'center'
    });

    // Add overlay if specified
    if (options.overlay) {
      const overlayBuffer = await createOverlay(
        specs.width,
        specs.height,
        options,
        platform
      );
      
      image = image.composite([{
        input: overlayBuffer,
        top: 0,
        left: 0
      }]);
    }

    const resultBuffer = await image.jpeg({ quality: 90 }).toBuffer();

    return {
      name: `hero_${platform}`,
      buffer: resultBuffer,
      width: specs.width,
      height: specs.height,
      platform: specs.name,
      description: `Optimized for ${specs.name}${options.overlay ? ` with ${options.overlay} overlay` : ''}`
    };
    
  } finally {
    // Ensure Sharp instance is cleaned up
    image.destroy();
    
    // Force garbage collection for large images
    if (buffer.length > 1024 * 1024 && global.gc) {
      global.gc();
    }
  }
}