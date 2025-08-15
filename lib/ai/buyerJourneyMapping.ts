/**
 * Buyer journey mapping and stage-aware content generation system
 * Maps content to awareness, consideration, and decision stages for optimal conversion
 */

import type { PhotoInsights } from './photoAnalysis';
import type { Facts } from './schemas';

export interface BuyerJourneyContent {
  awarenessStage: StageContent;
  considerationStage: StageContent;
  decisionStage: StageContent;
  journeyMap: JourneyMap;
  stageTransitions: StageTransition[];
  personaAlignment: PersonaAlignment;
  conversionPath: ConversionPath;
  touchpointOptimization: TouchpointOptimization;
}

export interface StageContent {
  stage: 'awareness' | 'consideration' | 'decision';
  primaryGoal: string;
  contentTypes: ContentType[];
  messagingFocus: string[];
  emotionalTriggers: string[];
  informationNeeds: string[];
  contentExamples: ContentExample[];
  successMetrics: string[];
  nextStageIndicators: string[];
}

export type PersonalizationLevel = 'high' | 'medium' | 'low' | 'very high';

export interface ContentType {
  format: string;
  purpose: string;
  deliveryMethod: string;
  frequency: string;
  personalization: PersonalizationLevel;
}

export interface ContentExample {
  title: string;
  description: string;
  keyMessages: string[];
  callToAction: string;
  expectedOutcome: string;
}

export interface JourneyMap {
  totalStages: number;
  averageDuration: string;
  criticalTouchpoints: Touchpoint[];
  decisionFactors: DecisionFactor[];
  painPoints: PainPoint[];
  opportunityMoments: OpportunityMoment[];
}

export interface Touchpoint {
  stage: 'awareness' | 'consideration' | 'decision';
  channel: string;
  interaction: string;
  importance: 'critical' | 'important' | 'supportive';
  optimization: string;
}

export interface DecisionFactor {
  factor: string;
  stage: 'awareness' | 'consideration' | 'decision';
  influence: 'high' | 'medium' | 'low';
  contentStrategy: string;
}

export interface PainPoint {
  stage: 'awareness' | 'consideration' | 'decision';
  issue: string;
  impact: 'high' | 'medium' | 'low';
  solution: string;
  contentResponse: string;
}

export interface OpportunityMoment {
  stage: 'awareness' | 'consideration' | 'decision';
  trigger: string;
  opportunity: string;
  contentStrategy: string;
  timing: string;
}

export interface StageTransition {
  fromStage: 'awareness' | 'consideration';
  toStage: 'consideration' | 'decision';
  triggers: string[];
  content: string;
  timeline: string;
}

export interface PersonaAlignment {
  primaryPersona: string;
  stageAlignment: {
    awareness: string;
    consideration: string;
    decision: string;
  };
  contentPreferences: ContentPreference[];
}

export interface ContentPreference {
  stage: 'awareness' | 'consideration' | 'decision';
  preferredFormats: string[];
  informationDepth: 'overview' | 'detailed' | 'comprehensive';
  decisionCriteria: string[];
}

export interface ConversionPath {
  entryPoints: EntryPoint[];
  progressionSteps: ProgressionStep[];
  conversionMoments: ConversionMoment[];
  fallbackStrategies: FallbackStrategy[];
}

export interface EntryPoint {
  source: string;
  stage: 'awareness' | 'consideration' | 'decision';
  content: string;
  followUpSequence: string[];
}

export interface ProgressionStep {
  currentStage: 'awareness' | 'consideration' | 'decision';
  nextStage: 'consideration' | 'decision' | 'conversion';
  requirements: string[];
  content: string;
  timeline: string;
}

export interface ConversionMoment {
  stage: 'consideration' | 'decision';
  trigger: string;
  content: string;
  urgency: 'immediate' | 'short_term' | 'long_term';
}

export interface FallbackStrategy {
  scenario: string;
  stage: 'awareness' | 'consideration' | 'decision';
  strategy: string;
  content: string;
}

export interface TouchpointOptimization {
  digitalTouchpoints: DigitalTouchpoint[];
  personalTouchpoints: PersonalTouchpoint[];
  optimizationStrategy: OptimizationStrategy[];
}

export interface DigitalTouchpoint {
  platform: string;
  stage: 'awareness' | 'consideration' | 'decision';
  content: string;
  optimization: string;
  measurement: string;
}

