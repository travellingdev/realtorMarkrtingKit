/**
 * LinkedIn and Facebook business content optimization system
 * Focuses on professional authority, market insights, and B2B lead generation
 */

import type { PhotoInsights } from './photoAnalysis';
import type { Facts } from './schemas';

export interface BusinessContentOptimized {
  linkedinPost: string;
  linkedinArticle: string;
  facebookPost: string;
  professionalHashtags: string[];
  industryInsights: string[];
  leadMagnets: string[];
  authorityScore: number;
  engagementPotential: number;
  networkingElements: string[];
}

export interface BusinessContext {
  expertiseArea: string[];
  marketPosition: 'local_expert' | 'luxury_specialist' | 'investment_advisor' | 'family_focused';
  contentPurpose: 'authority_building' | 'lead_generation' | 'market_education' | 'client_testimonial';
  targetAudience: 'potential_sellers' | 'potential_buyers' | 'industry_peers' | 'referral_partners';
  professionalCredentials: string[];
  marketInsights: MarketInsight[];
  businessObjectives: BusinessObjective[];
}

export interface MarketInsight {
  type: 'trend' | 'opportunity' | 'challenge' | 'prediction';
  insight: string;
  actionable: string;
  credibilityBooster: string;
}

export interface BusinessObjective {
  goal: 'brand_awareness' | 'lead_capture' | 'referral_generation' | 'thought_leadership';
  strategy: string;
  cta: string;
  measurementMetric: string;
}

/**
 * Generate business content context from property data and market position
 */
export function buildBusinessContext(
  facts: Facts,
  photoInsights?: PhotoInsights
): BusinessContext {
  // Determine expertise area based on property characteristics
  const expertiseArea = determineExpertiseArea(facts, photoInsights);
  
  // Set market position based on property category and features
  const marketPosition = determineMarketPosition(photoInsights?.propertyCategory || 'family');
  
  // Define content purpose based on business goals
  const contentPurpose = 'authority_building'; // Default, can be made dynamic
  
  // Target audience based on property type and market
  const targetAudience = determineTargetAudience(facts, photoInsights);
  
  // Professional credentials and positioning
  const professionalCredentials = buildProfessionalCredentials(expertiseArea);
  
  // Generate market insights relevant to this property/area
  const marketInsights = generateMarketInsights(facts, photoInsights);
  
  // Define business objectives for content
  const businessObjectives = defineBusinessObjectives(marketPosition, targetAudience);
  
  return {
    expertiseArea,
    marketPosition,
    contentPurpose,
    targetAudience,
    professionalCredentials,
    marketInsights,
    businessObjectives
  };
}

/**
 * Generate professional business content for LinkedIn and Facebook
 */
export function generateBusinessContent(
  facts: Facts,
  photoInsights: PhotoInsights,
  businessContext: BusinessContext
): BusinessContentOptimized {
  // Create LinkedIn post for professional networking
  const linkedinPost = generateLinkedInPost(facts, photoInsights, businessContext);
  
  // Create LinkedIn article for thought leadership
  const linkedinArticle = generateLinkedInArticle(facts, photoInsights, businessContext);
  
  // Create Facebook business post for broader reach
  const facebookPost = generateFacebookPost(facts, photoInsights, businessContext);
  
  // Generate professional hashtags for visibility
  const professionalHashtags = generateProfessionalHashtags(businessContext);
  
  // Extract industry insights for credibility
  const industryInsights = extractIndustryInsights(businessContext.marketInsights);
  
  // Create lead magnets for business generation
  const leadMagnets = generateLeadMagnets(facts, businessContext);
  
  // Calculate authority and engagement scores
  const { authorityScore, engagementPotential } = calculateBusinessScores(
    linkedinPost, facebookPost, businessContext
  );
  
  // Extract networking elements
  const networkingElements = extractNetworkingElements(businessContext);
  
  return {
    linkedinPost,
    linkedinArticle,
    facebookPost,
    professionalHashtags,
    industryInsights,
    leadMagnets,
    authorityScore,
    engagementPotential,
    networkingElements
  };
}

/**
 * Determine expertise area based on property characteristics
 */
