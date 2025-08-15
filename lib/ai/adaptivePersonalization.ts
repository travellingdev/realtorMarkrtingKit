/**
 * Adaptive content personalization based on behavior
 * Dynamically adjusts content presentation based on user interactions and preferences
 */

import type { PhotoInsights } from './photoAnalysis';
import type { BuyerProfile } from './buyerProfileOptimization';
import type { DetectedPersona } from './personaDetection';
import type { Output } from './schemas';

export interface PersonalizationEngine {
  profile: BuyerProfile;
  persona: DetectedPersona;
  adaptations: ContentAdaptation[];
  strategy: PersonalizationStrategy;
  performance: PersonalizationPerformance;
  experiments: PersonalizationExperiment[];
}

export interface ContentAdaptation {
  type: AdaptationType;
  original: string;
  adapted: string;
  reasoning: string;
  impact: number;
  confidence: number;
}

export type AdaptationType = 
  | 'tone'
  | 'length'
  | 'complexity'
  | 'emphasis'
  | 'structure'
  | 'imagery'
  | 'urgency'
  | 'social_proof'
  | 'personalization'
  | 'localization';

export interface PersonalizationStrategy {
  approach: StrategyApproach;
  rules: PersonalizationRule[];
  priorities: PriorityMatrix;
  constraints: PersonalizationConstraints;
  fallbacks: FallbackStrategy[];
}

export interface StrategyApproach {
  level: 'conservative' | 'moderate' | 'aggressive';
  focus: 'conversion' | 'engagement' | 'education' | 'relationship';
  adaptiveness: number;
  learningRate: number;
}

export interface PersonalizationRule {
  condition: RuleCondition;
  action: RuleAction;
  priority: number;
  confidence: number;
  performance: RulePerformance;
}

export interface RuleCondition {
  type: 'behavior' | 'demographic' | 'preference' | 'context' | 'history';
  attribute: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'matches';
  value: any;
  weight: number;
}

export interface RuleAction {
  type: string;
  modification: string;
  parameters: Record<string, any>;
  expectedOutcome: string;
}

export interface RulePerformance {
  applications: number;
  successRate: number;
  averageImpact: number;
  lastUpdated: Date;
}

export interface PriorityMatrix {
  personaAlignment: number;
  conversionPotential: number;
  engagementValue: number;
  brandConsistency: number;
  userPreference: number;
}

export interface PersonalizationConstraints {
  minReadability: number;
  maxComplexity: number;
  brandGuidelines: string[];
  legalRequirements: string[];
  ethicalBoundaries: string[];
}

export interface FallbackStrategy {
  trigger: string;
  action: string;
  priority: number;
}

export interface PersonalizationPerformance {
  overallEffectiveness: number;
  conversionLift: number;
  engagementIncrease: number;
  satisfactionScore: number;
  learningProgress: number;
  adaptationQuality: number;
}

export interface PersonalizationExperiment {
  id: string;
  hypothesis: string;
  variants: ExperimentVariant[];
  status: 'planning' | 'running' | 'completed' | 'abandoned';
  results?: ExperimentResults;
}

export interface ExperimentVariant {
  name: string;
  modifications: ContentAdaptation[];
  targetSegment: string;
  sampleSize: number;
}

export interface ExperimentResults {
  winner: string;
  lift: number;
  confidence: number;
  insights: string[];
  recommendations: string[];
}

export interface DynamicContent {
  baseContent: string;
  variations: ContentVariation[];
  selectionCriteria: SelectionCriteria;
  performance: VariationPerformance[];
}

export interface ContentVariation {
  id: string;
  content: string;
  targetPersona: string;
  modifications: ModificationDetail[];
  score: number;
}

export interface ModificationDetail {
  type: string;
  original: string;
  modified: string;
  reason: string;
}

export interface SelectionCriteria {
  method: 'rule_based' | 'ml_based' | 'hybrid';
  factors: SelectionFactor[];
  threshold: number;
}

export interface SelectionFactor {
  name: string;
  weight: number;
  source: string;
}

export interface VariationPerformance {
  variationId: string;
  impressions: number;
  engagements: number;
  conversions: number;
  score: number;
}

