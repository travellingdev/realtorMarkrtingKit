/**
 * Dynamic persona detection from user interactions
 * Identifies buyer personas in real-time based on behavior patterns
 */

import type { PhotoInsights } from './photoAnalysis';
import type { InteractionEvent, BuyerProfile } from './buyerProfileOptimization';

export interface PersonaDetectionResult {
  primaryPersona: DetectedPersona;
  secondaryPersonas: DetectedPersona[];
  confidence: number;
  signals: PersonaSignal[];
  recommendations: PersonaRecommendation[];
  evolutionPath: PersonaEvolution;
}

export interface DetectedPersona {
  type: PersonaType;
  confidence: number;
  characteristics: PersonaCharacteristics;
  behaviors: PersonaBehaviors;
  preferences: PersonaPreferences;
  triggers: PersonaTriggers;
  matchScore: number;
}

export type PersonaType = 
  | 'first_time_buyer'
  | 'move_up_buyer'
  | 'luxury_seeker'
  | 'investor'
  | 'downsizer'
  | 'relocator'
  | 'family_focused'
  | 'urban_professional'
  | 'retiree'
  | 'flipper';

export interface PersonaCharacteristics {
  demographic: DemographicProfile;
  psychographic: PsychographicProfile;
  financial: FinancialProfile;
  lifestyle: LifestyleProfile;
}

export interface DemographicProfile {
  ageRange: { min: number; max: number };
  incomeRange: { min: number; max: number };
  familySize: number;
  educationLevel: string;
  occupation: string;
}

export interface PsychographicProfile {
  values: string[];
  motivations: string[];
  fears: string[];
  aspirations: string[];
  personality: PersonalityTraits;
}