export interface PersonalTouchpoint {
  interaction: string;
  stage: 'awareness' | 'consideration' | 'decision';
  purpose: string;
  preparation: string;
  followUp: string;
}

export interface OptimizationStrategy {
  touchpoint: string;
  currentPerformance: string;
  targetImprovement: string;
  tactics: string[];
  measurement: string;
}

/**
 * Generate buyer journey mapping from property and market data
 */
export function buildBuyerJourney(
  facts: Facts,
  photoInsights?: PhotoInsights
): BuyerJourneyContent {
  // Determine primary persona for journey mapping
  const primaryPersona = determinePrimaryPersona(facts, photoInsights);
  
  // Create stage-specific content strategies
  const awarenessStage = buildAwarenessStage(facts, primaryPersona, photoInsights);
  const considerationStage = buildConsiderationStage(facts, primaryPersona, photoInsights);
  const decisionStage = buildDecisionStage(facts, primaryPersona, photoInsights);
  
  // Map the complete buyer journey
  const journeyMap = createJourneyMap(facts, primaryPersona, photoInsights);
  
  // Define stage transitions
  const stageTransitions = defineStageTransitions(primaryPersona, journeyMap);
  
  // Align content with persona preferences
  const personaAlignment = alignWithPersona(primaryPersona, [awarenessStage, considerationStage, decisionStage]);
  
  // Create conversion path optimization
  const conversionPath = buildConversionPath(facts, journeyMap, photoInsights);
  
  // Optimize touchpoints across journey
  const touchpointOptimization = optimizeTouchpoints(journeyMap, conversionPath);
  
  return {
    awarenessStage,
    considerationStage,
    decisionStage,
    journeyMap,
    stageTransitions,
    personaAlignment,
    conversionPath,
    touchpointOptimization
  };
}

/**
 * Determine primary buyer persona from property characteristics
 */
function determinePrimaryPersona(facts: Facts, photoInsights?: PhotoInsights): string {
  // Luxury properties attract affluent buyers
  if (photoInsights?.propertyCategory === 'luxury') {
    return 'Affluent Lifestyle Seekers';
  }
  
  // Investment properties attract investors
  if (photoInsights?.propertyCategory === 'investment') {
    return 'Real Estate Investors';
  }
  
  // Family homes attract growing families
  if (parseInt(facts.beds || '0') >= 3) {
    return 'Growing Families';
  }
  
  // Condos/smaller properties attract urban professionals
  if (facts.propertyType?.toLowerCase().includes('condo') || parseInt(facts.beds || '0') <= 2) {
    return 'Urban Professionals';
  }
  
  // First-time buyer market
  return 'First-Time Home Buyers';
}

/**
 * Build awareness stage content strategy
 */
function buildAwarenessStage(facts: Facts, persona: string, photoInsights?: PhotoInsights): StageContent {
  const neighborhood = facts.neighborhood || 'the area';
  
  return {
    stage: 'awareness',
    primaryGoal: 'Educate and build trust while introducing market opportunities',
    contentTypes: [
      {
        format: 'Market Reports',
        purpose: 'Establish expertise and provide valuable insights',
        deliveryMethod: 'Email newsletter, social media, blog posts',
        frequency: 'Weekly',
        personalization: 'high'
      },
      {
        format: 'Neighborhood Guides',
        purpose: 'Showcase local knowledge and community benefits',
        deliveryMethod: 'Video tours, interactive maps, downloadable guides',
        frequency: 'Monthly',
        personalization: 'medium'
      },
      {
        format: 'Educational Content',
        purpose: 'Address common questions and concerns',
        deliveryMethod: 'Blog articles, social media posts, video tips',
        frequency: 'Bi-weekly',
        personalization: 'low'
      }
    ],
    messagingFocus: [
      `Understanding ${neighborhood} market trends`,
      'Home buying process education',
      'Local community insights and amenities',
      'Market timing and opportunity awareness',
      'Professional guidance and support availability'
    ],
    emotionalTriggers: [
      'Curiosity about local market',
      'Desire for expert guidance',
      'Interest in community lifestyle',
      'Aspiration for homeownership',
      'Trust in professional expertise'
    ],
    informationNeeds: [
      'Local market conditions and trends',
      'Neighborhood characteristics and amenities',
      'Home buying process overview',
      'Financing options and requirements',
      'Timeline and planning considerations'
    ],
    contentExamples: [
      {
        title: `${neighborhood} Market Spotlight: What Buyers Need to Know`,
        description: 'Monthly market analysis with trends, pricing, and opportunities',
        keyMessages: ['Market stability', 'Growth potential', 'Best buying opportunities'],
        callToAction: 'Download full market report',
        expectedOutcome: 'Establish expertise and capture leads'
      },
      {
        title: 'Complete Guide to Home Buying in 2024',
        description: 'Step-by-step educational series for prospective buyers',
        keyMessages: ['Process clarity', 'Timeline expectations', 'Professional support'],
        callToAction: 'Subscribe for the complete series',
        expectedOutcome: 'Build trust and nurture prospects'
      }
    ],
    successMetrics: [
      'Email open rates >25%',
      'Content engagement rates >5%',
      'Lead capture conversion >3%',
      'Social media follows growth',
      'Website session duration >2 minutes'
    ],
    nextStageIndicators: [
      'Downloads market-specific content',
      'Engages with property-specific posts',
      'Requests neighborhood information',
      'Attends virtual market events',
      'Responds to targeted outreach'
    ]
  };
}

