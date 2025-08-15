// Challenge Reframing Logic - Turn property weaknesses into strengths

export interface Challenge {
  id: string;
  original: string;
  reframed: string;
  category: 'size' | 'condition' | 'location' | 'features' | 'age' | 'layout';
}

// Common property challenges and their positive reframes
export const CHALLENGE_REFRAMES: Record<string, string> = {
  // Size challenges
  'small rooms': 'cozy and efficient spaces',
  'tiny kitchen': 'efficient galley kitchen',
  'small lot': 'low-maintenance yard',
  'no yard': 'maintenance-free living',
  'limited storage': 'minimalist-friendly design',
  'small closets': 'encourages organized living',
  'compact layout': 'efficient use of space',
  
  // Condition challenges
  'dated kitchen': 'opportunity to customize to your taste',
  'needs updating': 'blank canvas for your vision',
  'original fixtures': 'vintage character and charm',
  'older appliances': 'opportunity for energy-efficient upgrades',
  'worn carpet': 'potential hardwood floors underneath',
  'needs paint': 'ready for your personal color palette',
  'tlc needed': 'priced to reflect renovation potential',
  'fixer upper': 'investment opportunity with sweat equity potential',
  
  // Location challenges
  'busy street': 'convenient access to major routes',
  'near highway': 'easy commute to anywhere',
  'no parking': 'walkable neighborhood',
  'limited parking': 'encourages eco-friendly transportation',
  'corner lot': 'multiple access points and extra light',
  'backs to commercial': 'no rear neighbors for privacy',
  'near train': 'public transit accessible',
  'flight path': 'close to airport for travelers',
  
  // Feature challenges
  'no garage': 'more yard space',
  'no basement': 'no basement maintenance concerns',
  'no fireplace': 'flexible wall space for furniture',
  'one bathroom': 'easier to maintain and clean',
  'no dining room': 'open concept living',
  'galley kitchen': 'efficient chef-style workflow',
  'no master bath': 'more bedroom square footage',
  
  // Age challenges
  'older home': 'mature character and established neighborhood',
  '1950s build': 'solid mid-century construction',
  '1970s style': 'retro charm with good bones',
  'needs modernization': 'opportunity to add value',
  'original windows': 'vintage architectural details',
  'old roof': 'negotiable for right price',
  'aging systems': 'upgrade to efficient modern systems',
  
  // Layout challenges
  'closed floor plan': 'defined spaces for privacy',
  'unusual layout': 'unique character home',
  'narrow lot': 'efficient land use',
  'steep driveway': 'elevated position with potential views',
  'split level': 'natural separation of living spaces',
  'no open concept': 'traditional layout with defined rooms',
  'awkward room': 'flex space for creative use',
};

// Categories of challenges for smart suggestions
export const CHALLENGE_CATEGORIES = {
  size: [
    'small rooms',
    'tiny kitchen',
    'small lot',
    'no yard',
    'limited storage',
    'small closets',
    'compact layout',
  ],
  condition: [
    'dated kitchen',
    'needs updating',
    'original fixtures',
    'older appliances',
    'worn carpet',
    'needs paint',
    'tlc needed',
    'fixer upper',
  ],
  location: [
    'busy street',
    'near highway',
    'no parking',
    'corner lot',
    'backs to commercial',
    'near train',
    'flight path',
  ],
  features: [
    'no garage',
    'no basement',
    'no fireplace',
    'one bathroom',
    'no dining room',
    'galley kitchen',
    'no master bath',
  ],
  age: [
    'older home',
    '1950s build',
    '1970s style',
    'needs modernization',
    'original windows',
    'old roof',
    'aging systems',
  ],
  layout: [
    'closed floor plan',
    'unusual layout',
    'narrow lot',
    'steep driveway',
    'split level',
    'no open concept',
    'awkward room',
  ],
};

