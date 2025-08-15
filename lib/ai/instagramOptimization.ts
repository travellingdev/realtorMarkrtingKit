/**
 * Instagram-specific content optimization system
 * Focuses on viral engagement, hashtag strategy, and conversion-driven social content
 */

import type { PhotoInsights } from './photoAnalysis';
import type { Facts } from './schemas';
import { INSTAGRAM_STRATEGY } from './channelStrategies';

export interface InstagramOptimizedContent {
  hook: string;
  slides: string[];
  hashtags: string[];
  caption: string;
  storySequence: string[];
  engagementScore: number;
  viralPotential: number;
  callToAction: string;
}

export interface InstagramContext {
  propertyHashtags: string[];
  locationHashtags: string[];
  viralHooks: string[];
  engagementTactics: string[];
  targetAudience: string;
  contentFormat: 'carousel' | 'single' | 'reel' | 'story';
  urgencyTriggers: string[];
}

/**
 * Generate Instagram-optimized context from property data and photo insights
 */
export function buildInstagramContext(
  facts: Facts,
  photoInsights?: PhotoInsights
): InstagramContext {
  const propertyType = facts.propertyType || 'home';
  const neighborhood = facts.neighborhood || facts.address?.split(',')[1]?.trim() || 'Prime Location';
  const features = photoInsights?.features || [];
  
  // Generate property-specific hashtags
  const propertyHashtags = generatePropertyHashtags(propertyType, features);
  
  // Generate location-based hashtags
  const locationHashtags = generateLocationHashtags(neighborhood, facts.address);
  
  // Select best viral hooks based on property category
  const viralHooks = selectViralHooks(photoInsights?.propertyCategory || 'family');
  
  // Choose engagement tactics based on marketing priority
  const engagementTactics = selectEngagementTactics(photoInsights?.marketingPriority || 'features');
  
  // Determine target audience
  const targetAudience = photoInsights?.buyerProfile || 'Home buyers seeking their perfect space';
  
  // Select urgency triggers
  const urgencyTriggers = photoInsights?.urgencyTriggers || [
    'Properties like this don\'t last long',
    'Your dream home awaits',
    'Don\'t miss this opportunity'
  ];
  
  return {
    propertyHashtags,
    locationHashtags,
    viralHooks,
    engagementTactics,
    targetAudience,
    contentFormat: 'carousel', // Default format
    urgencyTriggers
  };
}

/**
 * Create Instagram-optimized content with viral potential
 */
export function generateInstagramContent(
  facts: Facts,
  photoInsights: PhotoInsights,
  instagramContext: InstagramContext
): InstagramOptimizedContent {
  // Select best hook for opening
  const hook = selectBestHook(instagramContext.viralHooks, photoInsights);
  
  // Create carousel slides with different focuses
  const slides = generateCarouselSlides(facts, photoInsights, instagramContext);
  
  // Generate strategic hashtag mix
  const hashtags = generateHashtagMix(instagramContext);
  
  // Create full caption with engagement elements
  const caption = buildFullCaption(hook, facts, photoInsights, instagramContext);
  
  // Generate story sequence for follow-up content
  const storySequence = generateStorySequence(facts, photoInsights);
  
  // Calculate viral potential and engagement scores
  const { engagementScore, viralPotential } = calculateSocialScores(
    hook, slides, hashtags, photoInsights
  );
  
  // Create compelling call-to-action
  const callToAction = generateInstagramCTA(photoInsights, instagramContext);
  
  return {
    hook,
    slides,
    hashtags,
    caption,
    storySequence,
    engagementScore,
    viralPotential,
    callToAction
  };
}

/**
 * Generate property-specific hashtags based on features
 */
