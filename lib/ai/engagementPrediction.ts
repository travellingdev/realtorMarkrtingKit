/**
 * Engagement prediction scoring for social content
 * Predicts performance metrics across social media platforms
 */

import type { PhotoInsights } from './photoAnalysis';

export interface EngagementPrediction {
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube' | 'LinkedIn';
  overallScore: number;
  metrics: EngagementMetrics;
  viralPotential: ViralPrediction;
  audienceResonance: AudienceResonance;
  contentFactors: ContentFactors;
  algorithmOptimization: AlgorithmOptimization;
  performanceProjection: PerformanceProjection;
  recommendations: EngagementRecommendation[];
}

export interface EngagementMetrics {
  expectedLikes: PredictionRange;
  expectedComments: PredictionRange;
  expectedShares: PredictionRange;
  expectedReach: PredictionRange;
  expectedImpressions: PredictionRange;
  engagementRate: PredictionRange;
  conversionRate: PredictionRange;
}

export interface PredictionRange {
  low: number;
  mid: number;
  high: number;
  unit: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ViralPrediction {
  probability: number;
  factors: ViralFactor[];
  catalysts: string[];
  barriers: string[];
  timeframe: string;
  shareabilityScore: number;
}

export interface ViralFactor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  presence: boolean;
  weight: number;
}

export interface AudienceResonance {
  demographicAlignment: DemographicAlignment;
  emotionalTriggers: EmotionalTrigger[];
  aspirationalValue: AspirationalValue;
  relatabilityScore: number;
  trustFactors: TrustFactor[];
}

export interface DemographicAlignment {
  primaryAudience: string;
  alignmentScore: number;
  ageRelevance: number;
  incomeRelevance: number;
  lifestyleRelevance: number;
  geographicRelevance: number;
}

export interface EmotionalTrigger {
  emotion: 'desire' | 'aspiration' | 'envy' | 'curiosity' | 'excitement' | 'nostalgia';
  strength: number;
  evidence: string[];
  resonanceScore: number;
}

export interface AspirationalValue {
  lifestyleUpgrade: number;
  statusSymbol: number;
  goalAlignment: number;
  dreamFulfillment: number;
  socialSignaling: number;
}

export interface TrustFactor {
  factor: string;
  credibilityScore: number;
  evidenceStrength: number;
  audienceImpact: number;
}

export interface ContentFactors {
  visualAppeal: VisualAppeal;
  narrativeStrength: NarrativeStrength;
  informationValue: InformationValue;
  entertainmentValue: EntertainmentValue;
  uniquenessScore: number;
}

export interface VisualAppeal {
  photoQuality: number;
  compositionScore: number;
  colorHarmony: number;
  lightingQuality: number;
  aestheticValue: number;
}

export interface NarrativeStrength {
  storyArc: number;
  emotionalJourney: number;
  characterization: number;
  conflictResolution: number;
  satisfactionScore: number;
}

export interface InformationValue {
  educationalContent: number;
  marketInsights: number;
  practicalValue: number;
  expertiseDisplay: number;
  actionableAdvice: number;
}

export interface EntertainmentValue {
  surpriseElement: number;
  humorValue: number;
  dramaTension: number;
  curiosityGap: number;
  replayability: number;
}

export interface AlgorithmOptimization {
  platform: string;
  algorithimScore: number;
  optimizationFactors: OptimizationFactor[];
  rankingSignals: RankingSignal[];
  distributionPotential: DistributionPotential;
}

export interface OptimizationFactor {
  factor: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  currentScore: number;
  optimizationPotential: number;
  implementation: string;
}

export interface RankingSignal {
  signal: string;
  weight: number;
  currentStrength: number;
  improvementArea: string;
}

export interface DistributionPotential {
  organicReach: number;
  algorithmBoost: number;
  crossPlatformPotential: number;
  longTermVisibility: number;
}

export interface PerformanceProjection {
  timeframe: string;
  expectedGrowth: GrowthProjection;
  conversionProjection: ConversionProjection;
  brandImpact: BrandImpact;
  competitivePosition: CompetitivePosition;
}

export interface GrowthProjection {
  followerGrowth: PredictionRange;
  engagementGrowth: PredictionRange;
  reachExpansion: PredictionRange;
  influenceIncrease: PredictionRange;
}

export interface ConversionProjection {
  leadGeneration: PredictionRange;
  inquiryIncrease: PredictionRange;
  appointmentBooking: PredictionRange;
  businessImpact: PredictionRange;
}

