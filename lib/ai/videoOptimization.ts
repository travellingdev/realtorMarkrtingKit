/**
 * YouTube and TikTok video script generation system
 * Focuses on trending formats, viral hooks, and video-specific engagement optimization
 */

import type { PhotoInsights } from './photoAnalysis';
import type { Facts } from './schemas';

export interface VideoOptimizedContent {
  youtubeScript: VideoScript;
  tiktokScript: VideoScript;
  shortsScript: VideoScript;
  videoHooks: string[];
  trendingFormats: TrendingFormat[];
  visualCues: VisualCue[];
  engagementScore: number;
  viralPotential: number;
  retentionElements: string[];
}

export interface VideoScript {
  title: string;
  hook: string;
  scenes: VideoScene[];
  callToAction: string;
  description: string;
  tags: string[];
  duration: string;
  scriptNotes: string[];
}

export interface VideoScene {
  timestamp: string;
  action: string;
  dialogue: string;
  visualFocus: string;
  transitionNote?: string;
}

export interface TrendingFormat {
  name: string;
  platform: 'youtube' | 'tiktok' | 'shorts';
  structure: string;
  example: string;
  engagementTriggers: string[];
}

export interface VisualCue {
  timing: string;
  instruction: string;
  purpose: string;
  alternativeOptions?: string[];
}

export interface VideoContext {
  contentPurpose: 'property_tour' | 'market_insights' | 'tips_advice' | 'behind_scenes' | 'lifestyle_showcase';
  targetAudience: 'first_time_buyers' | 'sellers' | 'investors' | 'general_audience';
  trendingElements: string[];
  platformOptimization: PlatformOptimization;
  visualAssets: string[];
  engagementStrategy: EngagementStrategy;
}

export interface PlatformOptimization {
  youtube: {
    optimalLength: string;
    thumbnailSuggestions: string[];
    descriptionStrategy: string;
    endScreenElements: string[];
  };
  tiktok: {
    optimalLength: string;
    hashtagStrategy: string[];
    soundRecommendations: string[];
    effectSuggestions: string[];
  };
  shorts: {
    optimalLength: string;
    verticalOptimization: string[];
    attentionGrabbers: string[];
    loopingElements: string[];
  };
}

export interface EngagementStrategy {
  hookTechniques: string[];
  retentionTactics: string[];
  interactionPrompts: string[];
  virality_triggers: string[];
}

/**
 * Generate video content context from property data and trending insights
 */
export function buildVideoContext(
  facts: Facts,
  photoInsights?: PhotoInsights
): VideoContext {
  // Determine content purpose based on property and market factors
  const contentPurpose = determineContentPurpose(facts, photoInsights);
  
  // Identify target audience for video content
  const targetAudience = determineVideoAudience(photoInsights?.propertyCategory || 'family');
  
  // Extract trending elements from property and market
  const trendingElements = extractTrendingElements(facts, photoInsights);
  
  // Generate platform-specific optimizations
  const platformOptimization = generatePlatformOptimization(facts, photoInsights);
  
  // Identify visual assets from property photos/features
  const visualAssets = identifyVisualAssets(photoInsights);
  
  // Create engagement strategy for video content
  const engagementStrategy = buildEngagementStrategy(contentPurpose, targetAudience);
  
  return {
    contentPurpose,
    targetAudience,
    trendingElements,
    platformOptimization,
    visualAssets,
    engagementStrategy
  };
}

/**
 * Generate video scripts optimized for each platform
 */
export function generateVideoContent(
  facts: Facts,
  photoInsights: PhotoInsights,
  videoContext: VideoContext
): VideoOptimizedContent {
  // Create YouTube long-form script
  const youtubeScript = generateYouTubeScript(facts, photoInsights, videoContext);
  
  // Create TikTok viral script
  const tiktokScript = generateTikTokScript(facts, photoInsights, videoContext);
  
  // Create YouTube Shorts script
  const shortsScript = generateShortsScript(facts, photoInsights, videoContext);
  
  // Generate viral hooks for video openings
  const videoHooks = generateVideoHooks(photoInsights, videoContext);
  
  // Extract trending formats for current content
  const trendingFormats = getTrendingFormats(videoContext.contentPurpose);
  
  // Create visual direction cues
  const visualCues = generateVisualCues(facts, photoInsights, videoContext);
  
  // Calculate engagement and viral scores
  const { engagementScore, viralPotential } = calculateVideoScores(
    youtubeScript, tiktokScript, shortsScript, videoContext
  );
  
  // Extract retention elements
  const retentionElements = extractRetentionElements(videoContext);
  
  return {
    youtubeScript,
    tiktokScript,
    shortsScript,
    videoHooks,
    trendingFormats,
    visualCues,
    engagementScore,
    viralPotential,
    retentionElements
  };
}