/**
 * Build consideration stage content strategy
 */
function buildConsiderationStage(facts: Facts, persona: string, photoInsights?: PhotoInsights): StageContent {
  const propertyType = facts.propertyType || 'home';
  const features = photoInsights?.features || [];
  
  return {
    stage: 'consideration',
    primaryGoal: 'Demonstrate value and differentiation while building preference',
    contentTypes: [
      {
        format: 'Property Comparisons',
        purpose: 'Show value proposition and competitive advantages',
        deliveryMethod: 'Detailed comparison sheets, video walkthroughs',
        frequency: 'Per property inquiry',
        personalization: 'high'
      },
      {
        format: 'Lifestyle Showcases',
        purpose: 'Connect features to emotional benefits and lifestyle',
        deliveryMethod: 'Virtual tours, lifestyle videos, photo galleries',
        frequency: 'Weekly property features',
        personalization: 'high'
      },
      {
        format: 'Value Propositions',
        purpose: 'Articulate investment value and long-term benefits',
        deliveryMethod: 'ROI analysis, market projections, case studies',
        frequency: 'Monthly market updates',
        personalization: 'medium'
      }
    ],
    messagingFocus: [
      'Unique property features and advantages',
      'Lifestyle benefits and emotional connections',
      'Investment value and growth potential',
      'Competitive positioning in market',
      'Professional service differentiation'
    ],
    emotionalTriggers: [
      'Excitement about potential lifestyle',
      'Confidence in investment decision',
      'Pride of ownership anticipation',
      'Security and stability desires',
      'Trust in agent expertise'
    ],
    informationNeeds: [
      'Detailed property features and benefits',
      'Comparative market analysis',
      'Neighborhood lifestyle and amenities',
      'Investment potential and projections',
      'Service quality and professional support'
    ],
    contentExamples: [
      {
        title: `Why This ${propertyType} Stands Out: Complete Property Analysis`,
        description: 'Detailed comparison showing unique value proposition',
        keyMessages: ['Distinctive features', 'Market positioning', 'Investment value'],
        callToAction: 'Schedule private showing',
        expectedOutcome: 'Generate showing appointments'
      },
      {
        title: 'Lifestyle Preview: Living in Your New Home',
        description: 'Visual tour connecting features to lifestyle benefits',
        keyMessages: ['Daily life scenarios', 'Entertainment potential', 'Family benefits'],
        callToAction: 'Experience the lifestyle - book your tour',
        expectedOutcome: 'Emotional connection and urgency'
      }
    ],
    successMetrics: [
      'Showing appointments booked >40%',
      'Property-specific inquiries increase',
      'Comparison content engagement >8%',
      'Follow-up response rates >60%',
      'Referral quality improvements'
    ],
    nextStageIndicators: [
      'Requests property showing',
      'Inquires about pricing and terms',
      'Asks about neighborhood specifics',
      'Discusses financing options',
      'Shows urgency in communication'
    ]
  };
}

/**
 * Build decision stage content strategy
 */
