export interface TierFeatures {
  // Photo Analysis Features
  vision: boolean;                    // Full AI photo analysis
  photoUpload: boolean;              // Can upload photos
  photoPreview: boolean;             // Can see sample analysis
  visionLimit: number;               // Max photos per analysis (0 = unlimited)
  advancedAnalysis: boolean;         // Room scoring, marketing angles
  
  // Image Generation Features  
  heroImages: boolean;               // AI hero image selection
  heroSelection: boolean;            // Smart hero image picking
  basicOverlays: boolean;            // Basic overlays (sold, pending, etc.)
  customOverlays: boolean;           // Custom overlay text/branding
  
  // Platform & Support Features
  allPlatforms: boolean;             // All social media platforms
  prioritySupport: boolean;          // Priority customer support
  apiAccess: boolean;                // API access for integrations
  multiUser: boolean;                // Multi-user team access
  whiteLabel: boolean;               // White-label capabilities
  customBranding: boolean;           // Custom branding options
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

// Free photo analysis trial configuration
export const FREE_PHOTO_ANALYSIS_LIMIT = 2; // First 2 kits get free photo analysis

export const TIER_CONFIGS: Record<string, TierConfig> = {
  FREE: {
    name: 'FREE',
    displayName: 'Free',
    price: 0,
    kitsPerMonth: 2,
    features: {
      // Photo Analysis Features - NOW INCLUDES TRIAL
      vision: true,                   // Enable for trial kits
      photoUpload: true,              // Allow photo uploads
      photoPreview: true,             // Show sample analysis
      visionLimit: 3,                 // Limit to 3 photos for free trial
      advancedAnalysis: false,        // No advanced analysis on free
      
      // Image Generation Features
      heroImages: false,
      heroSelection: false,
      basicOverlays: false,
      customOverlays: false,
      
      // Platform & Support Features
      allPlatforms: false,
      prioritySupport: false,
      apiAccess: false,
      multiUser: false,
      whiteLabel: false,
      customBranding: false,
    },
    description: 'Perfect for trying out AI-generated real estate marketing with FREE photo analysis on first 2 kits',
    costPerKit: 0.0023,
    margin: '-$0.005'
  },

  STARTER: {
    name: 'STARTER',
    displayName: 'Starter',
    price: 29,
    kitsPerMonth: 10,
    features: {
      // Photo Analysis Features
      vision: true,                   // Enable basic photo analysis
      photoUpload: true,
      photoPreview: true,
      visionLimit: 3,                 // Limit to 3 photos per kit
      advancedAnalysis: false,        // No advanced room scoring
      
      // Image Generation Features
      heroImages: false,              // No hero image generation yet
      heroSelection: false,
      basicOverlays: true,
      customOverlays: false,
      
      // Platform & Support Features
      allPlatforms: true,
      prioritySupport: false,
      apiAccess: false,
      multiUser: false,
      whiteLabel: false,
      customBranding: false,
    },
    description: 'Essential AI marketing tools with basic photo analysis (3 photos max)',
    costPerKit: 0.003,
    margin: '99.9%'
  },

  PROFESSIONAL: {
    name: 'PROFESSIONAL',
    displayName: 'Professional',
    price: 59,
    kitsPerMonth: 25,
    features: {
      // Photo Analysis Features
      vision: true,
      photoUpload: true,
      photoPreview: true,
      visionLimit: 10,                // Up to 10 photos per kit
      advancedAnalysis: true,         // Full room scoring & marketing angles
      
      // Image Generation Features
      heroImages: true,               // Full hero image generation
      heroSelection: true,            // Smart hero image picking
      basicOverlays: true,
      customOverlays: true,
      
      // Platform & Support Features
      allPlatforms: true,
      prioritySupport: false,
      apiAccess: false,
      multiUser: false,
      whiteLabel: false,
      customBranding: true,
    },
    description: 'Full visual intelligence with smart photo analysis (up to 10 photos)',
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
      // Photo Analysis Features
      vision: true,
      photoUpload: true,
      photoPreview: true,
      visionLimit: 0,                 // Unlimited photos
      advancedAnalysis: true,
      
      // Image Generation Features
      heroImages: true,
      heroSelection: true,
      basicOverlays: true,
      customOverlays: true,
      
      // Platform & Support Features
      allPlatforms: true,
      prioritySupport: true,
      apiAccess: true,
      multiUser: false,
      whiteLabel: false,
      customBranding: true,
    },
    description: 'Everything plus priority support and API access (unlimited photos)',
    costPerKit: 0.046,
    margin: '97.1%'
  },

