import { type RealtorPersona } from './personaDetector';

// Essential inputs from the simplified form
export interface EssentialInputs {
  address: string;
  propertyType: string;
  priceRange: string;
  keyFeature: string;
  photos: File[];
}

// Generated content configuration
export interface ContentStrategy {
  // Basic property details (generated from essentials)
  beds: string;
  baths: string;
  sqft: string;
  neighborhood: string;
  features: string;
  
  // Content configuration
  propertyTemplate: string;
  tone: string;
  brandVoice: string;
  channels: string[];
  
  // Advanced settings
  readingLevel: string;
  useEmojis: boolean;
  hashtagStrategy: string;
  mlsFormat: string;
  
  // Target audience
  targetBuyer: string;
  contentFocus: string;
}

// Property type intelligence
const PROPERTY_TYPE_INTELLIGENCE = {
  starter_home: {
    typicalBeds: '3',
    typicalBaths: '2',
    typicalSqft: '1,400',
    propertyTemplate: 'Starter Home',
    tone: 'Warm & Lifestyle',
    targetBuyer: 'first_time_buyers',
    contentFocus: 'affordability_potential',
    brandVoice: 'Friendly, approachable, highlighting value and potential. Focus on lifestyle and community benefits.',
    channels: ['mls', 'instagram', 'email', 'facebook'],
    readingLevel: '8th grade',
    useEmojis: false,
    hashtagStrategy: 'neighborhood',
    mlsFormat: 'paragraph'
  },
  luxury_home: {
    typicalBeds: '4',
    typicalBaths: '3',
    typicalSqft: '3,200',
    propertyTemplate: 'Luxury',
    tone: 'Concise MLS',
    targetBuyer: 'luxury_buyers',
    contentFocus: 'exclusivity_prestige',
    brandVoice: 'Sophisticated, refined, emphasizing exclusivity and premium features. Confident and understated elegance.',
    channels: ['mls', 'instagram', 'email'],
    readingLevel: 'college',
    useEmojis: false,
    hashtagStrategy: 'luxury lifestyle',
    mlsFormat: 'paragraph'
  },
  condo_townhome: {
    typicalBeds: '2',
    typicalBaths: '2',
    typicalSqft: '1,100',
    propertyTemplate: 'Downtown Condo',
    tone: 'Warm & Lifestyle',
    targetBuyer: 'urban_professionals',
    contentFocus: 'convenience_lifestyle',
    brandVoice: 'Modern, urban, emphasizing convenience and lifestyle. Appeal to busy professionals.',
    channels: ['mls', 'instagram', 'email', 'facebook'],
    readingLevel: '8th grade',
    useEmojis: true,
    hashtagStrategy: 'urban lifestyle',
    mlsFormat: 'paragraph'
  },
  starter_condo: {
    typicalBeds: '1',
    typicalBaths: '1',
    typicalSqft: '750',
    propertyTemplate: 'Starter Home',
    tone: 'Warm & Lifestyle',
    targetBuyer: 'first_time_buyers',
    contentFocus: 'affordability_investment',
    brandVoice: 'Encouraging, investment-focused, highlighting starter home benefits and future potential.',
    channels: ['mls', 'instagram', 'email'],
    readingLevel: '8th grade',
    useEmojis: false,
    hashtagStrategy: 'first time buyer',
    mlsFormat: 'paragraph'
  },
  investment_property: {
    typicalBeds: '3',
    typicalBaths: '2',
    typicalSqft: '1,200',
    propertyTemplate: 'Investor Flip',
    tone: 'Data-driven',
    targetBuyer: 'investors',
    contentFocus: 'roi_potential',
    brandVoice: 'Direct, numbers-focused, highlighting ROI potential and investment metrics. No emotional fluff.',
    channels: ['mls', 'email'],
    readingLevel: 'professional',
    useEmojis: false,
    hashtagStrategy: 'investment roi',
    mlsFormat: 'bullets'
  },
  fixer_upper: {
    typicalBeds: '3',
    typicalBaths: '2',
    typicalSqft: '1,300',
    propertyTemplate: 'Fixer-Upper',
    tone: 'Data-driven',
    targetBuyer: 'investors',
    contentFocus: 'potential_value',
    brandVoice: 'Honest about condition, focus on potential and possibilities. Include renovation estimates where possible.',
    channels: ['mls', 'email'],
    readingLevel: 'professional',
    useEmojis: false,
    hashtagStrategy: 'renovation potential',
    mlsFormat: 'bullets'
  }
};