function buildDecisionStage(facts: Facts, persona: string, photoInsights?: PhotoInsights): StageContent {
  const urgencyTriggers = photoInsights?.urgencyTriggers || ['Market conditions favor buyers who act quickly'];
  
  return {
    stage: 'decision',
    primaryGoal: 'Drive immediate action and facilitate transaction completion',
    contentTypes: [
      {
        format: 'Urgency Communications',
        purpose: 'Create appropriate pressure and timeline awareness',
        deliveryMethod: 'Personalized emails, direct calls, market updates',
        frequency: 'As needed based on market conditions',
        personalization: 'very high'
      },
      {
        format: 'Social Proof Content',
        purpose: 'Build confidence through testimonials and success stories',
        deliveryMethod: 'Client testimonials, case studies, success stories',
        frequency: 'Weekly during active consideration',
        personalization: 'high'
      },
      {
        format: 'Process Facilitation',
        purpose: 'Remove friction and guide through transaction steps',
        deliveryMethod: 'Checklists, timeline guides, process updates',
        frequency: 'Daily during transaction',
        personalization: 'very high'
      }
    ],
    messagingFocus: [
      'Limited availability and market timing',
      'Exclusive opportunity and competitive advantage',
      'Professional support and guidance assurance',
      'Transaction process clarity and confidence',
      'Outcome satisfaction and success prediction'
    ],
    emotionalTriggers: [
      'Fear of missing perfect opportunity',
      'Confidence in decision quality',
      'Excitement about ownership transition',
      'Security in professional guidance',
      'Pride in smart investment choice'
    ],
    informationNeeds: [
      'Market timing and availability status',
      'Competitive landscape and positioning',
      'Transaction process and timeline',
      'Professional support and guidance',
      'Success probability and outcomes'
    ],
    contentExamples: [
      {
        title: 'Market Alert: Properties Like This Are Moving Fast',
        description: 'Urgent communication about market conditions and timing',
        keyMessages: urgencyTriggers,
        callToAction: 'Schedule immediate showing or secure with offer',
        expectedOutcome: 'Immediate action and offer submission'
      },
      {
        title: 'Success Story: How We Secured the Perfect Home',
        description: 'Client testimonial showing successful outcome',
        keyMessages: ['Professional guidance', 'Successful negotiation', 'Client satisfaction'],
        callToAction: 'Let us help you achieve the same success',
        expectedOutcome: 'Confidence building and commitment'
      }
    ],
    successMetrics: [
      'Offer submission rate >70%',
      'Transaction completion rate >85%',
      'Client satisfaction score >9/10',
      'Referral generation >30%',
      'Repeat business rate >40%'
    ],
    nextStageIndicators: [
      'Submits purchase offer',
      'Completes transaction process',
      'Provides testimonial',
      'Refers other prospects',
      'Engages for future transactions'
    ]
  };
}

/**
 * Create comprehensive journey map
 */
function createJourneyMap(facts: Facts, persona: string, photoInsights?: PhotoInsights): JourneyMap {
  return {
    totalStages: 3,
    averageDuration: determineAverageDuration(persona, photoInsights?.propertyCategory),
    criticalTouchpoints: [
      {
        stage: 'awareness',
        channel: 'Email marketing',
        interaction: 'Market report subscription',
        importance: 'critical',
        optimization: 'Increase value proposition and personalization'
      },
      {
        stage: 'consideration',
        channel: 'Property tour',
        interaction: 'In-person or virtual showing',
        importance: 'critical',
        optimization: 'Enhance lifestyle visualization and emotional connection'
      },
      {
        stage: 'decision',
        channel: 'Personal consultation',
        interaction: 'Offer preparation and negotiation',
        importance: 'critical',
        optimization: 'Streamline process and increase confidence'
      }
    ],
    decisionFactors: [
      {
        factor: 'Property features and condition',
        stage: 'consideration',
        influence: 'high',
        contentStrategy: 'Detailed feature showcases with lifestyle benefits'
      },
      {
        factor: 'Price and investment value',
        stage: 'decision',
        influence: 'high',
        contentStrategy: 'Comparative market analysis and ROI projections'
      },
      {
        factor: 'Agent expertise and trust',
        stage: 'awareness',
        influence: 'high',
        contentStrategy: 'Authority building through market insights and testimonials'
      }
    ],
    painPoints: [
      {
        stage: 'awareness',
        issue: 'Information overload and market confusion',
        impact: 'medium',
        solution: 'Curated, personalized market insights',
        contentResponse: 'Simplified market summaries with clear takeaways'
      },
      {
        stage: 'consideration',
        issue: 'Difficulty comparing options and values',
        impact: 'high',
        solution: 'Clear comparison frameworks and value propositions',
        contentResponse: 'Side-by-side comparisons with decision criteria'
      },
      {
        stage: 'decision',
        issue: 'Fear of making wrong choice or overpaying',
        impact: 'high',
        solution: 'Professional validation and market evidence',
        contentResponse: 'Market data, testimonials, and guarantee assurances'
      }
    ],
    opportunityMoments: [
      {
        stage: 'awareness',
        trigger: 'Life change event (job, family, financial)',
        opportunity: 'Positioning as trusted advisor for transition',
        contentStrategy: 'Personalized transition guides and support',
        timing: 'Immediate upon trigger identification'
      },
      {
        stage: 'consideration',
        trigger: 'Market shift or new inventory',
        opportunity: 'First access to new opportunities',
        contentStrategy: 'Exclusive previews and early access programs',
        timing: 'Within 24 hours of market change'
      },
      {
        stage: 'decision',
        trigger: 'Competing offers or market pressure',
        opportunity: 'Professional negotiation and strategy',
        contentStrategy: 'Market positioning and competitive strategy',
        timing: 'Real-time during negotiation process'
      }
    ]
  };
}

