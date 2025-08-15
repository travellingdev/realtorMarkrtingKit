export type RealtorPersona = 'new_agent' | 'experienced' | 'luxury' | 'volume' | 'team_leader';

export interface PersonaData {
  persona: RealtorPersona;
  confidence: number;
  indicators: string[];
}

export interface PersonaVariant {
  headline: string;
  subtext: string;
  cta: string;
  focusAreas: string[];
  trustSignals: string[];
}

// Persona detection from URL, user data, or behavior
export function detectPersona(context: {
  url?: string;
  experience?: number;
  listingsPerYear?: number;
  avgPrice?: number;
  hasTeam?: boolean;
  role?: string;
  utmSource?: string;
}): PersonaData {
  const indicators: string[] = [];
  let persona: RealtorPersona = 'experienced'; // default
  let confidence = 50;

  // URL-based detection (highest priority)
  if (context.url) {
    if (context.url.includes('/new-agent') || context.url.includes('/first-time')) {
      persona = 'new_agent';
      confidence = 95;
      indicators.push('URL indicates new agent');
    } else if (context.url.includes('/luxury') || context.url.includes('/premium')) {
      persona = 'luxury';
      confidence = 95;
      indicators.push('URL indicates luxury specialist');
    } else if (context.url.includes('/team') || context.url.includes('/broker')) {
      persona = 'team_leader';
      confidence = 95;
      indicators.push('URL indicates team leader');
    } else if (context.url.includes('/volume') || context.url.includes('/scale')) {
      persona = 'volume';
      confidence = 95;
      indicators.push('URL indicates volume agent');
    }
  }

  // Experience-based detection
  if (context.experience !== undefined) {
    if (context.experience < 2) {
      persona = 'new_agent';
      confidence = Math.max(confidence, 85);
      indicators.push(`${context.experience} years experience`);
    } else if (context.experience > 10) {
      confidence = Math.max(confidence, 75);
      indicators.push(`${context.experience} years experience (veteran)`);
    }
  }

  // Volume-based detection
  if (context.listingsPerYear !== undefined) {
    if (context.listingsPerYear > 50) {
      persona = 'volume';
      confidence = Math.max(confidence, 80);
      indicators.push(`${context.listingsPerYear} listings/year (high volume)`);
    } else if (context.listingsPerYear < 12 && persona === 'experienced') {
      persona = 'new_agent';
      confidence = Math.max(confidence, 70);
      indicators.push(`${context.listingsPerYear} listings/year (new agent)`);
    }
  }

  // Price-based detection
  if (context.avgPrice !== undefined) {
    if (context.avgPrice > 800000) {
      persona = 'luxury';
      confidence = Math.max(confidence, 75);
      indicators.push(`$${(context.avgPrice / 1000)}K avg price (luxury)`);
    }
  }

  // Team/role detection
  if (context.hasTeam || context.role === 'broker' || context.role === 'team_lead') {
    persona = 'team_leader';
    confidence = Math.max(confidence, 85);
    indicators.push('Has team or leadership role');
  }

  // UTM source detection
  if (context.utmSource) {
    if (context.utmSource.includes('luxury') || context.utmSource.includes('high-end')) {
      persona = 'luxury';
      confidence = Math.max(confidence, 70);
      indicators.push('Luxury marketing source');
    } else if (context.utmSource.includes('new-agent') || context.utmSource.includes('beginner')) {
      persona = 'new_agent';
      confidence = Math.max(confidence, 70);
      indicators.push('New agent marketing source');
    }
  }

  return { persona, confidence, indicators };
}

// Get messaging variants for each persona
export function getPersonaVariant(persona: RealtorPersona): PersonaVariant {
  const variants: Record<RealtorPersona, PersonaVariant> = {
    new_agent: {
      headline: "Your First Listing? We'll Make It Shine.",
      subtext: "Professional, MLS-safe content that builds your credibility. No compliance fears, just confidence.",
      cta: "Create My First Listing",
      focusAreas: ['compliance_safety', 'professional_appearance', 'confidence_building'],
      trustSignals: ['MLS-compliant', 'Realtor-tested', 'No experience required']
    },

    experienced: {
      headline: "Turn 2 Hours of Copy Into 2 Minutes.",
      subtext: "Professional content that matches your voice and attracts serious buyers. Built by realtors, for realtors.",
      cta: "Speed Up My Workflow",
      focusAreas: ['time_saving', 'brand_consistency', 'buyer_attraction'],
      trustSignals: ['Used by 10K+ agents', 'Maintains your voice', 'Works with any listing']
    },

    luxury: {
      headline: "Luxury Listings Deserve Luxury Copy.",
      subtext: "Sophisticated descriptions that preserve your premium brand while attracting qualified high-end buyers.",
      cta: "Craft Premium Content",
      focusAreas: ['brand_preservation', 'sophisticated_language', 'exclusivity_messaging'],
      trustSignals: ['Luxury-focused', 'Brand-safe', 'Affluent buyer tested']
    },

    volume: {
      headline: "Scale Your Content Like You Scale Your Business.",
      subtext: "Consistent, professional marketing content for every listing. Maintain quality while maximizing efficiency.",
      cta: "Scale My Content",
      focusAreas: ['speed', 'consistency', 'batch_processing', 'team_templates'],
      trustSignals: ['Bulk processing', '10x faster', 'Team-ready templates']
    },

    team_leader: {
      headline: "Ensure Every Agent Creates Professional Content.",
      subtext: "Brand-consistent marketing for your entire team. Templates, training, and quality control in one platform.",
      cta: "Standardize My Team",
      focusAreas: ['brand_consistency', 'team_training', 'quality_control', 'scalability'],
      trustSignals: ['Team management', 'Brand controls', 'Training included']
    }
  };

  return variants[persona];
}

// Hook for using persona detection in components
export function usePersonaDetection() {
  const [persona, setPersona] = React.useState<PersonaData | null>(null);

  React.useEffect(() => {
    // Detect persona from URL and any available context
    const detected = detectPersona({
      url: window.location.pathname + window.location.search,
      // Could add more context from localStorage, user data, etc.
    });
    
    setPersona(detected);
  }, []);

  return persona;
}

// Utility to get appropriate content strategy for persona
export function getPersonaContentStrategy(persona: RealtorPersona) {
  const strategies = {
    new_agent: {
      templates: ['safe_mls_templates', 'beginner_social_posts', 'client_communication_basics'],
      defaultChannels: ['mls', 'email'],
      tone: 'professional_friendly',
      complexity: 'simple'
    },
    
    experienced: {
      templates: ['complete_listing_package', 'buyer_attraction', 'brand_consistent'],
      defaultChannels: ['mls', 'instagram', 'email'],
      tone: 'professional_confident',
      complexity: 'standard'
    },
    
    luxury: {
      templates: ['luxury_descriptions', 'high_end_social', 'affluent_buyer_emails'],
      defaultChannels: ['mls', 'instagram', 'email'],
      tone: 'sophisticated_exclusive',
      complexity: 'advanced'
    },
    
    volume: {
      templates: ['quick_descriptions', 'template_variations', 'bulk_social_content'],
      defaultChannels: ['mls', 'instagram', 'email', 'facebook'],
      tone: 'efficient_professional',
      complexity: 'streamlined'
    },
    
    team_leader: {
      templates: ['team_templates', 'brand_guidelines', 'approval_workflows'],
      defaultChannels: ['mls', 'instagram', 'email', 'facebook'],
      tone: 'authoritative_consistent',
      complexity: 'enterprise'
    }
  };

  return strategies[persona];
}

// Export React import for the hook
import React from 'react';