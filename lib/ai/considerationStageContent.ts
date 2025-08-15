/**
 * Consideration stage content generation system
 * Focuses on property comparisons, value propositions, and lifestyle showcases
 */

import type { PhotoInsights } from './photoAnalysis';
import type { Facts } from './schemas';
import type { BuyerJourneyContent } from './buyerJourneyMapping';

export interface ConsiderationContent {
  propertyComparisons: PropertyComparison[];
  valuePropositions: ValueProposition[];
  lifestyleShowcases: LifestyleShowcase[];
  competitiveAnalysis: CompetitiveAnalysis;
  investmentAnalysis: InvestmentAnalysis;
  decisionFrameworks: DecisionFramework[];
  objectionHandling: ObjectionHandler[];
  conversionOptimization: ConsiderationConversionOptimization;
}

export interface PropertyComparison {
  comparisonTitle: string;
  subjectProperty: PropertyProfile;
  comparableProperties: ComparableProperty[];
  differentiators: Differentiator[];
  valueMatrix: ValueMatrix;
  recommendationSummary: string;
  nextSteps: string[];
}

export interface PropertyProfile {
  address: string;
  keyFeatures: string[];
  uniqueSellingPoints: string[];
  pricePosition: string;
  marketPosition: 'premium' | 'competitive' | 'value';
  strengthAreas: string[];
  considerations: string[];
}

export interface ComparableProperty {
  address: string;
  similarities: string[];
  differences: string[];
  priceComparison: string;
  featureComparison: FeatureComparison[];
  marketDays: string;
  conclusion: string;
}

export interface FeatureComparison {
  feature: string;
  subjectProperty: string;
  comparable: string;
  advantage: 'subject' | 'comparable' | 'neutral';
  importance: 'high' | 'medium' | 'low';
}

export interface Differentiator {
  category: string;
  advantage: string;
  impact: string;
  buyerBenefit: string;
  competitiveStrength: 'strong' | 'moderate' | 'weak';
}

export interface ValueMatrix {
  categories: ValueCategory[];
  overallScore: number;
  topStrengths: string[];
  considerations: string[];
}

export interface ValueCategory {
  category: string;
  weight: number;
  score: number;
  reasoning: string;
  comparison: string;
}

export interface ValueProposition {
  propositionTitle: string;
  targetBuyer: string;
  coreValue: string;
  supportingEvidence: Evidence[];
  emotionalDrivers: EmotionalDriver[];
  rationalJustification: RationalJustification;
  competitiveAdvantage: string;
  callToAction: string;
}

export interface Evidence {
  type: 'feature' | 'location' | 'market' | 'financial' | 'lifestyle';
  evidence: string;
  validation: string;
  buyerImpact: string;
}

export interface EmotionalDriver {
  emotion: string;
  trigger: string;
  scenario: string;
  outcome: string;
}

export interface RationalJustification {
  financialCase: string[];
  marketCase: string[];
  practicalCase: string[];
  opportunityCase: string[];
}

export interface LifestyleShowcase {
  lifestyleTheme: string;
  targetPersona: string;
  dailyLifeScenarios: DailyLifeScenario[];
  entertainingScenarios: EntertainingScenario[];
  personalMoments: PersonalMoment[];
  seasonalExperiences: SeasonalExperience[];
  aspirationalElements: AspirationalElement[];
}

export interface DailyLifeScenario {
  timeOfDay: string;
  activity: string;
  location: string;
  experience: string;
  emotionalBenefit: string;
}

export interface EntertainingScenario {
  occasion: string;
  setting: string;
  experience: string;
  guestExperience: string;
  hostBenefit: string;
}

export interface PersonalMoment {
  moment: string;
  setting: string;
  experience: string;
  emotionalReward: string;
}

export interface SeasonalExperience {
  season: string;
  activity: string;
  setting: string;
  experience: string;
  uniqueAspect: string;
}

export interface AspirationalElement {
  aspiration: string;
  enabler: string;
  visualization: string;
  achievement: string;
}

export interface CompetitiveAnalysis {
  marketPosition: MarketPosition;
  competitorComparison: CompetitorComparison[];
  uniqueAdvantages: UniqueAdvantage[];
  marketOpportunity: MarketOpportunity;
  positioningStrategy: PositioningStrategy;
}

export interface MarketPosition {
  segment: string;
  pricePosition: string;
  featurePosition: string;
  qualityPosition: string;
  valuePosition: string;
}

export interface CompetitorComparison {
  competitor: string;
  priceRange: string;
  keyFeatures: string[];
  advantages: string[];
  disadvantages: string[];
  recommendation: string;
}

export interface UniqueAdvantage {
  advantage: string;
  description: string;
  proof: string;
  buyerValue: string;
  difficulty_to_replicate: 'high' | 'medium' | 'low';
}

export interface MarketOpportunity {
  opportunity: string;
  timeframe: string;
  drivers: string[];
  riskFactors: string[];
  actionability: string;
}

export interface PositioningStrategy {
  primaryPosition: string;
  secondaryPositions: string[];
  messaging: string[];
  differentiationFocus: string[];
}

export interface InvestmentAnalysis {
  financialProjection: FinancialProjection;
  marketTrends: MarketTrend[];
  riskAssessment: RiskAssessment;
  opportunityAnalysis: OpportunityAnalysis;
  recommendationSummary: InvestmentRecommendation;
}