export interface BrandImpact {
  awarenessIncrease: number;
  reputationEnhancement: number;
  expertisePerception: number;
  trustBuilding: number;
  marketPositioning: number;
}

export interface CompetitivePosition {
  marketShare: number;
  differentiationScore: number;
  innovationIndex: number;
  thoughtLeadership: number;
}

export interface EngagementRecommendation {
  category: 'content' | 'timing' | 'hashtags' | 'engagement' | 'algorithm';
  priority: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
  expectedImpact: string;
  implementation: string[];
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
}

/**
 * Predict engagement performance for social content
 */
export function predictEngagementPerformance(
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube' | 'LinkedIn',
  content: string[],
  photoInsights: PhotoInsights,
  followerCount: number = 1000
): EngagementPrediction {
  // Calculate base engagement metrics
  const metrics = calculateEngagementMetrics(platform, content, photoInsights, followerCount);
  
  // Assess viral potential
  const viralPotential = assessViralPotential(platform, content, photoInsights);
  
  // Analyze audience resonance
  const audienceResonance = analyzeAudienceResonance(content, photoInsights);
  
  // Evaluate content factors
  const contentFactors = evaluateContentFactors(content, photoInsights);
  
  // Calculate algorithm optimization
  const algorithmOptimization = calculateAlgorithmOptimization(platform, content, photoInsights);
  
  // Project performance
  const performanceProjection = projectPerformance(metrics, viralPotential, followerCount);
  
  // Generate recommendations
  const recommendations = generateEngagementRecommendations(
    platform, metrics, viralPotential, contentFactors, algorithmOptimization
  );
  
  // Calculate overall score
  const overallScore = calculateOverallEngagementScore(
    metrics, viralPotential, audienceResonance, contentFactors, algorithmOptimization
  );
  
  return {
    platform,
    overallScore,
    metrics,
    viralPotential,
    audienceResonance,
    contentFactors,
    algorithmOptimization,
    performanceProjection,
    recommendations
  };
}

/**
 * Calculate engagement metrics based on content analysis
 */
function calculateEngagementMetrics(
  platform: string,
  content: string[],
  photoInsights: PhotoInsights,
  followerCount: number
): EngagementMetrics {
  const baseEngagementRate = getBaseEngagementRate(platform);
  const contentQualityMultiplier = calculateContentQualityMultiplier(content, photoInsights);
  const viralMultiplier = calculateViralMultiplier(content, photoInsights);
  
  const adjustedEngagementRate = baseEngagementRate * contentQualityMultiplier * viralMultiplier;
  
  return {
    expectedLikes: {
      low: Math.round(followerCount * adjustedEngagementRate * 0.6),
      mid: Math.round(followerCount * adjustedEngagementRate * 0.8),
      high: Math.round(followerCount * adjustedEngagementRate * 1.2),
      unit: 'likes',
      confidence: contentQualityMultiplier > 1.2 ? 'high' : 'medium'
    },
    expectedComments: {
      low: Math.round(followerCount * adjustedEngagementRate * 0.08),
      mid: Math.round(followerCount * adjustedEngagementRate * 0.12),
      high: Math.round(followerCount * adjustedEngagementRate * 0.18),
      unit: 'comments',
      confidence: 'medium'
    },
    expectedShares: {
      low: Math.round(followerCount * adjustedEngagementRate * 0.02),
      mid: Math.round(followerCount * adjustedEngagementRate * 0.04),
      high: Math.round(followerCount * adjustedEngagementRate * 0.08),
      unit: 'shares',
      confidence: viralMultiplier > 1.3 ? 'high' : 'low'
    },
    expectedReach: {
      low: Math.round(followerCount * 1.2),
      mid: Math.round(followerCount * 1.8),
      high: Math.round(followerCount * 2.5),
      unit: 'accounts reached',
      confidence: 'medium'
    },
    expectedImpressions: {
      low: Math.round(followerCount * 2.0),
      mid: Math.round(followerCount * 3.2),
      high: Math.round(followerCount * 4.8),
      unit: 'impressions',
      confidence: 'high'
    },
    engagementRate: {
      low: Math.round(adjustedEngagementRate * 80) / 100,
      mid: Math.round(adjustedEngagementRate * 100) / 100,
      high: Math.round(adjustedEngagementRate * 120) / 100,
      unit: '%',
      confidence: 'high'
    },
    conversionRate: {
      low: Math.round(adjustedEngagementRate * 10) / 100,
      mid: Math.round(adjustedEngagementRate * 15) / 100,
      high: Math.round(adjustedEngagementRate * 25) / 100,
      unit: '% to inquiries',
      confidence: 'medium'
    }
  };
}

