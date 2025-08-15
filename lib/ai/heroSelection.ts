import sharp from 'sharp';
import type { PhotoInsights, RoomAnalysis } from './photoAnalysis';

export interface HeroSelectionResult {
  selectedIndex: number;
  reason: string;
  confidence: number; // 0-1 confidence score
  alternatives: Array<{
    index: number;
    reason: string;
    score: number;
    confidence: number;
  }>;
  metadata: {
    totalPhotos: number;
    analysisMethod: 'ai_insights' | 'quality_analysis' | 'fallback';
    processingTime: number;
  };
}

export interface HeroPreferences {
  preferredRoomTypes?: string[];
  minimumQuality?: number;
  aspectRatioPreference?: 'landscape' | 'portrait' | 'square' | 'any';
  platformOptimized?: string; // Target platform for optimization
}

// Room scoring system (consolidated from both files)
const ROOM_MARKETING_SCORES = {
  exterior: 10,
  kitchen: 9,
  living: 8,
  pool: 9,
  dining: 7,
  bedroom: 6,
  bathroom: 5,
  office: 4,
  garage: 2,
  utility: 1,
  other: 5
} as const;

// Property type modifiers
const PROPERTY_TYPE_MODIFIERS = {
  luxury: {
    pool: +2,
    exterior: +2,
    kitchen: +1
  },
  'starter home': {
    kitchen: +2,
    living: +2,
    bedroom: +1
  },
  condo: {
    living: +2,
    kitchen: +1,
    exterior: -1 // Shared exterior less appealing
  },
  waterfront: {
    exterior: +3,
    pool: +1
  },
  commercial: {
    exterior: +1,
    office: +3,
    other: +1
  }
} as const;

/**
 * Unified hero selection function - single source of truth
 * Uses AI insights when available, falls back to quality analysis
 * Memory optimized: processes photos in streaming fashion when possible
 */
export async function selectOptimalHero(
  photoBuffers: Buffer[],
  photoInsights?: PhotoInsights,
  propertyType?: string,
  userPreferences?: HeroPreferences
): Promise<HeroSelectionResult> {
  const startTime = Date.now();
  
  if (!photoBuffers.length) {
    return {
      selectedIndex: 0,
      reason: 'No photos available',
      confidence: 0,
      alternatives: [],
      metadata: {
        totalPhotos: 0,
        analysisMethod: 'fallback',
        processingTime: Date.now() - startTime
      }
    };
  }

  try {
    // Method 1: Use AI insights if available (preferred)
    if (photoInsights?.rooms?.length && photoInsights.rooms.length === photoBuffers.length) {
      return await selectHeroFromAIInsights(
        photoBuffers,
        photoInsights,
        propertyType,
        userPreferences,
        startTime
      );
    }

    // Method 2: Quality-based analysis (fallback) - uses streaming approach
    return await selectHeroFromQualityAnalysisStreaming(
      photoBuffers,
      propertyType,
      userPreferences,
      startTime
    );

  } catch (error) {
    console.error('[heroSelection] Error during selection:', error);
    
    // Method 3: Simple fallback
    return {
      selectedIndex: 0,
      reason: 'Analysis failed, using first photo',
      confidence: 0.1,
      alternatives: [],
      metadata: {
        totalPhotos: photoBuffers.length,
        analysisMethod: 'fallback',
        processingTime: Date.now() - startTime
      }
    };
  }
}

/**
 * Select hero using AI insights (preferred method)
 */