  TEAM: {
    name: 'TEAM',
    displayName: 'Team',
    price: 299,
    kitsPerMonth: 200,
    features: {
      // Photo Analysis Features
      vision: true,
      photoUpload: true,
      photoPreview: true,
      visionLimit: 0,                 // Unlimited photos
      advancedAnalysis: true,
      
      // Image Generation Features
      heroImages: true,
      heroSelection: true,
      basicOverlays: true,
      customOverlays: true,
      
      // Platform & Support Features
      allPlatforms: true,
      prioritySupport: true,
      apiAccess: true,
      multiUser: true,
      whiteLabel: true,
      customBranding: true,
    },
    description: 'Multi-user access with white-label capabilities (unlimited photos)',
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
  const featureValue = tier.features[feature];
  
  // Handle different feature types
  if (typeof featureValue === 'boolean') {
    return featureValue;
  }
  if (typeof featureValue === 'number') {
    return featureValue > 0;
  }
  
  return false;
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

// New helper functions for photo analysis features
export function getPhotoLimit(tierName: string): number {
  const tier = getTierConfig(tierName);
  return tier.features.visionLimit;
}

export function canUploadPhotos(tierName: string): boolean {
  return canUseFeature(tierName, 'photoUpload');
}

export function canAnalyzePhotos(tierName: string): boolean {
  return canUseFeature(tierName, 'vision');
}

export function canPreviewAnalysis(tierName: string): boolean {
  return canUseFeature(tierName, 'photoPreview');
}

export function hasAdvancedAnalysis(tierName: string): boolean {
  return canUseFeature(tierName, 'advancedAnalysis');
}

export function getPhotoAnalysisLevel(tierName: string): 'none' | 'preview' | 'basic' | 'full' {
  const tier = getTierConfig(tierName);
  
  if (!tier.features.photoUpload) return 'none';
  if (!tier.features.vision && tier.features.photoPreview) return 'preview';
  if (tier.features.vision && !tier.features.advancedAnalysis) return 'basic';
  if (tier.features.vision && tier.features.advancedAnalysis) return 'full';
  
  return 'none';
}

export function checkPhotoLimitExceeded(tierName: string, photoCount: number): boolean {
  const limit = getPhotoLimit(tierName);
  return limit > 0 && photoCount > limit;
}

export function getPhotoLimitMessage(tierName: string): string {
  const limit = getPhotoLimit(tierName);
  const tier = getTierConfig(tierName);
  
  if (limit === 0) {
    return tier.features.vision ? 'Unlimited photos' : 'Photo preview only';
  }
  
  return `Up to ${limit} photo${limit > 1 ? 's' : ''} per kit`;
}

// New functions for photo analysis trial system
export function canAnalyzePhotosWithTrial(tierName: string, kitsUsed: number): boolean {
  // If tier has vision enabled, always allow
  if (canUseFeature(tierName, 'vision')) {
    return true;
  }
  
  // For FREE tier, allow analysis for first few kits
  if (tierName === 'FREE' && kitsUsed < FREE_PHOTO_ANALYSIS_LIMIT) {
    return true;
  }
  
  return false;
}

export function getRemainingPhotoAnalysisTrials(tierName: string, kitsUsed: number): number {
  if (tierName !== 'FREE') return 0;
  return Math.max(0, FREE_PHOTO_ANALYSIS_LIMIT - kitsUsed);
}

export function getPhotoAnalysisMessage(tierName: string, kitsUsed: number): string {
  if (canUseFeature(tierName, 'vision')) {
    return 'AI photo analysis included';
  }
  
  const remaining = getRemainingPhotoAnalysisTrials(tierName, kitsUsed);
  if (remaining > 0) {
    return `FREE photo analysis (${remaining} kit${remaining > 1 ? 's' : ''} remaining)`;
  }
  
  return 'Upgrade for photo analysis';
}

// Enhanced feature descriptions for UI with specific benefits
export const FEATURE_DESCRIPTIONS: Record<keyof TierFeatures, string> = {
  // Photo Analysis Features
  vision: 'AI analyzes your property photos using GPT-4 Vision to automatically identify features, room types, and selling points for better marketing copy',
  photoUpload: 'Upload property photos to enhance your marketing content generation',
  photoPreview: 'See what AI photo analysis can do with sample results and demo features',
  visionLimit: 'Number of photos that can be analyzed per marketing kit',
  advancedAnalysis: 'Deep room scoring, condition assessment, and sophisticated marketing angle suggestions',
  
  // Image Generation Features
  heroImages: 'AI-powered hero image selection with professional overlays (Just Listed, Open House, Sold) optimized for Facebook, Instagram, Email, Print and Web. Saves 2+ hours per listing.',
  heroSelection: 'Smart AI algorithm picks the most engaging photo from your uploads for maximum marketing impact',
  basicOverlays: 'Simple text overlays and social media templates for quick property marketing',
  customOverlays: 'Custom overlay text, branding, and style options for personalized marketing materials',
  
  // Platform & Support Features
  allPlatforms: 'Export perfectly sized content for Facebook (1200×630), Instagram (1080×1080), Stories (1080×1920), Email (600×400), Website (1920×1080), and Print (8.5×11")',
  prioritySupport: 'Get help within 2-4 hours instead of 24-48 hours with dedicated priority email support',
  apiAccess: 'REST API access for custom integrations, bulk processing, and connecting with your existing CRM or listing management system',
  multiUser: 'Team collaboration with multiple user accounts, shared templates, and consolidated billing for brokerages',
  whiteLabel: 'Complete white-label solution - remove all RealtorKit branding and use your own company name and logo throughout',
  customBranding: 'Add your brokerage logo, brand colors, contact information, and QR codes to all generated marketing materials'
};

// Extended feature benefits for detailed explanations
export const FEATURE_BENEFITS: Record<keyof TierFeatures, string[]> = {
  // Photo Analysis Features
  vision: [
    'Identifies room types, architectural features, and finishes automatically',
    'Extracts selling points like "granite counters" and "hardwood floors"',
    'Analyzes lighting, condition, and staging quality',
    'Suggests marketing angles based on visual analysis'
  ],
  photoUpload: [
    'Drag and drop multiple photos at once',
    'Support for all common image formats (JPG, PNG, HEIC)',
    'Automatic image optimization and resizing',
    'Preview thumbnails with easy reordering'
  ],
  photoPreview: [
    'See sample AI analysis results',
    'Preview room detection capabilities',
    'View example feature extraction',
    'Understand the value before upgrading'
  ],
  visionLimit: [
    'FREE: Photo preview only',
    'STARTER: Up to 3 photos analyzed',
    'PROFESSIONAL: Up to 10 photos analyzed',
    'PREMIUM & TEAM: Unlimited photo analysis'
  ],
  advancedAnalysis: [
    'Detailed room condition scoring (1-10)',
    'Marketing appeal assessment',
    'Staging quality evaluation',
    'Sophisticated demographic targeting suggestions'
  ],
  
  // Image Generation Features
  heroImages: [
    'AI selects the most engaging photo from your uploads',
    'Creates professional "Just Listed", "Open House", "Price Reduced", "Pending", and "Sold" overlays',
    'Generates platform-specific sizes automatically',
    'Modern, Luxury, Minimal, and Bold style options',
    'Includes property details, pricing, and agent branding',
    'Saves 2-3 hours of manual design work per listing'
  ],
  heroSelection: [
    'Analyzes composition, lighting, and visual appeal',
    'Considers room type marketing value',
    'Evaluates photo quality and resolution',
    'Provides reasoning for selection choice'
  ],
  basicOverlays: [
    'Pre-designed templates for social media posts',
    'Simple text overlays with your branding',
    'Quick property highlight graphics'
  ],
  customOverlays: [
    'Custom text and messaging options',
    'Brand color and font customization',
    'Logo placement and sizing control',
    'QR code integration for easy contact'
  ],
  allPlatforms: [
    'Facebook Feed posts (1200×630px)',
    'Instagram Feed squares (1080×1080px)', 
    'Instagram & Facebook Stories (1080×1920px)',
    'Email newsletter headers (600×400px)',
    'Website hero images (1920×1080px)',
    'Print flyers and handouts (8.5×11")'
  ],
  prioritySupport: [
    '2-4 hour response time vs 24-48 hours',
    'Direct line to senior support specialists',
    'Priority bug fixes and feature requests',
    'Phone support available upon request'
  ],
  apiAccess: [
    'RESTful API with comprehensive documentation',
    'Bulk generation capabilities',
    'Webhook notifications for completed jobs',
    'Integration with MLS, CRM, and listing platforms',
    'Custom workflow automation'
  ],
  multiUser: [
    'Add unlimited team members',
    'Shared templates and brand guidelines',
    'Usage analytics by team member',
    'Consolidated billing and admin controls',
    'Team performance dashboards'
  ],
  whiteLabel: [
    'Complete removal of RealtorKit branding',
    'Custom domain setup (your-company.com)',
    'Your company name throughout the interface',
    'Custom login page and email templates'
  ],
  customBranding: [
    'Upload and position your brokerage logo',
    'Set brand colors and fonts',
    'Add contact information to all materials',
    'Include QR codes for easy contact',
    'Custom footer text and disclaimers'
  ]
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