// Price range intelligence
const PRICE_RANGE_INTELLIGENCE = {
  under_300k: {
    targetBuyer: 'first_time_buyers',
    tone: 'Warm & Lifestyle',
    contentFocus: 'affordability_value',
    messaging: 'affordable, great value, perfect starter'
  },
  '300k_500k': {
    targetBuyer: 'growing_families',
    tone: 'Warm & Lifestyle', 
    contentFocus: 'family_lifestyle',
    messaging: 'family-perfect, room to grow, established neighborhood'
  },
  '500k_800k': {
    targetBuyer: 'move_up_buyers',
    tone: 'Professional',
    contentFocus: 'upgrade_lifestyle',
    messaging: 'spacious upgrade, premium features, established area'
  },
  '800k_plus': {
    targetBuyer: 'luxury_buyers',
    tone: 'Concise MLS',
    contentFocus: 'luxury_exclusivity',
    messaging: 'luxury, exclusive, premium, sophisticated'
  },
  varies: {
    targetBuyer: 'investors',
    tone: 'Data-driven',
    contentFocus: 'investment_roi',
    messaging: 'investment opportunity, cash flow, ROI potential'
  }
};

// Persona-specific adjustments
const PERSONA_ADJUSTMENTS = {
  new_agent: {
    prioritizeCompliance: true,
    simplifyLanguage: true,
    addEducationalNotes: true,
    focusOnSafety: true
  },
  experienced: {
    maintainBrandVoice: true,
    efficientGeneration: true,
    professionalTone: true,
    buyerFocus: true
  },
  luxury: {
    sophisticatedLanguage: true,
    brandProtection: true,
    exclusiveMessaging: true,
    qualifiedBuyerFocus: true
  },
  volume: {
    speedOptimized: true,
    templateConsistency: true,
    batchFriendly: true,
    scalableFormats: true
  },
  team_leader: {
    brandConsistency: true,
    approvalWorkflow: true,
    templateStandardization: true,
    qualityControl: true
  }
};

// Generate smart neighborhood from address
function generateNeighborhood(address: string): string {
  if (!address) return "the area";
  
  // Extract potential neighborhood/city from address
  const parts = address.split(',');
  if (parts.length > 1) {
    return parts[1].trim();
  }
  
  // Extract from street name patterns
  const streetMatch = address.match(/\d+\s+(.+?)\s+(St|Street|Ave|Avenue|Dr|Drive|Rd|Road|Blvd|Boulevard|Ln|Lane|Ct|Court|Pl|Place|Way)/i);
  if (streetMatch && streetMatch[1]) {
    const streetName = streetMatch[1];
    // Common patterns: "Oak Hill Dr" -> "Oak Hill", "Maple Street" -> "Maple"  
    return streetName;
  }
  
  return "this neighborhood";
}

// Generate smart features from key feature and property type
function generateFeatures(keyFeature: string, propertyType: string, priceRange: string): string {
  const features: string[] = [];
  
  // Add the key feature if provided
  if (keyFeature) {
    features.push(keyFeature);
  }
  
  // Add common features based on property type and price range
  const typeInfo = PROPERTY_TYPE_INTELLIGENCE[propertyType as keyof typeof PROPERTY_TYPE_INTELLIGENCE];
  const priceInfo = PRICE_RANGE_INTELLIGENCE[priceRange as keyof typeof PRICE_RANGE_INTELLIGENCE];
  
  if (propertyType === 'starter_home') {
    features.push('Open floor plan', 'Updated kitchen', 'Fenced yard');
  } else if (propertyType === 'luxury_home') {
    features.push('Chef\'s kitchen', 'Hardwood floors', 'Premium finishes');
  } else if (propertyType.includes('condo')) {
    features.push('Low maintenance', 'Convenient location', 'Modern amenities');
  } else if (propertyType === 'investment_property') {
    features.push('Rental potential', 'Solid construction', 'Good location');
  }
  
  // Add price-based features
  if (priceRange === 'under_300k') {
    features.push('Great value', 'Move-in ready');
  } else if (priceRange === '800k_plus') {
    features.push('Premium location', 'Luxury amenities');
  }
  
  return features.slice(0, 6).join(', ');
}