// Get suggested challenges based on property type and age
export function getSuggestedChallenges(
  propertyType: string,
  yearBuilt?: number
): string[] {
  const suggestions: string[] = [];
  const currentYear = new Date().getFullYear();
  
  // Based on property type
  if (propertyType.toLowerCase().includes('starter') || propertyType.toLowerCase().includes('condo')) {
    suggestions.push('small rooms', 'limited storage', 'one bathroom');
  }
  
  if (propertyType.toLowerCase().includes('fixer')) {
    suggestions.push('needs updating', 'dated kitchen', 'original fixtures');
  }
  
  if (propertyType.toLowerCase().includes('investor')) {
    suggestions.push('tlc needed', 'needs modernization', 'older appliances');
  }
  
  // Based on age
  if (yearBuilt && currentYear - yearBuilt > 50) {
    suggestions.push('older home', 'original windows', 'needs modernization');
  } else if (yearBuilt && currentYear - yearBuilt > 30) {
    suggestions.push('dated kitchen', 'original fixtures');
  }
  
  // Return unique suggestions
  return [...new Set(suggestions)].slice(0, 5);
}

// Reframe a challenge into positive language
export function reframeChallenge(challenge: string): string {
  // Direct match
  const directReframe = CHALLENGE_REFRAMES[challenge.toLowerCase()];
  if (directReframe) return directReframe;
  
  // Partial match
  const lowerChallenge = challenge.toLowerCase();
  for (const [key, value] of Object.entries(CHALLENGE_REFRAMES)) {
    if (lowerChallenge.includes(key) || key.includes(lowerChallenge)) {
      return value;
    }
  }
  
  // Smart reframing based on keywords
  if (lowerChallenge.includes('small') || lowerChallenge.includes('tiny')) {
    return 'cozy and efficient';
  }
  if (lowerChallenge.includes('old') || lowerChallenge.includes('dated')) {
    return 'opportunity for modernization';
  }
  if (lowerChallenge.includes('no ') || lowerChallenge.includes('without')) {
    return 'simplified living';
  }
  if (lowerChallenge.includes('needs') || lowerChallenge.includes('requires')) {
    return 'opportunity to customize';
  }
  
  // Default reframe
  return 'unique character feature';
}

// Reframe multiple challenges
export function reframeChallenges(challenges: string[]): Array<{ original: string; reframed: string }> {
  return challenges.map(challenge => ({
    original: challenge,
    reframed: reframeChallenge(challenge),
  }));
}

// Generate marketing language that addresses challenges positively
export function generatePositiveNarrative(challenges: string[]): string {
  if (challenges.length === 0) return '';
  
  const reframed = reframeChallenges(challenges);
  const narratives: string[] = [];
  
  reframed.forEach(({ original, reframed }) => {
    // Create contextual narrative
    if (original.includes('small')) {
      narratives.push(`The ${reframed} create an intimate atmosphere perfect for easy living.`);
    } else if (original.includes('dated') || original.includes('old')) {
      narratives.push(`This property offers ${reframed}, allowing you to build equity while creating your dream home.`);
    } else if (original.includes('no ')) {
      narratives.push(`Enjoy ${reframed} with less to maintain and more time to enjoy life.`);
    } else {
      narratives.push(`Features ${reframed} that adds to the home's unique appeal.`);
    }
  });
  
  return narratives.join(' ');
}

// Check if a feature description contains challenges
export function detectChallenges(text: string): string[] {
  const detected: string[] = [];
  const lowerText = text.toLowerCase();
  
  Object.keys(CHALLENGE_REFRAMES).forEach(challenge => {
    if (lowerText.includes(challenge)) {
      detected.push(challenge);
    }
  });
  
  // Also detect negative phrases
  const negativeIndicators = ['needs', 'requires', 'no ', 'without', 'lacking', 'dated', 'old', 'small', 'tiny'];
  negativeIndicators.forEach(indicator => {
    if (lowerText.includes(indicator) && detected.length < 5) {
      // Extract the phrase around the indicator
      const index = lowerText.indexOf(indicator);
      const start = Math.max(0, index - 10);
      const end = Math.min(lowerText.length, index + 30);
      const phrase = text.substring(start, end).trim();
      if (!detected.some(d => phrase.includes(d))) {
        detected.push(phrase);
      }
    }
  });
  
  return detected;
}