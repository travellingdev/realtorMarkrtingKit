/**
 * Channel-specific content strategies for optimized conversion
 * Phase 2.1: Platform-specific content optimization
 */

// Instagram-specific strategy interfaces
export interface InstagramStrategy extends ChannelStrategy {
  viralHooks: ViralHooks;
  hashtagStrategy: HashtagStrategy;
  engagementTactics: EngagementTactics;
  contentFormats: ContentFormat[];
  storySequences: StorySequence[];
}

export interface ViralHooks {
  openingLines: string[];
  questionStarters: string[];
  emotionalTriggers: string[];
  curiosityGaps: string[];
  trendingFormats: string[];
}

export interface HashtagStrategy {
  propertySpecific: string[]; // #luxuryhome, #poolhouse
  locationBased: string[]; // #brookfieldrealestate, #californialiving
  lifestyle: string[]; // #dreamhome, #familytime
  engagement: string[]; // #realtorlife, #homeforsale
  trending: string[]; // Updated dynamically
  maxHashtags: number;
  hashtagMix: 'viral' | 'targeted' | 'balanced';
}

export interface EngagementTactics {
  callToActions: string[];
  engagementBait: string[];
  shareWorthy: string[];
  saveWorthy: string[];
  commentStarters: string[];
}

export interface ContentFormat {
  type: 'carousel' | 'single' | 'reel' | 'story';
  slides: number;
  purpose: string;
  template: string;
}

export interface StorySequence {
  name: string;
  slides: string[];
  engagement: string[];
}

export interface ChannelStrategy {
  name: string;
  objectives: string[];
  contentStructure: string[];
  keyElements: string[];
  validationMetrics: string[];
}

export interface MLSStrategy extends ChannelStrategy {
  seoKeywords: string[];
  agentPositioning: AgentPositioning;
  formatPreferences: MLSFormatting;
  complianceRules: string[];
  searchOptimization: SEOOptimization;
}

export interface AgentPositioning {
  expertise: string[];
  credibilityIndicators: string[];
  localKnowledge: string[];
  professionalTone: string;
}

export interface MLSFormatting {
  structure: 'paragraph' | 'bullets' | 'mixed';
  maxLength: number;
  requiredSections: string[];
  keywordDensity: number; // percentage
}

export interface SEOOptimization {
  primaryKeywords: string[]; // 1-3 main keywords
  secondaryKeywords: string[]; // 5-10 supporting keywords
  localKeywords: string[]; // neighborhood, city, region
  semanticKeywords: string[]; // related terms for context
}

// MLS-specific strategy configuration
export const MLS_STRATEGY: MLSStrategy = {
  name: 'MLS Professional Optimization',
  objectives: [
    'Maximize search visibility for buyer searches',
    'Establish agent authority and expertise',
    'Drive qualified leads to contact agent',
    'Comply with MLS and Fair Housing regulations'
  ],
  contentStructure: [
    'Compelling headline with primary keyword',
    'Emotional hook with lifestyle benefit',
    'Key features with SEO integration',
    'Neighborhood/location advantages',
    'Agent positioning and credibility',
    'Clear call-to-action'
  ],
  keyElements: [
    'Primary keyword in first 50 characters',
    'Local search terms naturally integrated',
    'Professional agent credentials mention',
    'Unique value proposition highlighted',
    'Emotional benefits tied to features'
  ],
  validationMetrics: [
    'SEO keyword density 2-4%',
    'Primary keyword in title and first sentence',
    'Local keywords present',
    'Professional tone maintained',
    'Call-to-action included'
  ],
  seoKeywords: [], // Will be dynamically populated
  complianceRules: [
    'Fair Housing Act compliance - no discriminatory language',
    'MLS-specific formatting requirements',
    'Professional presentation standards',
    'Accurate property representation',
    'Required disclosure statements'
  ],
  agentPositioning: {
    expertise: [
      'Local market expert',
      'Luxury property specialist',
      'First-time buyer guide',
      'Investment property advisor'
    ],
    credibilityIndicators: [
      'Years of experience',
      'Successful sales record',
      'Market knowledge depth',
      'Client satisfaction focus'
    ],
    localKnowledge: [
      'Neighborhood insights',
      'Market trends awareness',
      'Community connections',
      'Area development knowledge'
    ],
    professionalTone: 'authoritative yet approachable'
  },
  formatPreferences: {
    structure: 'mixed',
    maxLength: 900,
    requiredSections: ['headline', 'features', 'location', 'contact'],
    keywordDensity: 3
  },
  searchOptimization: {
    primaryKeywords: [], // Dynamic based on property
    secondaryKeywords: [
      'homes for sale',
      'real estate',
      'property listing',
      'house hunting',
      'move-in ready'
    ],
    localKeywords: [], // Dynamic based on location
    semanticKeywords: [
      'residential',
      'neighborhood',
      'community',
      'lifestyle',
      'investment'
    ]
  }
};