async function selectHeroFromAIInsights(
  photoBuffers: Buffer[],
  photoInsights: PhotoInsights,
  propertyType?: string,
  userPreferences?: HeroPreferences,
  startTime?: number
): Promise<HeroSelectionResult> {
  const analyses = [];

  // Analyze each photo using AI insights + quality metrics
  for (let i = 0; i < photoBuffers.length; i++) {
    const buffer = photoBuffers[i];
    const roomAnalysis = photoInsights.rooms[i];
    
    if (!roomAnalysis) continue;

    try {
      const metadata = await sharp(buffer).metadata();
      const qualityScore = await calculateImageQuality(buffer, metadata);
      const contextScore = calculateContextScore(roomAnalysis, propertyType, metadata);
      
      // Combine AI insights with quality metrics
      const totalScore = (qualityScore * 0.4) + (contextScore * 0.4) + (roomAnalysis.appeal * 0.2);
      
      // Calculate confidence based on multiple factors
      const confidence = calculateConfidence({
        qualityScore,
        contextScore,
        aiAppeal: roomAnalysis.appeal,
        hasGoodMetadata: !!(metadata.width && metadata.height),
        roomType: roomAnalysis.type
      });

      analyses.push({
        index: i,
        score: totalScore,
        confidence,
        reason: buildDetailedReason(roomAnalysis, qualityScore, contextScore),
        metadata,
        roomAnalysis
      });

    } catch (error) {
      console.warn(`[heroSelection] Failed to analyze photo ${i}:`, error);
      // Add with low score to keep in alternatives
      analyses.push({
        index: i,
        score: 1,
        confidence: 0.1,
        reason: 'Analysis failed',
        metadata: null,
        roomAnalysis
      });
    }
  }

  // Sort by score and confidence
  analyses.sort((a, b) => {
    const scoreWeight = b.score - a.score;
    const confidenceWeight = (b.confidence - a.confidence) * 0.3;
    return scoreWeight + confidenceWeight;
  });

  // Check if AI's hero candidate should override our analysis
  if (photoInsights.heroCandidate) {
    const aiChoice = analyses.find(a => a.index === photoInsights.heroCandidate!.index);
    const topChoice = analyses[0];
    
    // Use AI choice if it's close to our top choice (within 15% score difference)
    if (aiChoice && topChoice && (aiChoice.score >= topChoice.score * 0.85)) {
      return buildResult(aiChoice, analyses, 'ai_insights', startTime, 'AI recommendation validated by quality analysis');
    }
  }

  // Use our top choice
  const bestChoice = analyses[0];
  if (bestChoice) {
    return buildResult(bestChoice, analyses, 'ai_insights', startTime);
  }

  // Fallback if no valid analyses
  return {
    selectedIndex: 0,
    reason: 'Using first photo (analysis incomplete)',
    confidence: 0.2,
    alternatives: [],
    metadata: {
      totalPhotos: photoBuffers.length,
      analysisMethod: 'ai_insights',
      processingTime: startTime ? Date.now() - startTime : 0
    }
  };
}

/**
 * Select hero using pure quality analysis (fallback method)
 * @deprecated Use selectHeroFromQualityAnalysisStreaming for better memory efficiency
 */
async function selectHeroFromQualityAnalysis(
  photoBuffers: Buffer[],
  propertyType?: string,
  userPreferences?: HeroPreferences,
  startTime?: number
): Promise<HeroSelectionResult> {
  const analyses = [];

  for (let i = 0; i < photoBuffers.length; i++) {
    const buffer = photoBuffers[i];
    
    try {
      const metadata = await sharp(buffer).metadata();
      const qualityScore = await calculateImageQuality(buffer, metadata);
      
      // Infer room type from position (rough heuristic)
      const inferredRoomType = inferRoomTypeFromPosition(i, photoBuffers.length);
      const contextScore = calculateBasicContextScore(inferredRoomType, propertyType);
      
      const totalScore = (qualityScore * 0.7) + (contextScore * 0.3);
      const confidence = Math.min(0.8, qualityScore / 15); // Lower confidence without AI
      
      analyses.push({
        index: i,
        score: totalScore,
        confidence,
        reason: buildQualityBasedReason(inferredRoomType, qualityScore, metadata),
        metadata
      });

    } catch (error) {
      console.warn(`[heroSelection] Failed to analyze photo ${i}:`, error);
      analyses.push({
        index: i,
        score: 1,
        confidence: 0.1,
        reason: 'Quality analysis failed',
        metadata: null
      });
    }
  }

  analyses.sort((a, b) => b.score - a.score);
  const bestChoice = analyses[0];
  
  return buildResult(bestChoice, analyses, 'quality_analysis', startTime);
}

/**
 * Memory-optimized quality analysis using streaming approach
 * Processes one photo at a time to minimize memory usage
 */
