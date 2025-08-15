/**
 * Decision stage content generation system
 * Focuses on urgency creation, social proof, and scheduling CTAs to drive immediate action
 */

import type { PhotoInsights } from './photoAnalysis';
import type { Facts } from './schemas';
import type { BuyerJourneyContent } from './buyerJourneyMapping';

export interface DecisionContent {
  urgencyMessaging: UrgencyMessaging;
  socialProofContent: SocialProofContent;
  schedulingCTAs: SchedulingCTA[];
  scarcityFactors: ScarcityFactor[];
  riskMitigation: RiskMitigation;
  closingSupport: ClosingSupport;
  competitiveAdvantage: CompetitiveAdvantage;
  finalPushStrategies: FinalPushStrategy[];
}

export interface UrgencyMessaging {
  immediateUrgency: ImmediateUrgency[];
  marketUrgency: MarketUrgency[];
  opportunityUrgency: OpportunityUrgency[];
  competitionUrgency: CompetitionUrgency[];
  seasonalUrgency: SeasonalUrgency[];
  personalUrgency: PersonalUrgency[];
}

export interface ImmediateUrgency {
  trigger: string;
  message: string;
  timeframe: string;
  actionRequired: string;
  consequence: string;
}

export interface MarketUrgency {
  marketCondition: string;
  impact: string;
  timeline: string;
  buyerAdvantage: string;
  riskOfDelay: string;
}

export interface OpportunityUrgency {
  opportunity: string;
  rarity: string;
  timeLimit: string;
  uniqueAspect: string;
  lossRisk: string;
}

export interface CompetitionUrgency {
  competitorActivity: string;
  buyerInterest: string;
  actionNeeded: string;
  competitiveEdge: string;
  timingCritical: string;
}

export interface SeasonalUrgency {
  season: string;
  marketDynamic: string;
  buyerBenefit: string;
  timingOptimal: string;
  seasonalRisk: string;
}

export interface PersonalUrgency {
  personalSituation: string;
  urgencyFactor: string;
  benefitOfAction: string;
  costOfDelay: string;
  emotionalTrigger: string;
}

export interface SocialProofContent {
  clientTestimonials: ClientTestimonial[];
  successStories: SuccessStory[];
  expertEndorsements: ExpertEndorsement[];
  marketValidation: MarketValidation[];
  peerExperiences: PeerExperience[];
  industryRecognition: IndustryRecognition[];
}

export interface ClientTestimonial {
  clientType: string;
  situation: string;
  testimonial: string;
  outcome: string;
  timeframe: string;
  relevance: string;
  credibility: string;
}

export interface SuccessStory {
  scenario: string;
  challenge: string;
  solution: string;
  result: string;
  clientBenefit: string;
  lessonsLearned: string[];
  applicability: string;
}

export interface ExpertEndorsement {
  expert: string;
  credentials: string;
  endorsement: string;
  context: string;
  validation: string;
}

export interface MarketValidation {
  validationType: string;
  evidence: string;
  source: string;
  implication: string;
  buyerRelevance: string;
}

export interface PeerExperience {
  peerGroup: string;
  experience: string;
  outcome: string;
  recommendation: string;
  similarity: string;
}

export interface IndustryRecognition {
  recognition: string;
  authority: string;
  significance: string;
  buyerBenefit: string;
  trustFactor: string;
}

export interface SchedulingCTA {
  ctaType: 'immediate' | 'priority' | 'convenient' | 'exclusive';
  urgencyLevel: 'high' | 'medium' | 'low';
  primaryMessage: string;
  supportingMessage: string;
  actionVerb: string;
  timeframe: string;
  incentive?: string;
  scarcityElement?: string;
  nextSteps: string[];
}

export interface ScarcityFactor {
  scarcityType: 'time' | 'inventory' | 'opportunity' | 'access' | 'pricing';
  description: string;
  evidenceSupport: string;
  impactOnBuyer: string;
  urgencyCreated: string;
  callToAction: string;
}

export interface RiskMitigation {
  buyerConcerns: BuyerConcern[];
  riskReductions: RiskReduction[];
  guarantees: Guarantee[];
  safeguards: Safeguard[];
  contingencyPlans: ContingencyPlan[];
}

