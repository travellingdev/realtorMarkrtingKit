// MLS Compliance Rules and Data Structure

export interface MLSCompliance {
  id: string;
  name: string;
  region: string;
  prohibitedWords: string[];
  requiredDisclosures: string[];
  fairHousingRules: string[];
  characterLimits?: {
    publicRemarks?: number;
    privateRemarks?: number;
  };
}

// Common Fair Housing prohibited terms across all MLS
const UNIVERSAL_PROHIBITED = [
  // Discriminatory terms
  'perfect for students',
  'ideal for singles',
  'great for young professionals',
  'family-oriented',
  'adult community',
  'senior',
  'exclusive',
  'private',
  'restricted',
  // Religious references
  'near church',
  'christian',
  'jewish',
  'muslim',
  // National origin
  'english only',
  'american',
  // Disability
  'wheelchair accessible', // Can only use if truly accessible
  'able-bodied',
  // Family status
  'no children',
  'adults only',
  'couples only',
  'bachelor pad',
  'perfect for empty nesters',
];

// MLS-specific compliance rules
export const MLS_COMPLIANCE_RULES: Record<string, MLSCompliance> = {
  'california_regional': {
    id: 'california_regional',
    name: 'California Regional MLS (CRMLS)',
    region: 'California',
    prohibitedWords: [
      ...UNIVERSAL_PROHIBITED,
      'cozy', // Often means small
      'tlc needed',
      'handyman special',
      'investors only',
      'cash only',
      'prestigious', // Can imply discrimination
    ],
    requiredDisclosures: [
      'Broker License #',
      'Equal Housing Opportunity',
    ],
    fairHousingRules: [
      'Cannot mention proximity to religious institutions',
      'Cannot describe ideal tenant characteristics',
      'Must focus on property features only',
    ],
    characterLimits: {
      publicRemarks: 1000,
      privateRemarks: 500,
    },
  },
  'texas_mls': {
    id: 'texas_mls',
    name: 'Texas MLS',
    region: 'Texas',
    prohibitedWords: [
      ...UNIVERSAL_PROHIBITED,
      'motivated seller',
      'must sell',
      'bring all offers',
      'obo',
      'divorce sale',
      'estate sale',
    ],
    requiredDisclosures: [
      'TREC License #',
      'Equal Housing Opportunity',
      'Property ID',
    ],
    fairHousingRules: [
      'No subjective quality descriptors',
      'Cannot mention neighborhood demographics',
      'Factual descriptions only',
    ],
    characterLimits: {
      publicRemarks: 2500,
      privateRemarks: 1000,
    },
  },
  'florida_mls': {
    id: 'florida_mls',
    name: 'Florida MLS',
    region: 'Florida',
    prohibitedWords: [
      ...UNIVERSAL_PROHIBITED,
      'hurricane damage',
      'flood zone', // Must be in specific fields
      'distressed',
      'quick sale',
      'foreclosure',
    ],
    requiredDisclosures: [
      'FL License #',
      'Equal Housing Opportunity',
      'Flood Zone Disclosure',
    ],
    fairHousingRules: [
      'Cannot reference protected classes',
      'Must include accessibility features if present',
      'Hurricane disclosures in designated fields only',
    ],
    characterLimits: {
      publicRemarks: 1500,
      privateRemarks: 750,
    },
  },
  'new_york_mls': {
    id: 'new_york_mls',
    name: 'New York MLS',
    region: 'New York',
    prohibitedWords: [
      ...UNIVERSAL_PROHIBITED,
      'rent stabilized', // Specific field only
      'section 8',
      'low income',
      'affordable housing', // Unless officially designated
    ],
    requiredDisclosures: [
      'NY License #',
      'Fair Housing Notice',
      'Lead Paint Disclosure (pre-1978)',
    ],
    fairHousingRules: [
      'No income requirements in public remarks',
      'Cannot mention school districts by name',
      'Co-op board approval must be factual only',
    ],
    characterLimits: {
      publicRemarks: 2000,
      privateRemarks: 1000,
    },
  },
  'national_association': {
    id: 'national_association',
    name: 'National Association of REALTORS®',
    region: 'National',
    prohibitedWords: UNIVERSAL_PROHIBITED,
    requiredDisclosures: [
      'Equal Housing Opportunity',
      'Licensed Real Estate Professional',
    ],
    fairHousingRules: [
      'Fair Housing Act compliance required',
      'No discriminatory language',
      'Property features only',
      'Objective descriptions',
    ],
  },
};