/**
 * Determine average journey duration based on persona and property type
 */
function determineAverageDuration(persona: string, propertyCategory?: string): string {
  if (persona === 'Real Estate Investors') {
    return '2-4 weeks';
  } else if (persona === 'Affluent Lifestyle Seekers') {
    return '3-6 months';
  } else if (persona === 'First-Time Home Buyers') {
    return '6-12 months';
  } else {
    return '3-6 months';
  }
}

/**
 * Define stage transition strategies
 */
function defineStageTransitions(persona: string, journeyMap: JourneyMap): StageTransition[] {
  return [
    {
      fromStage: 'awareness',
      toStage: 'consideration',
      triggers: [
        'Downloads property-specific content',
        'Engages with market analysis',
        'Requests neighborhood information',
        'Attends virtual events'
      ],
      content: 'Personalized property recommendations with lifestyle benefits',
      timeline: '2-4 weeks from first engagement'
    },
    {
      fromStage: 'consideration',
      toStage: 'decision',
      triggers: [
        'Schedules property showing',
        'Requests detailed property information',
        'Inquires about pricing and terms',
        'Shows urgency in communication'
      ],
      content: 'Market positioning, competitive analysis, and urgency messaging',
      timeline: '1-2 weeks from serious consideration'
    }
  ];
}

/**
 * Align content strategy with persona preferences
 */
function alignWithPersona(persona: string, stages: StageContent[]): PersonaAlignment {
  const alignmentStrategy = getPersonaAlignment(persona);
  
  return {
    primaryPersona: persona,
    stageAlignment: {
      awareness: alignmentStrategy.awareness,
      consideration: alignmentStrategy.consideration,
      decision: alignmentStrategy.decision
    },
    contentPreferences: stages.map(stage => ({
      stage: stage.stage,
      preferredFormats: getPreferredFormats(persona, stage.stage),
      informationDepth: getInformationDepth(persona, stage.stage),
      decisionCriteria: getDecisionCriteria(persona, stage.stage)
    }))
  };
}

/**
 * Get persona-specific alignment strategy
 */
function getPersonaAlignment(persona: string): { awareness: string; consideration: string; decision: string } {
  const alignments = {
    'First-Time Home Buyers': {
      awareness: 'Educational focus with process guidance and market basics',
      consideration: 'Detailed comparisons with clear value explanations',
      decision: 'Strong support with confidence building and process assistance'
    },
    'Growing Families': {
      awareness: 'Lifestyle and community focused content',
      consideration: 'Family benefit emphasis with safety and amenity focus',
      decision: 'Timeline coordination with family needs and school districts'
    },
    'Urban Professionals': {
      awareness: 'Efficient, data-driven market insights',
      consideration: 'Investment value and convenience factors',
      decision: 'Quick decision support with minimal friction'
    },
    'Real Estate Investors': {
      awareness: 'Market opportunity identification and trend analysis',
      consideration: 'ROI analysis and investment potential focus',
      decision: 'Financial structuring and portfolio optimization'
    },
    'Affluent Lifestyle Seekers': {
      awareness: 'Luxury market insights and exclusive opportunities',
      consideration: 'Lifestyle enhancement and status positioning',
      decision: 'White-glove service with discretion and exclusivity'
    }
  };
  
  return alignments[persona] || alignments['First-Time Home Buyers'];
}