export interface BuyerConcern {
  concern: string;
  frequency: 'common' | 'occasional' | 'rare';
  severity: 'high' | 'medium' | 'low';
  category: 'financial' | 'quality' | 'timing' | 'market' | 'personal';
  mitigation: string;
  reassurance: string;
}

export interface RiskReduction {
  risk: string;
  reductionStrategy: string;
  implementation: string;
  buyerBenefit: string;
  confidence: string;
}

export interface Guarantee {
  guaranteeType: string;
  coverage: string;
  terms: string;
  buyerProtection: string;
  confidence: string;
}

export interface Safeguard {
  safeguardType: string;
  protection: string;
  process: string;
  buyerAdvantage: string;
  peace_of_mind: string;
}

export interface ContingencyPlan {
  scenario: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  contingency: string;
  buyerProtection: string;
}

export interface ClosingSupport {
  processGuidance: ProcessGuidance[];
  documentationSupport: DocumentationSupport[];
  timelineManagement: TimelineManagement;
  problemResolution: ProblemResolution[];
  finalWalkthrough: FinalWalkthrough;
}

export interface ProcessGuidance {
  phase: string;
  description: string;
  buyerRole: string;
  agentSupport: string;
  timeline: string;
  keyMilestones: string[];
}

export interface DocumentationSupport {
  documentType: string;
  purpose: string;
  agentAssistance: string;
  buyerPreparation: string;
  timeline: string;
}

export interface TimelineManagement {
  totalTimeframe: string;
  criticalMilestones: CriticalMilestone[];
  bufferTime: string;
  accelerationOptions: string[];
  riskFactors: string[];
}

export interface CriticalMilestone {
  milestone: string;
  timeframe: string;
  requirements: string[];
  dependencies: string[];
  consequences: string;
}

export interface ProblemResolution {
  problemType: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  resolution: string;
  prevention: string;
  buyerProtection: string;
}

export interface FinalWalkthrough {
  purpose: string;
  timing: string;
  checklist: string[];
  agentRole: string;
  buyerPreparation: string;
  issueResolution: string;
}

export interface CompetitiveAdvantage {
  agentAdvantages: AgentAdvantage[];
  serviceAdvantages: ServiceAdvantage[];
  processAdvantages: ProcessAdvantage[];
  outcomeAdvantages: OutcomeAdvantage[];
  relationshipAdvantages: RelationshipAdvantage[];
}

export interface AgentAdvantage {
  advantage: string;
  description: string;
  buyerBenefit: string;
  evidence: string;
  differentiation: string;
}

export interface ServiceAdvantage {
  service: string;
  uniqueAspect: string;
  buyerValue: string;
  competitorComparison: string;
  delivery: string;
}

export interface ProcessAdvantage {
  processArea: string;
  improvement: string;
  efficiency: string;
  buyerExperience: string;
  outcomeImpact: string;
}

export interface OutcomeAdvantage {
  outcome: string;
  superiority: string;
  measurement: string;
  buyerSatisfaction: string;
  longTermValue: string;
}

export interface RelationshipAdvantage {
  relationship: string;
  depth: string;
  benefit: string;
  ongoing: string;
  trust: string;
}

export interface FinalPushStrategy {
  strategy: string;
  trigger: string;
  timing: string;
  approach: string;
  message: string;
  expectedOutcome: string;
  fallbackOption: string;
}

/**
 * Generate decision stage content focused on immediate action
 */
export function generateDecisionContent(
  facts: Facts,
  photoInsights: PhotoInsights,
  buyerJourney: BuyerJourneyContent
): DecisionContent {
  const persona = buyerJourney.personaAlignment.primaryPersona;
  const urgencyTriggers = photoInsights.urgencyTriggers || [];
  
  // Generate urgency messaging
  const urgencyMessaging = generateUrgencyMessaging(facts, photoInsights, persona);
  
  // Create social proof content
  const socialProofContent = generateSocialProofContent(facts, photoInsights, persona);
  
  // Build scheduling CTAs
  const schedulingCTAs = generateSchedulingCTAs(persona, urgencyTriggers);
  
  // Create scarcity factors
  const scarcityFactors = generateScarcityFactors(facts, photoInsights);
  
  // Build risk mitigation
  const riskMitigation = generateRiskMitigation(persona);
  
  // Create closing support
  const closingSupport = generateClosingSupport(persona);
  
  // Build competitive advantage
  const competitiveAdvantage = generateCompetitiveAdvantage(facts, photoInsights);
  
  // Create final push strategies
  const finalPushStrategies = generateFinalPushStrategies(persona, urgencyTriggers);
  
  return {
    urgencyMessaging,
    socialProofContent,
    schedulingCTAs,
    scarcityFactors,
    riskMitigation,
    closingSupport,
    competitiveAdvantage,
    finalPushStrategies
  };
}