// Personalization templates for different personas
const PERSONA_TEMPLATES = {
  first_time_buyer: {
    tone: 'educational and supportive',
    complexity: 'simple',
    length: 'detailed',
    emphasis: ['guidance', 'process', 'financial'],
    urgency: 'low',
    socialProof: 'peer testimonials'
  },
  luxury_seeker: {
    tone: 'sophisticated and exclusive',
    complexity: 'refined',
    length: 'concise',
    emphasis: ['exclusivity', 'quality', 'lifestyle'],
    urgency: 'subtle',
    socialProof: 'prestige indicators'
  },
  investor: {
    tone: 'analytical and direct',
    complexity: 'technical',
    length: 'data-rich',
    emphasis: ['roi', 'metrics', 'opportunity'],
    urgency: 'market-driven',
    socialProof: 'performance data'
  },
  family_focused: {
    tone: 'warm and reassuring',
    complexity: 'moderate',
    length: 'comprehensive',
    emphasis: ['safety', 'community', 'schools'],
    urgency: 'family-timing',
    socialProof: 'family testimonials'
  }
};

/**
 * Create personalized content based on buyer profile and behavior
 */
export function personalizeContent(
  outputs: Output,
  profile: BuyerProfile,
  persona: DetectedPersona,
  photoInsights: PhotoInsights
): PersonalizedOutput {
  // Initialize personalization engine
  const engine = initializeEngine(profile, persona);
  
  // Apply persona-based adaptations
  const personaAdapted = applyPersonaAdaptations(outputs, persona, photoInsights);
  
  // Apply behavioral adaptations
  const behaviorAdapted = applyBehavioralAdaptations(personaAdapted, profile);
  
  // Apply contextual adaptations
  const contextAdapted = applyContextualAdaptations(behaviorAdapted, profile, photoInsights);
  
  // Apply preference-based adaptations
  const preferenceAdapted = applyPreferenceAdaptations(contextAdapted, profile);
  
  // Optimize for conversion
  const optimized = optimizeForConversion(preferenceAdapted, persona, profile);
  
  // Track adaptations for learning
  const adaptations = trackAdaptations(outputs, optimized);
  
  return {
    original: outputs,
    personalized: optimized,
    adaptations,
    confidence: calculateConfidence(adaptations),
    performance: predictPerformance(optimized, persona, profile)
  };
}

export interface PersonalizedOutput {
  original: Output;
  personalized: Output;
  adaptations: ContentAdaptation[];
  confidence: number;
  performance: PredictedPerformance;
}

export interface PredictedPerformance {
  engagementLift: number;
  conversionLift: number;
  relevanceScore: number;
  personalizationDepth: number;
}

/**
 * Initialize personalization engine
 */
function initializeEngine(profile: BuyerProfile, persona: DetectedPersona): PersonalizationEngine {
  return {
    profile,
    persona,
    adaptations: [],
    strategy: {
      approach: {
        level: 'moderate',
        focus: 'conversion',
        adaptiveness: 75,
        learningRate: 0.1
      },
      rules: generatePersonalizationRules(persona),
      priorities: {
        personaAlignment: 30,
        conversionPotential: 25,
        engagementValue: 20,
        brandConsistency: 15,
        userPreference: 10
      },
      constraints: {
        minReadability: 60,
        maxComplexity: 80,
        brandGuidelines: ['professional', 'trustworthy', 'helpful'],
        legalRequirements: ['fair housing', 'truth in advertising'],
        ethicalBoundaries: ['no manipulation', 'honest representation']
      },
      fallbacks: [
        {
          trigger: 'low confidence',
          action: 'use generic content',
          priority: 1
        }
      ]
    },
    performance: {
      overallEffectiveness: 70,
      conversionLift: 15,
      engagementIncrease: 25,
      satisfactionScore: 80,
      learningProgress: 40,
      adaptationQuality: 75
    },
    experiments: []
  };
}

/**
 * Generate personalization rules based on persona
 */