/**
 * Get preferred content formats by persona and stage
 */
function getPreferredFormats(persona: string, stage: 'awareness' | 'consideration' | 'decision'): string[] {
  const formatPreferences = {
    'First-Time Home Buyers': {
      awareness: ['Educational blog posts', 'Video tutorials', 'Email newsletters'],
      consideration: ['Property comparisons', 'Virtual tours', 'Detailed guides'],
      decision: ['Personal consultations', 'Process checklists', 'Timeline guides']
    },
    'Real Estate Investors': {
      awareness: ['Market reports', 'Data analysis', 'Investment newsletters'],
      consideration: ['ROI calculators', 'Financial projections', 'Market analysis'],
      decision: ['Deal structuring', 'Portfolio analysis', 'Market timing']
    }
  };
  
  return formatPreferences[persona]?.[stage] || ['Email content', 'Social media', 'Direct communication'];
}

/**
 * Get information depth preference by persona and stage
 */
function getInformationDepth(persona: string, stage: 'awareness' | 'consideration' | 'decision'): 'overview' | 'detailed' | 'comprehensive' {
  if (persona === 'Real Estate Investors') {
    return stage === 'awareness' ? 'detailed' : 'comprehensive';
  } else if (persona === 'First-Time Home Buyers') {
    return stage === 'awareness' ? 'overview' : 'detailed';
  } else {
    return 'detailed';
  }
}

/**
 * Get decision criteria by persona and stage
 */
function getDecisionCriteria(persona: string, stage: 'awareness' | 'consideration' | 'decision'): string[] {
  const criteria = {
    'First-Time Home Buyers': {
      awareness: ['Market understanding', 'Process clarity', 'Expert guidance'],
      consideration: ['Affordability', 'Neighborhood safety', 'Future value'],
      decision: ['Financing approval', 'Inspection results', 'Agent support']
    },
    'Growing Families': {
      awareness: ['School districts', 'Family amenities', 'Community safety'],
      consideration: ['Space requirements', 'Yard/outdoor space', 'Neighborhood kids'],
      decision: ['Move-in timeline', 'Family disruption', 'Long-term suitability']
    }
  };
  
  return criteria[persona]?.[stage] || ['Value', 'Quality', 'Timing'];
}

/**
 * Build conversion path optimization
 */
function buildConversionPath(facts: Facts, journeyMap: JourneyMap, photoInsights?: PhotoInsights): ConversionPath {
  return {
    entryPoints: [
      {
        source: 'Social media advertising',
        stage: 'awareness',
        content: 'Market insight posts and property highlights',
        followUpSequence: ['Email welcome series', 'Market report delivery', 'Personalized outreach']
      },
      {
        source: 'Property listing inquiry',
        stage: 'consideration',
        content: 'Detailed property information and comparison',
        followUpSequence: ['Showing scheduling', 'Lifestyle presentation', 'Value proposition']
      },
      {
        source: 'Referral introduction',
        stage: 'consideration',
        content: 'Personal introduction with testimonial',
        followUpSequence: ['Needs assessment', 'Property matching', 'Immediate showing']
      }
    ],
    progressionSteps: [
      {
        currentStage: 'awareness',
        nextStage: 'consideration',
        requirements: ['Email engagement', 'Content downloads', 'Inquiry submission'],
        content: 'Personalized property recommendations',
        timeline: '2-4 weeks'
      },
      {
        currentStage: 'consideration',
        nextStage: 'decision',
        requirements: ['Property showing', 'Detailed discussions', 'Financing pre-approval'],
        content: 'Urgency messaging and competitive positioning',
        timeline: '1-2 weeks'
      }
    ],
    conversionMoments: [
      {
        stage: 'consideration',
        trigger: 'Property showing completion',
        content: 'Immediate follow-up with value reinforcement',
        urgency: 'immediate'
      },
      {
        stage: 'decision',
        trigger: 'Competing offers or market pressure',
        content: 'Strategic positioning and decision support',
        urgency: 'immediate'
      }
    ],
    fallbackStrategies: [
      {
        scenario: 'Low engagement in awareness stage',
        stage: 'awareness',
        strategy: 'Increase personalization and value proposition',
        content: 'Highly targeted content based on specific interests'
      },
      {
        scenario: 'Extended consideration without progression',
        stage: 'consideration',
        strategy: 'Address specific concerns and add social proof',
        content: 'Testimonials and success stories with similar concerns'
      }
    ]
  };
}