/**
 * Generate comprehensive urgency messaging
 */
function generateUrgencyMessaging(facts: Facts, photoInsights: PhotoInsights, persona: string): UrgencyMessaging {
  const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
  const neighborhood = facts.neighborhood || 'this location';
  
  return {
    immediateUrgency: [
      {
        trigger: 'Other buyer interest',
        message: 'This property is generating significant interest from other qualified buyers',
        timeframe: 'Next 24-48 hours',
        actionRequired: 'Submit competitive offer immediately',
        consequence: 'Risk losing opportunity to other buyers'
      },
      {
        trigger: 'Market momentum',
        message: `Properties with ${headlineFeature} are selling quickly in current market`,
        timeframe: 'Within days of listing',
        actionRequired: 'Move quickly with decision and offer',
        consequence: 'Extended search for similar quality property'
      }
    ],
    marketUrgency: [
      {
        marketCondition: 'Low inventory of comparable properties',
        impact: 'Limited alternatives with similar features and quality',
        timeline: 'Current market cycle',
        buyerAdvantage: 'Secure rare find before market tightens further',
        riskOfDelay: 'Fewer quality options and increased competition'
      },
      {
        marketCondition: 'Seasonal market timing',
        impact: 'Optimal buying conditions and seller motivation',
        timeline: 'Current season advantage',
        buyerAdvantage: 'Better negotiating position and terms',
        riskOfDelay: 'Loss of seasonal market advantages'
      }
    ],
    opportunityUrgency: [
      {
        opportunity: `Rare combination of ${headlineFeature} and prime location`,
        rarity: 'This feature set rarely becomes available in this market',
        timeLimit: 'Once sold, may not see similar opportunity for months',
        uniqueAspect: 'Specific feature combination and condition quality',
        lossRisk: 'Extended search time for comparable property'
      }
    ],
    competitionUrgency: [
      {
        competitorActivity: 'Multiple qualified buyers viewing property',
        buyerInterest: 'High level of serious buyer engagement',
        actionNeeded: 'Present strong, clean offer quickly',
        competitiveEdge: 'First competitive offer has best position',
        timingCritical: 'Delays reduce competitive advantage'
      }
    ],
    seasonalUrgency: [
      {
        season: 'Current buying season',
        marketDynamic: 'Optimal market conditions for buyers',
        buyerBenefit: 'Better selection and negotiating position',
        timingOptimal: 'Market timing favors decisive action',
        seasonalRisk: 'Seasonal window of opportunity'
      }
    ],
    personalUrgency: generatePersonalUrgency(persona, facts)
  };
}

/**
 * Generate personal urgency based on buyer persona
 */