function determineExpertiseArea(facts: Facts, photoInsights?: PhotoInsights): string[] {
  const expertise: string[] = [];
  
  // Location-based expertise
  if (facts.neighborhood) {
    expertise.push(`${facts.neighborhood} Real Estate Specialist`);
    expertise.push('Local Market Expert');
  }
  
  // Property type expertise
  if (photoInsights?.propertyCategory === 'luxury') {
    expertise.push('Luxury Properties Specialist');
    expertise.push('High-End Real Estate Advisor');
  } else if (photoInsights?.propertyCategory === 'family') {
    expertise.push('Family Home Specialist');
    expertise.push('Residential Real Estate Expert');
  } else if (photoInsights?.propertyCategory === 'investment') {
    expertise.push('Investment Property Advisor');
    expertise.push('Real Estate Investment Consultant');
  }
  
  // Feature-based expertise
  if (photoInsights?.features?.some(f => f.toLowerCase().includes('pool'))) {
    expertise.push('Luxury Amenities Specialist');
  }
  
  return expertise.slice(0, 4);
}

/**
 * Determine market position for professional positioning
 */
function determineMarketPosition(propertyCategory: string): 'local_expert' | 'luxury_specialist' | 'investment_advisor' | 'family_focused' {
  switch (propertyCategory) {
    case 'luxury': return 'luxury_specialist';
    case 'investment': return 'investment_advisor';
    case 'family': return 'family_focused';
    default: return 'local_expert';
  }
}

/**
 * Determine target audience for content
 */
function determineTargetAudience(facts: Facts, photoInsights?: PhotoInsights): 'potential_sellers' | 'potential_buyers' | 'industry_peers' | 'referral_partners' {
  // High-value properties target sellers for listings
  if (photoInsights?.propertyCategory === 'luxury') {
    return 'potential_sellers';
  }
  
  // Investment properties target both buyers and sellers
  if (photoInsights?.propertyCategory === 'investment') {
    return 'potential_buyers';
  }
  
  // Default to referral partners for professional networking
  return 'referral_partners';
}

/**
 * Build professional credentials and positioning
 */
function buildProfessionalCredentials(expertiseArea: string[]): string[] {
  const baseCredentials = [
    'Licensed Real Estate Professional',
    'Market Analysis Specialist',
    'Client Advocacy Expert',
    'Negotiation Specialist'
  ];
  
  // Add expertise-specific credentials
  const credentials = [...baseCredentials];
  
  if (expertiseArea.some(e => e.includes('Luxury'))) {
    credentials.push('Certified Luxury Home Marketing Specialist');
  }
  
  if (expertiseArea.some(e => e.includes('Investment'))) {
    credentials.push('Investment Property Consultant');
  }
  
  return credentials.slice(0, 5);
}

/**
 * Generate relevant market insights
 */
function generateMarketInsights(facts: Facts, photoInsights?: PhotoInsights): MarketInsight[] {
  const insights: MarketInsight[] = [];
  
  // Location-based insights
  if (facts.neighborhood) {
    insights.push({
      type: 'trend',
      insight: `${facts.neighborhood} market showing strong demand with quality properties moving quickly`,
      actionable: 'Sellers should consider listing now to capitalize on buyer demand',
      credibilityBooster: 'Based on recent market analysis and sales data'
    });
  }
  
  // Property type insights
  if (photoInsights?.propertyCategory === 'luxury') {
    insights.push({
      type: 'opportunity',
      insight: 'Luxury properties with unique features commanding premium prices',
      actionable: 'Focus on distinctive amenities and lifestyle benefits in marketing',
      credibilityBooster: 'Consistent with high-end market performance patterns'
    });
  }
  
  // Feature-based insights
  if (photoInsights?.features?.includes('pool')) {
    insights.push({
      type: 'trend',
      insight: 'Properties with resort-style amenities seeing increased buyer interest',
      actionable: 'Highlight lifestyle and entertainment value in presentations',
      credibilityBooster: 'Reflecting post-pandemic home preference shifts'
    });
  }
  
  return insights;
}

/**
 * Define business objectives for content strategy
 */
