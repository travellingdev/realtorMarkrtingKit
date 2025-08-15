/**
 * Advanced validation system with channel-specific metrics
 * Provides comprehensive content quality assessment and performance prediction
 */

import type { PhotoInsights } from './photoAnalysis';
import type { Facts, Output } from './schemas';

export interface AdvancedValidationResult {
  overallScore: number;
  channelScores: ChannelScore[];
  conversionPrediction: ConversionPrediction;
  qualityMetrics: QualityMetrics;
  optimizationRecommendations: OptimizationRecommendation[];
  performanceProjections: PerformanceProjection[];
  validationSummary: ValidationSummary;
}

export interface ChannelScore {
  channel: 'MLS' | 'Instagram' | 'Email' | 'LinkedIn' | 'Facebook' | 'YouTube' | 'TikTok' | 'Shorts';
  score: number;
  breakdown: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  improvementActions: string[];
  performancePrediction: ChannelPerformancePrediction;
}

export interface ScoreBreakdown {
  contentQuality: number;
  audienceAlignment: number;
  engagementPotential: number;
  conversionLikelihood: number;
  platformOptimization: number;
  brandConsistency: number;
}

export interface ChannelPerformancePrediction {
  engagementRate: PredictionRange;
  conversionRate: PredictionRange;
  reachPotential: PredictionRange;
  viralPotential: PredictionRange;
  confidenceLevel: 'high' | 'medium' | 'low';
  keyFactors: string[];
}

export interface PredictionRange {
  low: number;
  mid: number;
  high: number;
  unit: string;
}

export interface ConversionPrediction {
  overallConversionScore: number;
  stageConversions: StageConversion[];
  funnelOptimization: FunnelOptimization;
  dropoffPoints: DropoffPoint[];
  accelerationOpportunities: AccelerationOpportunity[];
}

export interface StageConversion {
  stage: 'awareness' | 'consideration' | 'decision';
  conversionRate: number;
  confidence: 'high' | 'medium' | 'low';
  keyFactors: string[];
  optimizationPotential: number;
}

export interface FunnelOptimization {
  currentEfficiency: number;
  potentialEfficiency: number;
  bottlenecks: Bottleneck[];
  recommendedActions: string[];
  expectedImprovement: number;
}

export interface Bottleneck {
  stage: string;
  issue: string;
  impact: 'high' | 'medium' | 'low';
  solution: string;
  effort: 'low' | 'medium' | 'high';
}

export interface DropoffPoint {
  location: string;
  severity: 'high' | 'medium' | 'low';
  cause: string;
  solution: string;
  priorityLevel: number;
}

export interface AccelerationOpportunity {
  opportunity: string;
  stage: string;
  impact: 'high' | 'medium' | 'low';
  implementation: string;
  expectedGain: number;
}

export interface QualityMetrics {
  readabilityScore: number;
  emotionalResonance: number;
  persuasionStrength: number;
  credibilityFactor: number;
  uniquenessScore: number;
  actionClarity: number;
  brandAlignment: number;
  contentCoherence: number;
}

export interface OptimizationRecommendation {
  category: 'content' | 'structure' | 'engagement' | 'conversion' | 'personalization';
  priority: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
  rationale: string;
  expectedImpact: string;
  implementationSteps: string[];
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
}

export interface PerformanceProjection {
  metric: string;
  currentProjection: number;
  optimizedProjection: number;
  improvementPotential: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  timeToRealize: string;
}

export interface ValidationSummary {
  overallGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
  keyStrengths: string[];
  criticalIssues: string[];
  quickWins: string[];
  strategicImprovements: string[];
  competitivePosition: 'superior' | 'competitive' | 'adequate' | 'needs_improvement';
}

export interface ValidationConfig {
  weightings: ChannelWeightings;
  benchmarks: PerformanceBenchmarks;
  thresholds: QualityThresholds;
  personaFactors: PersonaFactors;
}

export interface ChannelWeightings {
  contentQuality: number;
  audienceAlignment: number;
  engagementPotential: number;
  conversionLikelihood: number;
  platformOptimization: number;
  brandConsistency: number;
}

export interface PerformanceBenchmarks {
  industry: IndustryBenchmarks;
  platform: PlatformBenchmarks;
  competitive: CompetitiveBenchmarks;
}

export interface IndustryBenchmarks {
  engagementRates: Record<string, number>;
  conversionRates: Record<string, number>;
  qualityStandards: Record<string, number>;
}

export interface PlatformBenchmarks {
  [platform: string]: {
    avgEngagement: number;
    topPerformerThreshold: number;
    conversionBenchmark: number;
  };
}

export interface CompetitiveBenchmarks {
  contentQuality: number;
  engagementLevel: number;
  conversionRate: number;
  innovationScore: number;
}

export interface QualityThresholds {
  excellent: number;
  good: number;
  acceptable: number;
  needsImprovement: number;
  poor: number;
}

export interface PersonaFactors {
  [persona: string]: {
    contentPreferences: string[];
    engagementDrivers: string[];
    conversionTriggers: string[];
    qualityExpectations: number;
  };
}

/**
 * Perform advanced validation with comprehensive metrics
 */
export function performAdvancedValidation(
  outputs: Output,
  facts: Facts,
  photoInsights: PhotoInsights,
  config?: Partial<ValidationConfig>
): AdvancedValidationResult {
  const validationConfig = mergeWithDefaultConfig(config);
  
  // Analyze each channel's performance
  const channelScores = analyzeChannelPerformance(outputs, facts, photoInsights, validationConfig);
  
  // Calculate overall score
  const overallScore = calculateOverallScore(channelScores);
  
  // Predict conversion performance
  const conversionPrediction = predictConversionPerformance(outputs, facts, photoInsights, channelScores);
  
  // Assess quality metrics
  const qualityMetrics = assessQualityMetrics(outputs, facts, photoInsights);
  
  // Generate optimization recommendations
  const optimizationRecommendations = generateOptimizationRecommendations(
    channelScores, qualityMetrics, conversionPrediction
  );
  
  // Project performance improvements
  const performanceProjections = projectPerformanceImprovements(
    channelScores, optimizationRecommendations
  );
  
  // Create validation summary
  const validationSummary = createValidationSummary(
    overallScore, channelScores, qualityMetrics, optimizationRecommendations
  );
  
  return {
    overallScore,
    channelScores,
    conversionPrediction,
    qualityMetrics,
    optimizationRecommendations,
    performanceProjections,
    validationSummary
  };
}

/**
 * Analyze performance for each marketing channel
 */