async function selectHeroFromQualityAnalysisStreaming(
  photoBuffers: Buffer[],
  propertyType?: string,
  userPreferences?: HeroPreferences,
  startTime?: number
): Promise<HeroSelectionResult> {
  const analyses: any[] = [];
  let bestChoice: any = null;
  let bestScore = -1;

  // Process photos one at a time to minimize memory usage
  for (let i = 0; i < photoBuffers.length; i++) {
    const buffer = photoBuffers[i];
    let analysis: any;
    
    try {
      // Process with Sharp and dispose immediately
      const sharpInstance = sharp(buffer);
      const metadata = await sharpInstance.metadata();
      
      // Calculate quality metrics
      const qualityScore = await calculateImageQualityStreaming(sharpInstance, metadata);
      
      // Clean up Sharp instance
      sharpInstance.destroy();
      
      // Infer room type from position (rough heuristic)
      const inferredRoomType = inferRoomTypeFromPosition(i, photoBuffers.length);
      const contextScore = calculateBasicContextScore(inferredRoomType, propertyType);
      
      const totalScore = (qualityScore * 0.7) + (contextScore * 0.3);
      const confidence = Math.min(0.8, qualityScore / 15); // Lower confidence without AI
      
      analysis = {
        index: i,
        score: totalScore,
        confidence,
        reason: buildQualityBasedReason(inferredRoomType, qualityScore, metadata),
        metadata
      };

      // Track best choice to avoid sorting large arrays
      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestChoice = analysis;
      }

    } catch (error) {
      console.warn(`[heroSelection] Failed to analyze photo ${i}:`, error);
      analysis = {
        index: i,
        score: 1,
        confidence: 0.1,
        reason: 'Quality analysis failed',
        metadata: null
      };
    }
    
    analyses.push(analysis);
    
    // Force garbage collection hint for large buffers
    if (buffer.length > 1024 * 1024) { // 1MB threshold
      if (global.gc) {
        global.gc();
      }
    }
  }

  // Sort only for alternatives (top choice already identified)
  analyses.sort((a, b) => b.score - a.score);
  
  return buildResult(bestChoice || analyses[0], analyses, 'quality_analysis', startTime);
}

/**
 * Calculate image quality score using Sharp analysis
 */
async function calculateImageQuality(buffer: Buffer, metadata: sharp.Metadata): Promise<number> {
  let score = 5; // Base score

  // Resolution scoring (0-4 points)
  const pixels = (metadata.width || 0) * (metadata.height || 0);
  if (pixels >= 3840 * 2160) score += 4; // 4K+
  else if (pixels >= 1920 * 1080) score += 3; // 1080p+
  else if (pixels >= 1280 * 720) score += 2; // 720p+
  else if (pixels >= 640 * 480) score += 1; // 480p+
  else score -= 1; // Too small

  // Aspect ratio scoring (0-2 points)
  const aspectRatio = (metadata.width || 1) / (metadata.height || 1);
  if (aspectRatio >= 1.2 && aspectRatio <= 2.0) score += 2; // Good landscape
  else if (aspectRatio >= 0.8 && aspectRatio <= 1.2) score += 1; // Square (good for IG)
  else if (aspectRatio > 2.5 || aspectRatio < 0.4) score -= 1; // Too extreme

  // Format bonus (0-1 points)
  if (metadata.format === 'jpeg') score += 1;
  else if (metadata.format === 'png') score += 0.5;

  // File size analysis (indicates compression quality)
  const fileSize = buffer.length;
  const pixelRatio = pixels > 0 ? fileSize / pixels : 0;
  if (pixelRatio > 0.5) score += 2; // High quality, less compression
  else if (pixelRatio > 0.2) score += 1; // Good quality
  else if (pixelRatio < 0.1) score -= 1; // Over-compressed

  // Advanced analysis using Sharp stats
  try {
    const stats = await sharp(buffer).stats();
    
    if (stats.channels && stats.channels.length >= 3) {
      const avgBrightness = (stats.channels[0].mean + stats.channels[1].mean + stats.channels[2].mean) / 3;
      if (avgBrightness > 50 && avgBrightness < 200) score += 1; // Good exposure
      else if (avgBrightness < 30 || avgBrightness > 220) score -= 2; // Poor exposure
    }
  } catch (error) {
    // Stats analysis failed, continue without penalty
  }

  return Math.max(0, score);
}

/**
 * Memory-optimized quality calculation using existing Sharp instance
 * Reuses Sharp instance to avoid creating duplicate buffers
 */