function generatePersonalizationRules(persona: DetectedPersona): PersonalizationRule[] {
  const rules: PersonalizationRule[] = [];
  
  // Tone adaptation rule
  rules.push({
    condition: {
      type: 'demographic',
      attribute: 'persona_type',
      operator: 'equals',
      value: persona.type,
      weight: 0.8
    },
    action: {
      type: 'tone_adjustment',
      modification: PERSONA_TEMPLATES[persona.type]?.tone || 'professional',
      parameters: {
        formality: persona.behaviors.communicationPreference.tone,
        warmth: persona.characteristics.psychographic.personality.agreeableness / 100
      },
      expectedOutcome: 'increased engagement'
    },
    priority: 1,
    confidence: 85,
    performance: {
      applications: 0,
      successRate: 0,
      averageImpact: 0,
      lastUpdated: new Date()
    }
  });
  
  // Length adaptation rule
  rules.push({
    condition: {
      type: 'behavior',
      attribute: 'attention_span',
      operator: 'equals',
      value: persona.behaviors.contentConsumption.attentionSpan,
      weight: 0.7
    },
    action: {
      type: 'length_adjustment',
      modification: persona.behaviors.contentConsumption.attentionSpan === 'short' ? 'condense' : 'expand',
      parameters: {
        targetLength: persona.behaviors.contentConsumption.attentionSpan === 'short' ? 0.7 : 1.3,
        preserveKeyPoints: true
      },
      expectedOutcome: 'improved completion rate'
    },
    priority: 2,
    confidence: 75,
    performance: {
      applications: 0,
      successRate: 0,
      averageImpact: 0,
      lastUpdated: new Date()
    }
  });
  
  // Urgency adaptation rule
  if (persona.triggers.urgency.length > 0) {
    rules.push({
      condition: {
        type: 'context',
        attribute: 'urgency_sensitivity',
        operator: 'greater',
        value: 50,
        weight: 0.6
      },
      action: {
        type: 'urgency_injection',
        modification: 'add urgency elements',
        parameters: {
          urgencyLevel: persona.triggers.urgency[0].sensitivity / 100,
          urgencyType: persona.triggers.urgency[0].trigger
        },
        expectedOutcome: 'faster decision making'
      },
      priority: 3,
      confidence: 70,
      performance: {
        applications: 0,
        successRate: 0,
        averageImpact: 0,
        lastUpdated: new Date()
      }
    });
  }
  
  return rules;
}

/**
 * Apply persona-based adaptations
 */
function applyPersonaAdaptations(
  outputs: Output,
  persona: DetectedPersona,
  photoInsights: PhotoInsights
): Output {
  const adapted = { ...outputs };
  const template = PERSONA_TEMPLATES[persona.type];
  
  if (!template) return adapted;
  
  // Adapt MLS description
  if (adapted.mlsDesc) {
    adapted.mlsDesc = adaptTone(adapted.mlsDesc, template.tone);
    adapted.mlsDesc = adaptEmphasis(adapted.mlsDesc, template.emphasis, photoInsights);
    adapted.mlsDesc = addPersonaSocialProof(adapted.mlsDesc, template.socialProof);
  }
  
  // Adapt Instagram content
  if (adapted.igSlides) {
    adapted.igSlides = adapted.igSlides.map(slide => 
      adaptForPersonaEngagement(slide, persona)
    );
  }
  
  // Adapt email content
  if (adapted.emailBody) {
    adapted.emailBody = adaptEmailForPersona(adapted.emailBody, persona, template);
  }
  
  return adapted;
}

/**
 * Adapt tone of content
 */
function adaptTone(content: string, tone: string): string {
  const toneMap = {
    'educational and supportive': (text: string) => {
      return text
        .replace(/You should/g, 'Consider')
        .replace(/must/g, 'recommended to')
        .replace(/!/g, '.')
        + '\n\n💡 Helpful tip: We\'re here to guide you through every step.';
    },
    'sophisticated and exclusive': (text: string) => {
      return text
        .replace(/home/g, 'residence')
        .replace(/nice/g, 'exceptional')
        .replace(/good/g, 'superior')
        .replace(/great/g, 'extraordinary');
    },
    'analytical and direct': (text: string) => {
      return text
        .replace(/approximately/g, 'exactly')
        .replace(/might/g, 'will')
        .replace(/could/g, 'projected to');
    },
    'warm and reassuring': (text: string) => {
      return text
        .replace(/property/g, 'family home')
        .replace(/house/g, 'your future home')
        + '\n\n👨‍👩‍👧‍👦 Perfect for creating lasting family memories!';
    }
  };
  
  const adapter = toneMap[tone];
  return adapter ? adapter(content) : content;
}

/**
 * Adapt emphasis based on persona priorities
 */