function generatePropertyHashtags(propertyType: string, features: string[]): string[] {
  const baseHashtags = ['#dreamhome', '#realestate', '#homeforsale'];
  
  // Property type hashtags
  const typeHashtags = {
    'single-family': ['#singlefamily', '#familyhome', '#housegoals'],
    'condo': ['#condoliving', '#urbanliving', '#modernliving'],
    'townhouse': ['#townhome', '#communityliving', '#stylishliving'],
    'luxury': ['#luxuryhome', '#luxuryrealestate', '#premiumliving']
  };
  
  // Feature-based hashtags
  const featureHashtags = features.map(feature => {
    const cleanFeature = feature.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `#${cleanFeature}`;
  }).slice(0, 5);
  
  const propertySpecific = typeHashtags[propertyType as keyof typeof typeHashtags] || ['#home'];
  
  return [...baseHashtags, ...propertySpecific, ...featureHashtags];
}

/**
 * Generate location-based hashtags for local reach
 */
function generateLocationHashtags(neighborhood: string, address?: string): string[] {
  const locationTags: string[] = [];
  
  if (neighborhood) {
    const cleanNeighborhood = neighborhood.toLowerCase().replace(/[^a-z0-9]/g, '');
    locationTags.push(`#${cleanNeighborhood}`);
    locationTags.push(`#${cleanNeighborhood}realestate`);
    locationTags.push(`#${cleanNeighborhood}homes`);
  }
  
  // Extract city from address
  if (address) {
    const parts = address.split(',');
    if (parts.length >= 2) {
      const city = parts[1].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      locationTags.push(`#${city}`, `#${city}realestate`);
    }
  }
  
  return locationTags.slice(0, 6);
}

/**
 * Select viral hooks based on property category
 */
function selectViralHooks(propertyCategory: string): string[] {
  const categoryHooks = {
    luxury: [
      'POV: You just found your sanctuary',
      'This house just hit different...',
      'Tell me you wouldn\'t want to live like this',
      'The way this property makes me feel'
    ],
    family: [
      'POV: You found the perfect family home',
      'When the house checks every box',
      'Tell me this isn\'t family goals',
      'The home your kids will thank you for'
    ],
    investment: [
      'POV: You found the perfect investment',
      'This property screams opportunity',
      'Smart money moves look like this',
      'When the numbers just make sense'
    ]
  };
  
  return categoryHooks[propertyCategory as keyof typeof categoryHooks] || categoryHooks.family;
}

/**
 * Select engagement tactics based on marketing priority
 */
function selectEngagementTactics(marketingPriority: string): string[] {
  const priorityTactics = {
    features: [
      'Swipe to see the best part ➡️',
      'Wait for it... slide 3 is everything',
      'The kitchen or the pool? Choose one 👇'
    ],
    lifestyle: [
      'Tag someone who needs to see this 👇',
      'Save this for your vision board 💾',
      'Your future self will thank you'
    ],
    location: [
      'Rate this neighborhood 1-10',
      'Best part about this area? Comment below 👇',
      'Who else loves this location?'
    ]
  };
  
  return priorityTactics[marketingPriority as keyof typeof priorityTactics] || priorityTactics.features;
}

/**
 * Select best hook based on photo insights and viral potential
 */
function selectBestHook(availableHooks: string[], photoInsights: PhotoInsights): string {
  // Use conversion hooks if available
  if (photoInsights.conversionHooks && photoInsights.conversionHooks.length > 0) {
    return photoInsights.conversionHooks[0];
  }
  
  // Use headline feature for hook
  if (photoInsights.headlineFeature) {
    return `POV: You just discovered ${photoInsights.headlineFeature.toLowerCase()}`;
  }
  
  // Fall back to available hooks
  return availableHooks[0] || 'POV: You just found your dream home';
}

/**
 * Generate engaging carousel slides with different purposes
 */
