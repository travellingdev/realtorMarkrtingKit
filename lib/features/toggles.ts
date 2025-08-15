/**
 * Feature Toggles - Central control for all optional features
 * Change these to enable/disable features without code changes
 */

export const FEATURE_TOGGLES = {
  // Hero Image System
  heroImages: {
    enabled: true,                    // Master switch
    showInDev: true,                  // Show in development
    showInProd: true,                 // Show in production (set to true when ready)
    requiresAuth: false,              // Requires authentication
    minimumTier: 'FREE',              // Minimum tier required (FREE for testing)
  },
  
  // Other features can be added here
  advancedAnalytics: {
    enabled: false,
    showInDev: true,
    showInProd: false,
    requiresAuth: true,
    minimumTier: 'PROFESSIONAL',
  },
  
  teamCollaboration: {
    enabled: false,
    showInDev: false,
    showInProd: false,
    requiresAuth: true,
    minimumTier: 'TEAM',
  },
};

/**
 * Check if a feature should be shown
 */
export function shouldShowFeature(
  featureName: keyof typeof FEATURE_TOGGLES,
  isDev: boolean = process.env.NODE_ENV === 'development'
): boolean {
  const feature = FEATURE_TOGGLES[featureName];
  if (!feature || !feature.enabled) return false;
  
  return isDev ? feature.showInDev : feature.showInProd;
}

/**
 * Get all enabled features for current environment
 */
export function getEnabledFeatures(): string[] {
  const isDev = process.env.NODE_ENV === 'development';
  
  return Object.entries(FEATURE_TOGGLES)
    .filter(([_, config]) => {
      if (!config.enabled) return false;
      return isDev ? config.showInDev : config.showInProd;
    })
    .map(([name]) => name);
}