/**
 * Determine optimal content purpose for video
 */
function determineContentPurpose(facts: Facts, photoInsights?: PhotoInsights): 'property_tour' | 'market_insights' | 'tips_advice' | 'behind_scenes' | 'lifestyle_showcase' {
  // Luxury properties showcase lifestyle
  if (photoInsights?.propertyCategory === 'luxury') {
    return 'lifestyle_showcase';
  }
  
  // Investment properties focus on market insights
  if (photoInsights?.propertyCategory === 'investment') {
    return 'market_insights';
  }
  
  // Properties with unique features get tours
  if (photoInsights?.features && photoInsights.features.length >= 5) {
    return 'property_tour';
  }
  
  // Default to tips and advice for broader appeal
  return 'tips_advice';
}

/**
 * Determine target audience for video content
 */
function determineVideoAudience(propertyCategory: string): 'first_time_buyers' | 'sellers' | 'investors' | 'general_audience' {
  switch (propertyCategory) {
    case 'luxury': return 'sellers';
    case 'investment': return 'investors';
    case 'starter': return 'first_time_buyers';
    default: return 'general_audience';
  }
}

/**
 * Extract trending elements for viral potential
 */
function extractTrendingElements(facts: Facts, photoInsights?: PhotoInsights): string[] {
  const elements: string[] = [];
  
  // Property-based trending elements
  if (photoInsights?.features?.includes('pool')) {
    elements.push('luxury pool reveal', 'summer vibes', 'entertainment space');
  }
  
  if (photoInsights?.features?.some(f => f.toLowerCase().includes('kitchen'))) {
    elements.push('dream kitchen', 'cooking space goals', 'kitchen transformation');
  }
  
  // Location-based elements
  if (facts.neighborhood) {
    elements.push(`${facts.neighborhood} lifestyle`, 'neighborhood tour', 'local hidden gems');
  }
  
  // Market-based trending topics
  elements.push('home buying tips', 'real estate secrets', 'property investment');
  
  return elements.slice(0, 6);
}

/**
 * Generate platform-specific optimization strategies
 */
function generatePlatformOptimization(facts: Facts, photoInsights?: PhotoInsights): PlatformOptimization {
  const headlineFeature = photoInsights?.headlineFeature || 'amazing features';
  const neighborhood = facts.neighborhood || 'prime location';
  
  return {
    youtube: {
      optimalLength: '8-12 minutes',
      thumbnailSuggestions: [
        `${headlineFeature} with shocked expression overlay`,
        'Before/after split screen with property photos',
        'Agent pointing at key feature with highlight circle',
        'Price reveal with dramatic text overlay'
      ],
      descriptionStrategy: 'Detailed property info + market insights + timestamps + CTA',
      endScreenElements: [
        'Subscribe for market updates',
        'Watch similar property tours',
        'Contact for consultation',
        'Download buyer guide'
      ]
    },
    tiktok: {
      optimalLength: '15-60 seconds',
      hashtagStrategy: [
        '#RealEstate', '#PropertyTour', '#DreamHome', '#HomeBuying',
        '#RealEstateAgent', '#PropertyInvestment', '#HomeTour', '#RealEstateTips'
      ],
      soundRecommendations: [
        'Trending upbeat music for reveals',
        'Suspenseful music for before/after',
        'Luxury lifestyle audio for high-end properties',
        'Motivational sounds for tips content'
      ],
      effectSuggestions: [
        'Zoom transitions for room reveals',
        'Time warp effect for transformations',
        'Text overlay animations',
        'Split screen comparisons'
      ]
    },
    shorts: {
      optimalLength: '30-60 seconds',
      verticalOptimization: [
        'Portrait mode filming for all scenes',
        'Text overlay in safe zones (top/bottom thirds)',
        'Close-up shots for mobile viewing',
        'High contrast visuals for small screens'
      ],
      attentionGrabbers: [
        'Immediate visual hook in first 3 seconds',
        'Bold text overlays with key information',
        'Fast-paced editing with quick cuts',
        'Surprising reveals or transformations'
      ],
      loopingElements: [
        'Circular narrative structure',
        'Cliffhanger ending that connects to beginning',
        'Repeated visual motifs',
        'Question at end that hook answers'
      ]
    }
  };
}