function analyzeChannelPerformance(
  outputs: Output,
  facts: Facts,
  photoInsights: PhotoInsights,
  config: ValidationConfig
): ChannelScore[] {
  const channels: ChannelScore[] = [];
  
  // MLS Analysis
  if (outputs.mlsDesc) {
    channels.push(analyzeMLS(outputs.mlsDesc, facts, photoInsights, config));
  }
  
  // Instagram Analysis
  if (outputs.igSlides && outputs.igSlides.length > 0) {
    channels.push(analyzeInstagram(outputs.igSlides, facts, photoInsights, config));
  }
  
  // Email Analysis
  if (outputs.emailSubject && outputs.emailBody) {
    channels.push(analyzeEmail(outputs.emailSubject, outputs.emailBody, facts, photoInsights, config));
  }
  
  return channels;
}

/**
 * Analyze MLS content performance
 */
function analyzeMLS(
  mlsDesc: string,
  facts: Facts,
  photoInsights: PhotoInsights,
  config: ValidationConfig
): ChannelScore {
  const breakdown: ScoreBreakdown = {
    contentQuality: assessMLSContentQuality(mlsDesc, photoInsights),
    audienceAlignment: assessMLSAudienceAlignment(mlsDesc, facts, photoInsights),
    engagementPotential: assessMLSEngagementPotential(mlsDesc, photoInsights),
    conversionLikelihood: assessMLSConversionLikelihood(mlsDesc, photoInsights),
    platformOptimization: assessMLSPlatformOptimization(mlsDesc, facts, photoInsights),
    brandConsistency: 85 // Default professional standard
  };
  
  const score = calculateWeightedScore(breakdown, config.weightings);
  
  return {
    channel: 'MLS',
    score,
    breakdown,
    strengths: identifyMLSStrengths(mlsDesc, photoInsights),
    weaknesses: identifyMLSWeaknesses(mlsDesc, photoInsights),
    improvementActions: generateMLSImprovements(mlsDesc, photoInsights),
    performancePrediction: predictMLSPerformance(score, breakdown, photoInsights)
  };
}

/**
 * Assess MLS content quality
 */
function assessMLSContentQuality(mlsDesc: string, photoInsights: PhotoInsights): number {
  let score = 60; // Base score
  
  // Length appropriateness (300-800 words optimal)
  const wordCount = mlsDesc.split(/\s+/).length;
  if (wordCount >= 300 && wordCount <= 800) score += 15;
  else if (wordCount >= 200 && wordCount <= 1000) score += 10;
  else score -= 10;
  
  // Feature integration
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  const mentionedFeatures = mustMentionFeatures.filter(feature => 
    mlsDesc.toLowerCase().includes(feature.toLowerCase())
  );
  score += Math.min((mentionedFeatures.length / mustMentionFeatures.length) * 25, 25);
  
  // Professional language quality
  const professionalWords = ['exceptional', 'premium', 'quality', 'elegant', 'sophisticated'];
  const professionalCount = professionalWords.filter(word => 
    mlsDesc.toLowerCase().includes(word)
  ).length;
  score += Math.min(professionalCount * 3, 15);
  
  // Lifestyle scenarios inclusion
  const lifestyleWords = ['imagine', 'perfect', 'ideal', 'enjoy', 'experience'];
  const lifestyleCount = lifestyleWords.filter(word => 
    mlsDesc.toLowerCase().includes(word)
  ).length;
  score += Math.min(lifestyleCount * 2, 10);
  
  return Math.min(score, 100);
}

/**
 * Assess MLS audience alignment
 */
function assessMLSAudienceAlignment(mlsDesc: string, facts: Facts, photoInsights: PhotoInsights): number {
  let score = 60;
  
  // Buyer persona alignment
  const buyerProfile = photoInsights.buyerProfile || '';
  if (buyerProfile.toLowerCase().includes('family') && mlsDesc.toLowerCase().includes('family')) score += 15;
  if (buyerProfile.toLowerCase().includes('professional') && mlsDesc.toLowerCase().includes('convenient')) score += 15;
  if (buyerProfile.toLowerCase().includes('luxury') && mlsDesc.toLowerCase().includes('luxury')) score += 15;
  
  // Property type alignment
  const propertyType = facts.propertyType || '';
  if (propertyType && mlsDesc.toLowerCase().includes(propertyType.toLowerCase())) score += 10;
  
  // Neighborhood context
  const neighborhood = facts.neighborhood || '';
  if (neighborhood && mlsDesc.toLowerCase().includes(neighborhood.toLowerCase())) score += 10;
  
  return Math.min(score, 100);
}

/**
 * Assess MLS engagement potential
 */
function assessMLSEngagementPotential(mlsDesc: string, photoInsights: PhotoInsights): number {
  let score = 50;
  
  // Emotional language
  const emotionalWords = ['stunning', 'beautiful', 'amazing', 'perfect', 'dream', 'love'];
  const emotionalCount = emotionalWords.filter(word => 
    mlsDesc.toLowerCase().includes(word)
  ).length;
  score += Math.min(emotionalCount * 5, 25);
  
  // Unique selling propositions
  const headlineFeature = photoInsights.headlineFeature || '';
  if (headlineFeature && mlsDesc.toLowerCase().includes(headlineFeature.toLowerCase())) score += 15;
  
  // Call to action presence
  const ctaWords = ['call', 'contact', 'schedule', 'visit', 'see', 'tour'];
  const hasCTA = ctaWords.some(word => mlsDesc.toLowerCase().includes(word));
  if (hasCTA) score += 10;
  
  return Math.min(score, 100);
}

/**
 * Assess MLS conversion likelihood
 */
function assessMLSConversionLikelihood(mlsDesc: string, photoInsights: PhotoInsights): number {
  let score = 50;
  
  // Urgency triggers
  const urgencyWords = ['rare', 'opportunity', 'limited', 'exclusive', 'don\'t miss'];
  const urgencyCount = urgencyWords.filter(word => 
    mlsDesc.toLowerCase().includes(word)
  ).length;
  score += Math.min(urgencyCount * 8, 24);
  
  // Value proposition clarity
  const valueWords = ['value', 'investment', 'priced', 'opportunity', 'potential'];
  const valueCount = valueWords.filter(word => 
    mlsDesc.toLowerCase().includes(word)
  ).length;
  score += Math.min(valueCount * 6, 18);
  
  // Social proof elements
  const proofWords = ['award', 'recognized', 'popular', 'sought-after'];
  const proofCount = proofWords.filter(word => 
    mlsDesc.toLowerCase().includes(word)
  ).length;
  score += Math.min(proofCount * 4, 12);
  
  return Math.min(score, 100);
}

/**
 * Assess MLS platform optimization
 */