/**
 * Generate dynamic SEO keywords based on property and location
 */
export function generateMLSKeywords(
  propertyType: string,
  neighborhood: string,
  city: string,
  state: string,
  features: string[],
  priceRange?: string
): SEOOptimization {
  // Primary keywords (1-3 main search terms)
  const primaryKeywords = [
    `${propertyType} for sale ${neighborhood}`,
    `${neighborhood} ${propertyType}`,
    `${propertyType} ${city} ${state}`
  ].filter(Boolean);

  // Local keywords for geo-targeting
  const localKeywords = [
    neighborhood,
    `${neighborhood} ${city}`,
    `${city} ${state}`,
    `${neighborhood} real estate`,
    `${city} homes`,
    `near ${neighborhood}`
  ].filter(Boolean);

  // Secondary keywords based on features
  const featureKeywords = features.map(feature => 
    `${feature} ${propertyType}`
  ).slice(0, 5);

  const secondaryKeywords = [
    ...MLS_STRATEGY.searchOptimization.secondaryKeywords,
    ...featureKeywords,
    ...(priceRange ? [`${priceRange} homes`, `${priceRange} ${propertyType}`] : [])
  ];

  // Semantic keywords for context
  const semanticKeywords = [
    ...MLS_STRATEGY.searchOptimization.semanticKeywords,
    'family home',
    'property investment',
    'dream home',
    'perfect location',
    'quality construction'
  ];

  return {
    primaryKeywords: primaryKeywords.slice(0, 3),
    secondaryKeywords: secondaryKeywords.slice(0, 10),
    localKeywords: localKeywords.slice(0, 6),
    semanticKeywords: semanticKeywords.slice(0, 8)
  };
}

/**
 * Agent positioning based on property type and market
 */
export function getAgentPositioning(
  propertyType: string,
  priceRange: string,
  location: string
): AgentPositioning {
  const basePositioning = MLS_STRATEGY.agentPositioning;
  
  // Customize expertise based on property characteristics
  let expertise = [...basePositioning.expertise];
  
  if (priceRange.includes('luxury') || priceRange.includes('premium')) {
    expertise = ['Luxury property specialist', 'High-end real estate expert', ...expertise];
  }
  
  if (propertyType.includes('condo') || propertyType.includes('townhome')) {
    expertise = ['Urban living specialist', 'Condo market expert', ...expertise];
  }
  
  // Enhance local knowledge
  const localKnowledge = [
    `${location} market specialist`,
    `${location} neighborhood expert`,
    ...basePositioning.localKnowledge
  ];

  return {
    expertise: expertise.slice(0, 4),
    credibilityIndicators: basePositioning.credibilityIndicators,
    localKnowledge: localKnowledge.slice(0, 4),
    professionalTone: basePositioning.professionalTone
  };
}

/**
 * MLS content structure templates
 */
export const MLS_TEMPLATES = {
  luxury: {
    headline: "Exceptional {propertyType} in Prestigious {neighborhood}",
    hook: "Discover the epitome of luxury living in this stunning {propertyType}",
    features: "Featuring {primaryFeatures}, this property offers unparalleled {lifestyle}",
    location: "Located in the highly sought-after {neighborhood}, known for {locationBenefit}",
    agent: "Contact {agentName}, your local luxury property specialist",
    cta: "Schedule your private showing today"
  },
  family: {
    headline: "Perfect Family {propertyType} in {neighborhood}",
    hook: "Your family's dream home awaits in this beautifully maintained {propertyType}",
    features: "With {bedrooms} bedrooms, {bathrooms} bathrooms, and {keyFeatures}",
    location: "Nestled in family-friendly {neighborhood}, close to {amenities}",
    agent: "Contact {agentName}, your trusted family home specialist",
    cta: "Don't let this perfect family home slip away - call today"
  },
  investment: {
    headline: "Prime Investment {propertyType} in Growing {neighborhood}",
    hook: "Savvy investors recognize the potential in this well-positioned {propertyType}",
    features: "Offering {features} with strong rental potential and {investmentBenefit}",
    location: "Strategic location in {neighborhood} with {growthIndicators}",
    agent: "Contact {agentName}, your investment property advisor",
    cta: "Secure this investment opportunity before it's gone"
  }
};