function generateCarouselSlides(
  facts: Facts,
  photoInsights: PhotoInsights,
  context: InstagramContext
): string[] {
  const slides: string[] = [];
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  
  // Slide 1: Hook and headline feature
  const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
  slides.push(`${headlineFeature} that will make you fall in love 😍`);
  
  // Slide 2-4: Feature highlights with emotional benefits
  const featureSlides = mustMentionFeatures.slice(1, 4).map((feature, index) => {
    const benefit = photoInsights.buyerBenefits?.find(b => b.feature === feature);
    if (benefit) {
      return `${feature} = ${benefit.benefit} 🏡`;
    }
    return `${feature} ✨`;
  });
  slides.push(...featureSlides);
  
  // Slide 5: Lifestyle scenario
  if (photoInsights.lifestyleScenarios && photoInsights.lifestyleScenarios.length > 0) {
    slides.push(photoInsights.lifestyleScenarios[0]);
  }
  
  // Slide 6: Urgency/CTA
  const urgency = context.urgencyTriggers[0];
  slides.push(`${urgency} - DM for details! 📩`);
  
  return slides.slice(0, 6); // Limit to 6 slides for optimal engagement
}

/**
 * Generate strategic hashtag mix for maximum reach and engagement
 */
function generateHashtagMix(context: InstagramContext): string[] {
  const hashtagMix: string[] = [];
  
  // High engagement hashtags (30%)
  hashtagMix.push(...INSTAGRAM_STRATEGY.hashtagStrategy.engagement.slice(0, 8));
  
  // Property-specific hashtags (25%)
  hashtagMix.push(...context.propertyHashtags.slice(0, 6));
  
  // Location hashtags (20%)
  hashtagMix.push(...context.locationHashtags.slice(0, 5));
  
  // Lifestyle hashtags (15%)
  hashtagMix.push(...INSTAGRAM_STRATEGY.hashtagStrategy.lifestyle.slice(0, 4));
  
  // Trending/viral hashtags (10%)
  hashtagMix.push('#fyp', '#viral');
  
  // Remove duplicates and limit to 25
  return [...new Set(hashtagMix)].slice(0, 25);
}

/**
 * Build full Instagram caption with engagement elements
 */
function buildFullCaption(
  hook: string,
  facts: Facts,
  photoInsights: PhotoInsights,
  context: InstagramContext
): string {
  const captionParts: string[] = [];
  
  // Opening hook
  captionParts.push(hook);
  captionParts.push('');
  
  // Property highlights
  const bedBath = `${facts.beds || ''} bed, ${facts.baths || ''} bath`;
  const sqft = facts.sqft ? `• ${facts.sqft} sq ft` : '';
  const location = facts.neighborhood ? `• ${facts.neighborhood}` : '';
  
  captionParts.push(`${bedBath} ${facts.propertyType || 'home'}`);
  if (sqft) captionParts.push(sqft);
  if (location) captionParts.push(location);
  captionParts.push('');
  
  // Key features with benefits
  if (photoInsights.buyerBenefits && photoInsights.buyerBenefits.length > 0) {
    captionParts.push('Why you\'ll love it:');
    photoInsights.buyerBenefits.slice(0, 3).forEach(benefit => {
      captionParts.push(`• ${benefit.feature} → ${benefit.benefit}`);
    });
    captionParts.push('');
  }
  
  // Engagement element
  const engagementTactic = context.engagementTactics[0];
  captionParts.push(engagementTactic);
  captionParts.push('');
  
  // Call to action
  captionParts.push('Ready to make it yours? DM me! 📩');
  
  return captionParts.join('\n');
}

/**
 * Generate Instagram story sequence for extended engagement
 */
function generateStorySequence(facts: Facts, photoInsights: PhotoInsights): string[] {
  const stories: string[] = [];
  
  // Story 1: Tease
  stories.push('Coming to you LIVE from this incredible listing 🏡');
  
  // Story 2: Exterior/First impression
  stories.push('The exterior already has me speechless 😍');
  
  // Story 3: Interior reveal
  const headlineFeature = photoInsights.headlineFeature || 'the interior';
  stories.push(`But wait until you see ${headlineFeature}...`);
  
  // Story 4: Call to action
  stories.push('Swipe up for all the details! ⬆️');
  
  return stories;
}

/**
 * Generate compelling Instagram call-to-action
 */