function generatePersonalUrgency(persona: string, facts: Facts): PersonalUrgency[] {
  const urgencyMap = {
    'First-Time Home Buyers': [
      {
        personalSituation: 'Transitioning from renting to ownership',
        urgencyFactor: 'Building equity instead of paying rent',
        benefitOfAction: 'Start building wealth and stability immediately',
        costOfDelay: 'Continued rent payments without equity building',
        emotionalTrigger: 'Pride of homeownership and financial progress'
      }
    ],
    'Growing Families': [
      {
        personalSituation: 'Children growing and needing stable environment',
        urgencyFactor: 'Optimal timing for family stability and school enrollment',
        benefitOfAction: 'Settled family environment and community roots',
        costOfDelay: 'Continued disruption and uncertainty for family',
        emotionalTrigger: 'Providing best environment for children'
      }
    ],
    'Urban Professionals': [
      {
        personalSituation: 'Career advancement and lifestyle upgrade timing',
        urgencyFactor: 'Professional success demands suitable living environment',
        benefitOfAction: 'Living space that supports career and lifestyle goals',
        costOfDelay: 'Continued compromise on living standards and convenience',
        emotionalTrigger: 'Living space that reflects professional success'
      }
    ],
    'Real Estate Investors': [
      {
        personalSituation: 'Investment window and market timing',
        urgencyFactor: 'Current market conditions favor property investment',
        benefitOfAction: 'Secure investment with strong return potential',
        costOfDelay: 'Missing optimal investment timing and opportunity',
        emotionalTrigger: 'Portfolio growth and financial advancement'
      }
    ],
    'Affluent Lifestyle Seekers': [
      {
        personalSituation: 'Lifestyle enhancement and luxury living goals',
        urgencyFactor: 'Rare opportunity for exclusive living experience',
        benefitOfAction: 'Immediate elevation to desired lifestyle level',
        costOfDelay: 'Continued search for luxury property meeting standards',
        emotionalTrigger: 'Living the luxury lifestyle you\'ve earned'
      }
    ]
  };
  
  return urgencyMap[persona] || urgencyMap['First-Time Home Buyers'];
}

/**
 * Generate social proof content for credibility and confidence
 */
function generateSocialProofContent(facts: Facts, photoInsights: PhotoInsights, persona: string): SocialProofContent {
  return {
    clientTestimonials: [
      {
        clientType: persona,
        situation: 'Similar property search and purchase',
        testimonial: 'Working with this agent made all the difference. They helped us navigate multiple offers and secure our dream home in a competitive market.',
        outcome: 'Successful purchase of ideal property',
        timeframe: 'Closed within 30 days',
        relevance: 'Directly applicable to current buyer situation',
        credibility: 'Verified recent client with documented success'
      },
      {
        clientType: 'Previous buyer in same market',
        situation: 'Competitive market property purchase',
        testimonial: 'The market expertise and negotiation skills were exceptional. We got a great property at a fair price despite multiple competing offers.',
        outcome: 'Won competitive bidding situation',
        timeframe: 'Recent market transaction',
        relevance: 'Same market conditions and competition',
        credibility: 'Documented transaction with verifiable results'
      }
    ],
    successStories: [
      {
        scenario: 'Multiple offer situation with strategic positioning',
        challenge: 'Competing against cash offers with financing',
        solution: 'Strategic offer structure and seller appeal optimization',
        result: 'Won competition despite not being highest price',
        clientBenefit: 'Secured dream home at reasonable price',
        lessonsLearned: ['Strategy matters more than just price', 'Professional expertise crucial in competition'],
        applicability: 'Directly relevant to current competitive market'
      }
    ],
    expertEndorsements: [
      {
        expert: 'Local market authority',
        credentials: 'Recognized real estate market expert',
        endorsement: 'Exceptional knowledge of local market dynamics and buyer advocacy',
        context: 'Industry recognition for professional excellence',
        validation: 'Peer and client recognition consistently'
      }
    ],
    marketValidation: [
      {
        validationType: 'Market performance data',
        evidence: 'Consistent track record of successful buyer representation',
        source: 'MLS transaction records and client outcomes',
        implication: 'Proven ability to deliver results in any market',
        buyerRelevance: 'Same expertise applied to your transaction'
      }
    ],
    peerExperiences: [
      {
        peerGroup: `Other ${persona.toLowerCase()}`,
        experience: 'Successful property purchase with professional guidance',
        outcome: 'Satisfied homeownership and investment results',
        recommendation: 'Strongly recommend working with experienced professional',
        similarity: 'Similar buyer profile and goals'
      }
    ],
    industryRecognition: [
      {
        recognition: 'Professional excellence awards and certifications',
        authority: 'Industry organizations and peer recognition',
        significance: 'Demonstrated commitment to client success',
        buyerBenefit: 'Higher level of professional service and expertise',
        trustFactor: 'Third-party validation of professional capabilities'
      }
    ]
  };
}

/**
 * Generate scheduling CTAs with varying urgency levels
 */