async function calculateImageQualityStreaming(sharpInstance: sharp.Sharp, metadata: sharp.Metadata): Promise<number> {
  let score = 5; // Base score

  // Resolution scoring (0-4 points)
  const pixels = (metadata.width || 0) * (metadata.height || 0);
  if (pixels >= 3840 * 2160) score += 4; // 4K+
  else if (pixels >= 1920 * 1080) score += 3; // 1080p+
  else if (pixels >= 1280 * 720) score += 2; // 720p+
  else if (pixels >= 640 * 480) score += 1; // 480p+
  else score -= 1; // Too small

  // Aspect ratio scoring (0-2 points)
  const aspectRatio = (metadata.width || 1) / (metadata.height || 1);
  if (aspectRatio >= 1.2 && aspectRatio <= 2.0) score += 2; // Good landscape
  else if (aspectRatio >= 0.8 && aspectRatio <= 1.2) score += 1; // Square (good for IG)
  else if (aspectRatio > 2.5 || aspectRatio < 0.4) score -= 1; // Too extreme

  // Format bonus (0-1 points)
  if (metadata.format === 'jpeg') score += 1;
  else if (metadata.format === 'png') score += 0.5;

  // File size analysis (0-2 points) - approximate from metadata
  if (metadata.size) {
    const pixelRatio = pixels > 0 ? metadata.size / pixels : 0;
    if (pixelRatio > 0.5) score += 2; // High quality, less compression
    else if (pixelRatio > 0.2) score += 1; // Good quality
    else if (pixelRatio < 0.1) score -= 1; // Over-compressed
  }

  // Advanced analysis using Sharp stats (reuses instance)
  try {
    const stats = await sharpInstance.stats();
    
    if (stats.channels && stats.channels.length >= 3) {
      const avgBrightness = (stats.channels[0].mean + stats.channels[1].mean + stats.channels[2].mean) / 3;
      if (avgBrightness > 50 && avgBrightness < 200) score += 1; // Good exposure
      else if (avgBrightness < 30 || avgBrightness > 220) score -= 2; // Poor exposure
    }
  } catch (error) {
    // Stats analysis failed, continue without penalty
  }

  return Math.max(0, score);
}

/**
 * Calculate context score using room analysis
 */
function calculateContextScore(
  roomAnalysis: RoomAnalysis,
  propertyType?: string,
  metadata?: sharp.Metadata
): number {
  let score = ROOM_MARKETING_SCORES[roomAnalysis.type] || 5;

  // Condition bonus
  switch (roomAnalysis.condition) {
    case 'excellent': score += 2; break;
    case 'good': score += 1; break;
    case 'needs_updates': score -= 1; break;
  }

  // Property type modifiers
  if (propertyType) {
    const normalizedType = propertyType.toLowerCase().replace(/[^a-z]/g, '') as keyof typeof PROPERTY_TYPE_MODIFIERS;
    const modifiers = PROPERTY_TYPE_MODIFIERS[normalizedType];
    if (modifiers) {
      const roomTypeModifier = modifiers[roomAnalysis.type as keyof typeof modifiers];
      if (roomTypeModifier) score += roomTypeModifier;
    }
  }

  // Feature bonuses
  if (roomAnalysis.features.length > 3) score += 1;
  
  // Special features
  const hasPoolFeatures = roomAnalysis.features.some(f => 
    f.toLowerCase().includes('pool') || f.toLowerCase().includes('spa')
  );
  if (hasPoolFeatures) score += 2;

  return Math.max(0, score);
}

/**
 * Calculate basic context score without AI insights
 */
function calculateBasicContextScore(roomType: string, propertyType?: string): number {
  const baseScore = ROOM_MARKETING_SCORES[roomType as keyof typeof ROOM_MARKETING_SCORES] || 5;
  
  // Simple property type adjustments
  if (propertyType?.toLowerCase().includes('luxury') && roomType === 'exterior') {
    return baseScore + 2;
  }
  
  return baseScore;
}

/**
 * Infer room type from photo position (heuristic for quality-only analysis)
 */
