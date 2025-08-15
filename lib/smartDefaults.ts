export interface SmartDefault {
  propertyType: string;
  tone: string;
  channels: string[];
  mlsFormat: string;
  readingLevel: string;
  useEmojis: boolean;
  hashtagStrategy: string;
  brandVoice: string;
}

export const SMART_DEFAULTS: Record<string, SmartDefault> = {
  starter: {
    propertyType: "Starter Home",
    tone: "Warm & Lifestyle",
    channels: ['mls', 'instagram', 'email'],
    mlsFormat: "paragraph",
    readingLevel: "8th grade",
    useEmojis: false,
    hashtagStrategy: "neighborhood",
    brandVoice: "Friendly, approachable, highlighting value and potential. Focus on lifestyle and community."
  },
  luxury: {
    propertyType: "Luxury",
    tone: "Concise MLS",
    channels: ['mls', 'instagram', 'reel', 'email'],
    mlsFormat: "paragraph",
    readingLevel: "college",
    useEmojis: false,
    hashtagStrategy: "luxury lifestyle",
    brandVoice: "Sophisticated, refined, emphasizing exclusivity and premium features. Confident and understated."
  },
  investor: {
    propertyType: "Investor Flip",
    tone: "Data-driven",
    channels: ['mls', 'email'],
    mlsFormat: "bullets",
    readingLevel: "professional",
    useEmojis: false,
    hashtagStrategy: "investment roi",
    brandVoice: "Direct, numbers-focused, highlighting ROI potential and investment metrics. No fluff."
  },
  condo: {
    propertyType: "Downtown Condo",
    tone: "Warm & Lifestyle",
    channels: ['mls', 'instagram', 'reel', 'email'],
    mlsFormat: "paragraph",
    readingLevel: "8th grade",
    useEmojis: true,
    hashtagStrategy: "urban lifestyle",
    brandVoice: "Modern, urban, emphasizing convenience and lifestyle. Appeal to young professionals."
  },
  family: {
    propertyType: "Starter Home",
    tone: "Warm & Lifestyle",
    channels: ['mls', 'instagram', 'email', 'facebook'],
    mlsFormat: "paragraph",
    readingLevel: "8th grade",
    useEmojis: false,
    hashtagStrategy: "family neighborhood",
    brandVoice: "Warm, family-focused, highlighting schools, safety, and community. Create emotional connection."
  },
  fixer: {
    propertyType: "Fixer-Upper",
    tone: "Data-driven",
    channels: ['mls', 'email'],
    mlsFormat: "bullets",
    readingLevel: "professional",
    useEmojis: false,
    hashtagStrategy: "renovation potential",
    brandVoice: "Honest about condition, focus on potential and possibilities. Include renovation estimates."
  }
};

export function getSmartDefaults(preset: keyof typeof SMART_DEFAULTS): SmartDefault {
  return SMART_DEFAULTS[preset] || SMART_DEFAULTS.starter;
}

export function detectBestPreset(features: {
  sqft?: string;
  features?: string;
  propertyType?: string;
  neighborhood?: string;
}): keyof typeof SMART_DEFAULTS {
  const sqftNum = parseInt(features.sqft || '0');
  const featuresList = features.features?.toLowerCase() || '';
  const neighborhood = features.neighborhood?.toLowerCase() || '';
  
  // Detect luxury
  if (sqftNum > 4000 || 
      featuresList.includes('pool') || 
      featuresList.includes('wine') ||
      featuresList.includes('theater') ||
      featuresList.includes('luxury')) {
    return 'luxury';
  }
  
  // Detect fixer-upper
  if (featuresList.includes('fixer') || 
      featuresList.includes('needs work') ||
      featuresList.includes('handyman') ||
      featuresList.includes('tlc')) {
    return 'fixer';
  }
  
  // Detect condo
  if (features.propertyType?.includes('Condo') ||
      neighborhood.includes('downtown') ||
      neighborhood.includes('urban')) {
    return 'condo';
  }
  
  // Detect investor
  if (features.propertyType?.includes('Investor') ||
      featuresList.includes('rental') ||
      featuresList.includes('investment')) {
    return 'investor';
  }
  
  // Detect family home
  if (sqftNum > 2000 && sqftNum < 4000) {
    return 'family';
  }
  
  // Default to starter
  return 'starter';
}