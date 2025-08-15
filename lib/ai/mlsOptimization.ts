/**
 * MLS-specific content optimization system
 * Integrates SEO, agent positioning, and professional formatting
 */

import type { PhotoInsights } from './photoAnalysis';
import type { Facts } from './schemas';
import { generateMLSKeywords, getAgentPositioning, MLS_TEMPLATES } from './channelStrategies';

export interface MLSOptimizedContent {
  headline: string;
  description: string;
  keywords: string[];
  seoScore: number;
  agentPositioning: string;
  callToAction: string;
}

export interface MLSContext {
  primaryKeywords: string[];
  localKeywords: string[];
  agentExpertise: string[];
  propertyCategory: string;
  marketingPriority: string;
  competitiveAdvantage: string[];
}

/**
 * Generate MLS-optimized context from property data and photo insights
 */
export function buildMLSContext(
  facts: Facts,
  photoInsights?: PhotoInsights
): MLSContext {
  // Extract location information
  const neighborhood = facts.neighborhood || 'desirable area';
  const city = extractCityFromAddress(facts.address || '');
  const state = 'CA'; // Default, should be configurable
  
  // Determine property type for keyword generation
  const propertyType = facts.propertyType || 'home';
  const features = photoInsights?.features || [];
  
  // Generate SEO keywords
  const seoOptimization = generateMLSKeywords(
    propertyType,
    neighborhood,
    city,
    state,
    features
  );
  
  // Get agent positioning
  const agentPositioning = getAgentPositioning(
    propertyType,
    'market-rate', // TODO: Extract from facts or pricing data
    neighborhood
  );
  
  // Determine competitive advantages from photo analysis
  const competitiveAdvantage = photoInsights?.socialProofElements || [
    'Professional presentation',
    'Quality construction',
    'Well-maintained condition'
  ];
  
  return {
    primaryKeywords: seoOptimization.primaryKeywords,
    localKeywords: seoOptimization.localKeywords,
    agentExpertise: agentPositioning.expertise,
    propertyCategory: photoInsights?.propertyCategory || 'family',
    marketingPriority: photoInsights?.marketingPriority || 'features',
    competitiveAdvantage
  };
}

/**
 * Create MLS-optimized content using templates and context
 */
export function generateMLSContent(
  facts: Facts,
  photoInsights: PhotoInsights,
  mlsContext: MLSContext
): MLSOptimizedContent {
  const template = MLS_TEMPLATES[mlsContext.propertyCategory] || MLS_TEMPLATES.family;
  
  // Build headline with primary keyword
  const headline = template.headline
    .replace('{propertyType}', facts.propertyType || 'Home')
    .replace('{neighborhood}', facts.neighborhood || 'Prime Location');
  
  // Create opening hook with emotional connection
  const hook = template.hook
    .replace('{propertyType}', facts.propertyType || 'home');
  
  // Integrate key features with SEO keywords
  const featuresSection = buildFeaturesSection(facts, photoInsights, mlsContext);
  
  // Location benefits with local keywords
  const locationSection = buildLocationSection(facts, mlsContext);
  
  // Agent positioning and credibility
  const agentSection = buildAgentSection(mlsContext);
  
  // Call-to-action with urgency
  const ctaSection = buildCTASection(photoInsights, mlsContext);
  
  // Combine all sections
  const description = [
    hook,
    featuresSection,
    locationSection,
    agentSection,
    ctaSection
  ].filter(Boolean).join(' ');
  
  // Calculate SEO score
  const seoScore = calculateSEOScore(description, mlsContext);
  
  return {
    headline,
    description: description.substring(0, 900), // MLS character limit
    keywords: [...mlsContext.primaryKeywords, ...mlsContext.localKeywords],
    seoScore,
    agentPositioning: mlsContext.agentExpertise[0] || 'Real estate professional',
    callToAction: ctaSection
  };
}

/**
 * Build features section with SEO integration
 */
function buildFeaturesSection(
  facts: Facts,
  photoInsights: PhotoInsights,
  mlsContext: MLSContext
): string {
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  const bedBath = `${facts.beds || ''} bed${facts.beds !== '1' ? 's' : ''}, ${facts.baths || ''} bath${facts.baths !== '1' ? 's' : ''}`.trim();
  const sqft = facts.sqft ? `${facts.sqft} sq ft` : '';
  
  // Prioritize based on marketing priority
  switch (mlsContext.marketingPriority) {
    case 'features':
      return `This exceptional property features ${mustMentionFeatures.slice(0, 3).join(', ')}${bedBath ? ` with ${bedBath}` : ''}${sqft ? ` of ${sqft}` : ''}.`;
    
    case 'lifestyle':
      const lifestyleScenario = photoInsights.lifestyleScenarios?.[0] || 'Imagine coming home to this beautiful space';
      return `${lifestyleScenario}. Featuring ${mustMentionFeatures.slice(0, 2).join(' and ')}${bedBath ? `, ${bedBath}` : ''}.`;
    
    default:
      return `Featuring ${bedBath}${sqft ? `, ${sqft}` : ''}, with exceptional ${mustMentionFeatures.slice(0, 3).join(', ')}.`;
  }
}