/**
 * Get baseline engagement rate by platform
 */
function getBaseEngagementRate(platform: string): number {
  const rates = {
    'Instagram': 0.05,
    'Facebook': 0.025,
    'TikTok': 0.08,
    'YouTube': 0.04,
    'LinkedIn': 0.03
  };
  return rates[platform] || 0.03;
}

/**
 * Calculate content quality multiplier
 */
function calculateContentQualityMultiplier(content: string[], photoInsights: PhotoInsights): number {
  let multiplier = 1.0;
  
  // High-quality features boost
  const premiumFeatures = photoInsights.features.filter(feature => 
    ['luxury', 'premium', 'custom', 'high-end', 'designer'].some(keyword => 
      feature.toLowerCase().includes(keyword)
    )
  );
  multiplier += premiumFeatures.length * 0.1;
  
  // Emotional language boost
  const allContent = content.join(' ').toLowerCase();
  const emotionalWords = ['stunning', 'breathtaking', 'amazing', 'perfect', 'dream'];
  const emotionalCount = emotionalWords.filter(word => allContent.includes(word)).length;
  multiplier += emotionalCount * 0.05;
  
  // Visual appeal boost from photo insights
  if (photoInsights.headlineFeature) multiplier += 0.15;
  if (photoInsights.lighting === 'excellent') multiplier += 0.1;
  
  return Math.min(multiplier, 2.0); // Cap at 2x
}

/**
 * Calculate viral potential multiplier
 */
function calculateViralMultiplier(content: string[], photoInsights: PhotoInsights): number {
  let multiplier = 1.0;
  
  // Viral hooks
  const firstContent = content[0]?.toLowerCase() || '';
  const viralHooks = ['pov:', 'tell me', 'this house', 'rating this', 'when you'];
  if (viralHooks.some(hook => firstContent.includes(hook))) {
    multiplier += 0.4;
  }
  
  // Unique selling proposition (using headline feature as proxy)
  if (photoInsights.headlineFeature && photoInsights.sellingPoints.length > 3) multiplier += 0.2;
  
  // Lifestyle aspirational content
  const lifestyleWords = ['lifestyle', 'goals', 'vibes', 'aesthetic', 'dream'];
  const allContent = content.join(' ').toLowerCase();
  const lifestyleCount = lifestyleWords.filter(word => allContent.includes(word)).length;
  multiplier += lifestyleCount * 0.1;
  
  return Math.min(multiplier, 2.5); // Cap at 2.5x
}

/**
 * Assess viral potential of content
 */
function assessViralPotential(
  platform: string,
  content: string[],
  photoInsights: PhotoInsights
): ViralPrediction {
  const factors: ViralFactor[] = [
    {
      factor: 'Strong hook in opening',
      impact: 'high',
      presence: hasViralHook(content[0] || ''),
      weight: 0.25
    },
    {
      factor: 'Visual wow factor',
      impact: 'high',
      presence: photoInsights.headlineFeature !== undefined,
      weight: 0.20
    },
    {
      factor: 'Aspirational lifestyle content',
      impact: 'medium',
      presence: hasAspirationalContent(content),
      weight: 0.15
    },
    {
      factor: 'Unique property features',
      impact: 'medium',
      presence: photoInsights.features.length >= 5,
      weight: 0.15
    },
    {
      factor: 'Engagement bait elements',
      impact: 'medium',
      presence: hasEngagementBait(content),
      weight: 0.15
    },
    {
      factor: 'Shareability triggers',
      impact: 'low',
      presence: hasShareabilityTriggers(content),
      weight: 0.10
    }
  ];
  
  const shareabilityScore = factors.reduce((score, factor) => {
    return score + (factor.presence ? factor.weight * 100 : 0);
  }, 0);
  
  const probability = Math.min(shareabilityScore * 0.8, 85);
  
  return {
    probability,
    factors,
    catalysts: identifyViralCatalysts(content, photoInsights),
    barriers: identifyViralBarriers(content, photoInsights),
    timeframe: probability > 60 ? '24-72 hours' : '1-2 weeks',
    shareabilityScore
  };
}

/**
 * Check for viral hook patterns
 */
function hasViralHook(firstContent: string): boolean {
  const viralHooks = ['pov:', 'tell me', 'this house', 'rating this', 'when you', 'imagine if'];
  return viralHooks.some(hook => firstContent.toLowerCase().includes(hook));
}