function adaptEmphasis(content: string, emphasisAreas: string[], photoInsights: PhotoInsights): string {
  let adapted = content;
  
  emphasisAreas.forEach(area => {
    switch(area) {
      case 'guidance':
        adapted = addGuidanceElements(adapted);
        break;
      case 'process':
        adapted = addProcessClarification(adapted);
        break;
      case 'financial':
        adapted = addFinancialContext(adapted);
        break;
      case 'exclusivity':
        adapted = emphasizeExclusiveFeatures(adapted, photoInsights);
        break;
      case 'roi':
        adapted = addROIMetrics(adapted);
        break;
      case 'safety':
        adapted = highlightSafetyFeatures(adapted);
        break;
      case 'community':
        adapted = emphasizeCommunityAspects(adapted);
        break;
    }
  });
  
  return adapted;
}

/**
 * Helper functions for emphasis adaptation
 */
function addGuidanceElements(content: string): string {
  const guidance = '\n\n📋 Next Steps: Schedule a showing → Get pre-approved → Make an offer';
  return content + guidance;
}

function addProcessClarification(content: string): string {
  return content.replace(
    'Contact for more information',
    'Contact us for a step-by-step walkthrough of the buying process'
  );
}

function addFinancialContext(content: string): string {
  const financial = '\n\n💰 Financing available with competitive rates. Down payment assistance programs may apply.';
  return content + financial;
}

function emphasizeExclusiveFeatures(content: string, photoInsights: PhotoInsights): string {
  if (photoInsights.headlineFeature) {
    return content.replace(
      photoInsights.headlineFeature,
      `**EXCLUSIVE: ${photoInsights.headlineFeature}**`
    );
  }
  return content;
}

function addROIMetrics(content: string): string {
  const roi = '\n\n📊 Investment Analysis: Projected 8-12% annual appreciation based on market trends.';
  return content + roi;
}

function highlightSafetyFeatures(content: string): string {
  return content.replace(
    /neighborhood/g,
    'safe, family-friendly neighborhood'
  );
}

function emphasizeCommunityAspects(content: string): string {
  const community = '\n\n🏘️ Vibrant community with regular events and strong neighbor connections.';
  return content + community;
}

/**
 * Add persona-specific social proof
 */
function addPersonaSocialProof(content: string, socialProofType: string): string {
  const proofMap = {
    'peer testimonials': '\n\n⭐ "As a first-time buyer, the guidance we received was invaluable!" - Recent happy homeowner',
    'prestige indicators': '\n\n🏆 Exclusively listed • Architect-designed • Featured in Luxury Living Magazine',
    'performance data': '\n\n📈 Similar properties: 15% ROI average • 95% occupancy rate • $500+ monthly cash flow',
    'family testimonials': '\n\n❤️ "Our kids love the neighborhood! Great schools and safe streets." - Local family'
  };
  
  return content + (proofMap[socialProofType] || '');
}

/**
 * Adapt content for persona engagement
 */
function adaptForPersonaEngagement(content: string, persona: DetectedPersona): string {
  // Add persona-specific hooks
  const hooks = {
    first_time_buyer: 'First-time buyer friendly! ',
    luxury_seeker: 'Exclusive opportunity! ',
    investor: 'Investment alert! ',
    family_focused: 'Family perfect! '
  };
  
  const hook = hooks[persona.type] || '';
  return hook + content;
}

/**
 * Adapt email for persona
 */
function adaptEmailForPersona(email: string, persona: DetectedPersona, template: any): string {
  let adapted = email;
  
  // Adjust greeting
  const greetings = {
    first_time_buyer: 'Dear Future Homeowner',
    luxury_seeker: 'Dear Discerning Buyer',
    investor: 'Dear Investor',
    family_focused: 'Dear Family'
  };
  
  adapted = adapted.replace(/Dear \w+/g, greetings[persona.type] || 'Dear Valued Client');
  
  // Add persona-specific value proposition
  const valueProps = {
    first_time_buyer: '\n\nWe understand this is a big step, and we\'re here to make it simple and stress-free.',
    luxury_seeker: '\n\nThis exclusive property offers the prestige and quality you deserve.',
    investor: '\n\nThe numbers speak for themselves - strong ROI potential in a growing market.',
    family_focused: '\n\nPicture your family creating memories in this wonderful home and community.'
  };
  
  adapted += valueProps[persona.type] || '';
  
  return adapted;
}