export interface FinancialProjection {
  currentValue: string;
  projectedValue: ProjectedValue[];
  appreciationFactors: string[];
  riskFactors: string[];
  confidenceLevel: 'high' | 'medium' | 'low';
}

export interface ProjectedValue {
  timeframe: string;
  lowEstimate: string;
  midEstimate: string;
  highEstimate: string;
  assumptions: string[];
}

export interface MarketTrend {
  trend: string;
  impact: 'positive' | 'negative' | 'neutral';
  timeframe: string;
  confidence: 'high' | 'medium' | 'low';
  propertyImpact: string;
}

export interface RiskAssessment {
  riskLevel: 'low' | 'moderate' | 'high';
  primaryRisks: Risk[];
  mitigationStrategies: string[];
  monitoringIndicators: string[];
}

export interface Risk {
  risk: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface OpportunityAnalysis {
  opportunities: Opportunity[];
  timingSensitivity: string;
  actionSteps: string[];
  successIndicators: string[];
}

export interface Opportunity {
  opportunity: string;
  potential: string;
  timeframe: string;
  requirements: string[];
}

export interface InvestmentRecommendation {
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'consider' | 'pass';
  reasoning: string[];
  timeline: string;
  conditions: string[];
  alternatives: string[];
}

export interface DecisionFramework {
  frameworkName: string;
  applicableSituation: string;
  criteria: DecisionCriteria[];
  weightingMethod: string;
  scoringGuidance: ScoringGuidance[];
  interpretationGuide: string;
}

export interface DecisionCriteria {
  criterion: string;
  description: string;
  weight: number;
  scoringMethod: string;
  considerationFactors: string[];
}

export interface ScoringGuidance {
  score: number;
  description: string;
  indicators: string[];
  examples: string[];
}

export interface ObjectionHandler {
  objection: string;
  category: 'price' | 'location' | 'condition' | 'timing' | 'competition' | 'features';
  frequency: 'common' | 'occasional' | 'rare';
  response: ObjectionResponse;
  reframing: string;
  evidence: string[];
  nextSteps: string[];
}

export interface ObjectionResponse {
  acknowledgment: string;
  clarification: string;
  response: string;
  validation: string;
  redirect: string;
}

export interface ConsiderationConversionOptimization {
  urgencyCreation: UrgencyCreation;
  trustBuilding: TrustBuilding;
  valueReinforcement: ValueReinforcement;
  nextStepGuidance: NextStepGuidance;
  engagementMaintenance: EngagementMaintenance;
}

export interface UrgencyCreation {
  marketFactors: string[];
  competitionFactors: string[];
  opportunityFactors: string[];
  timingFactors: string[];
  messagingStrategy: string[];
}

export interface TrustBuilding {
  credibilityIndicators: string[];
  socialProofElements: string[];
  expertiseDemo: string[];
  transparencyFactors: string[];
  relationshipBuilders: string[];
}

export interface ValueReinforcement {
  valueRestatement: string[];
  benefitAmplification: string[];
  costJustification: string[];
  opportunityCost: string[];
  futureProofing: string[];
}

export interface NextStepGuidance {
  immediateActions: string[];
  preparationSteps: string[];
  decisionTimeline: string;
  supportOffered: string[];
  milestones: string[];
}

export interface EngagementMaintenance {
  touchpointStrategy: string[];
  contentSequence: string[];
  personalizedFollowup: string[];
  valueContinuation: string[];
  relationshipDeepening: string[];
}

/**
 * Generate consideration stage content from property and buyer journey data
 */
export function generateConsiderationContent(
  facts: Facts,
  photoInsights: PhotoInsights,
  buyerJourney: BuyerJourneyContent
): ConsiderationContent {
  const persona = buyerJourney.personaAlignment.primaryPersona;
  
  // Generate property comparisons
  const propertyComparisons = generatePropertyComparisons(facts, photoInsights, persona);
  
  // Create value propositions
  const valuePropositions = generateValuePropositions(facts, photoInsights, persona);
  
  // Build lifestyle showcases
  const lifestyleShowcases = generateLifestyleShowcases(facts, photoInsights, persona);
  
  // Develop competitive analysis
  const competitiveAnalysis = generateCompetitiveAnalysis(facts, photoInsights);
  
  // Create investment analysis
  const investmentAnalysis = generateInvestmentAnalysis(facts, photoInsights, persona);
  
  // Build decision frameworks
  const decisionFrameworks = generateDecisionFrameworks(persona);
  
  // Create objection handling
  const objectionHandling = generateObjectionHandling(facts, photoInsights, persona);
  
  // Optimize for conversion
  const conversionOptimization = generateConversionOptimization(facts, photoInsights, persona);
  
  return {
    propertyComparisons,
    valuePropositions,
    lifestyleShowcases,
    competitiveAnalysis,
    investmentAnalysis,
    decisionFrameworks,
    objectionHandling,
    conversionOptimization
  };
}

/**
 * Generate property comparisons with competitive analysis
 */
function generatePropertyComparisons(
  facts: Facts,
  photoInsights: PhotoInsights,
  persona: string
): PropertyComparison[] {
  const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  
  return [
    {
      comparisonTitle: `${facts.propertyType || 'Property'} Comparison Analysis - Why This Home Stands Out`,
      subjectProperty: {
        address: facts.address || 'Subject Property',
        keyFeatures: mustMentionFeatures,
        uniqueSellingPoints: [
          headlineFeature,
          ...photoInsights.features.slice(1, 3)
        ],
        pricePosition: 'Competitive for quality and features offered',
        marketPosition: photoInsights.propertyCategory === 'luxury' ? 'premium' : 'competitive',
        strengthAreas: [
          photoInsights.marketingPriority === 'features' ? 'Exceptional features and amenities' : 'Prime location and convenience',
          'Move-in ready condition',
          'Strong investment potential'
        ],
        considerations: [
          'Market timing and competition',
          'Financing and closing timeline'
        ]
      },
      comparableProperties: generateComparableProperties(facts, photoInsights),
      differentiators: generateDifferentiators(photoInsights),
      valueMatrix: generateValueMatrix(facts, photoInsights),
      recommendationSummary: `This ${facts.propertyType || 'property'} offers exceptional value with its ${headlineFeature} and ${photoInsights.features[1] || 'quality features'}. Compared to similar properties in the market, it provides ${photoInsights.propertyCategory === 'luxury' ? 'luxury amenities at competitive pricing' : 'superior features and condition at market value'}.`,
      nextSteps: [
        'Schedule comprehensive property viewing',
        'Review detailed financial analysis',
        'Discuss financing options and timeline',
        'Prepare competitive offer strategy'
      ]
    }
  ];
}

/**
 * Generate comparable properties for analysis
 */
function generateComparableProperties(facts: Facts, photoInsights: PhotoInsights): ComparableProperty[] {
  return [
    {
      address: `Comparable Property A - ${facts.neighborhood || 'Same Area'}`,
      similarities: [
        `Similar ${facts.beds} bedroom layout`,
        'Comparable square footage',
        'Same neighborhood location'
      ],
      differences: [
        `Missing ${photoInsights.headlineFeature || 'key feature'}`,
        'Older construction/updates',
        'Smaller outdoor space'
      ],
      priceComparison: 'Priced 5-8% higher despite fewer premium features',
      featureComparison: [
        {
          feature: photoInsights.headlineFeature || 'Key Feature',
          subjectProperty: 'Premium quality',
          comparable: 'Standard or missing',
          advantage: 'subject',
          importance: 'high'
        },
        {
          feature: 'Overall Condition',
          subjectProperty: 'Move-in ready',
          comparable: 'Needs updates',
          advantage: 'subject',
          importance: 'high'
        }
      ],
      marketDays: 'On market 45+ days',
      conclusion: 'Subject property offers superior value and features'
    },
    {
      address: `Comparable Property B - ${facts.neighborhood || 'Similar Area'}`,
      similarities: [
        'Similar price range',
        'Comparable property type',
        'Recent market activity'
      ],
      differences: [
        'Different neighborhood amenities',
        `Lacks ${photoInsights.features[1] || 'important feature'}`,
        'Higher maintenance requirements'
      ],
      priceComparison: 'Similar pricing with less value',
      featureComparison: [
        {
          feature: 'Location Convenience',
          subjectProperty: 'Prime location access',
          comparable: 'Less convenient access',
          advantage: 'subject',
          importance: 'medium'
        }
      ],
      marketDays: 'Recently reduced price',
      conclusion: 'Subject property better positioned for long-term value'
    }
  ];
}

/**
 * Generate differentiators that set property apart
 */
function generateDifferentiators(photoInsights: PhotoInsights): Differentiator[] {
  return [
    {
      category: 'Features & Amenities',
      advantage: photoInsights.headlineFeature || 'Premium features',
      impact: 'Immediate lifestyle enhancement and long-term value',
      buyerBenefit: 'Enhanced daily living experience and property appreciation',
      competitiveStrength: 'strong'
    },
    {
      category: 'Condition & Quality',
      advantage: 'Move-in ready with premium finishes',
      impact: 'No immediate investment needed, immediate enjoyment',
      buyerBenefit: 'Reduced stress, immediate move-in, cost savings',
      competitiveStrength: 'strong'
    },
    {
      category: 'Market Position',
      advantage: 'Optimal pricing for features and location',
      impact: 'Better value proposition than comparable properties',
      buyerBenefit: 'Stronger investment potential and buying power',
      competitiveStrength: 'moderate'
    }
  ];
}

/**
 * Generate value matrix for property assessment
 */
function generateValueMatrix(facts: Facts, photoInsights: PhotoInsights): ValueMatrix {
  return {
    categories: [
      {
        category: 'Features & Amenities',
        weight: 30,
        score: 9,
        reasoning: `Exceptional ${photoInsights.headlineFeature || 'features'} and quality amenities`,
        comparison: 'Superior to 85% of comparable properties'
      },
      {
        category: 'Location & Access',
        weight: 25,
        score: 8,
        reasoning: `Prime ${facts.neighborhood || 'location'} with convenient access`,
        comparison: 'Better than average for the area'
      },
      {
        category: 'Condition & Updates',
        weight: 20,
        score: 9,
        reasoning: 'Move-in ready with recent updates and maintenance',
        comparison: 'Excellent condition relative to market'
      },
      {
        category: 'Investment Potential',
        weight: 15,
        score: 8,
        reasoning: 'Strong fundamentals and appreciation indicators',
        comparison: 'Above-average investment characteristics'
      },
      {
        category: 'Market Pricing',
        weight: 10,
        score: 8,
        reasoning: 'Competitive pricing for quality and features',
        comparison: 'Fair to favorable pricing position'
      }
    ],
    overallScore: 85,
    topStrengths: [
      `Exceptional ${photoInsights.headlineFeature || 'features'}`,
      'Move-in ready condition',
      'Strong location fundamentals'
    ],
    considerations: [
      'Market timing for optimal purchase',
      'Financing structure optimization'
    ]
  };
}

/**
 * Generate value propositions for different buyer motivations
 */
function generateValuePropositions(
  facts: Facts,
  photoInsights: PhotoInsights,
  persona: string
): ValueProposition[] {
  const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
  
  return [
    {
      propositionTitle: getValuePropositionTitle(persona, headlineFeature),
      targetBuyer: persona,
      coreValue: getCoreValue(persona, photoInsights),
      supportingEvidence: [
        {
          type: 'feature',
          evidence: headlineFeature,
          validation: 'Premium quality construction and design',
          buyerImpact: 'Enhanced daily living experience and property pride'
        },
        {
          type: 'location',
          evidence: `Prime ${facts.neighborhood || 'location'} positioning`,
          validation: 'Established neighborhood with strong fundamentals',
          buyerImpact: 'Convenience, lifestyle, and long-term value stability'
        },
        {
          type: 'market',
          evidence: 'Strong competitive position in current market',
          validation: 'Analysis of comparable properties and market trends',
          buyerImpact: 'Optimal buying opportunity and investment timing'
        }
      ],
      emotionalDrivers: generateEmotionalDrivers(persona, photoInsights),
      rationalJustification: {
        financialCase: [
          'Competitive pricing for features and location',
          'Strong appreciation potential based on market fundamentals',
          'Move-in ready condition reduces immediate investment needs'
        ],
        marketCase: [
          'Prime market timing with favorable conditions',
          'Limited comparable inventory with similar features',
          'Stable neighborhood with consistent demand'
        ],
        practicalCase: [
          'No immediate repairs or updates required',
          'Quality construction and premium materials',
          'Energy efficient features reduce ongoing costs'
        ],
        opportunityCase: [
          'Rare combination of features and location',
          'Current market conditions favor buyers',
          'Property positioned for long-term appreciation'
        ]
      },
      competitiveAdvantage: `This property uniquely combines ${headlineFeature} with ${photoInsights.features[1] || 'quality features'} in an optimal location - a combination rarely available in the current market.`,
      callToAction: `Experience the difference in person - schedule your private showing to see why this property offers exceptional value for ${persona.toLowerCase()}.`
    }
  ];
}

/**
 * Get value proposition title based on persona
 */
function getValuePropositionTitle(persona: string, headlineFeature: string): string {
  const titles = {
    'First-Time Home Buyers': `Your Perfect First Home: ${headlineFeature} and Move-In Ready Convenience`,
    'Growing Families': `Family Life Enhanced: ${headlineFeature} in a Community You'll Love`,
    'Urban Professionals': `Professional Living Perfected: ${headlineFeature} with Urban Convenience`,
    'Real Estate Investors': `Prime Investment Opportunity: ${headlineFeature} Driving Superior Returns`,
    'Affluent Lifestyle Seekers': `Luxury Living Redefined: ${headlineFeature} in Exclusive Setting`
  };
  
  return titles[persona] || `Exceptional Value: ${headlineFeature} and Quality Living`;
}

/**
 * Get core value based on persona and property insights
 */
function getCoreValue(persona: string, photoInsights: PhotoInsights): string {
  const coreValues = {
    'First-Time Home Buyers': 'Security, pride of ownership, and community belonging with features that enhance daily life',
    'Growing Families': 'Safe, comfortable family environment with space and amenities for creating lasting memories',
    'Urban Professionals': 'Convenient, high-quality living that supports career success and lifestyle goals',
    'Real Estate Investors': 'Strong ROI potential through premium features, prime location, and market fundamentals',
    'Affluent Lifestyle Seekers': 'Exclusive lifestyle experience with luxury amenities and sophisticated living environment'
  };
  
  return coreValues[persona] || 'Quality living with exceptional features and long-term value';
}

/**
 * Generate emotional drivers for value proposition
 */
function generateEmotionalDrivers(persona: string, photoInsights: PhotoInsights): EmotionalDriver[] {
  const baseDrivers = [
    {
      emotion: 'Pride',
      trigger: photoInsights.headlineFeature || 'Premium features',
      scenario: 'Hosting friends and family in your beautiful home',
      outcome: 'Feeling proud of your home and lifestyle choices'
    },
    {
      emotion: 'Security',
      trigger: 'Quality construction and established neighborhood',
      scenario: 'Knowing your family is safe and your investment is sound',
      outcome: 'Peace of mind and confidence in your decision'
    }
  ];
  
  // Add persona-specific drivers
  if (persona === 'Growing Families') {
    baseDrivers.push({
      emotion: 'Joy',
      trigger: photoInsights.lifestyleScenarios?.[0] || 'Family-friendly features',
      scenario: 'Watching your children grow and play in their perfect home',
      outcome: 'Creating lifelong family memories and happiness'
    });
  }
  
  return baseDrivers;
}

/**
 * Generate lifestyle showcases with vivid scenarios
 */
function generateLifestyleShowcases(
  facts: Facts,
  photoInsights: PhotoInsights,
  persona: string
): LifestyleShowcase[] {
  return [
    {
      lifestyleTheme: getLifestyleTheme(persona),
      targetPersona: persona,
      dailyLifeScenarios: generateDailyLifeScenarios(photoInsights, persona),
      entertainingScenarios: generateEntertainingScenarios(photoInsights),
      personalMoments: generatePersonalMoments(photoInsights),
      seasonalExperiences: generateSeasonalExperiences(photoInsights),
      aspirationalElements: generateAspirationalElements(persona, photoInsights)
    }
  ];
}

/**
 * Get lifestyle theme based on persona
 */
function getLifestyleTheme(persona: string): string {
  const themes = {
    'First-Time Home Buyers': 'Starting Your Home Ownership Journey',
    'Growing Families': 'Creating Your Family Legacy',
    'Urban Professionals': 'Sophisticated Urban Living',
    'Real Estate Investors': 'Premium Investment Lifestyle',
    'Affluent Lifestyle Seekers': 'Luxury Living Excellence'
  };
  
  return themes[persona] || 'Quality Living Experience';
}

/**
 * Generate daily life scenarios
 */
function generateDailyLifeScenarios(photoInsights: PhotoInsights, persona: string): DailyLifeScenario[] {
  const scenarios = [
    {
      timeOfDay: 'Morning',
      activity: 'Starting your day',
      location: photoInsights.features.find(f => f.toLowerCase().includes('kitchen')) ? 'Gourmet kitchen' : 'Bright living space',
      experience: 'Enjoying coffee while natural light fills the space',
      emotionalBenefit: 'Peaceful, energizing start to each day'
    },
    {
      timeOfDay: 'Evening',
      activity: 'Unwinding after work',
      location: photoInsights.features.find(f => f.toLowerCase().includes('pool') || f.toLowerCase().includes('patio')) ? 'Private outdoor space' : 'Comfortable living area',
      experience: 'Relaxing in your own private retreat',
      emotionalBenefit: 'Stress relief and personal sanctuary feeling'
    }
  ];
  
  // Add persona-specific scenarios
  if (persona === 'Growing Families') {
    scenarios.push({
      timeOfDay: 'Afternoon',
      activity: 'Family time',
      location: 'Open living spaces',
      experience: 'Kids playing safely while you prepare dinner',
      emotionalBenefit: 'Family togetherness and parental peace of mind'
    });
  }
  
  return scenarios;
}

/**
 * Generate entertaining scenarios
 */
function generateEntertainingScenarios(photoInsights: PhotoInsights): EntertainingScenario[] {
  return [
    {
      occasion: 'Dinner party with friends',
      setting: photoInsights.features.find(f => f.toLowerCase().includes('kitchen')) ? 'Gourmet kitchen and dining area' : 'Open living and dining spaces',
      experience: 'Seamlessly hosting while staying connected with guests',
      guestExperience: 'Impressed by the quality and thoughtful design',
      hostBenefit: 'Effortless entertaining and social confidence'
    },
    {
      occasion: 'Holiday celebrations',
      setting: 'Open floor plan connecting living spaces',
      experience: 'Family gathered comfortably with room for everyone',
      guestExperience: 'Feeling welcomed in a beautiful, spacious home',
      hostBenefit: 'Creating memorable moments and family traditions'
    }
  ];
}

/**
 * Generate personal moments
 */
function generatePersonalMoments(photoInsights: PhotoInsights): PersonalMoment[] {
  return [
    {
      moment: 'Quiet reading time',
      setting: photoInsights.features.find(f => f.toLowerCase().includes('nook') || f.toLowerCase().includes('den')) ? 'Cozy reading nook' : 'Peaceful living area',
      experience: 'Curled up with a book in perfect natural light',
      emotionalReward: 'Personal sanctuary and mental rejuvenation'
    },
    {
      moment: 'Sunday morning coffee',
      setting: photoInsights.features.find(f => f.toLowerCase().includes('patio') || f.toLowerCase().includes('deck')) ? 'Private outdoor space' : 'Bright breakfast area',
      experience: 'Savoring peaceful moments in your own space',
      emotionalReward: 'Gratitude and contentment with life choices'
    }
  ];
}

/**
 * Generate seasonal experiences
 */
function generateSeasonalExperiences(photoInsights: PhotoInsights): SeasonalExperience[] {
  return [
    {
      season: 'Summer',
      activity: 'Outdoor living',
      setting: photoInsights.features.find(f => f.toLowerCase().includes('pool') || f.toLowerCase().includes('patio')) ? 'Private outdoor oasis' : 'Covered outdoor space',
      experience: 'Hosting BBQs and enjoying warm evenings outdoors',
      uniqueAspect: 'Your own private resort-style experience'
    },
    {
      season: 'Winter',
      activity: 'Cozy indoor gatherings',
      setting: photoInsights.features.find(f => f.toLowerCase().includes('fireplace')) ? 'Fireplace area' : 'Warm, inviting living spaces',
      experience: 'Intimate gatherings with warmth and comfort',
      uniqueAspect: 'Perfect blend of elegance and comfort'
    }
  ];
}

/**
 * Generate aspirational elements
 */
function generateAspirationalElements(persona: string, photoInsights: PhotoInsights): AspirationalElement[] {
  const elements = [
    {
      aspiration: 'Living your best life',
      enabler: photoInsights.headlineFeature || 'Premium features',
      visualization: 'Wake up every day in a home that reflects your success and values',
      achievement: 'Lifestyle upgrade and personal satisfaction'
    }
  ];
  
  if (persona === 'Growing Families') {
    elements.push({
      aspiration: 'Raising children in the perfect environment',
      enabler: 'Safe, spacious, family-friendly features',
      visualization: 'Watching your children thrive in a home designed for family life',
      achievement: 'Family happiness and children\'s positive development'
    });
  }
  
  return elements;
}

/**
 * Generate competitive analysis
 */
function generateCompetitiveAnalysis(facts: Facts, photoInsights: PhotoInsights): CompetitiveAnalysis {
  return {
    marketPosition: {
      segment: photoInsights.propertyCategory === 'luxury' ? 'Premium residential' : 'Quality residential',
      pricePosition: 'Competitive for features and location',
      featurePosition: 'Above average amenities and quality',
      qualityPosition: 'Superior construction and condition',
      valuePosition: 'Strong value proposition vs alternatives'
    },
    competitorComparison: [
      {
        competitor: 'Similar properties in area',
        priceRange: 'Comparable pricing',
        keyFeatures: ['Standard features', 'Basic amenities', 'Varying conditions'],
        advantages: ['Lower price point', 'Multiple options available'],
        disadvantages: [`Missing ${photoInsights.headlineFeature}`, 'Older condition', 'Fewer premium features'],
        recommendation: 'Subject property offers superior value for quality-conscious buyers'
      }
    ],
    uniqueAdvantages: [
      {
        advantage: photoInsights.headlineFeature || 'Premium features',
        description: 'Exceptional amenity rarely found in this price range',
        proof: 'Market analysis of comparable properties',
        buyerValue: 'Enhanced lifestyle and long-term appreciation',
        difficulty_to_replicate: 'high'
      }
    ],
    marketOpportunity: {
      opportunity: 'Limited inventory with similar quality and features',
      timeframe: 'Current market cycle',
      drivers: ['Low comparable inventory', 'Strong buyer demand', 'Quality construction'],
      riskFactors: ['Market timing', 'Interest rate changes'],
      actionability: 'High - act within optimal market window'
    },
    positioningStrategy: {
      primaryPosition: 'Premium quality at competitive pricing',
      secondaryPositions: ['Move-in ready convenience', 'Superior location access'],
      messaging: ['Exceptional value', 'Quality without compromise', 'Optimal market timing'],
      differentiationFocus: [photoInsights.headlineFeature || 'Key features', 'Condition quality', 'Location benefits']
    }
  };
}

/**
 * Generate investment analysis
 */
function generateInvestmentAnalysis(facts: Facts, photoInsights: PhotoInsights, persona: string): InvestmentAnalysis {
  return {
    financialProjection: {
      currentValue: 'Market-competitive pricing',
      projectedValue: [
        {
          timeframe: '1 year',
          lowEstimate: '2% appreciation',
          midEstimate: '4% appreciation',
          highEstimate: '6% appreciation',
          assumptions: ['Stable market conditions', 'Continued neighborhood desirability']
        },
        {
          timeframe: '5 years',
          lowEstimate: '15% appreciation',
          midEstimate: '25% appreciation',
          highEstimate: '35% appreciation',
          assumptions: ['Normal market cycles', 'Infrastructure improvements', 'Neighborhood development']
        }
      ],
      appreciationFactors: [
        `Premium ${photoInsights.headlineFeature || 'features'} maintain desirability`,
        'Quality construction ensures longevity',
        'Prime location fundamentals'
      ],
      riskFactors: ['Market cycle changes', 'Interest rate fluctuations', 'Economic conditions'],
      confidenceLevel: 'medium'
    },
    marketTrends: [
      {
        trend: 'Increased demand for quality features',
        impact: 'positive',
        timeframe: 'Medium to long term',
        confidence: 'high',
        propertyImpact: 'Properties with premium features appreciate faster'
      }
    ],
    riskAssessment: {
      riskLevel: 'moderate',
      primaryRisks: [
        {
          risk: 'Market cycle timing',
          probability: 'medium',
          impact: 'medium',
          mitigation: 'Long-term hold strategy and quality features'
        }
      ],
      mitigationStrategies: ['Quality property fundamentals', 'Prime location', 'Diverse economic base'],
      monitoringIndicators: ['Local market activity', 'Interest rate trends', 'Economic indicators']
    },
    opportunityAnalysis: {
      opportunities: [
        {
          opportunity: 'Market timing advantage',
          potential: 'Strong buyer position in current market',
          timeframe: 'Immediate',
          requirements: ['Competitive financing', 'Quick decision capability']
        }
      ],
      timingSensitivity: 'High - optimal market conditions for buyers',
      actionSteps: ['Secure financing pre-approval', 'Conduct thorough inspection', 'Prepare competitive offer'],
      successIndicators: ['Successful purchase at target price', 'Smooth closing process', 'Immediate equity position']
    },
    recommendationSummary: {
      recommendation: persona === 'Real Estate Investors' ? 'strong_buy' : 'buy',
      reasoning: [
        'Competitive pricing for quality and features',
        'Strong fundamentals and appreciation potential',
        'Limited comparable inventory creates opportunity'
      ],
      timeline: 'Move quickly - quality properties attract multiple buyers',
      conditions: ['Satisfactory inspection results', 'Acceptable financing terms'],
      alternatives: ['Consider similar properties if available', 'Wait for market correction (higher risk)']
    }
  };
}

/**
 * Generate decision frameworks for buyer guidance
 */
function generateDecisionFrameworks(persona: string): DecisionFramework[] {
  return [
    {
      frameworkName: 'Property Evaluation Matrix',
      applicableSituation: 'Comparing multiple properties or evaluating single property decision',
      criteria: [
        {
          criterion: 'Location & Access',
          description: 'Proximity to work, schools, amenities, and transportation',
          weight: 25,
          scoringMethod: '1-10 scale based on convenience and future potential',
          considerationFactors: ['Commute time', 'School districts', 'Neighborhood trajectory']
        },
        {
          criterion: 'Features & Amenities',
          description: 'Property features that enhance lifestyle and value',
          weight: 20,
          scoringMethod: '1-10 scale based on quality and uniqueness',
          considerationFactors: ['Must-have features', 'Nice-to-have features', 'Unique selling points']
        },
        {
          criterion: 'Condition & Quality',
          description: 'Current condition and quality of construction',
          weight: 20,
          scoringMethod: '1-10 scale based on inspection and observation',
          considerationFactors: ['Immediate repairs needed', 'Quality of materials', 'Age and maintenance']
        },
        {
          criterion: 'Financial Value',
          description: 'Price relative to market and investment potential',
          weight: 20,
          scoringMethod: '1-10 scale based on comparative market analysis',
          considerationFactors: ['Price per square foot', 'Comparable sales', 'Appreciation potential']
        },
        {
          criterion: 'Future Potential',
          description: 'Long-term value and lifestyle sustainability',
          weight: 15,
          scoringMethod: '1-10 scale based on market trends and personal factors',
          considerationFactors: ['Neighborhood development', 'Resale potential', 'Life stage changes']
        }
      ],
      weightingMethod: 'Multiply criterion score by weight percentage for weighted score',
      scoringGuidance: [
        {
          score: 9,
          description: 'Exceptional - significantly exceeds expectations',
          indicators: ['Best in class', 'Rare quality', 'Outstanding value'],
          examples: ['Premium location with all conveniences', 'Unique features rarely available']
        },
        {
          score: 7,
          description: 'Very Good - meets expectations with some advantages',
          indicators: ['Above average', 'Clear benefits', 'Good value'],
          examples: ['Convenient location', 'Quality features', 'Fair pricing']
        },
        {
          score: 5,
          description: 'Acceptable - meets basic requirements',
          indicators: ['Average', 'Acceptable quality', 'Market rate'],
          examples: ['Standard location', 'Basic features', 'Market pricing']
        }
      ],
      interpretationGuide: 'Total weighted score: 8.0+ = Strong Buy, 7.0-7.9 = Buy, 6.0-6.9 = Consider, <6.0 = Pass'
    }
  ];
}

/**
 * Generate objection handling responses
 */
function generateObjectionHandling(facts: Facts, photoInsights: PhotoInsights, persona: string): ObjectionHandler[] {
  return [
    {
      objection: 'The price seems high compared to other properties',
      category: 'price',
      frequency: 'common',
      response: {
        acknowledgment: 'I understand price is an important consideration in your decision',
        clarification: 'When you mention other properties, are you referring to similar quality and features?',
        response: `This property's pricing reflects its ${photoInsights.headlineFeature || 'premium features'} and move-in ready condition. When you factor in the cost of adding similar features to other properties, this represents exceptional value.`,
        validation: 'Let me show you a detailed comparison with truly comparable properties',
        redirect: 'What specific features are most important to you in your new home?'
      },
      reframing: 'Investment in quality saves money long-term while enhancing daily life',
      evidence: [
        'Comparative market analysis showing value position',
        'Cost analysis of adding features to lesser properties',
        'Long-term appreciation potential'
      ],
      nextSteps: [
        'Review detailed property comparison analysis',
        'Discuss financing options to optimize monthly investment',
        'Schedule second showing to experience quality firsthand'
      ]
    },
    {
      objection: 'We want to see more properties before deciding',
      category: 'timing',
      frequency: 'common',
      response: {
        acknowledgment: 'It\'s smart to thoroughly research your options before making such an important decision',
        clarification: 'What specific features or qualities are you hoping to find in other properties?',
        response: 'Absolutely continue your search - and I encourage you to use this property as your benchmark for quality and value. I\'m confident you\'ll find this combination of features and condition is rare in the current market.',
        validation: 'I\'ll provide you with a detailed feature checklist to use when evaluating other properties',
        redirect: 'What timeline are you working with for your move?'
      },
      reframing: 'Use this property as your quality standard while maintaining urgency awareness',
      evidence: [
        'Limited inventory with similar features',
        'Average days on market for quality properties',
        'Seasonal market timing factors'
      ],
      nextSteps: [
        'Provide property comparison checklist',
        'Schedule follow-up after viewing other properties',
        'Maintain communication about market changes'
      ]
    }
  ];
}

/**
 * Generate conversion optimization strategies
 */
function generateConversionOptimization(facts: Facts, photoInsights: PhotoInsights, persona: string): ConsiderationConversionOptimization {
  return {
    urgencyCreation: {
      marketFactors: [
        'Limited inventory with similar quality features',
        'Seasonal market timing favors current buyers',
        'Interest rate environment creates opportunity window'
      ],
      competitionFactors: [
        'Properties with this quality typically attract multiple offers',
        'Other buyers are actively viewing this property',
        'Delay may result in lost opportunity'
      ],
      opportunityFactors: [
        'Current market conditions favor buyers',
        'Quality properties move quickly when properly priced',
        'This feature combination rarely becomes available'
      ],
      timingFactors: [
        'Optimal buying season for market advantages',
        'Financing rates currently favorable',
        'Property availability window may be limited'
      ],
      messagingStrategy: [
        'Emphasize rarity of feature combination',
        'Highlight market timing advantages',
        'Share comparable property competition stories'
      ]
    },
    trustBuilding: {
      credibilityIndicators: [
        'Professional market analysis and expertise',
        'Transparent communication about property pros/cons',
        'Comprehensive support throughout process'
      ],
      socialProofElements: [
        'Similar client success stories',
        'Professional credentials and experience',
        'Market knowledge demonstration'
      ],
      expertiseDemo: [
        'Detailed property and market analysis',
        'Professional network and resources',
        'Process guidance and advocacy'
      ],
      transparencyFactors: [
        'Honest assessment of property considerations',
        'Clear explanation of market dynamics',
        'Open discussion of all buyer options'
      ],
      relationshipBuilders: [
        'Personal attention and responsiveness',
        'Educational approach to decision support',
        'Long-term perspective and advice'
      ]
    },
    valueReinforcement: {
      valueRestatement: [
        `Exceptional value with ${photoInsights.headlineFeature || 'premium features'}`,
        'Quality construction and move-in ready condition',
        'Prime location with strong fundamentals'
      ],
      benefitAmplification: [
        'Daily lifestyle enhancement from premium features',
        'Long-term appreciation potential',
        'Cost savings from move-in ready condition'
      ],
      costJustification: [
        'Competitive pricing for quality level',
        'Lower total cost of ownership',
        'Investment in long-term satisfaction'
      ],
      opportunityCost: [
        'Cost of continuing to search vs. securing ideal property',
        'Risk of missing rare feature combination',
        'Time value and market timing considerations'
      ],
      futureProofing: [
        'Features that maintain long-term appeal',
        'Quality construction ensures durability',
        'Location benefits continue to appreciate'
      ]
    },
    nextStepGuidance: {
      immediateActions: [
        'Schedule comprehensive property inspection',
        'Finalize financing pre-approval',
        'Prepare competitive offer strategy'
      ],
      preparationSteps: [
        'Review all property documentation',
        'Understand neighborhood and community',
        'Plan for moving and transition timeline'
      ],
      decisionTimeline: 'Optimal decision window: 24-48 hours for quality properties',
      supportOffered: [
        'Professional inspection coordination',
        'Financing assistance and guidance',
        'Negotiation strategy and advocacy'
      ],
      milestones: [
        'Property inspection completion',
        'Financing final approval',
        'Successful offer acceptance',
        'Smooth closing process'
      ]
    },
    engagementMaintenance: {
      touchpointStrategy: [
        'Daily check-ins during decision period',
        'Immediate response to questions/concerns',
        'Proactive market update sharing'
      ],
      contentSequence: [
        'Detailed property analysis delivery',
        'Market comparison updates',
        'Process timeline and guidance',
        'Success story sharing'
      ],
      personalizedFollowup: [
        'Address specific buyer concerns',
        'Provide additional property insights',
        'Share relevant market developments'
      ],
      valueContinuation: [
        'Reinforce unique property advantages',
        'Highlight market timing benefits',
        'Emphasize quality of life improvements'
      ],
      relationshipDeepening: [
        'Personal attention and care',
        'Long-term perspective sharing',
        'Trusted advisor positioning'
      ]
    }
  };
}

/**
 * Validate consideration content meets buyer engagement standards
 */
export function validateConsiderationContent(content: ConsiderationContent): {
  isValid: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;
  
  // Property comparisons validation
  if (!content.propertyComparisons || content.propertyComparisons.length < 1) {
    issues.push('Missing property comparison analysis');
    score -= 20;
  }
  
  // Value propositions validation
  if (!content.valuePropositions || content.valuePropositions.length < 1) {
    issues.push('Missing value proposition content');
    score -= 15;
  }
  
  // Lifestyle showcases validation
  if (!content.lifestyleShowcases || content.lifestyleShowcases.length < 1) {
    issues.push('Missing lifestyle showcase content');
    score -= 15;
  }
  
  // Competitive analysis validation
  if (!content.competitiveAnalysis.uniqueAdvantages || content.competitiveAnalysis.uniqueAdvantages.length < 1) {
    issues.push('Insufficient competitive differentiation');
    score -= 10;
  }
  
  // Investment analysis validation
  if (!content.investmentAnalysis.financialProjection || 
      !content.investmentAnalysis.financialProjection.projectedValue.length) {
    issues.push('Missing investment analysis projections');
    score -= 10;
  }
  
  // Decision frameworks validation
  if (!content.decisionFrameworks || content.decisionFrameworks.length < 1) {
    issues.push('Missing buyer decision support frameworks');
    score -= 10;
  }
  
  // Objection handling validation
  if (!content.objectionHandling || content.objectionHandling.length < 2) {
    issues.push('Insufficient objection handling responses');
    score -= 10;
  }
  
  // Conversion optimization validation
  if (!content.conversionOptimization.urgencyCreation.marketFactors.length ||
      !content.conversionOptimization.valueReinforcement.valueRestatement.length) {
    issues.push('Incomplete conversion optimization strategy');
    score -= 10;
  }
  
  return {
    isValid: issues.length <= 2 && score >= 75,
    issues,
    score: Math.max(0, score)
  };
}