// Instagram-specific strategy configuration
export const INSTAGRAM_STRATEGY: InstagramStrategy = {
  name: 'Instagram Viral Engagement',
  objectives: [
    'Maximize post engagement (likes, comments, saves)',
    'Drive story views and profile visits',
    'Generate qualified leads through DMs',
    'Build agent personal brand and authority',
    'Create shareable, viral-potential content'
  ],
  contentStructure: [
    'Attention-grabbing hook in first line',
    'Visual storytelling with lifestyle focus',
    'Emotional connection and aspiration',
    'Clear call-to-action for engagement',
    'Strategic hashtag placement'
  ],
  keyElements: [
    'Viral hook within first 7 words',
    'Question or curiosity gap to drive engagement',
    'Property lifestyle benefits over features',
    'Visual elements that stop the scroll',
    'Community engagement and relatability'
  ],
  validationMetrics: [
    'Hook strength and viral potential',
    'Engagement bait effectiveness',
    'Hashtag relevance and reach potential',
    'Call-to-action clarity',
    'Share-worthiness score'
  ],
  viralHooks: {
    openingLines: [
      'POV: You just found your dream home',
      'This house just hit different...',
      'Tell me you wouldn\'t want to live here',
      'The way this property makes me feel',
      'When the photos don\'t do it justice',
      'Everyone\'s asking about this house',
      'Plot twist: it\'s still available'
    ],
    questionStarters: [
      'Would you choose the pool or the kitchen?',
      'What\'s the first thing you\'d do here?',
      'Can you imagine waking up to this view?',
      'Which room would be your favorite?',
      'Is this giving you main character energy?'
    ],
    emotionalTriggers: [
      'obsessed',
      'stunning',
      'goals',
      'vibes',
      'iconic',
      'chef\'s kiss',
      'no words',
      'pure magic'
    ],
    curiosityGaps: [
      'Wait until you see slide 3...',
      'The surprise in the backyard though',
      'But here\'s what sold me...',
      'The plot twist nobody expected',
      'What happened next will shock you'
    ],
    trendingFormats: [
      'POV: [scenario]',
      'Tell me [statement] without telling me',
      'This [property] is giving [vibe]',
      'When [situation] hits different',
      'Nobody: ... Me: [reaction]'
    ]
  },
  hashtagStrategy: {
    propertySpecific: [], // Will be dynamically generated
    locationBased: [], // Will be dynamically generated
    lifestyle: [
      '#dreamhome', '#homegoals', '#luxurylifestyle', '#familytime',
      '#entertainingathome', '#homesweethome', '#interiordesign', '#architecture'
    ],
    engagement: [
      '#realtorlife', '#homeforsale', '#realestate', '#propertytour',
      '#househunting', '#newlisting', '#comingsoon', '#justlisted'
    ],
    trending: [], // Updated based on current trends
    maxHashtags: 25, // Instagram allows up to 30
    hashtagMix: 'balanced'
  },
  engagementTactics: {
    callToActions: [
      'DM me for details 📩',
      'Save this for later 💾',
      'Tag someone who needs to see this 👇',
      'Double tap if you agree ❤️',
      'Comment your favorite feature 👇',
      'Share this with your partner 💕'
    ],
    engagementBait: [
      'Swipe to see the best part ➡️',
      'Wait for it... slide 3 is everything',
      'Plot twist in the last slide',
      'The kitchen or the pool? Choose one 👇',
      'Rate this house 1-10 in the comments'
    ],
    shareWorthy: [
      'Tag your bestie who\'s house hunting',
      'Send this to someone who needs motivation',
      'Your future self will thank you',
      'This is someone\'s Pinterest board come to life'
    ],
    saveWorthy: [
      'Saving this for my vision board',
      'Screenshot for future reference',
      'Adding this to my dream home collection',
      'Filing this under \'goals\''
    ],
    commentStarters: [
      'What would you change about this space?',
      'First thing you\'d do in this kitchen?',
      'Pool party or cozy night in?',
      'Which room speaks to your soul?'
    ]
  },
  contentFormats: [
    {
      type: 'carousel',
      slides: 5,
      purpose: 'Full property showcase with lifestyle storytelling',
      template: 'Hook → Room highlights → Lifestyle benefit → Surprise feature → CTA'
    },
    {
      type: 'single',
      slides: 1,
      purpose: 'Hero image with powerful hook and engagement',
      template: 'Hero photo + viral caption + hashtags + CTA'
    },
    {
      type: 'reel',
      slides: 3,
      purpose: 'Quick property tour with trending audio',
      template: 'Hook → Transition → Reveal → CTA'
    },
    {
      type: 'story',
      slides: 4,
      purpose: 'Behind-scenes and personal connection',
      template: 'Tease → Tour → Agent insight → Swipe up'
    }
  ],
  storySequences: [
    {
      name: 'Property Reveal',
      slides: [
        'Coming to you LIVE from this incredible listing',
        'The exterior already has me speechless',
        'But wait until you see what\'s inside...',
        'Link in bio for more details!'
      ],
      engagement: ['Poll: Exterior or interior?', 'Quiz: Guess the square footage', 'Question sticker: Dream feature?']
    },
    {
      name: 'Agent POV',
      slides: [
        'Realtor confession: This house made me emotional',
        'Here\'s why this property is special',
        'The feature that sold me instantly',
        'DM me if you want the inside scoop'
      ],
      engagement: ['Rate this house 1-10', 'Ask me anything', 'Guess the price']
    }
  ]
};