function assessMLSPlatformOptimization(mlsDesc: string, facts: Facts, photoInsights: PhotoInsights): number {
  let score = 60;
  
  // SEO keyword integration
  const seoKeywords = photoInsights.mlsKeywords || [];
  const usedKeywords = seoKeywords.filter(keyword => 
    mlsDesc.toLowerCase().includes(keyword.toLowerCase())
  );
  score += Math.min((usedKeywords.length / Math.max(seoKeywords.length, 1)) * 20, 20);
  
  // Property details inclusion
  const details = [facts.beds, facts.baths, facts.sqft, facts.propertyType].filter(Boolean);
  const mentionedDetails = details.filter(detail => 
    mlsDesc.toLowerCase().includes(detail.toString().toLowerCase())
  );
  score += Math.min((mentionedDetails.length / details.length) * 15, 15);
  
  // Location optimization
  const location = facts.neighborhood || facts.address || '';
  if (location && mlsDesc.toLowerCase().includes(location.toLowerCase())) score += 10;
  
  return Math.min(score, 100);
}

/**
 * Identify MLS content strengths
 */
function identifyMLSStrengths(mlsDesc: string, photoInsights: PhotoInsights): string[] {
  const strengths: string[] = [];
  
  if (mlsDesc.length >= 300) strengths.push('Comprehensive property description');
  
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  const mentionedFeatures = mustMentionFeatures.filter(feature => 
    mlsDesc.toLowerCase().includes(feature.toLowerCase())
  );
  if (mentionedFeatures.length >= 4) strengths.push('Excellent feature integration');
  
  const emotionalWords = ['stunning', 'beautiful', 'amazing', 'perfect'];
  const hasEmotionalLanguage = emotionalWords.some(word => 
    mlsDesc.toLowerCase().includes(word)
  );
  if (hasEmotionalLanguage) strengths.push('Engaging emotional language');
  
  const headlineFeature = photoInsights.headlineFeature || '';
  if (headlineFeature && mlsDesc.toLowerCase().includes(headlineFeature.toLowerCase())) {
    strengths.push('Strong headline feature emphasis');
  }
  
  return strengths;
}

/**
 * Identify MLS content weaknesses
 */
function identifyMLSWeaknesses(mlsDesc: string, photoInsights: PhotoInsights): string[] {
  const weaknesses: string[] = [];
  
  if (mlsDesc.length < 200) weaknesses.push('Content too brief for effective marketing');
  if (mlsDesc.length > 1000) weaknesses.push('Content too lengthy, may lose reader attention');
  
  const ctaWords = ['call', 'contact', 'schedule', 'visit'];
  const hasCTA = ctaWords.some(word => mlsDesc.toLowerCase().includes(word));
  if (!hasCTA) weaknesses.push('Missing clear call-to-action');
  
  const urgencyWords = ['rare', 'opportunity', 'limited', 'exclusive'];
  const hasUrgency = urgencyWords.some(word => mlsDesc.toLowerCase().includes(word));
  if (!hasUrgency) weaknesses.push('Lacks urgency or scarcity messaging');
  
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  const mentionedFeatures = mustMentionFeatures.filter(feature => 
    mlsDesc.toLowerCase().includes(feature.toLowerCase())
  );
  if (mentionedFeatures.length < 3) weaknesses.push('Insufficient feature highlighting');
  
  return weaknesses;
}

/**
 * Generate MLS improvement actions
 */
function generateMLSImprovements(mlsDesc: string, photoInsights: PhotoInsights): string[] {
  const improvements: string[] = [];
  
  if (mlsDesc.length < 300) improvements.push('Expand content to include more lifestyle benefits');
  
  const ctaWords = ['call', 'contact', 'schedule', 'visit'];
  const hasCTA = ctaWords.some(word => mlsDesc.toLowerCase().includes(word));
  if (!hasCTA) improvements.push('Add clear call-to-action for scheduling showings');
  
  const urgencyWords = ['rare', 'opportunity', 'limited'];
  const hasUrgency = urgencyWords.some(word => mlsDesc.toLowerCase().includes(word));
  if (!hasUrgency) improvements.push('Include urgency or scarcity messaging');
  
  const seoKeywords = photoInsights.mlsKeywords || [];
  if (seoKeywords.length > 0) {
    const usedKeywords = seoKeywords.filter(keyword => 
      mlsDesc.toLowerCase().includes(keyword.toLowerCase())
    );
    if (usedKeywords.length < seoKeywords.length) {
      improvements.push('Integrate additional SEO keywords naturally');
    }
  }
  
  return improvements;
}

/**
 * Predict MLS performance
 */
function predictMLSPerformance(
  score: number,
  breakdown: ScoreBreakdown,
  photoInsights: PhotoInsights
): ChannelPerformancePrediction {
  // Base performance on score and property quality
  const baseEngagement = score * 0.8; // Convert to percentage
  const propertyQualityMultiplier = photoInsights.features.length >= 5 ? 1.2 : 1.0;
  
  return {
    engagementRate: {
      low: Math.round(baseEngagement * 0.8 * propertyQualityMultiplier * 10) / 10,
      mid: Math.round(baseEngagement * propertyQualityMultiplier * 10) / 10,
      high: Math.round(baseEngagement * 1.2 * propertyQualityMultiplier * 10) / 10,
      unit: '% of viewers engaging'
    },
    conversionRate: {
      low: Math.round(breakdown.conversionLikelihood * 0.1),
      mid: Math.round(breakdown.conversionLikelihood * 0.15),
      high: Math.round(breakdown.conversionLikelihood * 0.2),
      unit: '% conversion to inquiries'
    },
    reachPotential: {
      low: 70,
      mid: 85,
      high: 95,
      unit: '% of target audience reached'
    },
    viralPotential: {
      low: 5,
      mid: 12,
      high: 25,
      unit: '% likelihood of shares/forwards'
    },
    confidenceLevel: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low',
    keyFactors: [
      'Feature quality and uniqueness',
      'Professional photography impact',
      'Market timing and demand',
      'Competitive positioning'
    ]
  };
}

/**
 * Analyze Instagram content performance
 */
function analyzeInstagram(
  igSlides: string[],
  facts: Facts,
  photoInsights: PhotoInsights,
  config: ValidationConfig
): ChannelScore {
  const breakdown: ScoreBreakdown = {
    contentQuality: assessInstagramContentQuality(igSlides, photoInsights),
    audienceAlignment: assessInstagramAudienceAlignment(igSlides, photoInsights),
    engagementPotential: assessInstagramEngagementPotential(igSlides, photoInsights),
    conversionLikelihood: assessInstagramConversionLikelihood(igSlides, photoInsights),
    platformOptimization: assessInstagramPlatformOptimization(igSlides, photoInsights),
    brandConsistency: 80 // Default for social media consistency
  };
  
  const score = calculateWeightedScore(breakdown, config.weightings);
  
  return {
    channel: 'Instagram',
    score,
    breakdown,
    strengths: identifyInstagramStrengths(igSlides, photoInsights),
    weaknesses: identifyInstagramWeaknesses(igSlides, photoInsights),
    improvementActions: generateInstagramImprovements(igSlides, photoInsights),
    performancePrediction: predictInstagramPerformance(score, breakdown, igSlides, photoInsights)
  };
}