/**
 * Identify visual assets from property analysis
 */
function identifyVisualAssets(photoInsights?: PhotoInsights): string[] {
  const assets: string[] = [];
  
  if (photoInsights?.rooms) {
    photoInsights.rooms.forEach(room => {
      if (room.appeal >= 8) {
        assets.push(`High-appeal ${room.type} shots`);
      }
    });
  }
  
  // Add feature-based visual assets
  if (photoInsights?.mustMentionFeatures) {
    assets.push(...photoInsights.mustMentionFeatures.map(feature => `${feature} showcase`));
  }
  
  // Add hero candidate if available
  if (photoInsights?.heroCandidate) {
    assets.push(`Hero shot: ${photoInsights.heroCandidate.reason}`);
  }
  
  return assets;
}

/**
 * Build engagement strategy for video content
 */
function buildEngagementStrategy(
  contentPurpose: string,
  targetAudience: string
): EngagementStrategy {
  const baseStrategy = {
    hookTechniques: [
      'Question hook: "What would you do with this space?"',
      'Shock value: "You won\'t believe what\'s behind this door"',
      'Trend hook: "This home trend is taking over"',
      'Problem/solution: "Tired of tiny kitchens? Wait till you see this"'
    ],
    retentionTactics: [
      'Tease upcoming rooms/features',
      'Use transition phrases: "But wait, there\'s more"',
      'Create mini-cliffhangers between sections',
      'Include surprising facts or statistics'
    ],
    interactionPrompts: [
      'Comment your favorite room below',
      'Would you live here? Yes or no?',
      'Tag someone who needs to see this',
      'What would you change about this space?'
    ],
    virality_triggers: [
      'Shocking price reveal',
      'Unexpected hidden features',
      'Before/after transformations',
      'Relatable homeowner struggles'
    ]
  };
  
  // Customize based on content purpose
  if (contentPurpose === 'luxury_showcase') {
    baseStrategy.hookTechniques.unshift('Luxury lifestyle hook: "POV: You live like this"');
    baseStrategy.virality_triggers.unshift('Extreme luxury features');
  }
  
  return baseStrategy;
}

/**
 * Generate YouTube long-form script
 */
function generateYouTubeScript(
  facts: Facts,
  photoInsights: PhotoInsights,
  videoContext: VideoContext
): VideoScript {
  const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
  const neighborhood = facts.neighborhood || 'prime location';
  
  const scenes: VideoScene[] = [
    {
      timestamp: '0:00-0:15',
      action: 'Hook and introduction',
      dialogue: `What if I told you that this ${facts.propertyType || 'home'} in ${neighborhood} has ${headlineFeature}? I'm [Agent Name], and today I'm taking you inside what might be your next dream home.`,
      visualFocus: 'Exterior shot or most compelling room',
      transitionNote: 'Quick montage of best features'
    },
    {
      timestamp: '0:15-2:00',
      action: 'Property overview and context',
      dialogue: `This ${facts.beds || ''} bedroom, ${facts.baths || ''} bathroom ${facts.propertyType || 'home'} just hit the market, and here's why it's special...`,
      visualFocus: 'Room-by-room quick preview',
      transitionNote: 'Smooth camera movement between spaces'
    },
    {
      timestamp: '2:00-8:00',
      action: 'Detailed tour with lifestyle focus',
      dialogue: 'Now let me show you each space and explain why buyers are going to love it...',
      visualFocus: 'Detailed room tours with lifestyle scenarios',
      transitionNote: 'Focus on must-mention features'
    },
    {
      timestamp: '8:00-10:00',
      action: 'Market insights and value proposition',
      dialogue: 'Here\'s what makes this property a smart investment in today\'s market...',
      visualFocus: 'Agent on-camera with graphics/charts if available',
      transitionNote: 'Professional authority building'
    },
    {
      timestamp: '10:00-12:00',
      action: 'Call to action and next steps',
      dialogue: 'If you\'re interested in learning more about this property or others like it...',
      visualFocus: 'Agent direct to camera with contact information',
      transitionNote: 'End screen elements activated'
    }
  ];
  
  return {
    title: `${headlineFeature} ${facts.propertyType || 'Home'} Tour - ${neighborhood} Real Estate`,
    hook: `This ${neighborhood} home has ${headlineFeature} that will blow your mind!`,
    scenes,
    callToAction: 'Subscribe for more property tours and market updates. Comment below if you\'d live here!',
    description: `Take a complete tour of this stunning ${facts.propertyType || 'property'} featuring ${headlineFeature}. Located in ${neighborhood}, this home offers ${photoInsights.features?.slice(0, 3).join(', ')} and so much more!`,
    tags: ['real estate', 'property tour', 'home for sale', neighborhood.toLowerCase().replace(/\s+/g, ''), 'dream home'],
    duration: '10-12 minutes',
    scriptNotes: [
      'Maintain energy throughout',
      'Use lifestyle scenarios for each room',
      'Include market context and expertise',
      'End with strong call to action'
    ]
  };
}