function generateSchedulingCTAs(persona: string, urgencyTriggers: string[]): SchedulingCTA[] {
  return [
    {
      ctaType: 'immediate',
      urgencyLevel: 'high',
      primaryMessage: 'Schedule Your Priority Showing Today',
      supportingMessage: 'Don\'t let this opportunity pass to another buyer',
      actionVerb: 'Secure',
      timeframe: 'Today or tomorrow',
      incentive: 'First priority on showings and offer submission',
      scarcityElement: 'Limited showing availability due to buyer interest',
      nextSteps: [
        'Immediate showing confirmation',
        'Financing pre-approval verification',
        'Offer strategy discussion',
        'Same-day offer submission if desired'
      ]
    },
    {
      ctaType: 'priority',
      urgencyLevel: 'medium',
      primaryMessage: 'Reserve Your Showing This Week',
      supportingMessage: 'Quality properties move quickly in this market',
      actionVerb: 'Reserve',
      timeframe: 'Within 2-3 days',
      incentive: 'Comprehensive property analysis included',
      nextSteps: [
        'Confirmed showing appointment',
        'Market analysis preparation',
        'Financing guidance if needed',
        'Decision timeline discussion'
      ]
    },
    {
      ctaType: 'convenient',
      urgencyLevel: 'low',
      primaryMessage: 'Schedule Your Convenient Viewing',
      supportingMessage: 'See why this property is generating interest',
      actionVerb: 'Schedule',
      timeframe: 'This week',
      nextSteps: [
        'Flexible showing arrangement',
        'Property information packet',
        'Market context discussion',
        'Q&A and guidance session'
      ]
    }
  ];
}

/**
 * Generate scarcity factors to drive urgency
 */
function generateScarcityFactors(facts: Facts, photoInsights: PhotoInsights): ScarcityFactor[] {
  const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
  
  return [
    {
      scarcityType: 'inventory',
      description: `Very limited inventory with ${headlineFeature} in this market`,
      evidenceSupport: 'Market analysis shows fewer than 3 comparable properties available',
      impactOnBuyer: 'Rare opportunity that may not repeat for months',
      urgencyCreated: 'Act now to secure this unique combination of features',
      callToAction: 'Schedule immediate viewing to secure this rare find'
    },
    {
      scarcityType: 'opportunity',
      description: 'Optimal market timing for buyers won\'t last indefinitely',
      evidenceSupport: 'Current market conditions favor buyer negotiating position',
      impactOnBuyer: 'Future market shifts may reduce buyer advantages',
      urgencyCreated: 'Capitalize on current favorable market timing',
      callToAction: 'Move quickly while market conditions remain optimal'
    },
    {
      scarcityType: 'time',
      description: 'Properties with this quality typically sell within days',
      evidenceSupport: 'Historical data shows fast sales for similar properties',
      impactOnBuyer: 'Delay increases risk of losing to other buyers',
      urgencyCreated: 'Time sensitivity demands immediate decision',
      callToAction: 'Submit offer within 24-48 hours of viewing'
    }
  ];
}

/**
 * Generate risk mitigation strategies
 */
function generateRiskMitigation(persona: string): RiskMitigation {
  return {
    buyerConcerns: [
      {
        concern: 'Making wrong decision under pressure',
        frequency: 'common',
        severity: 'high',
        category: 'personal',
        mitigation: 'Comprehensive guidance and no-pressure consultation approach',
        reassurance: 'Full support for informed decision-making at your pace'
      },
      {
        concern: 'Overpaying in competitive market',
        frequency: 'common',
        severity: 'high',
        category: 'financial',
        mitigation: 'Detailed market analysis and comparative value assessment',
        reassurance: 'Professional pricing guidance ensures fair market value'
      }
    ],
    riskReductions: [
      {
        risk: 'Property condition issues',
        reductionStrategy: 'Professional inspection with qualified inspectors',
        implementation: 'Comprehensive inspection process and expert review',
        buyerBenefit: 'Complete property condition transparency',
        confidence: 'Full disclosure and professional assessment'
      }
    ],
    guarantees: [
      {
        guaranteeType: 'Professional service satisfaction',
        coverage: 'Complete satisfaction with service quality and outcomes',
        terms: 'Commitment to buyer advocacy and successful transaction',
        buyerProtection: 'Professional standards and ethical obligations',
        confidence: 'Track record of client satisfaction and success'
      }
    ],
    safeguards: [
      {
        safeguardType: 'Transaction contingencies',
        protection: 'Built-in protection periods and exit strategies',
        process: 'Professional contingency period management',
        buyerAdvantage: 'Multiple protection points throughout process',
        peace_of_mind: 'Security and flexibility during transaction'
      }
    ],
    contingencyPlans: [
      {
        scenario: 'Inspection reveals significant issues',
        probability: 'low',
        impact: 'medium',
        contingency: 'Negotiate repairs, credits, or price adjustment',
        buyerProtection: 'Full right to withdraw or renegotiate terms'
      }
    ]
  };
}

