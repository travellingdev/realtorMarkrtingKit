export interface TierFeatures {
  vision: boolean;
  heroImages: boolean;
  basicOverlays: boolean;
  allPlatforms: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
  multiUser: boolean;
  whiteLabel: boolean;
  customBranding: boolean;
}

export interface TierConfig {
  name: string;
  displayName: string;
  price: number;
  kitsPerMonth: number;
  features: TierFeatures;
  description: string;
  popular?: boolean;
  costPerKit: number;
  margin: string;
}

export const TIER_CONFIGS: Record<string, TierConfig> = {
  FREE: {
    name: 'FREE',
    displayName: 'Free',
    price: 0,
    kitsPerMonth: 2,
    features: {
      vision: false,
      heroImages: false,
      basicOverlays: false,
      allPlatforms: false,
      prioritySupport: false,
      apiAccess: false,
      multiUser: false,
      whiteLabel: false,
      customBranding: false,
    },
    description: 'Perfect for trying out AI-generated real estate marketing',
    costPerKit: 0.0023,
    margin: '-$0.005'
  },

  STARTER: {
    name: 'STARTER',
    displayName: 'Starter',
    price: 29,
    kitsPerMonth: 10,
    features: {
      vision: false,
      heroImages: false,
      basicOverlays: true,
      allPlatforms: true,
      prioritySupport: false,
      apiAccess: false,
      multiUser: false,
      whiteLabel: false,
      customBranding: false,
    },
    description: 'Essential AI marketing tools for new realtors',
    costPerKit: 0.003,
    margin: '99.9%'
  },

  PROFESSIONAL: {
    name: 'PROFESSIONAL',
    displayName: 'Professional',
    price: 59,
    kitsPerMonth: 25,
    features: {
      vision: true,
      heroImages: true,
      basicOverlays: true,
      allPlatforms: true,
      prioritySupport: false,
      apiAccess: false,
      multiUser: false,
      whiteLabel: false,
      customBranding: true,
    },
    description: 'Full visual intelligence with smart photo analysis',
    popular: true,
    costPerKit: 0.046,
    margin: '98.1%'
  },

  PREMIUM: {
    name: 'PREMIUM',
    displayName: 'Premium',
    price: 119,
    kitsPerMonth: 75,
    features: {
      vision: true,
      heroImages: true,
      basicOverlays: true,
      allPlatforms: true,
      prioritySupport: true,
      apiAccess: true,
      multiUser: false,
      whiteLabel: false,
      customBranding: true,
    },
    description: 'Everything plus priority support and API access',
    costPerKit: 0.046,
    margin: '97.1%'
  },

  TEAM: {
    name: 'TEAM',
    displayName: 'Team',
    price: 299,
    kitsPerMonth: 200,
    features: {
      vision: true,
      heroImages: true,
      basicOverlays: true,
      allPlatforms: true,
      prioritySupport: true,
      apiAccess: true,
      multiUser: true,
      whiteLabel: true,
      customBranding: true,
    },
    description: 'Multi-user access with white-label capabilities',
    costPerKit: 0.046,
    margin: '96.9%'
  }
};

// Helper functions
export function getTierConfig(tierName: string): TierConfig {
  return TIER_CONFIGS[tierName] || TIER_CONFIGS.FREE;
}

export function canUseFeature(tierName: string, feature: keyof TierFeatures): boolean {
  const tier = getTierConfig(tierName);
  return tier.features[feature];
}

export function getRemainingQuota(tierName: string, quotaUsed: number, extraQuota: number = 0): number {
  const tier = getTierConfig(tierName);
  const totalLimit = tier.kitsPerMonth + extraQuota;
  return Math.max(0, totalLimit - quotaUsed);
}

export function isQuotaExceeded(tierName: string, quotaUsed: number, extraQuota: number = 0): boolean {
  return getRemainingQuota(tierName, quotaUsed, extraQuota) <= 0;
}

export function getUpgradeRecommendation(currentTier: string, feature?: keyof TierFeatures): TierConfig | null {
  const current = getTierConfig(currentTier);
  
  // If looking for a specific feature
  if (feature) {
    for (const [tierName, config] of Object.entries(TIER_CONFIGS)) {
      if (config.features[feature] && !current.features[feature]) {
        return config;
      }
    }
  }
  
  // General upgrade path
  const upgradePath: Record<string, string> = {
    'FREE': 'STARTER',
    'STARTER': 'PROFESSIONAL', 
    'PROFESSIONAL': 'PREMIUM',
    'PREMIUM': 'TEAM'
  };
  
  const nextTier = upgradePath[currentTier];
  return nextTier ? TIER_CONFIGS[nextTier] : null;
}

// Feature descriptions for UI
export const FEATURE_DESCRIPTIONS: Record<keyof TierFeatures, string> = {
  vision: 'AI analyzes your property photos to extract features and selling points',
  heroImages: 'Intelligent hero image selection with multi-platform overlays',
  basicOverlays: 'Simple text overlays for social media and marketing',
  allPlatforms: 'Export to Facebook, Instagram, Email, Print, and Web formats',
  prioritySupport: 'Priority email support with faster response times',
  apiAccess: 'REST API access for custom integrations',
  multiUser: 'Team collaboration with multiple user accounts',
  whiteLabel: 'Remove branding and customize with your own',
  customBranding: 'Add your logo, colors, and contact information'
};

// Tier comparison for pricing pages
export const TIER_COMPARISON_FEATURES = [
  { key: 'kitsPerMonth', label: 'Marketing Kits / Month', type: 'number' },
  { key: 'vision', label: 'AI Photo Analysis', type: 'boolean' },
  { key: 'heroImages', label: 'Smart Hero Selection', type: 'boolean' },
  { key: 'allPlatforms', label: 'Multi-Platform Export', type: 'boolean' },
  { key: 'customBranding', label: 'Custom Branding', type: 'boolean' },
  { key: 'prioritySupport', label: 'Priority Support', type: 'boolean' },
  { key: 'apiAccess', label: 'API Access', type: 'boolean' },
  { key: 'multiUser', label: 'Team Collaboration', type: 'boolean' },
  { key: 'whiteLabel', label: 'White Label', type: 'boolean' },
] as const;