/**
 * Assess Instagram content quality
 */
function assessInstagramContentQuality(igSlides: string[], photoInsights: PhotoInsights): number {
  let score = 50;
  
  // Optimal slide count (4-7 slides)
  if (igSlides.length >= 4 && igSlides.length <= 7) score += 15;
  else if (igSlides.length >= 3 && igSlides.length <= 9) score += 10;
  else score -= 10;
  
  // Viral hook quality
  const firstSlide = igSlides[0]?.toLowerCase() || '';
  const viralHooks = ['pov:', 'tell me', 'this house', 'when you', 'the way this'];
  const hasViralHook = viralHooks.some(hook => firstSlide.includes(hook));
  if (hasViralHook) score += 20;
  
  // Feature integration across slides
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  const allSlidesText = igSlides.join(' ').toLowerCase();
  const mentionedFeatures = mustMentionFeatures.filter(feature => 
    allSlidesText.includes(feature.toLowerCase())
  );
  score += Math.min((mentionedFeatures.length / mustMentionFeatures.length) * 20, 20);
  
  // Engagement elements
  const engagementWords = ['swipe', 'comment', 'dm', 'tag', 'save'];
  const hasEngagementBait = igSlides.some(slide => 
    engagementWords.some(word => slide.toLowerCase().includes(word))
  );
  if (hasEngagementBait) score += 15;
  
  return Math.min(score, 100);
}

/**
 * Assess Instagram audience alignment
 */
function assessInstagramAudienceAlignment(igSlides: string[], photoInsights: PhotoInsights): number {
  let score = 60;
  
  // Lifestyle focus for target persona
  const allSlidesText = igSlides.join(' ').toLowerCase();
  const lifestyleWords = ['lifestyle', 'dream', 'goals', 'vibes', 'aesthetic'];
  const lifestyleCount = lifestyleWords.filter(word => allSlidesText.includes(word)).length;
  score += Math.min(lifestyleCount * 8, 24);
  
  // Aspirational content
  const aspirationalWords = ['luxury', 'stunning', 'perfect', 'amazing', 'goals'];
  const aspirationalCount = aspirationalWords.filter(word => allSlidesText.includes(word)).length;
  score += Math.min(aspirationalCount * 4, 16);
  
  return Math.min(score, 100);
}

/**
 * Assess Instagram engagement potential
 */