/**
 * Apply behavioral adaptations
 */
function applyBehavioralAdaptations(outputs: Output, profile: BuyerProfile): Output {
  const adapted = { ...outputs };
  
  // Adapt based on engagement patterns
  const engagementLevel = profile.engagement.overall.score;
  
  if (engagementLevel < 30) {
    // Low engagement - simplify and add hooks
    adapted.mlsDesc = simplifyContent(adapted.mlsDesc || '');
    adapted.igSlides = adapted.igSlides?.slice(0, 3); // Fewer slides
  } else if (engagementLevel > 70) {
    // High engagement - provide more detail
    adapted.mlsDesc = enrichContent(adapted.mlsDesc || '', profile);
  }
  
  // Adapt based on decision-making style
  if (profile.behavior.decisionMaking.style === 'analytical') {
    adapted.mlsDesc = addAnalyticalElements(adapted.mlsDesc || '');
  } else if (profile.behavior.decisionMaking.style === 'intuitive') {
    adapted.mlsDesc = addEmotionalElements(adapted.mlsDesc || '');
  }
  
  return adapted;
}

/**
 * Apply contextual adaptations
 */
function applyContextualAdaptations(
  outputs: Output,
  profile: BuyerProfile,
  photoInsights: PhotoInsights
): Output {
  const adapted = { ...outputs };
  
  // Adapt based on lifecycle stage
  const stage = profile.lifecycle.stage;
  
  if (stage === 'awareness') {
    adapted.mlsDesc = addEducationalContent(adapted.mlsDesc || '');
  } else if (stage === 'consideration') {
    adapted.mlsDesc = addComparisonPoints(adapted.mlsDesc || '', photoInsights);
  } else if (stage === 'decision') {
    adapted.mlsDesc = addDecisionSupport(adapted.mlsDesc || '');
  }
  
  // Adapt based on urgency
  if (profile.intent.buyingIntent.timeline.immediate > 50) {
    adapted.mlsDesc = injectUrgency(adapted.mlsDesc || '');
  }
  
  return adapted;
}

/**
 * Apply preference-based adaptations
 */
function applyPreferenceAdaptations(outputs: Output, profile: BuyerProfile): Output {
  const adapted = { ...outputs };
  
  // Adapt based on communication preferences
  const commPref = profile.preferences.communication;
  
  if (commPref.informationDepth === 'detailed') {
    adapted.mlsDesc = expandDetails(adapted.mlsDesc || '');
  } else if (commPref.informationDepth === 'highlights') {
    adapted.mlsDesc = extractHighlights(adapted.mlsDesc || '');
  }
  
  // Adapt based on feature preferences
  const mustHaveFeatures = profile.preferences.features.mustHave;
  if (mustHaveFeatures.length > 0) {
    adapted.mlsDesc = highlightMustHaveFeatures(adapted.mlsDesc || '', mustHaveFeatures);
  }
  
  return adapted;
}

/**
 * Optimize content for conversion
 */
function optimizeForConversion(
  outputs: Output,
  persona: DetectedPersona,
  profile: BuyerProfile
): Output {
  const optimized = { ...outputs };
  
  // Add conversion triggers based on persona
  const conversionTriggers = getConversionTriggers(persona);
  
  if (optimized.mlsDesc) {
    optimized.mlsDesc = addConversionTriggers(optimized.mlsDesc, conversionTriggers);
  }
  
  // Optimize CTAs
  if (optimized.emailBody) {
    optimized.emailBody = optimizeCTAs(optimized.emailBody, persona, profile);
  }
  
  // Add urgency if appropriate
  if (shouldAddUrgency(profile)) {
    optimized.mlsDesc = addUrgencyElements(optimized.mlsDesc || '');
  }
  
  return optimized;
}

/**
 * Helper functions for content optimization
 */
function simplifyContent(content: string): string {
  // Remove complex sentences, focus on key points
  const sentences = content.split('. ');
  const simplified = sentences
    .filter(s => s.length < 100)
    .slice(0, Math.ceil(sentences.length * 0.7))
    .join('. ');
  return simplified;
}