function inferRoomTypeFromPosition(index: number, totalPhotos: number): string {
  // Common photo order patterns
  if (index === 0) return 'exterior'; // First photo usually exterior
  if (index === 1 && totalPhotos > 3) return 'kitchen'; // Second often kitchen
  if (index === 2 && totalPhotos > 4) return 'living'; // Third often living
  
  // For remaining photos, use a rotation
  const remainingTypes = ['bedroom', 'bathroom', 'dining', 'other'];
  return remainingTypes[(index - 3) % remainingTypes.length] || 'other';
}

/**
 * Calculate confidence score based on multiple factors
 */
function calculateConfidence(factors: {
  qualityScore: number;
  contextScore: number;
  aiAppeal: number;
  hasGoodMetadata: boolean;
  roomType: string;
}): number {
  let confidence = 0.5; // Base confidence

  // Quality factor (0-0.3)
  confidence += Math.min(0.3, factors.qualityScore / 15);
  
  // Context factor (0-0.2)
  confidence += Math.min(0.2, factors.contextScore / 15);
  
  // AI appeal factor (0-0.2)
  confidence += Math.min(0.2, factors.aiAppeal / 10);
  
  // Metadata bonus (0-0.1)
  if (factors.hasGoodMetadata) confidence += 0.1;
  
  // Room type bonus (0-0.1)
  if (['exterior', 'kitchen', 'living', 'pool'].includes(factors.roomType)) {
    confidence += 0.1;
  }

  return Math.min(1, Math.max(0, confidence));
}

/**
 * Build detailed reason string for AI-based selection
 */
function buildDetailedReason(
  roomAnalysis: RoomAnalysis,
  qualityScore: number,
  contextScore: number
): string {
  const reasons = [];
  
  // Room type
  const roomTypeDescriptions = {
    exterior: 'front exterior (classic choice)',
    kitchen: 'kitchen (high engagement)', 
    living: 'living room (family appeal)',
    pool: 'pool area (luxury appeal)',
    dining: 'dining room',
    bedroom: 'bedroom',
    bathroom: 'bathroom',
    office: 'office space',
    garage: 'garage',
    other: 'property feature'
  };
  
  reasons.push(roomTypeDescriptions[roomAnalysis.type] || 'property area');
  
  // Quality
  if (qualityScore > 10) reasons.push('excellent image quality');
  else if (qualityScore > 7) reasons.push('good image quality');
  
  // Condition
  if (roomAnalysis.condition === 'excellent') reasons.push('pristine condition');
  else if (roomAnalysis.condition === 'good') reasons.push('good condition');
  
  // Features
  if (roomAnalysis.features.length > 2) {
    reasons.push(`notable features (${roomAnalysis.features.slice(0, 2).join(', ')})`);
  }
  
  // Marketing appeal
  if (roomAnalysis.appeal > 8) reasons.push('strong marketing appeal');
  
  return reasons.join(', ');
}

/**
 * Build reason string for quality-based selection
 */
function buildQualityBasedReason(roomType: string, qualityScore: number, metadata: sharp.Metadata | null): string {
  const reasons = [];
  
  if (roomType === 'exterior') reasons.push('front exterior photo');
  else if (roomType === 'kitchen') reasons.push('kitchen area');
  else reasons.push(`${roomType} photo`);
  
  if (qualityScore > 10) reasons.push('high quality');
  else if (qualityScore > 7) reasons.push('good quality');
  
  if (metadata) {
    const pixels = (metadata.width || 0) * (metadata.height || 0);
    if (pixels >= 1920 * 1080) reasons.push('high resolution');
  }
  
  return reasons.join(', ');
}

/**
 * Build final result object
 */
function buildResult(
  bestChoice: any,
  allAnalyses: any[],
  analysisMethod: 'ai_insights' | 'quality_analysis' | 'fallback',
  startTime?: number,
  overrideReason?: string
): HeroSelectionResult {
  const alternatives = allAnalyses
    .filter(a => a.index !== bestChoice.index)
    .slice(0, 3) // Top 3 alternatives
    .map(a => ({
      index: a.index,
      reason: a.reason,
      score: a.score,
      confidence: a.confidence
    }));

  return {
    selectedIndex: bestChoice.index,
    reason: overrideReason || bestChoice.reason,
    confidence: bestChoice.confidence,
    alternatives,
    metadata: {
      totalPhotos: allAnalyses.length,
      analysisMethod,
      processingTime: startTime ? Date.now() - startTime : 0
    }
  };
}