export interface PersonalityTraits {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface FinancialProfile {
  budgetRange: { min: number; max: number };
  financingType: 'cash' | 'conventional' | 'fha' | 'va' | 'jumbo';
  downPaymentCapability: number;
  creditScore: 'excellent' | 'good' | 'fair' | 'poor';
  debtToIncome: number;
}

export interface LifestyleProfile {
  workStyle: 'remote' | 'hybrid' | 'office' | 'flexible';
  hobbies: string[];
  socialActivity: 'high' | 'medium' | 'low';
  travelFrequency: 'frequent' | 'occasional' | 'rare';
  entertainmentStyle: string[];
}

export interface PersonaBehaviors {
  searchPatterns: SearchPattern[];
  engagementStyle: EngagementStyle;
  decisionMaking: DecisionStyle;
  contentConsumption: ContentConsumptionPattern;
  communicationPreference: CommunicationStyle;
}

export interface SearchPattern {
  pattern: string;
  frequency: number;
  timeOfDay: string[];
  devices: string[];
  duration: number;
}

export interface EngagementStyle {
  depth: 'surface' | 'moderate' | 'deep';
  speed: 'quick' | 'moderate' | 'thorough';
  interaction: 'passive' | 'active' | 'highly_engaged';
  sharing: 'never' | 'selective' | 'frequent';
}

export interface DecisionStyle {
  approach: 'analytical' | 'intuitive' | 'collaborative' | 'cautious';
  speed: 'impulsive' | 'quick' | 'deliberate' | 'slow';
  influences: string[];
  riskTolerance: 'low' | 'medium' | 'high';
}

export interface ContentConsumptionPattern {
  preferredFormats: string[];
  consumptionTime: string[];
  attentionSpan: 'short' | 'medium' | 'long';
  detailOrientation: 'summary' | 'moderate' | 'comprehensive';
}

export interface CommunicationStyle {
  channels: string[];
  frequency: 'high' | 'medium' | 'low';
  tone: 'formal' | 'professional' | 'casual' | 'friendly';
  responseTime: 'immediate' | 'same_day' | 'flexible';
}

export interface PersonaPreferences {
  propertyTypes: PropertyPreference[];
  features: FeaturePreference[];
  locations: LocationPreference[];
  aesthetics: AestheticPreference;
  dealBreakers: string[];
}

export interface PropertyPreference {
  type: string;
  preference: number;
  reasons: string[];
}

export interface FeaturePreference {
  feature: string;
  importance: number;
  flexibility: number;
}

export interface LocationPreference {
  area: string;
  factors: string[];
  importance: number;
}

export interface AestheticPreference {
  styles: string[];
  eras: string[];
  colors: string[];
  materials: string[];
}

export interface PersonaTriggers {
  emotional: EmotionalTrigger[];
  logical: LogicalTrigger[];
  social: SocialTrigger[];
  urgency: UrgencyTrigger[];
}

export interface EmotionalTrigger {
  emotion: string;
  trigger: string;
  strength: number;
  response: string;
}

export interface LogicalTrigger {
  factor: string;
  importance: number;
  threshold: number;
  action: string;
}

export interface SocialTrigger {
  influence: string;
  source: string;
  impact: number;
  response: string;
}

export interface UrgencyTrigger {
  trigger: string;
  sensitivity: number;
  response: string;
  timeframe: string;
}

export interface PersonaSignal {
  signal: string;
  strength: number;
  source: string;
  timestamp: Date;
  confidence: number;
  implication: string;
}

export interface PersonaRecommendation {
  category: 'content' | 'communication' | 'timing' | 'channel' | 'offer';
  recommendation: string;
  rationale: string;
  expectedImpact: number;
  implementation: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface PersonaEvolution {
  currentStage: string;
  nextLikelyStage: string;
  probability: number;
  timeframe: string;
  triggers: string[];
  indicators: string[];
}

// Persona definitions with detailed characteristics
const PERSONA_DEFINITIONS: Record<PersonaType, PersonaDefinition> = {
  first_time_buyer: {
    characteristics: {
      demographic: {
        ageRange: { min: 25, max: 35 },
        incomeRange: { min: 50000, max: 100000 },
        familySize: 1.5,
        educationLevel: 'college',
        occupation: 'professional'
      },
      psychographic: {
        values: ['stability', 'achievement', 'independence'],
        motivations: ['building equity', 'life milestone', 'investment'],
        fears: ['overpaying', 'hidden problems', 'commitment'],
        aspirations: ['homeownership', 'financial growth', 'stability'],
        personality: {
          openness: 70,
          conscientiousness: 80,
          extraversion: 60,
          agreeableness: 70,
          neuroticism: 60
        }
      },
      financial: {
        budgetRange: { min: 200000, max: 400000 },
        financingType: 'conventional',
        downPaymentCapability: 10,
        creditScore: 'good',
        debtToIncome: 0.35
      },
      lifestyle: {
        workStyle: 'hybrid',
        hobbies: ['fitness', 'social'],
        socialActivity: 'medium',
        travelFrequency: 'occasional',
        entertainmentStyle: ['casual', 'friends']
      }
    },
    behaviors: {
      searchPatterns: [
        {
          pattern: 'educational content heavy',
          frequency: 85,
          timeOfDay: ['evening', 'weekend'],
          devices: ['mobile', 'desktop'],
          duration: 45
        }
      ],
      engagementStyle: {
        depth: 'deep',
        speed: 'thorough',
        interaction: 'active',
        sharing: 'selective'
      },
      decisionMaking: {
        approach: 'analytical',
        speed: 'deliberate',
        influences: ['data', 'expert advice', 'peer experiences'],
        riskTolerance: 'low'
      },
      contentConsumption: {
        preferredFormats: ['guides', 'calculators', 'comparisons'],
        consumptionTime: ['evening', 'lunch'],
        attentionSpan: 'long',
        detailOrientation: 'comprehensive'
      },
      communicationPreference: {
        channels: ['email', 'text'],
        frequency: 'high',
        tone: 'professional',
        responseTime: 'same_day'
      }
    },
    triggers: {
      emotional: [
        {
          emotion: 'excitement',
          trigger: 'perfect starter home',
          strength: 85,
          response: 'increased engagement'
        }
      ],
      logical: [
        {
          factor: 'monthly payment vs rent',
          importance: 90,
          threshold: 1.2,
          action: 'serious consideration'
        }
      ],
      social: [
        {
          influence: 'peer success stories',
          source: 'testimonials',
          impact: 75,
          response: 'increased confidence'
        }
      ],
      urgency: [
        {
          trigger: 'rising interest rates',
          sensitivity: 80,
          response: 'accelerated timeline',
          timeframe: '1-2 months'
        }
      ]
    }
  },
  move_up_buyer: {
    characteristics: {
      demographic: {
        ageRange: { min: 35, max: 50 },
        incomeRange: { min: 100000, max: 200000 },
        familySize: 3.5,
        educationLevel: 'college+',
        occupation: 'established professional'
      },
      psychographic: {
        values: ['family', 'quality', 'growth'],
        motivations: ['space needs', 'lifestyle upgrade', 'investment'],
        fears: ['market timing', 'contingent sale'],
        aspirations: ['dream home', 'family stability'],
        personality: {
          openness: 65,
          conscientiousness: 85,
          extraversion: 65,
          agreeableness: 75,
          neuroticism: 45
        }
      },
      financial: {
        budgetRange: { min: 400000, max: 700000 },
        financingType: 'conventional',
        downPaymentCapability: 20,
        creditScore: 'excellent',
        debtToIncome: 0.30
      },
      lifestyle: {
        workStyle: 'office',
        hobbies: ['family activities', 'home improvement'],
        socialActivity: 'high',
        travelFrequency: 'occasional',
        entertainmentStyle: ['family', 'entertaining']
      }
    },
    behaviors: {
      searchPatterns: [
        {
          pattern: 'specific feature focused',
          frequency: 70,
          timeOfDay: ['evening', 'morning'],
          devices: ['desktop', 'tablet'],
          duration: 30
        }
      ],
      engagementStyle: {
        depth: 'moderate',
        speed: 'moderate',
        interaction: 'active',
        sharing: 'frequent'
      },
      decisionMaking: {
        approach: 'collaborative',
        speed: 'deliberate',
        influences: ['family needs', 'resale value'],
        riskTolerance: 'medium'
      },
      contentConsumption: {
        preferredFormats: ['virtual tours', 'neighborhood guides'],
        consumptionTime: ['evening', 'weekend'],
        attentionSpan: 'medium',
        detailOrientation: 'moderate'
      },
      communicationPreference: {
        channels: ['phone', 'email'],
        frequency: 'medium',
        tone: 'friendly',
        responseTime: 'flexible'
      }
    },
    triggers: {
      emotional: [
        {
          emotion: 'aspiration',
          trigger: 'dream features',
          strength: 80,
          response: 'strong interest'
        }
      ],
      logical: [
        {
          factor: 'school ratings',
          importance: 95,
          threshold: 8,
          action: 'priority consideration'
        }
      ],
      social: [
        {
          influence: 'neighborhood reputation',
          source: 'community',
          impact: 85,
          response: 'increased interest'
        }
      ],
      urgency: [
        {
          trigger: 'school year timing',
          sensitivity: 90,
          response: 'immediate action',
          timeframe: '2-3 months'
        }
      ]
    }
  },
  luxury_seeker: {
    characteristics: {
      demographic: {
        ageRange: { min: 40, max: 65 },
        incomeRange: { min: 250000, max: 1000000 },
        familySize: 2.5,
        educationLevel: 'advanced degree',
        occupation: 'executive'
      },
      psychographic: {
        values: ['prestige', 'quality', 'exclusivity'],
        motivations: ['status', 'lifestyle', 'investment'],
        fears: ['poor craftsmanship', 'value depreciation'],
        aspirations: ['luxury lifestyle', 'social status'],
        personality: {
          openness: 75,
          conscientiousness: 90,
          extraversion: 70,
          agreeableness: 60,
          neuroticism: 35
        }
      },
      financial: {
        budgetRange: { min: 800000, max: 3000000 },
        financingType: 'jumbo',
        downPaymentCapability: 30,
        creditScore: 'excellent',
        debtToIncome: 0.25
      },
      lifestyle: {
        workStyle: 'flexible',
        hobbies: ['golf', 'wine', 'art'],
        socialActivity: 'high',
        travelFrequency: 'frequent',
        entertainmentStyle: ['formal', 'exclusive']
      }
    },
    behaviors: {
      searchPatterns: [
        {
          pattern: 'curated selection',
          frequency: 40,
          timeOfDay: ['morning', 'evening'],
          devices: ['desktop', 'tablet'],
          duration: 20
        }
      ],
      engagementStyle: {
        depth: 'surface',
        speed: 'quick',
        interaction: 'passive',
        sharing: 'never'
      },
      decisionMaking: {
        approach: 'intuitive',
        speed: 'quick',
        influences: ['exclusivity', 'brand', 'uniqueness'],
        riskTolerance: 'high'
      },
      contentConsumption: {
        preferredFormats: ['high-quality visuals', 'video tours'],
        consumptionTime: ['flexible'],
        attentionSpan: 'short',
        detailOrientation: 'summary'
      },
      communicationPreference: {
        channels: ['phone', 'in-person'],
        frequency: 'low',
        tone: 'formal',
        responseTime: 'immediate'
      }
    },
    triggers: {
      emotional: [
        {
          emotion: 'desire',
          trigger: 'exclusive features',
          strength: 95,
          response: 'immediate interest'
        }
      ],
      logical: [
        {
          factor: 'investment potential',
          importance: 70,
          threshold: 15,
          action: 'consideration'
        }
      ],
      social: [
        {
          influence: 'peer ownership',
          source: 'social circle',
          impact: 60,
          response: 'competitive interest'
        }
      ],
      urgency: [
        {
          trigger: 'unique opportunity',
          sensitivity: 85,
          response: 'immediate decision',
          timeframe: 'days'
        }
      ]
    }
  },
  investor: {
    characteristics: {
      demographic: {
        ageRange: { min: 35, max: 70 },
        incomeRange: { min: 150000, max: 500000 },
        familySize: 2,
        educationLevel: 'college+',
        occupation: 'business owner/investor'
      },
      psychographic: {
        values: ['roi', 'efficiency', 'growth'],
        motivations: ['profit', 'portfolio growth', 'passive income'],
        fears: ['negative cash flow', 'vacancy', 'maintenance'],
        aspirations: ['financial freedom', 'portfolio expansion'],
        personality: {
          openness: 80,
          conscientiousness: 85,
          extraversion: 55,
          agreeableness: 50,
          neuroticism: 40
        }
      },
      financial: {
        budgetRange: { min: 200000, max: 1000000 },
        financingType: 'conventional',
        downPaymentCapability: 25,
        creditScore: 'excellent',
        debtToIncome: 0.40
      },
      lifestyle: {
        workStyle: 'flexible',
        hobbies: ['investing', 'business'],
        socialActivity: 'medium',
        travelFrequency: 'occasional',
        entertainmentStyle: ['networking']
      }
    },
    behaviors: {
      searchPatterns: [
        {
          pattern: 'data-driven analysis',
          frequency: 90,
          timeOfDay: ['anytime'],
          devices: ['desktop'],
          duration: 60
        }
      ],
      engagementStyle: {
        depth: 'deep',
        speed: 'quick',
        interaction: 'highly_engaged',
        sharing: 'never'
      },
      decisionMaking: {
        approach: 'analytical',
        speed: 'quick',
        influences: ['numbers', 'market data', 'trends'],
        riskTolerance: 'high'
      },
      contentConsumption: {
        preferredFormats: ['spreadsheets', 'analytics', 'reports'],
        consumptionTime: ['anytime'],
        attentionSpan: 'long',
        detailOrientation: 'comprehensive'
      },
      communicationPreference: {
        channels: ['email', 'text'],
        frequency: 'low',
        tone: 'professional',
        responseTime: 'flexible'
      }
    },
    triggers: {
      emotional: [
        {
          emotion: 'opportunity',
          trigger: 'below market value',
          strength: 70,
          response: 'analysis mode'
        }
      ],
      logical: [
        {
          factor: 'cap rate',
          importance: 95,
          threshold: 8,
          action: 'deep analysis'
        }
      ],
      social: [
        {
          influence: 'market competition',
          source: 'other investors',
          impact: 50,
          response: 'competitive bidding'
        }
      ],
      urgency: [
        {
          trigger: 'market opportunity',
          sensitivity: 75,
          response: 'quick decision',
          timeframe: '24-48 hours'
        }
      ]
    }
  },
  family_focused: {
    characteristics: {
      demographic: {
        ageRange: { min: 30, max: 45 },
        incomeRange: { min: 80000, max: 150000 },
        familySize: 4,
        educationLevel: 'college',
        occupation: 'professional'
      },
      psychographic: {
        values: ['family', 'safety', 'community'],
        motivations: ['children needs', 'quality of life', 'stability'],
        fears: ['unsafe areas', 'poor schools', 'isolation'],
        aspirations: ['ideal family home', 'community belonging'],
        personality: {
          openness: 60,
          conscientiousness: 85,
          extraversion: 70,
          agreeableness: 85,
          neuroticism: 55
        }
      },
      financial: {
        budgetRange: { min: 300000, max: 500000 },
        financingType: 'conventional',
        downPaymentCapability: 15,
        creditScore: 'good',
        debtToIncome: 0.38
      },
      lifestyle: {
        workStyle: 'office',
        hobbies: ['family activities', 'sports'],
        socialActivity: 'high',
        travelFrequency: 'rare',
        entertainmentStyle: ['family', 'community']
      }
    },
    behaviors: {
      searchPatterns: [
        {
          pattern: 'school district focused',
          frequency: 95,
          timeOfDay: ['evening', 'weekend'],
          devices: ['mobile', 'tablet'],
          duration: 40
        }
      ],
      engagementStyle: {
        depth: 'moderate',
        speed: 'thorough',
        interaction: 'active',
        sharing: 'frequent'
      },
      decisionMaking: {
        approach: 'collaborative',
        speed: 'slow',
        influences: ['family consensus', 'child needs'],
        riskTolerance: 'low'
      },
      contentConsumption: {
        preferredFormats: ['neighborhood guides', 'school info'],
        consumptionTime: ['evening'],
        attentionSpan: 'medium',
        detailOrientation: 'moderate'
      },
      communicationPreference: {
        channels: ['phone', 'text'],
        frequency: 'medium',
        tone: 'friendly',
        responseTime: 'same_day'
      }
    },
    triggers: {
      emotional: [
        {
          emotion: 'security',
          trigger: 'safe neighborhood',
          strength: 95,
          response: 'high interest'
        }
      ],
      logical: [
        {
          factor: 'school ratings',
          importance: 98,
          threshold: 8,
          action: 'serious consideration'
        }
      ],
      social: [
        {
          influence: 'family-friendly community',
          source: 'neighbors',
          impact: 90,
          response: 'strong preference'
        }
      ],
      urgency: [
        {
          trigger: 'school enrollment deadline',
          sensitivity: 95,
          response: 'urgent action',
          timeframe: '1-2 months'
        }
      ]
    }
  },
  downsizer: {
    characteristics: {
      demographic: {
        ageRange: { min: 55, max: 70 },
        incomeRange: { min: 60000, max: 120000 },
        familySize: 2,
        educationLevel: 'college',
        occupation: 'nearing retirement'
      },
      psychographic: {
        values: ['simplicity', 'convenience', 'freedom'],
        motivations: ['less maintenance', 'lifestyle change', 'cost reduction'],
        fears: ['isolation', 'losing memories', 'wrong timing'],
        aspirations: ['easier lifestyle', 'travel freedom'],
        personality: {
          openness: 55,
          conscientiousness: 75,
          extraversion: 60,
          agreeableness: 80,
          neuroticism: 50
        }
      },
      financial: {
        budgetRange: { min: 200000, max: 400000 },
        financingType: 'cash',
        downPaymentCapability: 50,
        creditScore: 'excellent',
        debtToIncome: 0.20
      },
      lifestyle: {
        workStyle: 'flexible',
        hobbies: ['travel', 'gardening', 'social'],
        socialActivity: 'medium',
        travelFrequency: 'frequent',
        entertainmentStyle: ['quiet', 'selective']
      }
    },
    behaviors: {
      searchPatterns: [
        {
          pattern: 'low maintenance focus',
          frequency: 80,
          timeOfDay: ['morning', 'afternoon'],
          devices: ['desktop', 'tablet'],
          duration: 25
        }
      ],
      engagementStyle: {
        depth: 'moderate',
        speed: 'thorough',
        interaction: 'passive',
        sharing: 'never'
      },
      decisionMaking: {
        approach: 'analytical',
        speed: 'slow',
        influences: ['maintenance needs', 'accessibility'],
        riskTolerance: 'low'
      },
      contentConsumption: {
        preferredFormats: ['photos', 'floor plans'],
        consumptionTime: ['morning'],
        attentionSpan: 'short',
        detailOrientation: 'moderate'
      },
      communicationPreference: {
        channels: ['phone', 'email'],
        frequency: 'low',
        tone: 'formal',
        responseTime: 'flexible'
      }
    },
    triggers: {
      emotional: [
        {
          emotion: 'relief',
          trigger: 'maintenance-free living',
          strength: 85,
          response: 'strong interest'
        }
      ],
      logical: [
        {
          factor: 'monthly costs',
          importance: 90,
          threshold: 0.7,
          action: 'serious consideration'
        }
      ],
      social: [
        {
          influence: 'active community',
          source: 'current residents',
          impact: 75,
          response: 'increased comfort'
        }
      ],
      urgency: [
        {
          trigger: 'current home burden',
          sensitivity: 70,
          response: 'motivated',
          timeframe: '3-6 months'
        }
      ]
    }
  },
  relocator: {
    characteristics: {
      demographic: {
        ageRange: { min: 30, max: 50 },
        incomeRange: { min: 70000, max: 150000 },
        familySize: 2.5,
        educationLevel: 'college+',
        occupation: 'professional'
      },
      psychographic: {
        values: ['opportunity', 'adaptation', 'growth'],
        motivations: ['career move', 'lifestyle change', 'new start'],
        fears: ['unknown area', 'wrong choice', 'isolation'],
        aspirations: ['successful transition', 'better life'],
        personality: {
          openness: 75,
          conscientiousness: 70,
          extraversion: 65,
          agreeableness: 70,
          neuroticism: 60
        }
      },
      financial: {
        budgetRange: { min: 250000, max: 500000 },
        financingType: 'conventional',
        downPaymentCapability: 20,
        creditScore: 'good',
        debtToIncome: 0.35
      },
      lifestyle: {
        workStyle: 'hybrid',
        hobbies: ['exploring', 'networking'],
        socialActivity: 'medium',
        travelFrequency: 'occasional',
        entertainmentStyle: ['discovering', 'social']
      }
    },
    behaviors: {
      searchPatterns: [
        {
          pattern: 'area research heavy',
          frequency: 90,
          timeOfDay: ['evening', 'weekend'],
          devices: ['mobile', 'desktop'],
          duration: 50
        }
      ],
      engagementStyle: {
        depth: 'deep',
        speed: 'quick',
        interaction: 'active',
        sharing: 'selective'
      },
      decisionMaking: {
        approach: 'analytical',
        speed: 'quick',
        influences: ['area info', 'commute', 'amenities'],
        riskTolerance: 'medium'
      },
      contentConsumption: {
        preferredFormats: ['area guides', 'virtual tours', 'maps'],
        consumptionTime: ['anytime'],
        attentionSpan: 'long',
        detailOrientation: 'comprehensive'
      },
      communicationPreference: {
        channels: ['video', 'email'],
        frequency: 'high',
        tone: 'professional',
        responseTime: 'immediate'
      }
    },
    triggers: {
      emotional: [
        {
          emotion: 'excitement',
          trigger: 'perfect location',
          strength: 80,
          response: 'quick action'
        }
      ],
      logical: [
        {
          factor: 'commute time',
          importance: 85,
          threshold: 30,
          action: 'priority filter'
        }
      ],
      social: [
        {
          influence: 'welcoming community',
          source: 'local insights',
          impact: 70,
          response: 'increased confidence'
        }
      ],
      urgency: [
        {
          trigger: 'relocation deadline',
          sensitivity: 95,
          response: 'immediate action',
          timeframe: '1-2 months'
        }
      ]
    }
  },
  urban_professional: {
    characteristics: {
      demographic: {
        ageRange: { min: 25, max: 40 },
        incomeRange: { min: 80000, max: 200000 },
        familySize: 1.5,
        educationLevel: 'graduate',
        occupation: 'tech/finance/consulting'
      },
      psychographic: {
        values: ['efficiency', 'convenience', 'status'],
        motivations: ['location', 'lifestyle', 'investment'],
        fears: ['long commute', 'missing out', 'poor value'],
        aspirations: ['urban lifestyle', 'career growth'],
        personality: {
          openness: 80,
          conscientiousness: 85,
          extraversion: 70,
          agreeableness: 60,
          neuroticism: 55
        }
      },
      financial: {
        budgetRange: { min: 400000, max: 800000 },
        financingType: 'conventional',
        downPaymentCapability: 20,
        creditScore: 'excellent',
        debtToIncome: 0.28
      },
      lifestyle: {
        workStyle: 'hybrid',
        hobbies: ['dining', 'fitness', 'culture'],
        socialActivity: 'high',
        travelFrequency: 'frequent',
        entertainmentStyle: ['trendy', 'social']
      }
    },
    behaviors: {
      searchPatterns: [
        {
          pattern: 'location-centric',
          frequency: 85,
          timeOfDay: ['lunch', 'late evening'],
          devices: ['mobile'],
          duration: 15
        }
      ],
      engagementStyle: {
        depth: 'surface',
        speed: 'quick',
        interaction: 'passive',
        sharing: 'frequent'
      },
      decisionMaking: {
        approach: 'intuitive',
        speed: 'quick',
        influences: ['location', 'amenities', 'vibe'],
        riskTolerance: 'high'
      },
      contentConsumption: {
        preferredFormats: ['videos', 'quick tours', 'highlights'],
        consumptionTime: ['commute', 'breaks'],
        attentionSpan: 'short',
        detailOrientation: 'summary'
      },
      communicationPreference: {
        channels: ['text', 'app'],
        frequency: 'low',
        tone: 'casual',
        responseTime: 'flexible'
      }
    },
    triggers: {
      emotional: [
        {
          emotion: 'desire',
          trigger: 'lifestyle match',
          strength: 75,
          response: 'impulse interest'
        }
      ],
      logical: [
        {
          factor: 'walkability score',
          importance: 90,
          threshold: 85,
          action: 'must-have filter'
        }
      ],
      social: [
        {
          influence: 'trendy neighborhood',
          source: 'social media',
          impact: 80,
          response: 'FOMO driven'
        }
      ],
      urgency: [
        {
          trigger: 'hot market',
          sensitivity: 60,
          response: 'competitive',
          timeframe: 'immediate'
        }
      ]
    }
  },
  retiree: {
    characteristics: {
      demographic: {
        ageRange: { min: 60, max: 75 },
        incomeRange: { min: 50000, max: 100000 },
        familySize: 2,
        educationLevel: 'varied',
        occupation: 'retired'
      },
      psychographic: {
        values: ['comfort', 'security', 'community'],
        motivations: ['retirement lifestyle', 'proximity to family', 'climate'],
        fears: ['isolation', 'health access', 'finances'],
        aspirations: ['peaceful retirement', 'active lifestyle'],
        personality: {
          openness: 50,
          conscientiousness: 80,
          extraversion: 55,
          agreeableness: 85,
          neuroticism: 45
        }
      },
      financial: {
        budgetRange: { min: 150000, max: 350000 },
        financingType: 'cash',
        downPaymentCapability: 100,
        creditScore: 'excellent',
        debtToIncome: 0.15
      },
      lifestyle: {
        workStyle: 'flexible',
        hobbies: ['golf', 'gardening', 'grandchildren'],
        socialActivity: 'medium',
        travelFrequency: 'occasional',
        entertainmentStyle: ['quiet', 'community']
      }
    },
    behaviors: {
      searchPatterns: [
        {
          pattern: 'amenity focused',
          frequency: 70,
          timeOfDay: ['morning', 'afternoon'],
          devices: ['desktop', 'tablet'],
          duration: 30
        }
      ],
      engagementStyle: {
        depth: 'deep',
        speed: 'thorough',
        interaction: 'passive',
        sharing: 'selective'
      },
      decisionMaking: {
        approach: 'cautious',
        speed: 'slow',
        influences: ['healthcare', 'community', 'climate'],
        riskTolerance: 'low'
      },
      contentConsumption: {
        preferredFormats: ['detailed descriptions', 'photos'],
        consumptionTime: ['morning'],
        attentionSpan: 'long',
        detailOrientation: 'comprehensive'
      },
      communicationPreference: {
        channels: ['phone', 'in-person'],
        frequency: 'low',
        tone: 'formal',
        responseTime: 'same_day'
      }
    },
    triggers: {
      emotional: [
        {
          emotion: 'comfort',
          trigger: 'age-friendly features',
          strength: 90,
          response: 'serious interest'
        }
      ],
      logical: [
        {
          factor: 'healthcare proximity',
          importance: 95,
          threshold: 5,
          action: 'requirement'
        }
      ],
      social: [
        {
          influence: 'active senior community',
          source: 'current residents',
          impact: 85,
          response: 'strong appeal'
        }
      ],
      urgency: [
        {
          trigger: 'health considerations',
          sensitivity: 50,
          response: 'methodical',
          timeframe: '6-12 months'
        }
      ]
    }
  },
  flipper: {
    characteristics: {
      demographic: {
        ageRange: { min: 30, max: 55 },
        incomeRange: { min: 100000, max: 500000 },
        familySize: 2,
        educationLevel: 'varied',
        occupation: 'investor/contractor'
      },
      psychographic: {
        values: ['profit', 'efficiency', 'opportunity'],
        motivations: ['ROI', 'quick turnaround', 'market timing'],
        fears: ['overpaying', 'hidden issues', 'market downturn'],
        aspirations: ['profitable flip', 'portfolio growth'],
        personality: {
          openness: 70,
          conscientiousness: 75,
          extraversion: 65,
          agreeableness: 50,
          neuroticism: 60
        }
      },
      financial: {
        budgetRange: { min: 100000, max: 400000 },
        financingType: 'cash',
        downPaymentCapability: 100,
        creditScore: 'good',
        debtToIncome: 0.40
      },
      lifestyle: {
        workStyle: 'flexible',
        hobbies: ['real estate', 'renovation'],
        socialActivity: 'high',
        travelFrequency: 'rare',
        entertainmentStyle: ['business', 'networking']
      }
    },
    behaviors: {
      searchPatterns: [
        {
          pattern: 'distressed properties',
          frequency: 95,
          timeOfDay: ['anytime'],
          devices: ['mobile', 'desktop'],
          duration: 10
        }
      ],
      engagementStyle: {
        depth: 'surface',
        speed: 'quick',
        interaction: 'active',
        sharing: 'never'
      },
      decisionMaking: {
        approach: 'analytical',
        speed: 'impulsive',
        influences: ['profit margin', 'renovation cost'],
        riskTolerance: 'high'
      },
      contentConsumption: {
        preferredFormats: ['basic facts', 'numbers'],
        consumptionTime: ['anytime'],
        attentionSpan: 'short',
        detailOrientation: 'summary'
      },
      communicationPreference: {
        channels: ['text', 'quick call'],
        frequency: 'low',
        tone: 'professional',
        responseTime: 'immediate'
      }
    },
    triggers: {
      emotional: [
        {
          emotion: 'opportunity',
          trigger: 'undervalued property',
          strength: 60,
          response: 'quick analysis'
        }
      ],
      logical: [
        {
          factor: 'ARV potential',
          importance: 100,
          threshold: 1.3,
          action: 'immediate offer'
        }
      ],
      social: [
        {
          influence: 'competition',
          source: 'other flippers',
          impact: 40,
          response: 'aggressive bidding'
        }
      ],
      urgency: [
        {
          trigger: 'distressed sale',
          sensitivity: 90,
          response: 'cash offer',
          timeframe: 'same day'
        }
      ]
    }
  }
};

export interface PersonaDefinition {
  characteristics: PersonaCharacteristics;
  behaviors: PersonaBehaviors;
  triggers: PersonaTriggers;
}

/**
 * Detect buyer persona from interactions
 */
export function detectPersona(
  interactions: InteractionEvent[],
  profile?: BuyerProfile,
  photoInsights?: PhotoInsights
): PersonaDetectionResult {
  // Analyze interaction patterns
  const signals = extractPersonaSignals(interactions);
  
  // Score each persona based on signals
  const personaScores = scorePersonas(signals, profile, photoInsights);
  
  // Identify primary and secondary personas
  const sortedPersonas = personaScores.sort((a, b) => b.confidence - a.confidence);
  const primaryPersona = sortedPersonas[0];
  const secondaryPersonas = sortedPersonas.slice(1, 3).filter(p => p.confidence > 30);
  
  // Calculate overall confidence
  const confidence = calculateConfidence(primaryPersona, signals);
  
  // Generate recommendations based on detected persona
  const recommendations = generatePersonaRecommendations(primaryPersona);
  
  // Predict persona evolution
  const evolutionPath = predictPersonaEvolution(primaryPersona, interactions);
  
  return {
    primaryPersona,
    secondaryPersonas,
    confidence,
    signals,
    recommendations,
    evolutionPath
  };
}

/**
 * Extract persona signals from interactions
 */
function extractPersonaSignals(interactions: InteractionEvent[]): PersonaSignal[] {
  const signals: PersonaSignal[] = [];
  
  // Analyze content types viewed
  const contentTypes = interactions.map(i => i.content);
  const uniqueContent = [...new Set(contentTypes)];
  
  // Check for first-time buyer signals
  if (contentTypes.filter(c => c.includes('guide') || c.includes('tips')).length > 3) {
    signals.push({
      signal: 'Educational content consumption',
      strength: 85,
      source: 'content_analysis',
      timestamp: new Date(),
      confidence: 80,
      implication: 'First-time buyer learning phase'
    });
  }
  
  // Check for luxury signals
  if (contentTypes.some(c => c.includes('luxury') || c.includes('premium'))) {
    signals.push({
      signal: 'Luxury property interest',
      strength: 75,
      source: 'content_analysis',
      timestamp: new Date(),
      confidence: 70,
      implication: 'High-end market focus'
    });
  }
  
  // Check for family signals
  if (contentTypes.some(c => c.includes('school') || c.includes('family'))) {
    signals.push({
      signal: 'Family-oriented search',
      strength: 90,
      source: 'content_analysis',
      timestamp: new Date(),
      confidence: 85,
      implication: 'Family needs priority'
    });
  }
  
  // Analyze interaction frequency
  const sessionCount = new Set(interactions.map(i => i.context?.session?.sessionId)).size;
  if (sessionCount > 5) {
    signals.push({
      signal: 'High engagement frequency',
      strength: 70,
      source: 'behavior_analysis',
      timestamp: new Date(),
      confidence: 75,
      implication: 'Serious buyer intent'
    });
  }
  
  // Analyze property price ranges
  const properties = interactions
    .filter(i => i.context?.property)
    .map(i => i.context!.property!);
  
  if (properties.length > 0) {
    const avgPrice = properties.reduce((sum, p) => sum + p.price, 0) / properties.length;
    
    if (avgPrice < 300000) {
      signals.push({
        signal: 'Entry-level price range',
        strength: 80,
        source: 'property_analysis',
        timestamp: new Date(),
        confidence: 85,
        implication: 'First-time or budget-conscious buyer'
      });
    } else if (avgPrice > 800000) {
      signals.push({
        signal: 'Luxury price range',
        strength: 85,
        source: 'property_analysis',
        timestamp: new Date(),
        confidence: 90,
        implication: 'Luxury or investment buyer'
      });
    }
  }
  
  // Analyze device usage
  const devices = interactions.map(i => i.context?.device).filter(Boolean);
  const mobileUsage = devices.filter(d => d === 'mobile').length / devices.length;
  
  if (mobileUsage > 0.7) {
    signals.push({
      signal: 'Mobile-first behavior',
      strength: 60,
      source: 'device_analysis',
      timestamp: new Date(),
      confidence: 70,
      implication: 'On-the-go, busy lifestyle'
    });
  }
  
  return signals;
}

/**
 * Score each persona based on signals
 */
function scorePersonas(
  signals: PersonaSignal[],
  profile?: BuyerProfile,
  photoInsights?: PhotoInsights
): DetectedPersona[] {
  const personas: DetectedPersona[] = [];
  
  for (const [personaType, definition] of Object.entries(PERSONA_DEFINITIONS)) {
    let score = 0;
    let matchCount = 0;
    
    // Score based on signals
    signals.forEach(signal => {
      if (personaType === 'first_time_buyer' && signal.signal.includes('Educational')) {
        score += signal.strength;
        matchCount++;
      }
      if (personaType === 'luxury_seeker' && signal.signal.includes('Luxury')) {
        score += signal.strength;
        matchCount++;
      }
      if (personaType === 'family_focused' && signal.signal.includes('Family')) {
        score += signal.strength;
        matchCount++;
      }
      if (personaType === 'investor' && signal.signal.includes('investment')) {
        score += signal.strength * 0.8;
        matchCount++;
      }
    });
    
    // Score based on profile data if available
    if (profile) {
      // Age matching
      const ageMatch = checkAgeMatch(
        profile.demographics.ageRange,
        definition.characteristics.demographic.ageRange
      );
      if (ageMatch > 0.7) {
        score += 20;
        matchCount++;
      }
      
      // Income matching
      const incomeMatch = checkIncomeMatch(
        profile.demographics.incomeRange,
        definition.characteristics.financial.budgetRange
      );
      if (incomeMatch > 0.7) {
        score += 25;
        matchCount++;
      }
      
      // Lifestyle matching
      if (profile.demographics.familyStatus.status === 'young_family' && personaType === 'family_focused') {
        score += 30;
        matchCount++;
      }
    }
    
    // Score based on photo insights if available
    if (photoInsights) {
      if (photoInsights.propertyCategory === 'luxury' && personaType === 'luxury_seeker') {
        score += 35;
        matchCount++;
      }
      if (photoInsights.propertyCategory === 'family' && personaType === 'family_focused') {
        score += 35;
        matchCount++;
      }
      if (photoInsights.propertyCategory === 'investment' && personaType === 'investor') {
        score += 30;
        matchCount++;
      }
    }
    
    // Calculate confidence based on matches and score
    const confidence = matchCount > 0 ? Math.min((score / matchCount) * (matchCount / 5), 100) : 0;
    
    personas.push({
      type: personaType as PersonaType,
      confidence,
      characteristics: definition.characteristics,
      behaviors: definition.behaviors,
      preferences: {
        propertyTypes: [],
        features: [],
        locations: [],
        aesthetics: {
          styles: [],
          eras: [],
          colors: [],
          materials: []
        },
        dealBreakers: []
      },
      triggers: definition.triggers,
      matchScore: score
    });
  }
  
  return personas;
}

/**
 * Check age range match
 */
function checkAgeMatch(
  profileAge: { min: number; max: number },
  personaAge: { min: number; max: number }
): number {
  const overlap = Math.min(profileAge.max, personaAge.max) - Math.max(profileAge.min, personaAge.min);
  const totalRange = Math.max(profileAge.max - profileAge.min, personaAge.max - personaAge.min);
  return overlap > 0 ? overlap / totalRange : 0;
}

/**
 * Check income/budget match
 */
function checkIncomeMatch(
  profileIncome: { min: number; max: number },
  personaBudget: { min: number; max: number }
): number {
  // Rough calculation: budget = income * 3-5
  const estimatedBudgetMin = profileIncome.min * 3;
  const estimatedBudgetMax = profileIncome.max * 5;
  
  const overlap = Math.min(estimatedBudgetMax, personaBudget.max) - Math.max(estimatedBudgetMin, personaBudget.min);
  const totalRange = personaBudget.max - personaBudget.min;
  
  return overlap > 0 ? overlap / totalRange : 0;
}

/**
 * Calculate overall confidence
 */
function calculateConfidence(persona: DetectedPersona, signals: PersonaSignal[]): number {
  const signalStrength = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;
  const personaConfidence = persona.confidence;
  
  return Math.round((signalStrength * 0.4 + personaConfidence * 0.6));
}

/**
 * Generate recommendations based on detected persona
 */
function generatePersonaRecommendations(persona: DetectedPersona): PersonaRecommendation[] {
  const recommendations: PersonaRecommendation[] = [];
  
  // Content recommendations
  if (persona.type === 'first_time_buyer') {
    recommendations.push({
      category: 'content',
      recommendation: 'Provide comprehensive buying guides and calculators',
      rationale: 'First-time buyers need education and confidence building',
      expectedImpact: 35,
      implementation: [
        'Create step-by-step buying guide',
        'Add mortgage calculator',
        'Include FAQ section',
        'Provide checklist templates'
      ],
      priority: 'high'
    });
  }
  
  if (persona.type === 'luxury_seeker') {
    recommendations.push({
      category: 'content',
      recommendation: 'Emphasize exclusivity and premium features',
      rationale: 'Luxury buyers respond to prestige and uniqueness',
      expectedImpact: 40,
      implementation: [
        'Highlight unique architectural features',
        'Use premium photography',
        'Emphasize privacy and exclusivity',
        'Include lifestyle imagery'
      ],
      priority: 'high'
    });
  }
  
  if (persona.type === 'family_focused') {
    recommendations.push({
      category: 'content',
      recommendation: 'Focus on family-friendly features and community',
      rationale: 'Family buyers prioritize children needs and safety',
      expectedImpact: 45,
      implementation: [
        'Highlight school information prominently',
        'Showcase family spaces',
        'Include neighborhood safety data',
        'Emphasize community amenities'
      ],
      priority: 'high'
    });
  }
  
  // Communication recommendations
  recommendations.push({
    category: 'communication',
    recommendation: `Adapt communication style to ${persona.behaviors.communicationPreference.tone} tone`,
    rationale: 'Matching communication style increases engagement',
    expectedImpact: 25,
    implementation: [
      `Use ${persona.behaviors.communicationPreference.tone} language`,
      `Respond within ${persona.behaviors.communicationPreference.responseTime}`,
      `Focus on ${persona.behaviors.communicationPreference.channels.join(', ')}`
    ],
    priority: 'medium'
  });
  
  // Timing recommendations
  const bestTimes = persona.behaviors.contentConsumption.consumptionTime;
  recommendations.push({
    category: 'timing',
    recommendation: `Schedule communications for ${bestTimes.join(' and ')}`,
    rationale: 'Optimal timing increases open and response rates',
    expectedImpact: 20,
    implementation: [
      `Send emails during ${bestTimes[0]}`,
      'Schedule follow-ups accordingly',
      'Post social content at peak times'
    ],
    priority: 'medium'
  });
  
  return recommendations;
}

/**
 * Predict persona evolution
 */
function predictPersonaEvolution(
  persona: DetectedPersona,
  interactions: InteractionEvent[]
): PersonaEvolution {
  // Evolution patterns
  const evolutionPaths: Record<PersonaType, PersonaEvolution> = {
    first_time_buyer: {
      currentStage: 'education',
      nextLikelyStage: 'active_search',
      probability: 70,
      timeframe: '2-3 months',
      triggers: ['pre-approval', 'market understanding'],
      indicators: ['increased search frequency', 'specific criteria']
    },
    move_up_buyer: {
      currentStage: 'consideration',
      nextLikelyStage: 'decision',
      probability: 65,
      timeframe: '1-2 months',
      triggers: ['home sale', 'market opportunity'],
      indicators: ['contingent offer preparation', 'timing alignment']
    },
    luxury_seeker: {
      currentStage: 'browsing',
      nextLikelyStage: 'selective_viewing',
      probability: 55,
      timeframe: '3-6 months',
      triggers: ['unique property', 'market advantage'],
      indicators: ['exclusive showings', 'direct inquiries']
    },
    investor: {
      currentStage: 'analysis',
      nextLikelyStage: 'opportunity_action',
      probability: 80,
      timeframe: '1-2 weeks',
      triggers: ['roi threshold', 'market timing'],
      indicators: ['financial analysis', 'quick decisions']
    },
    family_focused: {
      currentStage: 'research',
      nextLikelyStage: 'neighborhood_selection',
      probability: 75,
      timeframe: '1-3 months',
      triggers: ['school enrollment', 'family growth'],
      indicators: ['school research', 'community investigation']
    },
    downsizer: {
      currentStage: 'planning',
      nextLikelyStage: 'downsizing_execution',
      probability: 60,
      timeframe: '3-6 months',
      triggers: ['retirement', 'maintenance burden'],
      indicators: ['simplified living research', 'decluttering']
    },
    relocator: {
      currentStage: 'area_research',
      nextLikelyStage: 'property_search',
      probability: 85,
      timeframe: '1-2 months',
      triggers: ['job start', 'relocation package'],
      indicators: ['area comparison', 'virtual tours']
    },
    urban_professional: {
      currentStage: 'lifestyle_match',
      nextLikelyStage: 'property_selection',
      probability: 70,
      timeframe: '2-4 weeks',
      triggers: ['commute optimization', 'lifestyle fit'],
      indicators: ['transit research', 'amenity focus']
    },
    retiree: {
      currentStage: 'lifestyle_planning',
      nextLikelyStage: 'community_selection',
      probability: 65,
      timeframe: '3-6 months',
      triggers: ['retirement date', 'lifestyle change'],
      indicators: ['community research', 'climate preference']
    },
    flipper: {
      currentStage: 'opportunity_scan',
      nextLikelyStage: 'quick_acquisition',
      probability: 75,
      timeframe: '1-2 weeks',
      triggers: ['distressed property', 'price opportunity'],
      indicators: ['rehab cost analysis', 'rapid decisions']
    }
  };
  
  return evolutionPaths[persona.type] || evolutionPaths.first_time_buyer;
}

/**
 * Get persona-specific content strategy
 */
export function getPersonaContentStrategy(persona: DetectedPersona): ContentStrategy {
  const strategies: Record<PersonaType, ContentStrategy> = {
    first_time_buyer: {
      themes: ['education', 'guidance', 'confidence'],
      formats: ['guides', 'checklists', 'calculators'],
      tone: 'supportive and informative',
      frequency: 'high',
      channels: ['email', 'blog', 'social'],
      keyMessages: [
        'Step-by-step guidance',
        'Financial preparation',
        'Market education',
        'Process demystification'
      ]
    },
    move_up_buyer: {
      themes: ['upgrade', 'timing', 'value'],
      formats: ['comparisons', 'market analysis', 'virtual tours'],
      tone: 'consultative and strategic',
      frequency: 'medium',
      channels: ['email', 'phone', 'in-person'],
      keyMessages: [
        'Market timing advantages',
        'Contingent sale strategies',
        'Upgrade benefits',
        'Family growth accommodation'
      ]
    },
    luxury_seeker: {
      themes: ['exclusivity', 'prestige', 'lifestyle'],
      formats: ['premium visuals', 'private tours', 'curated selections'],
      tone: 'sophisticated and exclusive',
      frequency: 'low',
      channels: ['private showings', 'direct contact'],
      keyMessages: [
        'Unique features',
        'Investment value',
        'Lifestyle enhancement',
        'Exclusive opportunity'
      ]
    },
    investor: {
      themes: ['roi', 'data', 'opportunity'],
      formats: ['spreadsheets', 'analytics', 'market reports'],
      tone: 'data-driven and direct',
      frequency: 'as-needed',
      channels: ['email', 'portal'],
      keyMessages: [
        'ROI projections',
        'Market analysis',
        'Cash flow potential',
        'Investment metrics'
      ]
    },
    family_focused: {
      themes: ['safety', 'community', 'schools'],
      formats: ['neighborhood guides', 'school reports', 'family testimonials'],
      tone: 'warm and reassuring',
      frequency: 'medium-high',
      channels: ['phone', 'text', 'email'],
      keyMessages: [
        'School excellence',
        'Safe neighborhoods',
        'Family amenities',
        'Community connection'
      ]
    },
    downsizer: {
      themes: ['simplification', 'convenience', 'lifestyle'],
      formats: ['lifestyle guides', 'maintenance comparisons', 'community tours'],
      tone: 'understanding and practical',
      frequency: 'medium',
      channels: ['phone', 'in-person'],
      keyMessages: [
        'Simplified living',
        'Reduced maintenance',
        'Lifestyle amenities',
        'Financial benefits'
      ]
    },
    relocator: {
      themes: ['area overview', 'transition support', 'local insights'],
      formats: ['area guides', 'virtual tours', 'relocation packages'],
      tone: 'helpful and comprehensive',
      frequency: 'high',
      channels: ['video calls', 'email', 'portal'],
      keyMessages: [
        'Area expertise',
        'Smooth transition',
        'Local insights',
        'Remote support'
      ]
    },
    urban_professional: {
      themes: ['convenience', 'lifestyle', 'connectivity'],
      formats: ['commute analysis', 'amenity maps', 'lifestyle content'],
      tone: 'modern and efficient',
      frequency: 'medium',
      channels: ['app', 'text', 'email'],
      keyMessages: [
        'Urban convenience',
        'Work-life balance',
        'Transit access',
        'City amenities'
      ]
    },
    retiree: {
      themes: ['comfort', 'community', 'leisure'],
      formats: ['community guides', 'lifestyle videos', 'testimonials'],
      tone: 'respectful and patient',
      frequency: 'low-medium',
      channels: ['phone', 'in-person', 'email'],
      keyMessages: [
        'Active lifestyle',
        'Community connection',
        'Healthcare access',
        'Leisure amenities'
      ]
    },
    flipper: {
      themes: ['opportunity', 'profit', 'speed'],
      formats: ['distressed listings', 'rehab estimates', 'comps'],
      tone: 'fast and factual',
      frequency: 'high',
      channels: ['text', 'phone', 'direct'],
      keyMessages: [
        'Below market value',
        'Rehab potential',
        'Quick closing',
        'Profit margins'
      ]
    }
  };
  
  return strategies[persona.type];
}

export interface ContentStrategy {
  themes: string[];
  formats: string[];
  tone: string;
  frequency: string;
  channels: string[];
  keyMessages: string[];
}

/**
 * Adapt content for detected persona
 */
export function adaptContentForPersona(
  content: string,
  persona: DetectedPersona
): string {
  let adaptedContent = content;
  
  // Apply persona-specific modifications
  if (persona.type === 'first_time_buyer') {
    // Add educational context
    adaptedContent = addEducationalContext(content);
  } else if (persona.type === 'luxury_seeker') {
    // Emphasize exclusivity
    adaptedContent = emphasizeExclusivity(content);
  } else if (persona.type === 'family_focused') {
    // Highlight family features
    adaptedContent = highlightFamilyFeatures(content);
  } else if (persona.type === 'investor') {
    // Add investment metrics
    adaptedContent = addInvestmentMetrics(content);
  }
  
  return adaptedContent;
}

/**
 * Helper functions for content adaptation
 */
function addEducationalContext(content: string): string {
  const educational = `\n\n💡 First-Time Buyer Tip: ${content}`;
  return content + educational;
}

function emphasizeExclusivity(content: string): string {
  return content.replace(
    /This property/g,
    'This exclusive property'
  ).replace(
    /features/g,
    'premium features'
  );
}

function highlightFamilyFeatures(content: string): string {
  const familyAddition = '\n\nPerfect for families with excellent schools nearby!';
  return content + familyAddition;
}

function addInvestmentMetrics(content: string): string {
  const metrics = '\n\n📊 Investment Metrics: Strong rental potential with positive cash flow projection.';
  return content + metrics;
}