// Validation function
export function validateMLSCompliance(
  text: string,
  mlsId: string
): {
  valid: boolean;
  violations: string[];
  warnings: string[];
  suggestions: string[];
} {
  const rules = MLS_COMPLIANCE_RULES[mlsId];
  if (!rules) {
    return {
      valid: true,
      violations: [],
      warnings: ['MLS rules not found, using general compliance'],
      suggestions: [],
    };
  }

  const violations: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  const lowerText = text.toLowerCase();

  // Check prohibited words
  rules.prohibitedWords.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) {
      violations.push(`Prohibited term found: "${word}"`);
      suggestions.push(getAlternativeSuggestion(word));
    }
  });

  // Check character limits
  if (rules.characterLimits?.publicRemarks && text.length > rules.characterLimits.publicRemarks) {
    warnings.push(`Text exceeds MLS limit of ${rules.characterLimits.publicRemarks} characters`);
  }

  // Check for required disclosures
  rules.requiredDisclosures.forEach(disclosure => {
    if (!lowerText.includes(disclosure.toLowerCase())) {
      warnings.push(`Missing required disclosure: ${disclosure}`);
    }
  });

  return {
    valid: violations.length === 0,
    violations,
    warnings,
    suggestions: suggestions.filter(Boolean),
  };
}

// Helper function to suggest alternatives
function getAlternativeSuggestion(prohibitedTerm: string): string {
  const alternatives: Record<string, string> = {
    'cozy': 'efficient layout',
    'tlc needed': 'opportunity for customization',
    'handyman special': 'renovation opportunity',
    'perfect for students': 'near university',
    'family-oriented': 'near schools and parks',
    'exclusive': 'private',
    'walking distance to church': 'convenient location',
    'adults only': '',
    'no children': '',
    'bachelor pad': 'studio/one-bedroom',
    'motivated seller': 'priced to sell',
    'must sell': 'immediate availability',
  };

  return alternatives[prohibitedTerm.toLowerCase()] || '';
}

// Get MLS list for dropdown
export function getMLSList() {
  return Object.values(MLS_COMPLIANCE_RULES).map(mls => ({
    id: mls.id,
    name: mls.name,
    region: mls.region,
  }));
}

// Check if text has potential Fair Housing violations
export function checkFairHousingCompliance(text: string): {
  compliant: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const lowerText = text.toLowerCase();

  // Check for family status discrimination
  const familyTerms = ['no kids', 'no children', 'adult', 'singles only', 'couples only'];
  familyTerms.forEach(term => {
    if (lowerText.includes(term)) {
      issues.push(`Potential family status discrimination: "${term}"`);
    }
  });

  // Check for disability discrimination  
  const disabilityTerms = ['not wheelchair', 'no disabled', 'able-bodied only'];
  disabilityTerms.forEach(term => {
    if (lowerText.includes(term)) {
      issues.push(`Potential disability discrimination: "${term}"`);
    }
  });

  // Check for national origin discrimination
  const originTerms = ['english only', 'americans only', 'no foreigners'];
  originTerms.forEach(term => {
    if (lowerText.includes(term)) {
      issues.push(`Potential national origin discrimination: "${term}"`);
    }
  });

  return {
    compliant: issues.length === 0,
    issues,
  };
}

// Reframe problematic language
export function reframeForCompliance(text: string, mlsId: string): string {
  const rules = MLS_COMPLIANCE_RULES[mlsId];
  if (!rules) return text;

  let reframed = text;

  // Replace prohibited terms with alternatives
  rules.prohibitedWords.forEach(word => {
    const alternative = getAlternativeSuggestion(word);
    if (alternative) {
      const regex = new RegExp(word, 'gi');
      reframed = reframed.replace(regex, alternative);
    }
  });

  return reframed;
}