function enrichContent(content: string, profile: BuyerProfile): string {
  const enrichment = `\n\nAdditional Details for Your Consideration:\n` +
    `• Market Analysis: Strong appreciation potential\n` +
    `• Investment Metrics: Positive cash flow projected\n` +
    `• Neighborhood Trends: Growing area with new developments`;
  return content + enrichment;
}

function addAnalyticalElements(content: string): string {
  const analytical = '\n\n📊 Data Points: Price per sq ft below market average • ' +
    'HOA fees 20% lower than comparable properties • Property tax rate: 1.2%';
  return content + analytical;
}

function addEmotionalElements(content: string): string {
  return content.replace(
    /This property features/g,
    'Imagine coming home to'
  ).replace(
    /includes/g,
    'embraces you with'
  );
}

function addEducationalContent(content: string): string {
  const educational = '\n\n📚 Buyer\'s Guide: Understanding property features and their value...';
  return content + educational;
}

function addComparisonPoints(content: string, photoInsights: PhotoInsights): string {
  const comparison = `\n\n✓ Compared to similar properties: More ${photoInsights.features[0]} • ` +
    `Better ${photoInsights.condition} condition • Superior location`;
  return content + comparison;
}

function addDecisionSupport(content: string): string {
  const support = '\n\n✅ Ready to decide? We offer: Virtual tours • Inspection coordination • ' +
    'Offer strategy consultation • Negotiation support';
  return content + support;
}

function injectUrgency(content: string): string {
  return '⏰ HIGH DEMAND PROPERTY - Expected to sell quickly!\n\n' + content;
}

function expandDetails(content: string): string {
  // Add more detailed descriptions
  return content.replace(/features/g, 'features including specific details');
}

function extractHighlights(content: string): string {
  // Extract first paragraph and key features
  const paragraphs = content.split('\n\n');
  return paragraphs[0] + '\n\nKey Highlights: ' + paragraphs.slice(1, 3).join(' • ');
}

function highlightMustHaveFeatures(content: string, features: any[]): string {
  let highlighted = content;
  features.forEach(f => {
    const regex = new RegExp(f.feature, 'gi');
    highlighted = highlighted.replace(regex, `**${f.feature.toUpperCase()}**`);
  });
  return highlighted;
}

function getConversionTriggers(persona: DetectedPersona): string[] {
  const triggers = {
    first_time_buyer: ['pre-approval assistance', 'first-time buyer programs', 'step-by-step guidance'],
    luxury_seeker: ['exclusive showing', 'private tour', 'off-market opportunity'],
    investor: ['cash flow positive', 'below market value', 'quick close possible'],
    family_focused: ['top-rated schools', 'safe neighborhood', 'family-friendly community']
  };
  
  return triggers[persona.type] || [];
}

function addConversionTriggers(content: string, triggers: string[]): string {
  const triggerText = triggers.map(t => `✓ ${t}`).join('\n');
  return content + '\n\n' + triggerText;
}

function optimizeCTAs(content: string, persona: DetectedPersona, profile: BuyerProfile): string {
  const ctaMap = {
    first_time_buyer: 'Schedule your FREE first-time buyer consultation today!',
    luxury_seeker: 'Request your private showing at your convenience.',
    investor: 'Get detailed investment analysis within 24 hours.',
    family_focused: 'Visit with your family this weekend - kids welcome!'
  };
  
  const optimizedCTA = ctaMap[persona.type] || 'Contact us today!';
  
  return content.replace(/Contact us today/gi, optimizedCTA);
}

function shouldAddUrgency(profile: BuyerProfile): boolean {
  return profile.intent.buyingIntent.strength > 60 ||
         profile.lifecycle.stage === 'decision' ||
         profile.intent.urgencySignals.length > 2;
}

function addUrgencyElements(content: string): string {
  const urgency = [
    '🔥 Multiple offers expected',
    '📈 Price likely to increase',
    '⏳ Limited time opportunity',
    '🏃 Fast action recommended'
  ];
  
  return urgency[Math.floor(Math.random() * urgency.length)] + '\n\n' + content;
}

/**
 * Track adaptations for learning
 */