function assessInstagramEngagementPotential(igSlides: string[], photoInsights: PhotoInsights): number {
  let score = 40;
  
  // Viral hook in first slide
  const firstSlide = igSlides[0]?.toLowerCase() || '';
  const viralHooks = ['pov:', 'tell me', 'this house hits different', 'when you'];
  const hasStrongHook = viralHooks.some(hook => firstSlide.includes(hook));
  if (hasStrongHook) score += 25;
  
  // Engagement bait throughout
  const engagementWords = ['swipe', 'comment', 'dm', 'tag', 'share', 'save'];
  const engagementCount = igSlides.filter(slide => 
    engagementWords.some(word => slide.toLowerCase().includes(word))
  ).length;
  score += Math.min(engagementCount * 8, 24);
  
  // Emoji usage for visual appeal
  const allSlidesText = igSlides.join('');
  const emojiCount = (allSlidesText.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  score += Math.min(emojiCount * 2, 16);
  
  return Math.min(score, 100);
}

/**
 * Assess Instagram conversion likelihood
 */
function assessInstagramConversionLikelihood(igSlides: string[], photoInsights: PhotoInsights): number {
  let score = 40;
  
  // Clear CTA in final slide
  const lastSlide = igSlides[igSlides.length - 1]?.toLowerCase() || '';
  const ctaWords = ['dm', 'contact', 'link in bio', 'comment', 'message'];
  const hasCTA = ctaWords.some(word => lastSlide.includes(word));
  if (hasCTA) score += 20;
  
  // Urgency elements
  const urgencyWords = ['limited', 'don\'t miss', 'act fast', 'opportunity'];
  const hasUrgency = igSlides.some(slide => 
    urgencyWords.some(word => slide.toLowerCase().includes(word))
  );
  if (hasUrgency) score += 15;
  
  // Value proposition clarity
  const valueWords = ['perfect', 'ideal', 'exactly what', 'everything you'];
  const hasValue = igSlides.some(slide => 
    valueWords.some(phrase => slide.toLowerCase().includes(phrase))
  );
  if (hasValue) score += 15;
  
  return Math.min(score, 100);
}

/**
 * Assess Instagram platform optimization
 */
function assessInstagramPlatformOptimization(igSlides: string[], photoInsights: PhotoInsights): number {
  let score = 50;
  
  // Optimal slide count for carousel engagement
  if (igSlides.length >= 4 && igSlides.length <= 6) score += 20;
  else if (igSlides.length >= 3 && igSlides.length <= 8) score += 15;
  
  // Hook optimization for algorithm
  const firstSlide = igSlides[0]?.toLowerCase() || '';
  const algorithmFriendly = ['pov', 'tell me', 'this house', 'rating this'];
  const isAlgorithmOptimized = algorithmFriendly.some(phrase => firstSlide.includes(phrase));
  if (isAlgorithmOptimized) score += 15;
  
  // Story potential (looping narrative)
  const hasStoryFlow = igSlides.length >= 4 && 
    igSlides[0].toLowerCase().includes('pov') &&
    igSlides[igSlides.length - 1].toLowerCase().includes('dm');
  if (hasStoryFlow) score += 15;
  
  return Math.min(score, 100);
}

/**
 * Additional helper functions for Instagram analysis
 */
function identifyInstagramStrengths(igSlides: string[], photoInsights: PhotoInsights): string[] {
  const strengths: string[] = [];
  
  // Check for viral hook
  const firstSlide = igSlides[0]?.toLowerCase() || '';
  if (firstSlide.includes('pov') || firstSlide.includes('tell me')) {
    strengths.push('Strong viral hook format');
  }
  
  // Check slide count
  if (igSlides.length >= 4 && igSlides.length <= 7) {
    strengths.push('Optimal slide count for engagement');
  }
  
  // Check for engagement bait
  const hasEngagementBait = igSlides.some(slide => 
    ['swipe', 'dm', 'comment'].some(word => slide.toLowerCase().includes(word))
  );
  if (hasEngagementBait) {
    strengths.push('Effective engagement prompts');
  }
  
  return strengths;
}

function identifyInstagramWeaknesses(igSlides: string[], photoInsights: PhotoInsights): string[] {
  const weaknesses: string[] = [];
  
  if (igSlides.length < 3) weaknesses.push('Too few slides for carousel optimization');
  if (igSlides.length > 8) weaknesses.push('Too many slides may reduce completion rate');
  
  const firstSlide = igSlides[0]?.toLowerCase() || '';
  const viralHooks = ['pov:', 'tell me', 'this house'];
  const hasViralHook = viralHooks.some(hook => firstSlide.includes(hook));
  if (!hasViralHook) weaknesses.push('Missing viral hook format');
  
  const lastSlide = igSlides[igSlides.length - 1]?.toLowerCase() || '';
  const hasCTA = ['dm', 'contact', 'comment'].some(word => lastSlide.includes(word));
  if (!hasCTA) weaknesses.push('Missing clear call-to-action');
  
  return weaknesses;
}

function generateInstagramImprovements(igSlides: string[], photoInsights: PhotoInsights): string[] {
  const improvements: string[] = [];
  
  const firstSlide = igSlides[0]?.toLowerCase() || '';
  if (!firstSlide.includes('pov') && !firstSlide.includes('tell me')) {
    improvements.push('Add viral hook format (POV, Tell me, etc.) to first slide');
  }
  
  const hasEngagementBait = igSlides.some(slide => 
    ['swipe', 'dm', 'comment', 'tag'].some(word => slide.toLowerCase().includes(word))
  );
  if (!hasEngagementBait) {
    improvements.push('Add engagement bait (swipe prompts, comment requests)');
  }
  
  const lastSlide = igSlides[igSlides.length - 1]?.toLowerCase() || '';
  const hasUrgency = ['don\'t miss', 'limited', 'act fast'].some(phrase => lastSlide.includes(phrase));
  if (!hasUrgency) {
    improvements.push('Add urgency element to final slide');
  }
  
  return improvements;
}

function predictInstagramPerformance(
  score: number,
  breakdown: ScoreBreakdown,
  igSlides: string[],
  photoInsights: PhotoInsights
): ChannelPerformancePrediction {
  const baseEngagement = score * 0.6; // Instagram has higher baseline engagement
  const viralMultiplier = igSlides[0]?.toLowerCase().includes('pov') ? 1.5 : 1.0;
  
  return {
    engagementRate: {
      low: Math.round(baseEngagement * 0.8 * viralMultiplier * 10) / 10,
      mid: Math.round(baseEngagement * viralMultiplier * 10) / 10,
      high: Math.round(baseEngagement * 1.3 * viralMultiplier * 10) / 10,
      unit: '% engagement rate'
    },
    conversionRate: {
      low: Math.round(breakdown.conversionLikelihood * 0.05),
      mid: Math.round(breakdown.conversionLikelihood * 0.08),
      high: Math.round(breakdown.conversionLikelihood * 0.12),
      unit: '% conversion to DMs/inquiries'
    },
    reachPotential: {
      low: 60,
      mid: 85,
      high: 120,
      unit: '% of follower reach potential'
    },
    viralPotential: {
      low: Math.round(breakdown.engagementPotential * 0.2),
      mid: Math.round(breakdown.engagementPotential * 0.4),
      high: Math.round(breakdown.engagementPotential * 0.6),
      unit: '% likelihood of viral spread'
    },
    confidenceLevel: score >= 75 ? 'high' : score >= 60 ? 'medium' : 'low',
    keyFactors: [
      'Viral hook effectiveness',
      'Visual content quality',
      'Engagement bait strategy',
      'Algorithm optimization'
    ]
  };
}

/**
 * Analyze Email content performance
 */
function analyzeEmail(
  emailSubject: string,
  emailBody: string,
  facts: Facts,
  photoInsights: PhotoInsights,
  config: ValidationConfig
): ChannelScore {
  const breakdown: ScoreBreakdown = {
    contentQuality: assessEmailContentQuality(emailSubject, emailBody, photoInsights),
    audienceAlignment: assessEmailAudienceAlignment(emailSubject, emailBody, photoInsights),
    engagementPotential: assessEmailEngagementPotential(emailSubject, emailBody, photoInsights),
    conversionLikelihood: assessEmailConversionLikelihood(emailSubject, emailBody, photoInsights),
    platformOptimization: assessEmailPlatformOptimization(emailSubject, emailBody),
    brandConsistency: 85 // Professional email standard
  };
  
  const score = calculateWeightedScore(breakdown, config.weightings);
  
  return {
    channel: 'Email',
    score,
    breakdown,
    strengths: identifyEmailStrengths(emailSubject, emailBody, photoInsights),
    weaknesses: identifyEmailWeaknesses(emailSubject, emailBody, photoInsights),
    improvementActions: generateEmailImprovements(emailSubject, emailBody, photoInsights),
    performancePrediction: predictEmailPerformance(score, breakdown, emailSubject, emailBody)
  };
}

/**
 * Additional email analysis functions would go here...
 * Similar pattern to Instagram analysis
 */

/**
 * Calculate weighted score from breakdown
 */
function calculateWeightedScore(breakdown: ScoreBreakdown, weightings: ChannelWeightings): number {
  const weightedScore = 
    (breakdown.contentQuality * weightings.contentQuality) +
    (breakdown.audienceAlignment * weightings.audienceAlignment) +
    (breakdown.engagementPotential * weightings.engagementPotential) +
    (breakdown.conversionLikelihood * weightings.conversionLikelihood) +
    (breakdown.platformOptimization * weightings.platformOptimization) +
    (breakdown.brandConsistency * weightings.brandConsistency);
  
  return Math.round(weightedScore);
}

/**
 * Calculate overall score from channel scores
 */
function calculateOverallScore(channelScores: ChannelScore[]): number {
  if (channelScores.length === 0) return 0;
  
  const totalScore = channelScores.reduce((sum, channel) => sum + channel.score, 0);
  return Math.round(totalScore / channelScores.length);
}

/**
 * Merge user config with default configuration
 */
function mergeWithDefaultConfig(config?: Partial<ValidationConfig>): ValidationConfig {
  const defaultConfig: ValidationConfig = {
    weightings: {
      contentQuality: 0.25,
      audienceAlignment: 0.20,
      engagementPotential: 0.20,
      conversionLikelihood: 0.20,
      platformOptimization: 0.10,
      brandConsistency: 0.05
    },
    benchmarks: {
      industry: {
        engagementRates: { 'MLS': 15, 'Instagram': 35, 'Email': 25 },
        conversionRates: { 'MLS': 8, 'Instagram': 3, 'Email': 12 },
        qualityStandards: { 'Overall': 75, 'Content': 80, 'Engagement': 70 }
      },
      platform: {
        'Instagram': { avgEngagement: 35, topPerformerThreshold: 60, conversionBenchmark: 5 },
        'MLS': { avgEngagement: 15, topPerformerThreshold: 25, conversionBenchmark: 10 },
        'Email': { avgEngagement: 25, topPerformerThreshold: 40, conversionBenchmark: 15 }
      },
      competitive: {
        contentQuality: 70,
        engagementLevel: 60,
        conversionRate: 8,
        innovationScore: 65
      }
    },
    thresholds: {
      excellent: 90,
      good: 80,
      acceptable: 70,
      needsImprovement: 60,
      poor: 50
    },
    personaFactors: {
      'First-Time Home Buyers': {
        contentPreferences: ['educational', 'supportive', 'detailed'],
        engagementDrivers: ['trust', 'guidance', 'clarity'],
        conversionTriggers: ['support', 'education', 'reassurance'],
        qualityExpectations: 75
      },
      'Growing Families': {
        contentPreferences: ['family-focused', 'lifestyle', 'emotional'],
        engagementDrivers: ['family benefits', 'safety', 'community'],
        conversionTriggers: ['family appeal', 'safety features', 'community'],
        qualityExpectations: 80
      }
    }
  };
  
  return { ...defaultConfig, ...config };
}

/**
 * Placeholder functions for additional email analysis
 */
/**
 * Assess email content quality comprehensively
 */
function assessEmailContentQuality(emailSubject: string, emailBody: string, photoInsights: PhotoInsights): number {
  let score = 50;
  
  // Subject line quality analysis
  const subjectAnalysis = analyzeSubjectLine(emailSubject);
  score += (subjectAnalysis.score * 0.3);
  
  // Content structure and readability
  const wordCount = emailBody.split(/\s+/).length;
  if (wordCount >= 150 && wordCount <= 500) score += 15;
  else if (wordCount >= 100 && wordCount <= 700) score += 10;
  else score -= 10;
  
  // Feature integration from photos
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  const mentionedFeatures = mustMentionFeatures.filter(feature => 
    emailBody.toLowerCase().includes(feature.toLowerCase())
  );
  score += Math.min((mentionedFeatures.length / mustMentionFeatures.length) * 20, 20);
  
  // Professional tone
  const professionalWords = ['pleased', 'excited', 'opportunity', 'exceptional', 'quality'];
  const professionalCount = professionalWords.filter(word => 
    emailBody.toLowerCase().includes(word)
  ).length;
  score += Math.min(professionalCount * 3, 15);
  
  return Math.min(score, 100);
}

/**
 * Analyze subject line effectiveness
 */
function analyzeSubjectLine(subjectLine: string): { score: number; recommendations: string[] } {
  const recommendations: string[] = [];
  let score = 50;

  // Length optimization (30-50 characters is ideal)
  const length = subjectLine.length;
  if (length >= 30 && length <= 50) {
    score += 15;
  } else if (length < 30) {
    recommendations.push('Subject line too short - aim for 30-50 characters');
    score -= 10;
  } else if (length > 50) {
    recommendations.push('Subject line too long - may be truncated on mobile');
    score -= 5;
  }

  // Urgency indicators
  const urgencyWords = /\b(today|now|urgent|limited|expires|deadline|hurry|act fast|don't miss)\b/gi;
  if (urgencyWords.test(subjectLine)) {
    score += 10;
  } else {
    recommendations.push('Add urgency elements to subject line');
  }

  // Personalization
  if (/\{?\w+\}?/.test(subjectLine)) {
    score += 10;
  } else {
    recommendations.push('Personalize subject line with recipient name or location');
  }

  // Question format (increases engagement)
  if (subjectLine.includes('?')) {
    score += 5;
  }

  // Numbers (specific values increase credibility)
  if (/\d/.test(subjectLine)) {
    score += 5;
  }

  // Spam indicators (reduce score)
  const spamWords = /\b(free|guarantee|amazing|incredible|unbelievable|act now|limited time|special offer)\b/gi;
  const spamMatches = (subjectLine.match(spamWords) || []).length;
  if (spamMatches > 0) {
    score -= spamMatches * 5;
    recommendations.push('Reduce spam-trigger words in subject line');
  }

  return { score: Math.max(0, Math.min(100, score)), recommendations };
}

function assessEmailAudienceAlignment(emailSubject: string, emailBody: string, photoInsights: PhotoInsights): number {
  let score = 60;
  
  // Buyer persona language alignment
  const buyerProfile = photoInsights.buyerProfile || '';
  const combinedContent = (emailSubject + ' ' + emailBody).toLowerCase();
  
  if (buyerProfile.toLowerCase().includes('family')) {
    const familyWords = ['family', 'children', 'kids', 'school', 'safe', 'neighborhood'];
    const familyMatches = familyWords.filter(word => combinedContent.includes(word)).length;
    score += Math.min(familyMatches * 5, 25);
  }
  
  if (buyerProfile.toLowerCase().includes('professional')) {
    const professionalWords = ['convenient', 'commute', 'office', 'professional', 'career', 'work'];
    const professionalMatches = professionalWords.filter(word => combinedContent.includes(word)).length;
    score += Math.min(professionalMatches * 5, 25);
  }
  
  if (buyerProfile.toLowerCase().includes('luxury')) {
    const luxuryWords = ['luxury', 'premium', 'elegant', 'sophisticated', 'exclusive', 'elite'];
    const luxuryMatches = luxuryWords.filter(word => combinedContent.includes(word)).length;
    score += Math.min(luxuryMatches * 5, 25);
  }
  
  // Personalization elements
  const personalizationPatterns = /\{\w+\}/g;
  const personalizationCount = (combinedContent.match(personalizationPatterns) || []).length;
  score += Math.min(personalizationCount * 8, 24);
  
  return Math.min(score, 100);
}

function assessEmailEngagementPotential(emailSubject: string, emailBody: string, photoInsights: PhotoInsights): number {
  let score = 40;
  
  // Subject line engagement potential
  const subjectAnalysis = analyzeSubjectLine(emailSubject);
  score += (subjectAnalysis.score * 0.25);
  
  // Emotional language in body
  const emotionalWords = ['imagine', 'perfect', 'dream', 'love', 'amazing', 'stunning', 'beautiful'];
  const emotionalCount = emotionalWords.filter(word => 
    emailBody.toLowerCase().includes(word)
  ).length;
  score += Math.min(emotionalCount * 4, 20);
  
  // Visual imagery and lifestyle scenarios
  const lifestyleWords = ['picture yourself', 'envision', 'experience', 'enjoy', 'relax', 'entertain'];
  const lifestyleCount = lifestyleWords.filter(word => 
    emailBody.toLowerCase().includes(word)
  ).length;
  score += Math.min(lifestyleCount * 6, 18);
  
  // Question engagement
  const questionCount = (emailBody.match(/\?/g) || []).length;
  score += Math.min(questionCount * 3, 12);
  
  // Story elements
  const storyWords = ['story', 'journey', 'discover', 'explore', 'find out'];
  const storyCount = storyWords.filter(word => 
    emailBody.toLowerCase().includes(word)
  ).length;
  score += Math.min(storyCount * 4, 16);
  
  return Math.min(score, 100);
}

function assessEmailConversionLikelihood(emailSubject: string, emailBody: string, photoInsights: PhotoInsights): number {
  let score = 40;
  
  // CTA effectiveness analysis
  const ctaAnalysis = analyzeCTAs(emailBody);
  score += (ctaAnalysis.score * 0.3);
  
  // Urgency and scarcity
  const urgencyWords = ['limited', 'exclusive', 'rare', 'opportunity', 'don\'t miss', 'act now'];
  const urgencyCount = urgencyWords.filter(word => 
    emailBody.toLowerCase().includes(word)
  ).length;
  score += Math.min(urgencyCount * 6, 24);
  
  // Value proposition clarity
  const valueWords = ['value', 'investment', 'benefit', 'advantage', 'save', 'gain'];
  const valueCount = valueWords.filter(word => 
    emailBody.toLowerCase().includes(word)
  ).length;
  score += Math.min(valueCount * 4, 16);
  
  // Social proof elements
  const proofWords = ['clients', 'testimonial', 'review', 'satisfied', 'successful', 'trusted'];
  const proofCount = proofWords.filter(word => 
    emailBody.toLowerCase().includes(word)
  ).length;
  score += Math.min(proofCount * 5, 20);
  
  // Clear next steps
  const actionWords = ['call', 'schedule', 'visit', 'book', 'contact', 'reply'];
  const actionCount = actionWords.filter(word => 
    emailBody.toLowerCase().includes(word)
  ).length;
  score += Math.min(actionCount * 3, 12);
  
  return Math.min(score, 100);
}

/**
 * Analyze call-to-action effectiveness
 */
function analyzeCTAs(content: string): { score: number; recommendations: string[] } {
  const recommendations: string[] = [];
  let score = 30;

  // Find CTAs (buttons, links, action phrases)
  const ctaPatterns = [
    /\b(click here|learn more|view property|schedule|book|call now|contact|reply|respond)\b/gi,
    /\[(.*?)\]\((.*?)\)/g, // Markdown links
    /<a\s+href/gi, // HTML links
    /\bhttps?:\/\/\S+/gi // URLs
  ];

  let ctaCount = 0;
  ctaPatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    ctaCount += matches.length;
  });

  // Scoring based on CTA presence and quantity
  if (ctaCount === 0) {
    recommendations.push('Add clear call-to-action buttons or links');
    score = 10;
  } else if (ctaCount === 1) {
    score = 60;
    recommendations.push('Consider adding secondary CTA for different engagement levels');
  } else if (ctaCount >= 2 && ctaCount <= 3) {
    score = 85;
  } else if (ctaCount > 3) {
    score = 70;
    recommendations.push('Too many CTAs may dilute effectiveness - focus on 2-3 primary actions');
  }

  // Check for action-oriented language
  const actionWords = /\b(schedule|book|view|explore|discover|secure|reserve|claim|get|download)\b/gi;
  if (actionWords.test(content)) {
    score += 10;
  } else {
    recommendations.push('Use stronger action verbs in CTAs');
  }

  // Check for urgency in CTAs
  const urgentCTAs = /\b(today|now|immediately|asap|limited time|expires)\b/gi;
  if (urgentCTAs.test(content)) {
    score += 5;
  }

  return { score: Math.max(0, Math.min(100, score)), recommendations };
}