/**
 * Generate TikTok viral script
 */
function generateTikTokScript(
  facts: Facts,
  photoInsights: PhotoInsights,
  videoContext: VideoContext
): VideoScript {
  const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
  
  const scenes: VideoScene[] = [
    {
      timestamp: '0:00-0:03',
      action: 'Viral hook',
      dialogue: `POV: You find a ${facts.propertyType || 'home'} with ${headlineFeature}`,
      visualFocus: 'Most dramatic visual - exterior or best feature',
      transitionNote: 'Quick zoom or reveal effect'
    },
    {
      timestamp: '0:03-0:15',
      action: 'Feature reveals',
      dialogue: 'Wait till you see what\'s inside...',
      visualFocus: 'Quick cuts of best 3-4 features',
      transitionNote: 'Fast-paced transitions with trending audio'
    },
    {
      timestamp: '0:15-0:45',
      action: 'Lifestyle showcase',
      dialogue: 'Imagine hosting friends here... cooking in this kitchen... relaxing in this space...',
      visualFocus: 'Lifestyle-focused shots of key areas',
      transitionNote: 'Smooth transitions showing functionality'
    },
    {
      timestamp: '0:45-0:60',
      action: 'Engagement and CTA',
      dialogue: 'Would you live here? Comment YES or NO! Follow for more dream homes!',
      visualFocus: 'Final glamour shot or agent with property',
      transitionNote: 'Text overlay with engagement prompt'
    }
  ];
  
  return {
    title: `${headlineFeature} hits different 🏡✨`,
    hook: `POV: You find the perfect ${facts.propertyType || 'home'} with ${headlineFeature}`,
    scenes,
    callToAction: 'Follow for more dream homes! Comment YES if you\'d live here 👇',
    description: `This ${facts.propertyType || 'home'} in ${facts.neighborhood || 'prime location'} is everything! 😍 #DreamHome #RealEstate #PropertyTour`,
    tags: videoContext.platformOptimization.tiktok.hashtagStrategy,
    duration: '45-60 seconds',
    scriptNotes: [
      'Use trending audio/sound',
      'Quick cuts for attention retention',
      'Include interactive elements',
      'End with clear engagement ask'
    ]
  };
}

/**
 * Generate YouTube Shorts script
 */
