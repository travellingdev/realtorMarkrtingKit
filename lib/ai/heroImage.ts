import sharp from 'sharp';
import type { PhotoInsights, RoomAnalysis } from './photoAnalysis';

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
  if (!photoBuffers.length) {
    return { 
      index: 0, 
      reason: 'No photos available', 
      score: 0,
      alternatives: []
    };
  }

  // Analyze all images for quality and features
  const imageAnalyses = await Promise.all(
    photoBuffers.map(async (buffer, index) => {
      try {
        const metadata = await sharp(buffer).metadata();
        const qualityScore = await calculateAdvancedImageQuality(buffer, metadata);
        const roomType = inferRoomType(photoInsights?.rooms, index);
        const contextScore = calculateContextualScore(roomType, propertyType, metadata);
        
        const totalScore = qualityScore + contextScore;
        
        return {
          index,
          score: totalScore,
          reason: buildSelectionReason(roomType, qualityScore, contextScore, metadata),
          metadata,
          roomType
        };
      } catch (error) {
        return { 
          index, 
          score: 0, 
          reason: 'Image analysis failed',
          metadata: null,
          roomType: 'unknown'
        };
      }
    })
  );

  // Sort by score to get best options
  const sortedImages = imageAnalyses.sort((a, b) => b.score - a.score);
  
  // Handle edge cases
  const edgeCaseResult = handleEdgeCases(sortedImages, propertyType);
  if (edgeCaseResult) {
    return edgeCaseResult;
  }

  // Use AI insights as a boost, not replacement
  if (photoInsights?.heroCandidate && photoInsights.heroCandidate.index < photoBuffers.length) {
    const aiCandidate = sortedImages.find(img => img.index === photoInsights.heroCandidate!.index);
    if (aiCandidate && aiCandidate.score > sortedImages[0].score * 0.8) {
      // AI choice is close enough to top choice, use it
      return {
        index: aiCandidate.index,
        reason: `AI selected: ${aiCandidate.reason}`,
        score: aiCandidate.score,
        alternatives: sortedImages.slice(0, 3).filter(img => img.index !== aiCandidate.index)
      };
    }
  }

  const bestImage = sortedImages[0];
  return {
    index: bestImage.index,
    reason: bestImage.reason,
    score: bestImage.score,
    alternatives: sortedImages.slice(1, 4) // Top 3 alternatives
  };
}

async function calculateAdvancedImageQuality(buffer: Buffer, metadata: sharp.Metadata): Promise<number> {
  let score = 5; // Base score

  // Resolution scoring (higher weight for quality)
  const pixels = (metadata.width || 0) * (metadata.height || 0);
  if (pixels >= 2073600) score += 4; // 1920x1080 or higher
  else if (pixels >= 1036800) score += 3; // 1280x810
  else if (pixels >= 518400) score += 2; // 960x540
  else if (pixels >= 307200) score += 1; // 640x480
  else score -= 2; // Too small

  // Aspect ratio scoring (context-dependent)
  const aspectRatio = (metadata.width || 1) / (metadata.height || 1);
  if (aspectRatio >= 1.2 && aspectRatio <= 2.0) score += 2; // Good for most platforms
  else if (aspectRatio >= 0.8 && aspectRatio <= 1.2) score += 1; // Square works for IG
  else score -= 1; // Poor aspect ratio

  // Format bonus
  if (metadata.format === 'jpeg' || metadata.format === 'jpg') score += 1;
  else if (metadata.format === 'png') score += 0.5;

  // File size analysis (indicates compression quality)
  const fileSize = buffer.length;
  const pixelRatio = fileSize / pixels;
  if (pixelRatio > 0.5) score += 2; // High quality
  else if (pixelRatio > 0.2) score += 1; // Good quality
  else if (pixelRatio < 0.1) score -= 1; // Over-compressed

  // Advanced analysis using Sharp stats
  try {
    const stats = await sharp(buffer).stats();
    
    // Check for proper exposure (avoid too dark/bright)
    const channels = stats.channels;
    if (channels && channels.length >= 3) {
      const avgBrightness = (channels[0].mean + channels[1].mean + channels[2].mean) / 3;
      if (avgBrightness > 50 && avgBrightness < 200) score += 1; // Good exposure
      else if (avgBrightness < 30 || avgBrightness > 220) score -= 2; // Poor exposure
    }
  } catch (error) {
    // Stats analysis failed, continue without penalty
  }

  return Math.max(0, score);
}

function inferRoomType(rooms: RoomAnalysis[] | undefined, imageIndex: number): string {
  if (!rooms || imageIndex >= rooms.length) {
    // Fallback: guess based on typical order
    if (imageIndex === 0) return 'exterior';
    if (imageIndex === 1) return 'kitchen';
    return 'other';
  }
  
  return rooms[imageIndex]?.type || 'other';
}