// Main function to generate content strategy from essential inputs
export function generateContentStrategy(
  essentials: EssentialInputs,
  contentTypes: string[],
  persona: RealtorPersona
): ContentStrategy {
  const propertyInfo = PROPERTY_TYPE_INTELLIGENCE[essentials.propertyType as keyof typeof PROPERTY_TYPE_INTELLIGENCE];
  const priceInfo = PRICE_RANGE_INTELLIGENCE[essentials.priceRange as keyof typeof PRICE_RANGE_INTELLIGENCE];
  const personaAdjustments = PERSONA_ADJUSTMENTS[persona];
  
  if (!propertyInfo) {
    throw new Error(`Unknown property type: ${essentials.propertyType}`);
  }
  
  // Generate smart defaults
  const strategy: ContentStrategy = {
    // Auto-generated property details
    beds: propertyInfo.typicalBeds,
    baths: propertyInfo.typicalBaths,
    sqft: propertyInfo.typicalSqft,
    neighborhood: generateNeighborhood(essentials.address),
    features: generateFeatures(essentials.keyFeature, essentials.propertyType, essentials.priceRange),
    
    // Content configuration from property type
    propertyTemplate: propertyInfo.propertyTemplate,
    tone: propertyInfo.tone,
    brandVoice: propertyInfo.brandVoice,
    channels: [...propertyInfo.channels], // Copy array
    
    // Advanced settings
    readingLevel: propertyInfo.readingLevel,
    useEmojis: propertyInfo.useEmojis,
    hashtagStrategy: propertyInfo.hashtagStrategy,
    mlsFormat: propertyInfo.mlsFormat,
    
    // Target audience
    targetBuyer: priceInfo?.targetBuyer || propertyInfo.targetBuyer,
    contentFocus: priceInfo?.contentFocus || propertyInfo.contentFocus
  };
  
  // Apply persona-specific adjustments
  if (personaAdjustments) {
    if ('simplifyLanguage' in personaAdjustments && personaAdjustments.simplifyLanguage) {
      strategy.readingLevel = '6th grade';
    }
    
    if ('sophisticatedLanguage' in personaAdjustments && personaAdjustments.sophisticatedLanguage) {
      strategy.readingLevel = 'college';
      strategy.tone = 'Concise MLS';
    }
    
    if ('speedOptimized' in personaAdjustments && personaAdjustments.speedOptimized) {
      strategy.mlsFormat = 'bullets';
      strategy.channels = strategy.channels.filter(c => c !== 'facebook'); // Reduce channels for speed
    }
    
    if ('brandProtection' in personaAdjustments && personaAdjustments.brandProtection && persona === 'luxury') {
      strategy.brandVoice = `${strategy.brandVoice} IMPORTANT: Maintain sophisticated, premium language that reflects luxury market positioning.`;
    }
  }
  
  // Apply content type specific adjustments
  if (contentTypes.includes('buyer_attraction')) {
    strategy.tone = 'Hype for Social';
    strategy.useEmojis = true;
    if (!strategy.channels.includes('instagram')) {
      strategy.channels.push('instagram');
    }
  }
  
  if (contentTypes.includes('seller_communication')) {
    if (!strategy.channels.includes('email')) {
      strategy.channels.push('email');
    }
    strategy.brandVoice = `${strategy.brandVoice} Include professional updates and market insights for sellers.`;
  }
  
  if (contentTypes.includes('client_nurturing')) {
    if (!strategy.channels.includes('email')) {
      strategy.channels.push('email');
    }
    strategy.brandVoice = `${strategy.brandVoice} Focus on relationship building and staying top-of-mind.`;
  }
  
  return strategy;
}

// Helper to get human-readable strategy summary
export function getStrategySummary(strategy: ContentStrategy): string {
  return `${strategy.propertyTemplate} targeting ${strategy.targetBuyer} with ${strategy.tone.toLowerCase()} tone across ${strategy.channels.length} channels`;
}

// Helper to validate essential inputs
export function validateEssentials(essentials: EssentialInputs): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!essentials.propertyType) {
    errors.push('Property type is required');
  }
  
  if (!essentials.priceRange) {
    errors.push('Price range is required');
  }
  
  if (!essentials.propertyType || !(essentials.propertyType in PROPERTY_TYPE_INTELLIGENCE)) {
    errors.push('Invalid property type selected');
  }
  
  if (!essentials.priceRange || !(essentials.priceRange in PRICE_RANGE_INTELLIGENCE)) {
    errors.push('Invalid price range selected');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}