function generateShortsScript(
  facts: Facts,
  photoInsights: PhotoInsights,
  videoContext: VideoContext
): VideoScript {
  const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
  
  const scenes: VideoScene[] = [
    {
      timestamp: '0:00-0:05',
      action: 'Attention grab',
      dialogue: `This ${facts.propertyType || 'home'} sold for HOW MUCH?!`,
      visualFocus: 'Exterior or hero shot with dramatic text overlay',
      transitionNote: 'Bold text animation with price or feature reveal'
    },
    {
      timestamp: '0:05-0:25',
      action: 'Quick feature tour',
      dialogue: 'Here\'s what you get for that price...',
      visualFocus: 'Rapid tour of best features',
      transitionNote: 'Fast transitions with feature callouts'
    },
    {
      timestamp: '0:25-0:50',
      action: 'Value proposition',
      dialogue: 'In this market, that\'s actually a steal because...',
      visualFocus: 'Agent explanation with visual proof',
      transitionNote: 'Split screen or overlay graphics'
    },
    {
      timestamp: '0:50-0:60',
      action: 'CTA and loop',
      dialogue: 'Follow for more real estate insights! Would you buy this?',
      visualFocus: 'Back to opening shot for loop potential',
      transitionNote: 'Circular ending that loops to beginning'
    }
  ];
  
  return {
    title: `${facts.propertyType || 'Home'} Sold for SHOCKING Price! 😱`,
    hook: `This ${facts.propertyType || 'home'} with ${headlineFeature} sold for HOW MUCH?!`,
    scenes,
    callToAction: 'Follow for market insights! Would you buy this? 👇',
    description: `Real estate market insights! This property breakdown will surprise you 📈 #RealEstate #MarketAnalysis`,
    tags: ['real estate', 'property market', 'home prices', 'market analysis', 'real estate tips'],
    duration: '60 seconds',
    scriptNotes: [
      'Vertical video format (9:16)',
      'Text overlays in safe zones',
      'High energy throughout',
      'Design for loop viewing'
    ]
  };
}

/**
 * Generate viral video hooks
 */
function generateVideoHooks(photoInsights: PhotoInsights, videoContext: VideoContext): string[] {
  const hooks: string[] = [];
  const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
  
  // Property-specific hooks
  hooks.push(`POV: You walk into a home with ${headlineFeature}`);
  hooks.push(`This house just hit different with its ${headlineFeature}`);
  hooks.push(`Tell me you wouldn't want ${headlineFeature} in your home`);
  
  // Market/price hooks
  hooks.push('This property sold for HOW MUCH?!');
  hooks.push('Real estate agents don\'t want you to know this...');
  hooks.push('The housing market is crazy right now, but this...');
  
  // Lifestyle hooks
  if (photoInsights.lifestyleScenarios && photoInsights.lifestyleScenarios.length > 0) {
    hooks.push(`Imagine: ${photoInsights.lifestyleScenarios[0]}`);
  }
  
  // Trending format hooks
  hooks.push('Day in the life of a real estate agent...');
  hooks.push('Rating this property from 1-10...');
  hooks.push('Things that make a house feel like home...');
  
  return hooks;
}

/**
 * Get trending formats for content type
 */
function getTrendingFormats(contentPurpose: string): TrendingFormat[] {
  const baseFormats: TrendingFormat[] = [
    {
      name: 'Property Rating',
      platform: 'tiktok',
      structure: 'Rate different aspects of property 1-10',
      example: 'Rating this kitchen: 10/10 ✨',
      engagementTriggers: ['interactive rating', 'comment disagreement', 'comparison debates']
    },
    {
      name: 'Before & After',
      platform: 'shorts',
      structure: 'Show transformation or reveal',
      example: 'This room looked completely different before...',
      engagementTriggers: ['shocking reveals', 'transformation amazement', 'improvement inspiration']
    },
    {
      name: 'Day in the Life',
      platform: 'youtube',
      structure: 'Follow agent through property activities',
      example: 'Day in the life showing this luxury home...',
      engagementTriggers: ['behind scenes access', 'professional insights', 'lifestyle aspiration']
    }
  ];
  
  return baseFormats;
}

/**
 * Generate visual direction cues
 */
function generateVisualCues(
  facts: Facts,
  photoInsights: PhotoInsights,
  videoContext: VideoContext
): VisualCue[] {
  const cues: VisualCue[] = [];
  
  // Opening shot cues
  cues.push({
    timing: 'Opening (0-3 seconds)',
    instruction: 'Start with most visually impressive shot - exterior or hero feature',
    purpose: 'Immediate attention grab and retention',
    alternativeOptions: ['Drone exterior shot', 'Dramatic interior reveal', 'Agent welcome shot']
  });
  
  // Transition cues
  cues.push({
    timing: 'Between rooms',
    instruction: 'Use smooth camera movements or quick cuts with trending transitions',
    purpose: 'Maintain flow and energy throughout tour',
    alternativeOptions: ['Walking transitions', 'Door reveals', 'Zoom transitions']
  });
  
  // Feature highlight cues
  if (photoInsights.mustMentionFeatures) {
    photoInsights.mustMentionFeatures.slice(0, 3).forEach((feature, index) => {
      cues.push({
        timing: `Feature ${index + 1} reveal`,
        instruction: `Close-up of ${feature} with lifestyle context`,
        purpose: 'Showcase key selling points with emotional connection'
      });
    });
  }
  
  // Closing shot cues
  cues.push({
    timing: 'Closing (final 10 seconds)',
    instruction: 'Return to hero shot or agent direct-to-camera with CTA',
    purpose: 'Strong ending that encourages action and potential loop viewing'
  });
  
  return cues;
}