/**
 * Optimize touchpoints across the buyer journey
 */
function optimizeTouchpoints(journeyMap: JourneyMap, conversionPath: ConversionPath): TouchpointOptimization {
  return {
    digitalTouchpoints: [
      {
        platform: 'Email marketing',
        stage: 'awareness',
        content: 'Market insights and educational content',
        optimization: 'Increase personalization and segment by interests',
        measurement: 'Open rates, click-through rates, engagement time'
      },
      {
        platform: 'Social media',
        stage: 'consideration',
        content: 'Property showcases and lifestyle content',
        optimization: 'Use video content and interactive elements',
        measurement: 'Engagement rates, shares, inquiry generation'
      },
      {
        platform: 'Website/CRM',
        stage: 'decision',
        content: 'Detailed property information and process guides',
        optimization: 'Streamline user experience and reduce friction',
        measurement: 'Conversion rates, time to decision, satisfaction scores'
      }
    ],
    personalTouchpoints: [
      {
        interaction: 'Initial consultation call',
        stage: 'awareness',
        purpose: 'Understand needs and build relationship',
        preparation: 'Research background and market position',
        followUp: 'Personalized market analysis and property matching'
      },
      {
        interaction: 'Property showing',
        stage: 'consideration',
        purpose: 'Demonstrate value and create emotional connection',
        preparation: 'Property research and lifestyle presentation',
        followUp: 'Value reinforcement and next steps discussion'
      },
      {
        interaction: 'Offer negotiation',
        stage: 'decision',
        purpose: 'Secure best terms and facilitate transaction',
        preparation: 'Market analysis and negotiation strategy',
        followUp: 'Transaction management and satisfaction follow-up'
      }
    ],
    optimizationStrategy: [
      {
        touchpoint: 'Email marketing campaigns',
        currentPerformance: 'Average industry performance',
        targetImprovement: '25% increase in engagement',
        tactics: ['Advanced segmentation', 'Behavioral triggers', 'Personalized content'],
        measurement: 'Engagement rates, conversion to next stage'
      },
      {
        touchpoint: 'Property showing experience',
        currentPerformance: 'Standard presentation approach',
        targetImprovement: '40% increase in offer rate',
        tactics: ['Lifestyle visualization', 'Emotional storytelling', 'Urgency creation'],
        measurement: 'Showing to offer conversion rate'
      }
    ]
  };
}

/**
 * Validate buyer journey content strategy
 */
export function validateBuyerJourney(content: BuyerJourneyContent): {
  isValid: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;
  
  // Stage completeness validation
  const stages = [content.awarenessStage, content.considerationStage, content.decisionStage];
  stages.forEach((stage, index) => {
    if (!stage.contentTypes || stage.contentTypes.length < 2) {
      issues.push(`${stage.stage} stage needs more content type diversity`);
      score -= 10;
    }
    
    if (!stage.contentExamples || stage.contentExamples.length < 2) {
      issues.push(`${stage.stage} stage missing content examples`);
      score -= 10;
    }
  });
  
  // Journey map validation
  if (!content.journeyMap.criticalTouchpoints || content.journeyMap.criticalTouchpoints.length < 3) {
    issues.push('Journey map missing critical touchpoints');
    score -= 15;
  }
  
  // Stage transition validation
  if (!content.stageTransitions || content.stageTransitions.length < 2) {
    issues.push('Missing stage transition strategies');
    score -= 15;
  }
  
  // Persona alignment validation
  if (!content.personaAlignment.contentPreferences || content.personaAlignment.contentPreferences.length < 3) {
    issues.push('Insufficient persona alignment');
    score -= 10;
  }
  
  // Conversion path validation
  if (!content.conversionPath.entryPoints || content.conversionPath.entryPoints.length < 2) {
    issues.push('Limited conversion entry points');
    score -= 10;
  }
  
  // Touchpoint optimization validation
  if (!content.touchpointOptimization.digitalTouchpoints || 
      !content.touchpointOptimization.personalTouchpoints) {
    issues.push('Incomplete touchpoint optimization');
    score -= 10;
  }
  
  return {
    isValid: issues.length <= 2 && score >= 70,
    issues,
    score: Math.max(0, score)
  };
}