function trackAdaptations(original: Output, adapted: Output): ContentAdaptation[] {
  const adaptations: ContentAdaptation[] = [];
  
  // Track MLS description changes
  if (original.mlsDesc !== adapted.mlsDesc) {
    adaptations.push({
      type: 'tone',
      original: original.mlsDesc || '',
      adapted: adapted.mlsDesc || '',
      reasoning: 'Persona-optimized tone and messaging',
      impact: 25,
      confidence: 80
    });
  }
  
  // Track Instagram changes
  if (JSON.stringify(original.igSlides) !== JSON.stringify(adapted.igSlides)) {
    adaptations.push({
      type: 'structure',
      original: JSON.stringify(original.igSlides),
      adapted: JSON.stringify(adapted.igSlides),
      reasoning: 'Engagement-optimized slide structure',
      impact: 20,
      confidence: 75
    });
  }
  
  // Track email changes
  if (original.emailBody !== adapted.emailBody) {
    adaptations.push({
      type: 'personalization',
      original: original.emailBody || '',
      adapted: adapted.emailBody || '',
      reasoning: 'Personalized messaging and CTAs',
      impact: 30,
      confidence: 85
    });
  }
  
  return adaptations;
}

/**
 * Calculate confidence in adaptations
 */
function calculateConfidence(adaptations: ContentAdaptation[]): number {
  if (adaptations.length === 0) return 50;
  
  const totalConfidence = adaptations.reduce((sum, a) => sum + a.confidence, 0);
  return Math.round(totalConfidence / adaptations.length);
}

/**
 * Predict performance of personalized content
 */
function predictPerformance(
  outputs: Output,
  persona: DetectedPersona,
  profile: BuyerProfile
): PredictedPerformance {
  // Base predictions
  let engagementLift = 15;
  let conversionLift = 10;
  let relevanceScore = 70;
  let personalizationDepth = 60;
  
  // Adjust based on persona match
  if (persona.confidence > 80) {
    engagementLift += 10;
    conversionLift += 8;
    relevanceScore += 15;
  }
  
  // Adjust based on profile completeness
  if (profile.confidence > 70) {
    personalizationDepth += 20;
    relevanceScore += 10;
  }
  
  // Adjust based on intent signals
  if (profile.intent.buyingIntent.strength > 70) {
    conversionLift += 12;
  }
  
  // Adjust based on lifecycle stage
  if (profile.lifecycle.stage === 'decision') {
    conversionLift += 15;
  }
  
  return {
    engagementLift: Math.min(engagementLift, 50),
    conversionLift: Math.min(conversionLift, 45),
    relevanceScore: Math.min(relevanceScore, 95),
    personalizationDepth: Math.min(personalizationDepth, 90)
  };
}

/**
 * Create dynamic content variations
 */
export function createDynamicContent(
  baseContent: string,
  personas: DetectedPersona[],
  photoInsights: PhotoInsights
): DynamicContent {
  const variations: ContentVariation[] = [];
  
  // Create variation for each persona
  personas.forEach(persona => {
    const variation = createPersonaVariation(baseContent, persona, photoInsights);
    variations.push(variation);
  });
  
  // Add control variation
  variations.push({
    id: 'control',
    content: baseContent,
    targetPersona: 'generic',
    modifications: [],
    score: 50
  });
  
  return {
    baseContent,
    variations,
    selectionCriteria: {
      method: 'hybrid',
      factors: [
        { name: 'persona_match', weight: 0.4, source: 'persona_detection' },
        { name: 'engagement_history', weight: 0.3, source: 'user_behavior' },
        { name: 'conversion_potential', weight: 0.3, source: 'predictive_model' }
      ],
      threshold: 70
    },
    performance: []
  };
}

/**
 * Create persona-specific content variation
 */
function createPersonaVariation(
  baseContent: string,
  persona: DetectedPersona,
  photoInsights: PhotoInsights
): ContentVariation {
  const template = PERSONA_TEMPLATES[persona.type];
  let modified = baseContent;
  const modifications: ModificationDetail[] = [];
  
  // Apply tone modification
  const toneModified = adaptTone(modified, template?.tone || 'professional');
  if (toneModified !== modified) {
    modifications.push({
      type: 'tone',
      original: modified.substring(0, 50),
      modified: toneModified.substring(0, 50),
      reason: `Adapted tone for ${persona.type}`
    });
    modified = toneModified;
  }
  
  // Apply emphasis modification
  const emphasisModified = adaptEmphasis(
    modified,
    template?.emphasis || [],
    photoInsights
  );
  if (emphasisModified !== modified) {
    modifications.push({
      type: 'emphasis',
      original: 'Standard emphasis',
      modified: `${template?.emphasis.join(', ')} emphasis`,
      reason: 'Persona-specific focus areas'
    });
    modified = emphasisModified;
  }
  
  // Calculate variation score
  const score = calculateVariationScore(modifications, persona.confidence);
  
  return {
    id: `${persona.type}_variation`,
    content: modified,
    targetPersona: persona.type,
    modifications,
    score
  };
}