function defineBusinessObjectives(
  marketPosition: string, 
  targetAudience: string
): BusinessObjective[] {
  const objectives: BusinessObjective[] = [];
  
  // Authority building objective
  objectives.push({
    goal: 'thought_leadership',
    strategy: 'Share market insights and professional expertise',
    cta: 'What trends are you seeing in your area?',
    measurementMetric: 'engagement_rate'
  });
  
  // Lead generation objective
  objectives.push({
    goal: 'lead_capture',
    strategy: 'Offer valuable market reports and property insights',
    cta: 'DM me for a complimentary market analysis',
    measurementMetric: 'direct_messages'
  });
  
  // Referral generation objective
  if (targetAudience === 'referral_partners') {
    objectives.push({
      goal: 'referral_generation',
      strategy: 'Showcase successful client outcomes and professional service',
      cta: 'Know someone looking to buy or sell? I\'d love to help',
      measurementMetric: 'referral_inquiries'
    });
  }
  
  return objectives;
}

/**
 * Generate LinkedIn post for professional networking
 */
function generateLinkedInPost(
  facts: Facts,
  photoInsights: PhotoInsights,
  businessContext: BusinessContext
): string {
  const sections: string[] = [];
  
  // Professional hook with market insight
  const marketInsight = businessContext.marketInsights[0];
  if (marketInsight) {
    sections.push(`📈 Market Insight: ${marketInsight.insight}`);
    sections.push('');
  }
  
  // Property example with professional context
  const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
  const propertyContext = `Just listed: ${facts.propertyType || 'Property'} in ${facts.neighborhood || 'prime location'} featuring ${headlineFeature}`;
  sections.push(propertyContext);
  sections.push('');
  
  // Professional expertise demonstration
  const expertise = businessContext.expertiseArea[0];
  sections.push(`As a ${expertise}, I've seen how properties with unique features like this create exceptional value for homeowners.`);
  sections.push('');
  
  // Market education
  if (marketInsight) {
    sections.push(`Key takeaway: ${marketInsight.actionable}`);
    sections.push('');
  }
  
  // Business objective CTA
  const objective = businessContext.businessObjectives[0];
  sections.push(objective.cta);
  sections.push('');
  
  // Professional hashtags
  sections.push('#RealEstate #MarketInsights #PropertyExpert #LocalMarket');
  
  return sections.join('\n');
}

/**
 * Generate LinkedIn article for thought leadership
 */
function generateLinkedInArticle(
  facts: Facts,
  photoInsights: PhotoInsights,
  businessContext: BusinessContext
): string {
  const sections: string[] = [];
  
  // Article title and introduction
  const neighborhood = facts.neighborhood || 'Local Market';
  sections.push(`Understanding ${neighborhood} Real Estate: What Buyers and Sellers Need to Know`);
  sections.push('');
  
  // Market overview
  sections.push('**Current Market Landscape**');
  sections.push('');
  businessContext.marketInsights.forEach(insight => {
    sections.push(`• ${insight.insight} - ${insight.actionable}`);
  });
  sections.push('');
  
  // Property case study
  sections.push('**Property Spotlight: What Makes a Home Stand Out**');
  sections.push('');
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  sections.push(`Take this exceptional ${facts.propertyType || 'property'} featuring:`);
  mustMentionFeatures.forEach(feature => {
    sections.push(`• ${feature}`);
  });
  sections.push('');
  
  // Professional insights
  sections.push('**Professional Perspective**');
  sections.push('');
  sections.push(`As a ${businessContext.expertiseArea[0]}, I help clients understand market dynamics and property values. Here's what I'm seeing:`);
  sections.push('');
  
  // Actionable advice
  sections.push('**For Sellers:**');
  sections.push('• Properties with distinctive features are commanding premium attention');
  sections.push('• Professional presentation and marketing strategy are crucial');
  sections.push('• Timing and pricing strategy can maximize returns');
  sections.push('');
  
  sections.push('**For Buyers:**');
  sections.push('• Quality properties are moving quickly in desirable areas');
  sections.push('• Pre-approval and decisive action are competitive advantages');
  sections.push('• Working with local experts provides market insights');
  sections.push('');
  
  // Call to action
  sections.push('**Ready to Make Your Move?**');
  sections.push('');
  sections.push('Whether you\'re buying or selling, I\'m here to provide expert guidance and market insights. Let\'s discuss your real estate goals.');
  
  return sections.join('\n');
}