/**
 * Generate closing support framework
 */
function generateClosingSupport(persona: string): ClosingSupport {
  return {
    processGuidance: [
      {
        phase: 'Offer acceptance to inspection',
        description: 'Property inspection and initial due diligence',
        buyerRole: 'Schedule inspections and review findings',
        agentSupport: 'Coordinate inspections and interpret results',
        timeline: '7-10 days',
        keyMilestones: ['Professional inspection', 'Inspection review', 'Negotiation if needed']
      },
      {
        phase: 'Financing finalization',
        description: 'Complete loan approval and underwriting',
        buyerRole: 'Provide required documentation promptly',
        agentSupport: 'Coordinate with lender and expedite process',
        timeline: '2-3 weeks',
        keyMilestones: ['Appraisal completion', 'Underwriting approval', 'Clear to close']
      }
    ],
    documentationSupport: [
      {
        documentType: 'Purchase agreement and addenda',
        purpose: 'Legal framework for transaction terms',
        agentAssistance: 'Complete preparation and explanation',
        buyerPreparation: 'Review and understand all terms',
        timeline: 'Immediate upon offer acceptance'
      }
    ],
    timelineManagement: {
      totalTimeframe: '30-45 days from offer to closing',
      criticalMilestones: [
        {
          milestone: 'Inspection completion',
          timeframe: 'Within 7-10 days',
          requirements: ['Inspector scheduling', 'Property access'],
          dependencies: ['Seller cooperation', 'Inspector availability'],
          consequences: 'Timeline delays if not completed promptly'
        }
      ],
      bufferTime: 'Built-in flexibility for unexpected delays',
      accelerationOptions: ['Expedited inspections', 'Rush loan processing'],
      riskFactors: ['Appraisal delays', 'Lender processing time', 'Title issues']
    },
    problemResolution: [
      {
        problemType: 'Inspection issues',
        likelihood: 'medium',
        impact: 'medium',
        resolution: 'Negotiate repair credits or price adjustments',
        prevention: 'Thorough pre-inspection property review',
        buyerProtection: 'Full contingency period protection'
      }
    ],
    finalWalkthrough: {
      purpose: 'Verify property condition before closing',
      timing: '24-48 hours before closing',
      checklist: ['Verify agreed repairs completed', 'Check property condition', 'Test systems and appliances'],
      agentRole: 'Coordinate and attend walkthrough',
      buyerPreparation: 'Review repair agreements and inspection items',
      issueResolution: 'Immediate issue resolution or closing delay if needed'
    }
  };
}

/**
 * Generate competitive advantage messaging
 */
function generateCompetitiveAdvantage(facts: Facts, photoInsights: PhotoInsights): CompetitiveAdvantage {
  return {
    agentAdvantages: [
      {
        advantage: 'Local market expertise',
        description: `Deep knowledge of ${facts.neighborhood || 'local'} market dynamics`,
        buyerBenefit: 'Insider insights and strategic advantages',
        evidence: 'Track record of successful transactions in area',
        differentiation: 'Superior market knowledge vs. general agents'
      }
    ],
    serviceAdvantages: [
      {
        service: 'Comprehensive buyer advocacy',
        uniqueAspect: 'Complete representation and protection throughout process',
        buyerValue: 'Professional advocacy and guidance at every step',
        competitorComparison: 'More thorough and protective than standard service',
        delivery: 'Proactive communication and support throughout transaction'
      }
    ],
    processAdvantages: [
      {
        processArea: 'Transaction management',
        improvement: 'Streamlined and efficient process management',
        efficiency: 'Faster timelines with fewer complications',
        buyerExperience: 'Smoother, less stressful transaction experience',
        outcomeImpact: 'Higher success rate and satisfaction'
      }
    ],
    outcomeAdvantages: [
      {
        outcome: 'Successful transaction completion',
        superiority: 'Higher success rate in competitive markets',
        measurement: 'Track record of closed transactions vs. fall-throughs',
        buyerSatisfaction: 'Consistently high client satisfaction ratings',
        longTermValue: 'Ongoing relationship and future support'
      }
    ],
    relationshipAdvantages: [
      {
        relationship: 'Long-term client partnership',
        depth: 'Beyond transaction relationship into ongoing support',
        benefit: 'Continued guidance and market insights',
        ongoing: 'Future real estate needs and referrals',
        trust: 'Established trust and proven performance'
      }
    ]
  };
}