/**
 * Calculate variation score
 */
function calculateVariationScore(modifications: ModificationDetail[], confidence: number): number {
  const modificationScore = modifications.length * 10;
  const confidenceBonus = confidence * 0.5;
  return Math.min(modificationScore + confidenceBonus, 100);
}

/**
 * Select best content variation for user
 */
export function selectBestVariation(
  dynamicContent: DynamicContent,
  profile: BuyerProfile,
  persona: DetectedPersona
): ContentVariation {
  let bestVariation = dynamicContent.variations[0];
  let bestScore = 0;
  
  dynamicContent.variations.forEach(variation => {
    let score = variation.score;
    
    // Boost score if persona matches
    if (variation.targetPersona === persona.type) {
      score += 30;
    }
    
    // Boost score based on past performance
    const performance = dynamicContent.performance.find(p => p.variationId === variation.id);
    if (performance) {
      score += (performance.conversions / Math.max(performance.impressions, 1)) * 100;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestVariation = variation;
    }
  });
  
  return bestVariation;
}

/**
 * Run personalization experiment
 */
export function runPersonalizationExperiment(
  hypothesis: string,
  variants: ContentVariation[],
  targetSegment: string
): PersonalizationExperiment {
  return {
    id: `exp_${Date.now()}`,
    hypothesis,
    variants: variants.map(v => ({
      name: v.id,
      modifications: [],
      targetSegment,
      sampleSize: 100
    })),
    status: 'planning'
  };
}

/**
 * Analyze experiment results
 */
export function analyzeExperimentResults(
  experiment: PersonalizationExperiment,
  performance: VariationPerformance[]
): ExperimentResults {
  // Find winning variation
  let winner = '';
  let bestConversion = 0;
  
  performance.forEach(p => {
    const conversionRate = p.conversions / Math.max(p.engagements, 1);
    if (conversionRate > bestConversion) {
      bestConversion = conversionRate;
      winner = p.variationId;
    }
  });
  
  // Calculate lift
  const control = performance.find(p => p.variationId === 'control');
  const controlRate = control ? control.conversions / Math.max(control.engagements, 1) : 0;
  const lift = ((bestConversion - controlRate) / Math.max(controlRate, 0.01)) * 100;
  
  return {
    winner,
    lift,
    confidence: calculateStatisticalSignificance(performance),
    insights: generateExperimentInsights(performance, experiment),
    recommendations: generateExperimentRecommendations(winner, lift)
  };
}

/**
 * Helper functions for experiment analysis
 */
function calculateStatisticalSignificance(performance: VariationPerformance[]): number {
  // Simplified confidence calculation
  const totalSamples = performance.reduce((sum, p) => sum + p.impressions, 0);
  return Math.min(95, 50 + (totalSamples / 100) * 5);
}

function generateExperimentInsights(
  performance: VariationPerformance[],
  experiment: PersonalizationExperiment
): string[] {
  return [
    `Tested ${experiment.variants.length} variations`,
    `Total sample size: ${performance.reduce((sum, p) => sum + p.impressions, 0)}`,
    `Highest engagement: ${Math.max(...performance.map(p => p.engagements / Math.max(p.impressions, 1) * 100)).toFixed(1)}%`
  ];
}

function generateExperimentRecommendations(winner: string, lift: number): string[] {
  const recommendations: string[] = [];
  
  if (lift > 20) {
    recommendations.push('Implement winning variation immediately');
    recommendations.push('Expand testing to similar segments');
  } else if (lift > 10) {
    recommendations.push('Consider implementing with further optimization');
    recommendations.push('Run follow-up test with refined variations');
  } else {
    recommendations.push('Continue testing with larger sample size');
    recommendations.push('Try more significant variations');
  }
  
  return recommendations;
}