/**
 * Generate Facebook business post for broader reach
 */
function generateFacebookPost(
  facts: Facts,
  photoInsights: PhotoInsights,
  businessContext: BusinessContext
): string {
  const sections: string[] = [];
  
  // Engaging hook with visual appeal
  sections.push('🏡 JUST LISTED: Your dream home awaits!');
  sections.push('');
  
  // Property highlights with lifestyle focus
  const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
  sections.push(`This stunning ${facts.propertyType || 'home'} in ${facts.neighborhood || 'prime location'} features ${headlineFeature} - perfect for creating lasting memories with family and friends.`);
  sections.push('');
  
  // Lifestyle benefits
  if (photoInsights.lifestyleScenarios && photoInsights.lifestyleScenarios.length > 0) {
    sections.push(`Imagine: ${photoInsights.lifestyleScenarios[0]}`);
    sections.push('');
  }
  
  // Professional credibility
  const credential = businessContext.professionalCredentials[0];
  sections.push(`As your ${credential}, I'm here to guide you through every step of your home buying or selling journey.`);
  sections.push('');
  
  // Clear call to action
  sections.push('💬 Comment "INFO" for details or DM me directly!');
  sections.push('📞 Ready to schedule a viewing? Let\'s connect!');
  sections.push('');
  
  // Community hashtags
  sections.push('#YourDreamHome #RealEstate #HomeSweetHome #LocalExpert');
  
  return sections.join('\n');
}

/**
 * Generate professional hashtags for business content
 */
function generateProfessionalHashtags(businessContext: BusinessContext): string[] {
  const hashtags: string[] = [];
  
  // Core real estate hashtags
  hashtags.push('#RealEstate', '#PropertyExpert', '#MarketInsights');
  
  // Expertise-based hashtags
  if (businessContext.marketPosition === 'luxury_specialist') {
    hashtags.push('#LuxuryRealEstate', '#LuxuryProperties', '#HighEndHomes');
  } else if (businessContext.marketPosition === 'investment_advisor') {
    hashtags.push('#InvestmentProperty', '#RealEstateInvestment', '#PropertyInvestor');
  } else if (businessContext.marketPosition === 'family_focused') {
    hashtags.push('#FamilyHomes', '#ResidentialRealEstate', '#HomeBuying');
  }
  
  // Professional networking hashtags
  hashtags.push('#NetworkingOpportunity', '#BusinessDevelopment', '#ProfessionalServices');
  
  // Local market hashtags (would be dynamic based on location)
  hashtags.push('#LocalExpert', '#CommunityFocused', '#NeighborhoodSpecialist');
  
  return hashtags.slice(0, 15);
}

/**
 * Extract industry insights for credibility
 */
function extractIndustryInsights(marketInsights: MarketInsight[]): string[] {
  return marketInsights.map(insight => `${insight.insight} - ${insight.credibilityBooster}`);
}

/**
 * Generate lead magnets for business development
 */
function generateLeadMagnets(facts: Facts, businessContext: BusinessContext): string[] {
  const magnets: string[] = [];
  
  // Market-specific lead magnets
  if (facts.neighborhood) {
    magnets.push(`Free ${facts.neighborhood} Market Report`);
    magnets.push(`${facts.neighborhood} Property Value Analysis`);
  }
  
  // Expertise-based lead magnets
  if (businessContext.marketPosition === 'luxury_specialist') {
    magnets.push('Luxury Property Marketing Guide');
    magnets.push('High-End Home Selling Strategy');
  } else if (businessContext.marketPosition === 'investment_advisor') {
    magnets.push('Investment Property ROI Calculator');
    magnets.push('Real Estate Investment Opportunities Report');
  } else {
    magnets.push('First-Time Home Buyer Guide');
    magnets.push('Home Selling Preparation Checklist');
  }
  
  return magnets.slice(0, 4);
}