function assessEmailPlatformOptimization(emailSubject: string, emailBody: string): number {
  let score = 60;
  
  // Subject line length optimization
  const subjectLength = emailSubject.length;
  if (subjectLength >= 30 && subjectLength <= 50) score += 15;
  else if (subjectLength >= 25 && subjectLength <= 60) score += 10;
  else score -= 10;
  
  // Email body length optimization
  const bodyLength = emailBody.length;
  if (bodyLength >= 800 && bodyLength <= 2000) score += 10;
  else if (bodyLength >= 500 && bodyLength <= 3000) score += 5;
  
  // Mobile-friendly formatting
  const paragraphCount = emailBody.split('\n\n').length;
  if (paragraphCount >= 3) score += 10; // Good paragraph breaks
  
  // Link optimization
  const linkCount = (emailBody.match(/https?:\/\/\S+/gi) || []).length;
  if (linkCount >= 1 && linkCount <= 3) score += 10;
  else if (linkCount > 3) score -= 5;
  
  // Preheader text potential
  const firstLine = emailBody.split('\n')[0] || '';
  if (firstLine.length >= 50 && firstLine.length <= 100) score += 5;
  
  return Math.min(score, 100);
}

function identifyEmailStrengths(emailSubject: string, emailBody: string, photoInsights: PhotoInsights): string[] {
  const strengths: string[] = [];
  
  const subjectAnalysis = analyzeSubjectLine(emailSubject);
  if (subjectAnalysis.score >= 80) {
    strengths.push('Compelling subject line with optimal length and urgency');
  }
  
  const ctaAnalysis = analyzeCTAs(emailBody);
  if (ctaAnalysis.score >= 80) {
    strengths.push('Clear and actionable call-to-action strategy');
  }
  
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  const mentionedFeatures = mustMentionFeatures.filter(feature => 
    emailBody.toLowerCase().includes(feature.toLowerCase())
  );
  if (mentionedFeatures.length >= 4) {
    strengths.push('Comprehensive property feature integration');
  }
  
  const wordCount = emailBody.split(/\s+/).length;
  if (wordCount >= 200 && wordCount <= 400) {
    strengths.push('Optimal content length for engagement and conversion');
  }
  
  const personalizedElements = (emailBody.match(/\{\w+\}/g) || []).length;
  if (personalizedElements >= 3) {
    strengths.push('Strong personalization elements throughout content');
  }
  
  const educationalWords = ['market trends', 'investment', 'equity', 'analysis'];
  const hasEducational = educationalWords.some(word => 
    emailBody.toLowerCase().includes(word)
  );
  if (hasEducational) {
    strengths.push('Excellent educational and relationship-building content');
  }
  
  return strengths;
}