/**
 * Generate final push strategies for decision conversion
 */
function generateFinalPushStrategies(persona: string, urgencyTriggers: string[]): FinalPushStrategy[] {
  return [
    {
      strategy: 'Last chance urgency',
      trigger: 'End of optimal timing window',
      timing: 'When other buyers are actively engaged',
      approach: 'Direct but supportive urgency communication',
      message: 'This opportunity requires immediate decision to avoid loss to competition',
      expectedOutcome: 'Immediate offer submission or clear decline',
      fallbackOption: 'Maintain relationship for future opportunities'
    },
    {
      strategy: 'Value reinforcement with social proof',
      trigger: 'Buyer hesitation or uncertainty',
      timing: 'During decision consideration period',
      approach: 'Combine value restatement with success stories',
      message: 'Similar clients who acted quickly secured their dream homes and avoided extended searches',
      expectedOutcome: 'Renewed confidence and decision momentum',
      fallbackOption: 'Address specific concerns individually'
    },
    {
      strategy: 'Professional recommendation',
      trigger: 'Request for professional opinion',
      timing: 'When buyer seeks agent guidance',
      approach: 'Clear professional recommendation with reasoning',
      message: 'Based on my market expertise and your stated needs, I strongly recommend moving forward',
      expectedOutcome: 'Buyer confidence in professional guidance',
      fallbackOption: 'Respect buyer decision while maintaining support'
    }
  ];
}

/**
 * Validate decision content meets conversion standards
 */
export function validateDecisionContent(content: DecisionContent): {
  isValid: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;
  
  // Urgency messaging validation
  if (!content.urgencyMessaging.immediateUrgency.length ||
      !content.urgencyMessaging.marketUrgency.length) {
    issues.push('Insufficient urgency messaging variety');
    score -= 20;
  }
  
  // Social proof validation
  if (!content.socialProofContent.clientTestimonials.length ||
      !content.socialProofContent.successStories.length) {
    issues.push('Missing critical social proof elements');
    score -= 15;
  }
  
  // Scheduling CTAs validation
  if (!content.schedulingCTAs.length || content.schedulingCTAs.length < 2) {
    issues.push('Insufficient scheduling CTA options');
    score -= 15;
  }
  
  // Scarcity factors validation
  if (!content.scarcityFactors.length || content.scarcityFactors.length < 2) {
    issues.push('Missing scarcity factor messaging');
    score -= 10;
  }
  
  // Risk mitigation validation
  if (!content.riskMitigation.buyerConcerns.length ||
      !content.riskMitigation.riskReductions.length) {
    issues.push('Incomplete risk mitigation strategy');
    score -= 10;
  }
  
  // Closing support validation
  if (!content.closingSupport.processGuidance.length ||
      !content.closingSupport.timelineManagement) {
    issues.push('Missing closing support framework');
    score -= 10;
  }
  
  // Competitive advantage validation
  if (!content.competitiveAdvantage.agentAdvantages.length ||
      !content.competitiveAdvantage.serviceAdvantages.length) {
    issues.push('Insufficient competitive advantage messaging');
    score -= 10;
  }
  
  // Final push strategies validation
  if (!content.finalPushStrategies.length || content.finalPushStrategies.length < 2) {
    issues.push('Missing final conversion strategies');
    score -= 10;
  }
  
  return {
    isValid: issues.length <= 2 && score >= 75,
    issues,
    score: Math.max(0, score)
  };
}