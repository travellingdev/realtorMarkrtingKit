/**
 * Hero Image Feature Configuration
 * Centralized config for easy enable/disable
 */

import { shouldShowFeature } from '../toggles';

export const HERO_IMAGE_CONFIG = {
  // Master switch - controlled by feature toggles
  enabled: shouldShowFeature('heroImages'),
  
  // Feature flags for granular control
  features: {
    showInOutputs: true,        // Show in outputs section
    autoSelectBest: true,       // Auto-select best image
    showEnhancements: true,     // Show enhancement options
    allowDownload: true,        // Allow downloading
    showScoring: true,          // Show AI scoring details
  },
  
  // Tier access configuration
  tiers: {
    FREE: {
      enabled: true,  // Enabled for first 2 kits
      message: 'Hero Images included with your free kits',
      generations: 2,
      features: ['sky', 'brightness'], // Basic features for free users
    },
    STARTER: {
      enabled: true,
      generations: 5,
      features: ['sky', 'brightness'],
      watermark: true,
    },
    PROFESSIONAL: {
      enabled: true,
      generations: 20,
      features: ['sky', 'brightness', 'staging', 'twilight'],
      watermark: false,
    },
    PREMIUM: {
      enabled: true,
      generations: -1, // unlimited
      features: ['all'],
      watermark: false,
      variations: 3,
    },
  },
  
  // UI positioning
  placement: {
    position: 'after-mls', // Options: 'after-mls', 'before-outputs', 'floating', 'tab'
    expandedByDefault: true,  // Auto-expand when photos exist
    showPreview: true,
    autoAnalyze: true,         // Automatically analyze photos on mount
  },
  
  // Enhancement options
  enhancements: {
    sky: {
      enabled: true,
      label: 'Perfect Sky',
      icon: '☀️',
      description: 'Replace cloudy sky with blue skies',
    },
    twilight: {
      enabled: true,
      label: 'Twilight Magic',
      icon: '🌅',
      description: 'Convert to golden hour lighting',
    },
    staging: {
      enabled: true,
      label: 'Virtual Staging',
      icon: '🛋️',
      description: 'Add furniture to empty rooms',
    },
    seasonal: {
      enabled: true,
      label: 'Season Change',
      icon: '🍂',
      description: 'Change seasonal appearance',
    },
  },
  
  // API endpoints
  api: {
    analyze: '/api/hero-image/analyze',
    generate: '/api/hero-image/generate',
    download: '/api/hero-image/download',
  },
  
  // Scoring weights for AI selection
  scoring: {
    weights: {
      emotional: 0.30,
      technical: 0.20,
      marketing: 0.25,
      story: 0.15,
      uniqueness: 0.10,
    },
    minScore: 60, // Minimum score to be considered
    showTopN: 3,  // Show top N alternatives
  },
};

// Helper function to check if feature is enabled for user
export function isHeroImageEnabled(userTier: string = 'FREE'): boolean {
  if (!HERO_IMAGE_CONFIG.enabled) return false;
  
  const tierConfig = HERO_IMAGE_CONFIG.tiers[userTier as keyof typeof HERO_IMAGE_CONFIG.tiers];
  return tierConfig?.enabled || false;
}

// Helper to get remaining generations
export function getHeroImageGenerations(userTier: string, used: number = 0): number {
  const tierConfig = HERO_IMAGE_CONFIG.tiers[userTier as keyof typeof HERO_IMAGE_CONFIG.tiers];
  if (!tierConfig) return 0;
  
  const limit = tierConfig.generations;
  if (limit === -1) return -1; // unlimited
  
  return Math.max(0, limit - used);
}