function generateInstagramCTA(
  photoInsights: PhotoInsights,
  context: InstagramContext
): string {
  const urgency = photoInsights.urgencyTriggers?.[0];
  
  if (urgency) {
    return `${urgency} - DM me for exclusive details! 📩`;
  }
  
  return 'Ready to fall in love with this home? DM for details! 📩💕';
}

/**
 * Calculate engagement and viral potential scores
 */
function calculateSocialScores(
  hook: string,
  slides: string[],
  hashtags: string[],
  photoInsights: PhotoInsights
): { engagementScore: number; viralPotential: number } {
  let engagementScore = 0;
  let viralPotential = 0;
  
  // Hook quality (30% of engagement score)
  const hookWords = ['POV:', 'Tell me', 'This house', 'When you'];
  const hasViralHook = hookWords.some(word => hook.includes(word));
  if (hasViralHook) engagementScore += 30;
  
  // Emoji usage (10% of engagement score)
  const emojiCount = (hook + slides.join('')).match(/[\u{1F300}-\u{1F9FF}]/gu)?.length || 0;
  if (emojiCount >= 3) engagementScore += 10;
  
  // Question/engagement bait (25% of engagement score)
  const hasQuestion = slides.some(slide => slide.includes('?'));
  const hasEngagementBait = slides.some(slide => 
    slide.includes('DM') || slide.includes('comment') || slide.includes('tag')
  );
  if (hasQuestion) engagementScore += 15;
  if (hasEngagementBait) engagementScore += 10;
  
  // Hashtag strategy (20% of engagement score)
  const hashtagMix = hashtags.length;
  if (hashtagMix >= 15 && hashtagMix <= 25) engagementScore += 20;
  else if (hashtagMix >= 10) engagementScore += 15;
  
  // Content length optimization (15% of engagement score)
  const totalLength = hook.length + slides.join('').length;
  if (totalLength >= 200 && totalLength <= 500) engagementScore += 15;
  
  // Viral potential based on content elements
  const viralElements = {
    hasLifestyleScenario: photoInsights.lifestyleScenarios?.length > 0,
    hasEmotionalTriggers: photoInsights.emotionalTriggers?.length > 0,
    hasUrgencyTriggers: photoInsights.urgencyTriggers?.length > 0,
    hasConversionHooks: photoInsights.conversionHooks?.length > 0
  };
  
  viralPotential = Object.values(viralElements).filter(Boolean).length * 25;
  
  return {
    engagementScore: Math.min(100, engagementScore),
    viralPotential: Math.min(100, viralPotential)
  };
}

/**
 * Validate Instagram content meets platform best practices
 */
export function validateInstagramContent(content: InstagramOptimizedContent): {
  isValid: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;
  
  // Check hook effectiveness
  if (!content.hook || content.hook.length < 10) {
    issues.push('Hook too short for viral potential');
    score -= 20;
  }
  
  // Check slide count
  if (content.slides.length < 3) {
    issues.push('Too few slides for carousel engagement');
    score -= 15;
  }
  
  if (content.slides.length > 10) {
    issues.push('Too many slides - may reduce completion rate');
    score -= 10;
  }
  
  // Check hashtag strategy
  if (content.hashtags.length < 10) {
    issues.push('Insufficient hashtags for reach optimization');
    score -= 15;
  }
  
  if (content.hashtags.length > 30) {
    issues.push('Excessive hashtags may appear spammy');
    score -= 10;
  }
  
  // Check engagement elements
  const hasCallToAction = content.slides.some(slide => 
    slide.includes('DM') || slide.includes('comment') || slide.includes('tag')
  );
  if (!hasCallToAction) {
    issues.push('Missing clear call-to-action for engagement');
    score -= 15;
  }
  
  // Check caption length
  if (content.caption.length < 100) {
    issues.push('Caption too short for algorithm optimization');
    score -= 10;
  }
  
  if (content.caption.length > 2200) {
    issues.push('Caption exceeds Instagram character limit');
    score -= 20;
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    score: Math.max(0, score)
  };
}