/**
 * Check for aspirational content elements
 */
function hasAspirationalContent(content: string[]): boolean {
  const aspirationalWords = ['dream', 'goals', 'luxury', 'perfect', 'ideal', 'lifestyle'];
  const allContent = content.join(' ').toLowerCase();
  return aspirationalWords.some(word => allContent.includes(word));
}

/**
 * Check for engagement bait elements
 */
function hasEngagementBait(content: string[]): boolean {
  const engagementWords = ['comment', 'dm', 'tag', 'share', 'save', 'thoughts'];
  const allContent = content.join(' ').toLowerCase();
  return engagementWords.some(word => allContent.includes(word));
}

/**
 * Check for shareability triggers
 */
function hasShareabilityTriggers(content: string[]): boolean {
  const shareabilityWords = ['can you believe', 'wait until you see', 'mind blown', 'incredible'];
  const allContent = content.join(' ').toLowerCase();
  return shareabilityWords.some(phrase => allContent.includes(phrase));
}

/**
 * Additional helper functions for comprehensive engagement prediction
 */
function analyzeAudienceResonance(content: string[], photoInsights: PhotoInsights): AudienceResonance {
  return {
    demographicAlignment: {
      primaryAudience: photoInsights.buyerProfile || 'General homebuyers',
      alignmentScore: 75,
      ageRelevance: 80,
      incomeRelevance: 85,
      lifestyleRelevance: 78,
      geographicRelevance: 82
    },
    emotionalTriggers: [
      {
        emotion: 'desire',
        strength: 85,
        evidence: ['luxury features', 'lifestyle imagery'],
        resonanceScore: 82
      },
      {
        emotion: 'aspiration',
        strength: 78,
        evidence: ['dream home language', 'upgrade potential'],
        resonanceScore: 75
      }
    ],
    aspirationalValue: {
      lifestyleUpgrade: 85,
      statusSymbol: 70,
      goalAlignment: 80,
      dreamFulfillment: 88,
      socialSignaling: 75
    },
    relatabilityScore: 72,
    trustFactors: [
      {
        factor: 'Professional presentation',
        credibilityScore: 85,
        evidenceStrength: 80,
        audienceImpact: 75
      }
    ]
  };
}

function evaluateContentFactors(content: string[], photoInsights: PhotoInsights): ContentFactors {
  return {
    visualAppeal: {
      photoQuality: 85,
      compositionScore: 80,
      colorHarmony: 78,
      lightingQuality: 82,
      aestheticValue: 85
    },
    narrativeStrength: {
      storyArc: 75,
      emotionalJourney: 80,
      characterization: 70,
      conflictResolution: 65,
      satisfactionScore: 78
    },
    informationValue: {
      educationalContent: 70,
      marketInsights: 65,
      practicalValue: 75,
      expertiseDisplay: 80,
      actionableAdvice: 72
    },
    entertainmentValue: {
      surpriseElement: 68,
      humorValue: 45,
      dramaTension: 70,
      curiosityGap: 75,
      replayability: 65
    },
    uniquenessScore: 78
  };
}

function calculateAlgorithmOptimization(
  platform: string,
  content: string[],
  photoInsights: PhotoInsights
): AlgorithmOptimization {
  return {
    platform,
    algorithimScore: 75,
    optimizationFactors: [
      {
        factor: 'Engagement velocity',
        importance: 'critical',
        currentScore: 70,
        optimizationPotential: 85,
        implementation: 'Post at optimal times and encourage early engagement'
      }
    ],
    rankingSignals: [
      {
        signal: 'Time spent viewing',
        weight: 0.3,
        currentStrength: 75,
        improvementArea: 'Add more compelling visual elements'
      }
    ],
    distributionPotential: {
      organicReach: 78,
      algorithmBoost: 72,
      crossPlatformPotential: 80,
      longTermVisibility: 70
    }
  };
}