function identifyEmailWeaknesses(emailSubject: string, emailBody: string, photoInsights: PhotoInsights): string[] {
  const weaknesses: string[] = [];
  
  const subjectAnalysis = analyzeSubjectLine(emailSubject);
  if (subjectAnalysis.score < 60) {
    weaknesses.push('Subject line lacks urgency or optimal length');
  }
  
  const personalizedElements = (emailBody.match(/\{\w+\}/g) || []).length;
  if (personalizedElements < 2) {
    weaknesses.push('Insufficient personalization elements');
  }
  
  const ctaAnalysis = analyzeCTAs(emailBody);
  if (ctaAnalysis.score < 60) {
    weaknesses.push('Weak or unclear call-to-action');
  }
  
  const wordCount = emailBody.split(/\s+/).length;
  if (wordCount < 100) {
    weaknesses.push('Content too brief to be compelling');
  } else if (wordCount > 600) {
    weaknesses.push('Content may be too lengthy for email format');
  }
  
  const urgencyWords = ['limited', 'exclusive', 'don\'t miss', 'act now'];
  const hasUrgency = urgencyWords.some(word => 
    emailBody.toLowerCase().includes(word)
  );
  if (!hasUrgency) {
    weaknesses.push('Missing urgency or scarcity messaging');
  }
  
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  const mentionedFeatures = mustMentionFeatures.filter(feature => 
    emailBody.toLowerCase().includes(feature.toLowerCase())
  );
  if (mentionedFeatures.length < 2) {
    weaknesses.push('Insufficient property feature highlighting');
  }
  
  const educationalWords = ['market', 'tips', 'guide', 'analysis', 'trends'];
  const hasEducational = educationalWords.some(word => 
    emailBody.toLowerCase().includes(word)
  );
  if (!hasEducational) {
    weaknesses.push('Limited educational or relationship-building content');
  }
  
  return weaknesses;
}