function calculateContextualScore(roomType: string, propertyType?: string, metadata?: sharp.Metadata): number {
  let score = 0;
  
  // Base room type scoring
  const roomScores: Record<string, number> = {
    exterior: 10,
    kitchen: 9,
    living: 8,
    pool: 9,
    dining: 7,
    bedroom: 6,
    bathroom: 4,
    office: 4,
    garage: 2,
    utility: 1,
    other: 5
  };
  
  score += roomScores[roomType] || 5;
  
  // Property type context boosts
  if (propertyType) {
    switch (propertyType.toLowerCase()) {
      case 'luxury':
        if (roomType === 'pool' || roomType === 'exterior') score += 2;
        break;
      case 'starter home':
        if (roomType === 'kitchen' || roomType === 'living') score += 2;
        break;
      case 'condo':
        if (roomType === 'living' || roomType === 'kitchen') score += 2;
        if (roomType === 'exterior') score -= 1; // Shared exterior
        break;
      case 'lakefront':
      case 'waterfront':
        if (roomType === 'exterior') score += 3;
        break;
    }
  }
  
  // Unique feature bonuses
  if (roomType === 'pool') score += 2;
  if (roomType === 'exterior' && metadata) {
    const aspectRatio = (metadata.width || 1) / (metadata.height || 1);
    if (aspectRatio > 1.5) score += 1; // Landscape exterior preferred
  }
  
  return score;
}

function buildSelectionReason(roomType: string, qualityScore: number, contextScore: number, metadata: sharp.Metadata | null): string {
  const reasons = [];
  
  // Room type reason
  const roomReasons: Record<string, string> = {
    exterior: 'front exterior (classic choice)',
    kitchen: 'kitchen (high engagement)',
    living: 'living room (safe choice)',
    pool: 'pool area (luxury appeal)',
    dining: 'dining room',
    bedroom: 'bedroom',
    bathroom: 'bathroom',
    office: 'office/flex space',
    garage: 'garage',
    other: 'property feature'
  };
  
  reasons.push(roomReasons[roomType] || 'property area');
  
  // Quality indicators
  if (qualityScore > 8) reasons.push('excellent quality');
  else if (qualityScore > 6) reasons.push('good quality');
  
  if (metadata) {
    const pixels = (metadata.width || 0) * (metadata.height || 0);
    if (pixels >= 2073600) reasons.push('high resolution');
  }
  
  // Context bonuses
  if (contextScore > 12) reasons.push('strong marketing appeal');
  
  return reasons.join(', ');
}

function handleEdgeCases(sortedImages: any[], propertyType?: string): { index: number; reason: string; score: number; alternatives: any[] } | null {
  const hasGoodPhotos = sortedImages.some(img => img.score > 5);
  
  if (!hasGoodPhotos) {
    // All photos are poor quality
    const bestAvailable = sortedImages[0];
    if (bestAvailable) {
      return {
        index: bestAvailable.index,
        reason: `Best available photo (suggest retaking for better results)`,
        score: bestAvailable.score,
        alternatives: []
      };
    }
  }
  
  // Check for specific edge cases
  const roomTypes = sortedImages.map(img => img.roomType);
  const hasExterior = roomTypes.includes('exterior');
  const hasKitchen = roomTypes.includes('kitchen');
  const hasLiving = roomTypes.includes('living');
  
  // Property-specific edge case handling
  if (propertyType?.toLowerCase() === 'condo' && !hasExterior) {
    // Condo with no exterior - prioritize interior
    const interiorOptions = sortedImages.filter(img => img.roomType !== 'exterior');
    if (interiorOptions.length > 0) {
      const best = interiorOptions[0];
      return {
        index: best.index,
        reason: `${best.reason} (interior focus for condo)`,
        score: best.score,
        alternatives: interiorOptions.slice(1, 3)
      };
    }
  }
  
  if (!hasExterior && !hasKitchen && !hasLiving) {
    // No primary marketing photos - use best available
    const best = sortedImages[0];
    return {
      index: best.index,
      reason: `${best.reason} (limited photo options)`,
      score: best.score,
      alternatives: sortedImages.slice(1, 3)
    };
  }
  
  return null; // No edge case handling needed
}

function calculateImageQuality(metadata: sharp.Metadata): number {
  // Keep original function for backward compatibility
  let score = 5;
  const pixels = (metadata.width || 0) * (metadata.height || 0);
  if (pixels >= 2073600) score += 3;
  else if (pixels >= 1036800) score += 2;
  else if (pixels >= 518400) score += 1;

  const aspectRatio = (metadata.width || 1) / (metadata.height || 1);
  if (aspectRatio >= 1.2 && aspectRatio <= 2.0) score += 1;

  if (metadata.format === 'jpeg' || metadata.format === 'jpg') score += 1;

  return score;
}

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