function projectPerformance(
  metrics: EngagementMetrics,
  viralPotential: ViralPrediction,
  followerCount: number
): PerformanceProjection {
  return {
    timeframe: '30 days',
    expectedGrowth: {
      followerGrowth: {
        low: Math.round(followerCount * 0.02),
        mid: Math.round(followerCount * 0.05),
        high: Math.round(followerCount * 0.12),
        unit: 'new followers',
        confidence: 'medium'
      },
      engagementGrowth: {
        low: 15,
        mid: 25,
        high: 45,
        unit: '% increase',
        confidence: 'high'
      },
      reachExpansion: {
        low: 20,
        mid: 35,
        high: 60,
        unit: '% increase',
        confidence: 'medium'
      },
      influenceIncrease: {
        low: 10,
        mid: 18,
        high: 30,
        unit: '% increase',
        confidence: 'low'
      }
    },
    conversionProjection: {
      leadGeneration: {
        low: Math.round(metrics.expectedReach.mid * 0.01),
        mid: Math.round(metrics.expectedReach.mid * 0.02),
        high: Math.round(metrics.expectedReach.mid * 0.04),
        unit: 'qualified leads',
        confidence: 'medium'
      },
      inquiryIncrease: {
        low: 25,
        mid: 40,
        high: 70,
        unit: '% increase',
        confidence: 'high'
      },
      appointmentBooking: {
        low: 15,
        mid: 28,
        high: 45,
        unit: '% increase',
        confidence: 'medium'
      },
      businessImpact: {
        low: 10,
        mid: 20,
        high: 35,
        unit: '% revenue increase',
        confidence: 'low'
      }
    },
    brandImpact: {
      awarenessIncrease: 82,
      reputationEnhancement: 75,
      expertisePerception: 85,
      trustBuilding: 78,
      marketPositioning: 80
    },
    competitivePosition: {
      marketShare: 72,
      differentiationScore: 85,
      innovationIndex: 78,
      thoughtLeadership: 80
    }
  };
}

function generateEngagementRecommendations(
  platform: string,
  metrics: EngagementMetrics,
  viralPotential: ViralPrediction,
  contentFactors: ContentFactors,
  algorithmOptimization: AlgorithmOptimization
): EngagementRecommendation[] {
  return [
    {
      category: 'content',
      priority: 'high',
      recommendation: 'Lead with stronger viral hook in opening slide/frame',
      expectedImpact: '25-40% increase in initial engagement',
      implementation: ['Use "POV:" or "Tell me" format', 'Create curiosity gap', 'Add emotional trigger'],
      effort: 'low',
      timeframe: 'Immediate'
    },
    {
      category: 'timing',
      priority: 'high',
      recommendation: 'Post during peak audience activity hours',
      expectedImpact: '15-25% increase in early engagement velocity',
      implementation: ['Analyze audience insights', 'Schedule for 7-9 PM weekdays', 'Test different times'],
      effort: 'low',
      timeframe: '1 week'
    },
    {
      category: 'engagement',
      priority: 'medium',
      recommendation: 'Add interactive elements to boost algorithm signals',
      expectedImpact: '20-30% increase in time spent and comments',
      implementation: ['Add polls or questions', 'Use "swipe for more" prompts', 'Encourage saves and shares'],
      effort: 'medium',
      timeframe: '2 weeks'
    }
  ];
}

function calculateOverallEngagementScore(
  metrics: EngagementMetrics,
  viralPotential: ViralPrediction,
  audienceResonance: AudienceResonance,
  contentFactors: ContentFactors,
  algorithmOptimization: AlgorithmOptimization
): number {
  const metricsScore = (metrics.engagementRate.mid * 100) * 0.3;
  const viralScore = viralPotential.probability * 0.25;
  const audienceScore = audienceResonance.relatabilityScore * 0.2;
  const contentScore = contentFactors.uniquenessScore * 0.15;
  const algorithmScore = algorithmOptimization.algorithimScore * 0.1;
  
  return Math.round(metricsScore + viralScore + audienceScore + contentScore + algorithmScore);
}

function identifyViralCatalysts(content: string[], photoInsights: PhotoInsights): string[] {
  const catalysts: string[] = [];
  
  if (hasViralHook(content[0] || '')) {
    catalysts.push('Strong opening hook drives initial engagement');
  }
  
  if (photoInsights.headlineFeature) {
    catalysts.push('Unique property feature creates shareability');
  }
  
  if (hasAspirationalContent(content)) {
    catalysts.push('Lifestyle aspiration triggers emotional sharing');
  }
  
  return catalysts;
}

function identifyViralBarriers(content: string[], photoInsights: PhotoInsights): string[] {
  const barriers: string[] = [];
  
  if (!hasEngagementBait(content)) {
    barriers.push('Missing engagement prompts reduce interaction');
  }
  
  if (content.length > 8) {
    barriers.push('Too many slides may reduce completion rate');
  }
  
  if (!hasShareabilityTriggers(content)) {
    barriers.push('Limited shareability elements restrict viral potential');
  }
  
  return barriers;
}