/**
 * Calculate authority and engagement scores
 */
function calculateBusinessScores(
  linkedinPost: string,
  facebookPost: string,
  businessContext: BusinessContext
): { authorityScore: number; engagementPotential: number } {
  let authorityScore = 0;
  let engagementPotential = 0;
  
  // Authority scoring factors
  const credibilityWords = ['expert', 'specialist', 'professional', 'analysis', 'insight', 'experience'];
  const authorityCount = credibilityWords.filter(word => 
    linkedinPost.toLowerCase().includes(word) || facebookPost.toLowerCase().includes(word)
  ).length;
  authorityScore += Math.min(authorityCount * 10, 50);
  
  // Market insights boost authority
  authorityScore += businessContext.marketInsights.length * 15;
  
  // Professional credentials boost
  authorityScore += Math.min(businessContext.professionalCredentials.length * 5, 25);
  
  // Expertise area specificity
  if (businessContext.expertiseArea.length >= 3) authorityScore += 20;
  
  // Engagement potential scoring
  const engagementWords = ['comment', 'dm', 'connect', 'share', 'thoughts', 'experience'];
  const engagementCount = engagementWords.filter(word =>
    linkedinPost.toLowerCase().includes(word) || facebookPost.toLowerCase().includes(word)
  ).length;
  engagementPotential += Math.min(engagementCount * 12, 60);
  
  // Question presence boosts engagement
  const hasQuestions = linkedinPost.includes('?') || facebookPost.includes('?');
  if (hasQuestions) engagementPotential += 20;
  
  // CTA strength
  const strongCTAs = ['dm me', 'comment', 'connect', 'let\'s discuss'];
  const hasCTA = strongCTAs.some(cta => 
    linkedinPost.toLowerCase().includes(cta) || facebookPost.toLowerCase().includes(cta)
  );
  if (hasCTA) engagementPotential += 20;
  
  return {
    authorityScore: Math.min(authorityScore, 100),
    engagementPotential: Math.min(engagementPotential, 100)
  };
}

/**
 * Extract networking elements for relationship building
 */
function extractNetworkingElements(businessContext: BusinessContext): string[] {
  const elements: string[] = [];
  
  // Professional credentials for networking
  elements.push(...businessContext.professionalCredentials.slice(0, 3));
  
  // Expertise areas for conversation starters
  elements.push(...businessContext.expertiseArea.slice(0, 2));
  
  // Market insights for thought leadership
  elements.push(...businessContext.marketInsights.map(i => i.insight).slice(0, 2));
  
  return elements;
}

/**
 * Validate business content meets professional standards
 */
export function validateBusinessContent(content: BusinessContentOptimized): {
  isValid: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;
  
  // LinkedIn post validation
  if (!content.linkedinPost || content.linkedinPost.length < 100) {
    issues.push('LinkedIn post too short for professional engagement');
    score -= 15;
  }
  
  if (content.linkedinPost.length > 3000) {
    issues.push('LinkedIn post too long - may reduce readability');
    score -= 10;
  }
  
  // Professional hashtags validation
  if (content.professionalHashtags.length < 5) {
    issues.push('Insufficient professional hashtags for visibility');
    score -= 10;
  }
  
  // Authority score validation
  if (content.authorityScore < 60) {
    issues.push('Low authority score - missing credibility elements');
    score -= 20;
  }
  
  // Engagement potential validation
  if (content.engagementPotential < 50) {
    issues.push('Low engagement potential - missing interactive elements');
    score -= 15;
  }
  
  // Lead magnets validation
  if (content.leadMagnets.length < 2) {
    issues.push('Insufficient lead magnets for business development');
    score -= 10;
  }
  
  // Industry insights validation
  if (content.industryInsights.length < 1) {
    issues.push('Missing industry insights for thought leadership');
    score -= 10;
  }
  
  // Facebook content validation
  if (content.facebookPost.length < 80) {
    issues.push('Facebook post too short for effective reach');
    score -= 10;
  }
  
  return {
    isValid: issues.length <= 1 && score >= 70,
    issues,
    score: Math.max(0, score)
  };
}