/**
 * Calculate video engagement and viral potential scores
 */
function calculateVideoScores(
  youtubeScript: VideoScript,
  tiktokScript: VideoScript,
  shortsScript: VideoScript,
  videoContext: VideoContext
): { engagementScore: number; viralPotential: number } {
  let engagementScore = 0;
  let viralPotential = 0;
  
  // Hook quality assessment
  const allHooks = [youtubeScript.hook, tiktokScript.hook, shortsScript.hook];
  const strongHookWords = ['pov', 'shocking', 'won\'t believe', 'hits different', 'how much'];
  const hookQuality = allHooks.some(hook => 
    strongHookWords.some(word => hook.toLowerCase().includes(word))
  );
  if (hookQuality) engagementScore += 25;
  
  // CTA strength
  const allCTAs = [youtubeScript.callToAction, tiktokScript.callToAction, shortsScript.callToAction];
  const strongCTAs = allCTAs.filter(cta => 
    cta.toLowerCase().includes('comment') || 
    cta.toLowerCase().includes('follow') || 
    cta.toLowerCase().includes('subscribe')
  ).length;
  engagementScore += strongCTAs * 15;
  
  // Platform optimization
  const platformOptimized = videoContext.platformOptimization;
  if (platformOptimized.tiktok.optimalLength && platformOptimized.shorts.optimalLength) {
    engagementScore += 20;
  }
  
  // Trending elements
  viralPotential += Math.min(videoContext.trendingElements.length * 15, 60);
  
  // Visual assets quality
  viralPotential += Math.min(videoContext.visualAssets.length * 10, 40);
  
  return {
    engagementScore: Math.min(engagementScore, 100),
    viralPotential: Math.min(viralPotential, 100)
  };
}

/**
 * Extract retention elements for video optimization
 */
function extractRetentionElements(videoContext: VideoContext): string[] {
  return [
    ...videoContext.engagementStrategy.retentionTactics,
    ...videoContext.engagementStrategy.hookTechniques.slice(0, 2),
    ...videoContext.engagementStrategy.virality_triggers.slice(0, 2)
  ];
}

/**
 * Validate video content meets platform standards
 */
export function validateVideoContent(content: VideoOptimizedContent): {
  isValid: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;
  
  // YouTube script validation
  if (!content.youtubeScript.scenes || content.youtubeScript.scenes.length < 3) {
    issues.push('YouTube script needs minimum 3 scenes for proper structure');
    score -= 15;
  }
  
  // TikTok script validation
  if (!content.tiktokScript.hook || !content.tiktokScript.hook.toLowerCase().includes('pov')) {
    issues.push('TikTok script missing viral hook format (POV, etc.)');
    score -= 10;
  }
  
  // Shorts optimization validation
  if (!content.shortsScript.scriptNotes?.some(note => note.includes('Vertical'))) {
    issues.push('Shorts script missing vertical format optimization');
    score -= 10;
  }
  
  // Hook diversity validation
  if (content.videoHooks.length < 5) {
    issues.push('Insufficient hook variety for A/B testing');
    score -= 10;
  }
  
  // Visual cues validation
  if (content.visualCues.length < 3) {
    issues.push('Missing visual direction for effective video production');
    score -= 15;
  }
  
  // Engagement score validation
  if (content.engagementScore < 60) {
    issues.push('Low engagement potential - missing interactive elements');
    score -= 15;
  }
  
  // Viral potential validation
  if (content.viralPotential < 50) {
    issues.push('Low viral potential - missing trending elements');
    score -= 15;
  }
  
  // Platform optimization validation
  const hasAllPlatforms = content.youtubeScript.title && 
                         content.tiktokScript.title && 
                         content.shortsScript.title;
  if (!hasAllPlatforms) {
    issues.push('Missing scripts for one or more platforms');
    score -= 10;
  }
  
  return {
    isValid: issues.length <= 1 && score >= 70,
    issues,
    score: Math.max(0, score)
  };
}