/**
 * Build location section with local SEO
 */
function buildLocationSection(facts: Facts, mlsContext: MLSContext): string {
  const neighborhood = facts.neighborhood || 'this desirable area';
  const localKeyword = mlsContext.localKeywords[0] || neighborhood;
  
  return `Located in ${localKeyword}, this property offers convenient access to ${getLocalAmenities(neighborhood)}.`;
}

/**
 * Build agent positioning section
 */
function buildAgentSection(mlsContext: MLSContext): string {
  const expertise = mlsContext.agentExpertise[0] || 'local market expert';
  return `Contact your ${expertise} for more information and to schedule your showing.`;
}

/**
 * Build compelling call-to-action
 */
function buildCTASection(photoInsights: PhotoInsights, mlsContext: MLSContext): string {
  const urgencyTrigger = photoInsights.urgencyTriggers?.[0];
  
  if (urgencyTrigger) {
    return `${urgencyTrigger} - don't miss this opportunity!`;
  }
  
  switch (mlsContext.propertyCategory) {
    case 'luxury':
      return 'Schedule your private showing of this exclusive property today.';
    case 'family':
      return 'Don\'t let your family\'s dream home slip away - call today!';
    case 'investment':
      return 'Secure this prime investment opportunity before it\'s gone.';
    default:
      return 'Contact us today to schedule your showing.';
  }
}

/**
 * Calculate SEO optimization score
 */
function calculateSEOScore(content: string, mlsContext: MLSContext): number {
  const contentLower = content.toLowerCase();
  let score = 0;
  
  // Check primary keyword presence (40 points)
  const primaryKeywordFound = mlsContext.primaryKeywords.some(keyword => 
    contentLower.includes(keyword.toLowerCase())
  );
  if (primaryKeywordFound) score += 40;
  
  // Check local keyword presence (30 points)
  const localKeywordFound = mlsContext.localKeywords.some(keyword =>
    contentLower.includes(keyword.toLowerCase())
  );
  if (localKeywordFound) score += 30;
  
  // Check keyword density (20 points)
  const totalWords = content.split(' ').length;
  const keywordCount = mlsContext.primaryKeywords.reduce((count, keyword) => {
    const matches = (contentLower.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    return count + matches;
  }, 0);
  
  const density = (keywordCount / totalWords) * 100;
  if (density >= 2 && density <= 4) score += 20;
  else if (density >= 1 && density < 2) score += 15;
  else if (density < 1) score += 5;
  
  // Check content length optimization (10 points)
  if (content.length >= 300 && content.length <= 800) score += 10;
  else if (content.length >= 200 && content.length < 300) score += 5;
  
  return Math.min(score, 100);
}

/**
 * Extract city from address string
 */
function extractCityFromAddress(address: string): string {
  // Simple extraction - can be enhanced with geocoding API
  const parts = address.split(',');
  if (parts.length >= 2) {
    return parts[1].trim();
  }
  return 'City'; // Fallback
}

/**
 * Get local amenities for area description
 */
function getLocalAmenities(neighborhood: string): string {
  // This should be enhanced with real local data
  return 'shopping, dining, schools, and recreational facilities';
}

/**
 * Validate MLS content meets professional standards
 */
export function validateMLSContent(content: MLSOptimizedContent): {
  isValid: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;
  
  // Check headline optimization
  if (!content.headline || content.headline.length < 20) {
    issues.push('Headline too short for SEO optimization');
    score -= 15;
  }
  
  if (content.headline.length > 60) {
    issues.push('Headline too long for search display');
    score -= 10;
  }
  
  // Check description length
  if (content.description.length < 200) {
    issues.push('Description too short for effective marketing');
    score -= 20;
  }
  
  if (content.description.length > 900) {
    issues.push('Description exceeds MLS character limits');
    score -= 15;
  }
  
  // Check SEO score
  if (content.seoScore < 50) {
    issues.push('Poor SEO optimization - missing key search terms');
    score -= 25;
  }
  
  // Check professional elements
  if (!content.callToAction) {
    issues.push('Missing clear call-to-action');
    score -= 10;
  }
  
  if (!content.agentPositioning) {
    issues.push('Missing agent positioning/expertise');
    score -= 10;
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    score: Math.max(0, score)
  };
}