function generateEmailImprovements(emailSubject: string, emailBody: string, photoInsights: PhotoInsights): string[] {
  const improvements: string[] = [];
  
  const subjectAnalysis = analyzeSubjectLine(emailSubject);
  if (subjectAnalysis.score < 75) {
    improvements.push('Optimize subject line with urgency and personalization');
  }
  
  const personalizedElements = (emailBody.match(/\{\w+\}/g) || []).length;
  if (personalizedElements < 3) {
    improvements.push('Add more personalization tokens (name, location, preferences)');
  }
  
  const ctaAnalysis = analyzeCTAs(emailBody);
  if (ctaAnalysis.score < 70) {
    improvements.push('Strengthen call-to-action with action verbs and urgency');
  }
  
  const educationalWords = ['market', 'tips', 'analysis', 'trends'];
  const hasEducational = educationalWords.some(word => 
    emailBody.toLowerCase().includes(word)
  );
  if (!hasEducational) {
    improvements.push('Include market insights and educational content');
  }
  
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  const mentionedFeatures = mustMentionFeatures.filter(feature => 
    emailBody.toLowerCase().includes(feature.toLowerCase())
  );
  if (mentionedFeatures.length < 3) {
    improvements.push('Integrate more key property features into content');
  }
  
  const socialProofWords = ['clients', 'testimonial', 'successful', 'satisfied'];
  const hasSocialProof = socialProofWords.some(word => 
    emailBody.toLowerCase().includes(word)
  );
  if (!hasSocialProof) {
    improvements.push('Add social proof elements (testimonials, success stories)');
  }
  
  const visualWords = ['imagine', 'picture', 'envision', 'see yourself'];
  const hasVisualLanguage = visualWords.some(word => 
    emailBody.toLowerCase().includes(word)
  );
  if (!hasVisualLanguage) {
    improvements.push('Include more visual and lifestyle-focused language');
  }
  
  return improvements;
}

function predictEmailPerformance(score: number, breakdown: ScoreBreakdown, emailSubject: string, emailBody: string): ChannelPerformancePrediction {
  return {
    engagementRate: { low: 20, mid: 25, high: 35, unit: '% open rate' },
    conversionRate: { low: 8, mid: 12, high: 18, unit: '% conversion rate' },
    reachPotential: { low: 85, mid: 95, high: 98, unit: '% delivery rate' },
    viralPotential: { low: 2, mid: 5, high: 8, unit: '% forward rate' },
    confidenceLevel: 'medium',
    keyFactors: ['Subject line appeal', 'Content relevance', 'CTA clarity', 'Personalization']
  };
}

/**
 * Additional placeholder functions for the full validation system
 */
function predictConversionPerformance(
  outputs: Output,
  facts: Facts,
  photoInsights: PhotoInsights,
  channelScores: ChannelScore[]
): ConversionPrediction {
  return {
    overallConversionScore: 75,
    stageConversions: [],
    funnelOptimization: {
      currentEfficiency: 65,
      potentialEfficiency: 85,
      bottlenecks: [],
      recommendedActions: [],
      expectedImprovement: 20
    },
    dropoffPoints: [],
    accelerationOpportunities: []
  };
}

function assessQualityMetrics(outputs: Output, facts: Facts, photoInsights: PhotoInsights): QualityMetrics {
  return {
    readabilityScore: 80,
    emotionalResonance: 75,
    persuasionStrength: 78,
    credibilityFactor: 82,
    uniquenessScore: 70,
    actionClarity: 85,
    brandAlignment: 80,
    contentCoherence: 83
  };
}

function generateOptimizationRecommendations(
  channelScores: ChannelScore[],
  qualityMetrics: QualityMetrics,
  conversionPrediction: ConversionPrediction
): OptimizationRecommendation[] {
  return [
    {
      category: 'content',
      priority: 'high',
      recommendation: 'Enhance feature integration across all channels',
      rationale: 'Consistent feature messaging increases brand recall and conversion',
      expectedImpact: '15-20% improvement in engagement',
      implementationSteps: ['Audit current feature mentions', 'Create feature priority matrix', 'Update content templates'],
      effort: 'medium',
      timeframe: '1-2 weeks'
    }
  ];
}

function projectPerformanceImprovements(
  channelScores: ChannelScore[],
  optimizationRecommendations: OptimizationRecommendation[]
): PerformanceProjection[] {
  return [
    {
      metric: 'Overall Engagement Rate',
      currentProjection: 65,
      optimizedProjection: 80,
      improvementPotential: 15,
      confidenceLevel: 'high',
      timeToRealize: '2-4 weeks'
    }
  ];
}

function createValidationSummary(
  overallScore: number,
  channelScores: ChannelScore[],
  qualityMetrics: QualityMetrics,
  optimizationRecommendations: OptimizationRecommendation[]
): ValidationSummary {
  const grade = overallScore >= 95 ? 'A+' :
                overallScore >= 90 ? 'A' :
                overallScore >= 85 ? 'A-' :
                overallScore >= 80 ? 'B+' :
                overallScore >= 75 ? 'B' :
                overallScore >= 70 ? 'B-' :
                overallScore >= 65 ? 'C+' :
                overallScore >= 60 ? 'C' :
                overallScore >= 55 ? 'C-' :
                overallScore >= 50 ? 'D' : 'F';
  
  return {
    overallGrade: grade,
    keyStrengths: channelScores.flatMap(channel => channel.strengths).slice(0, 5),
    criticalIssues: channelScores.flatMap(channel => channel.weaknesses).slice(0, 3),
    quickWins: optimizationRecommendations.filter(rec => rec.effort === 'low').map(rec => rec.recommendation),
    strategicImprovements: optimizationRecommendations.filter(rec => rec.priority === 'high').map(rec => rec.recommendation),
    competitivePosition: overallScore >= 80 ? 'superior' : 
                        overallScore >= 70 ? 'competitive' : 
                        overallScore >= 60 ? 'adequate' : 'needs_improvement'
  };
}

/**
 * Export validation configuration for external use
 */
export const defaultValidationConfig = mergeWithDefaultConfig();