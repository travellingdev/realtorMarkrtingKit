/**
 * Content-Aware Hashtag Generation System
 * Analyzes actual generated content to create highly relevant hashtags
 */

import type { Output } from './schemas';

interface ContentThemes {
  emotions: string[];
  benefits: string[];
  lifestyle: string[];
  features: string[];
  urgency: string[];
  luxury: string[];
}

interface ContentHashtags {
  contentBased: string[];
  emotionBased: string[];
  benefitBased: string[];
  lifestyleBased: string[];
}

/**
 * Extract themes and keywords from generated Instagram content
 */
export function extractContentThemes(igSlides: string[]): ContentThemes {
  const content = igSlides.join(' ').toLowerCase();
  
  const themes: ContentThemes = {
    emotions: [],
    benefits: [],
    lifestyle: [],
    features: [],
    urgency: [],
    luxury: []
  };

  // Emotion detection patterns
  const emotionPatterns = {
    love: ['love', 'fall in love', 'dream', 'heart'],
    excitement: ['excited', 'amazing', 'incredible', 'stunning', 'wow'],
    comfort: ['cozy', 'comfortable', 'relaxing', 'peaceful', 'serene'],
    pride: ['proud', 'impressive', 'prestigious', 'exclusive'],
    joy: ['happy', 'joyful', 'delightful', 'wonderful']
  };

  // Benefit detection patterns
  const benefitPatterns = {
    convenience: ['convenient', 'easy', 'accessible', 'close to', 'walkable'],
    value: ['value', 'investment', 'opportunity', 'potential', 'growth'],
    lifestyle: ['lifestyle', 'living', 'life', 'everyday', 'daily'],
    entertainment: ['entertain', 'hosting', 'gathering', 'party', 'guests'],
    privacy: ['private', 'secluded', 'quiet', 'peaceful', 'tranquil']
  };

  // Lifestyle detection patterns
  const lifestylePatterns = {
    family: ['family', 'kids', 'children', 'schools', 'playground'],
    professional: ['office', 'work from home', 'remote', 'professional', 'career'],
    entertainment: ['entertainment', 'hosting', 'parties', 'gatherings', 'bbq'],
    wellness: ['gym', 'fitness', 'health', 'wellness', 'yoga', 'meditation'],
    luxury: ['luxury', 'premium', 'high-end', 'exclusive', 'sophisticated']
  };

  // Feature extraction from content
  const featurePatterns = {
    kitchen: ['kitchen', 'cooking', 'chef', 'culinary', 'granite', 'appliances'],
    pool: ['pool', 'swimming', 'backyard oasis', 'poolside', 'outdoor'],
    view: ['view', 'scenic', 'panoramic', 'vista', 'overlook'],
    space: ['spacious', 'open', 'room', 'square feet', 'expansive'],
    modern: ['modern', 'contemporary', 'updated', 'renovated', 'new']
  };

  // Urgency patterns
  const urgencyPatterns = {
    scarcity: ['last', 'only', 'rare', 'unique', 'one of a kind'],
    timing: ['now', 'today', 'don\'t miss', 'hurry', 'quick'],
    opportunity: ['opportunity', 'chance', 'moment', 'perfect time']
  };

  // Extract themes based on patterns
  for (const [emotion, keywords] of Object.entries(emotionPatterns)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      themes.emotions.push(emotion);
    }
  }

  for (const [benefit, keywords] of Object.entries(benefitPatterns)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      themes.benefits.push(benefit);
    }
  }

  for (const [lifestyle, keywords] of Object.entries(lifestylePatterns)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      themes.lifestyle.push(lifestyle);
    }
  }

  for (const [feature, keywords] of Object.entries(featurePatterns)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      themes.features.push(feature);
    }
  }

  for (const [urgency, keywords] of Object.entries(urgencyPatterns)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      themes.urgency.push(urgency);
    }
  }

  // Check for luxury indicators
  const luxuryKeywords = ['luxury', 'premium', 'executive', 'upscale', 'elegant', 'sophisticated'];
  if (luxuryKeywords.some(keyword => content.includes(keyword))) {
    themes.luxury.push('luxury');
  }

  return themes;
}

/**
 * Generate hashtags based on extracted content themes
 */
export function generateContentBasedHashtags(themes: ContentThemes): ContentHashtags {
  const hashtags: ContentHashtags = {
    contentBased: [],
    emotionBased: [],
    benefitBased: [],
    lifestyleBased: []
  };

  // Emotion-based hashtags
  const emotionHashtagMap: Record<string, string[]> = {
    love: ['#lovewhereyoulive', '#dreamhometrue', '#homeiswheretheheart'],
    excitement: ['#excitingnews', '#amazingproperty', '#stunninghome'],
    comfort: ['#cozyhome', '#comfortliving', '#peacefulhome'],
    pride: ['#proudhomeowner', '#prestigiousliving', '#exclusiveproperty'],
    joy: ['#happyhome', '#joyfulspaces', '#delightfulliving']
  };

  // Benefit-based hashtags
  const benefitHashtagMap: Record<string, string[]> = {
    convenience: ['#convenientlocation', '#easyaccess', '#walkableneighborhood'],
    value: ['#greatvalue', '#investmentopportunity', '#growthpotential'],
    lifestyle: ['#lifestyleupgrade', '#betterlivingstartshere', '#yourdreamlifestyle'],
    entertainment: ['#entertainathome', '#perfectforentertaining', '#hostwitthemoost'],
    privacy: ['#privateretreate', '#peacefulhaven', '#yoursanctuary']
  };

  // Lifestyle-based hashtags
  const lifestyleHashtagMap: Record<string, string[]> = {
    family: ['#familyhomesweethome', '#kidfriendlyhome', '#familyneighborhood'],
    professional: ['#workfromhomeparadise', '#homeofficegoals', '#remoteworkready'],
    entertainment: ['#entertainmentready', '#partyperfect', '#gatheringplace'],
    wellness: ['#wellnessliving', '#healthyhome', '#mindfulspaces'],
    luxury: ['#luxuryliving', '#premiumhomes', '#highendrealestate']
  };

  // Feature-based hashtags
  const featureHashtagMap: Record<string, string[]> = {
    kitchen: ['#kitchengoals', '#chefskitchen', '#gourmetkitchen'],
    pool: ['#poollife', '#backyardoasis', '#poolsideparadise'],
    view: ['#roomwithaview', '#scenicviews', '#viewsthatinspire'],
    space: ['#spaciousliving', '#openfloorplan', '#roomtogrow'],
    modern: ['#modernhome', '#contemporaryliving', '#updatedandready']
  };

  // Generate hashtags from themes
  themes.emotions.forEach(emotion => {
    if (emotionHashtagMap[emotion]) {
      hashtags.emotionBased.push(...emotionHashtagMap[emotion].slice(0, 2));
    }
  });

  themes.benefits.forEach(benefit => {
    if (benefitHashtagMap[benefit]) {
      hashtags.benefitBased.push(...benefitHashtagMap[benefit].slice(0, 2));
    }
  });

  themes.lifestyle.forEach(lifestyle => {
    if (lifestyleHashtagMap[lifestyle]) {
      hashtags.lifestyleBased.push(...lifestyleHashtagMap[lifestyle].slice(0, 2));
    }
  });

  themes.features.forEach(feature => {
    if (featureHashtagMap[feature]) {
      hashtags.contentBased.push(...featureHashtagMap[feature].slice(0, 2));
    }
  });

  // Add urgency hashtags if themes present
  if (themes.urgency.length > 0) {
    hashtags.contentBased.push('#dontmissout', '#actfast', '#limitedtime');
  }

  // Add luxury hashtags if applicable
  if (themes.luxury.length > 0) {
    hashtags.contentBased.push('#luxurylistings', '#premiumproperty');
  }

  return hashtags;
}

/**
 * Extract key phrases and convert them to hashtags
 */
export function extractKeyPhraseHashtags(igSlides: string[]): string[] {
  const hashtags: string[] = [];
  const content = igSlides.join(' ');

  // Extract "POV:" statements and similar hooks
  const povMatch = content.match(/POV:\s*([^.!?]+)/i);
  if (povMatch) {
    const phrase = povMatch[1].toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 3)
      .join('');
    if (phrase.length > 5 && phrase.length < 30) {
      hashtags.push(`#${phrase}`);
    }
  }

  // Extract "Picture yourself" scenarios
  const pictureMatch = content.match(/Picture yourself\s*([^.!?]+)/i);
  if (pictureMatch) {
    const scenario = pictureMatch[1].toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .slice(0, 2)
      .join('');
    if (scenario.length > 5 && scenario.length < 20) {
      hashtags.push(`#${scenario}life`);
    }
  }

  // Extract superlatives and unique descriptors
  const superlatives = ['perfect', 'stunning', 'amazing', 'incredible', 'beautiful', 'gorgeous'];
  superlatives.forEach(word => {
    if (content.toLowerCase().includes(word)) {
      const afterWord = content.toLowerCase().split(word)[1]?.trim().split(' ')[0];
      if (afterWord && afterWord.length > 3) {
        hashtags.push(`#${word}${afterWord}`.replace(/[^a-z]/g, ''));
      }
    }
  });

  return hashtags.filter(tag => tag.length > 5 && tag.length < 30);
}

/**
 * Analyze Instagram content sentiment for hashtag generation
 */
export function analyzeSentimentForHashtags(igSlides: string[]): string[] {
  const content = igSlides.join(' ').toLowerCase();
  const sentimentHashtags: string[] = [];

  // Positive sentiment indicators
  const positiveWords = ['love', 'amazing', 'perfect', 'beautiful', 'dream', 'stunning'];
  const positiveCount = positiveWords.filter(word => content.includes(word)).length;

  if (positiveCount >= 3) {
    sentimentHashtags.push('#mustsee', '#topdeal', '#hotproperty');
  }

  // Urgency indicators
  const urgencyWords = ['now', 'today', 'fast', 'quick', 'limited', 'exclusive'];
  const urgencyCount = urgencyWords.filter(word => content.includes(word)).length;

  if (urgencyCount >= 2) {
    sentimentHashtags.push('#actfast', '#newlisting', '#justlisted');
  }

  // Lifestyle indicators
  const lifestyleWords = ['lifestyle', 'living', 'life', 'home', 'family', 'comfort'];
  const lifestyleCount = lifestyleWords.filter(word => content.includes(word)).length;

  if (lifestyleCount >= 3) {
    sentimentHashtags.push('#homesweethome', '#lifestylegoals', '#livingthedream');
  }

  return sentimentHashtags;
}

/**
 * Main function to enhance hashtags with content awareness
 */
export function enhanceHashtagsWithContent(
  existingHashtags: any,
  igSlides: string[]
): any {
  // Extract themes from content
  const themes = extractContentThemes(igSlides);
  
  // Generate content-based hashtags
  const contentHashtags = generateContentBasedHashtags(themes);
  
  // Extract key phrase hashtags
  const keyPhrases = extractKeyPhraseHashtags(igSlides);
  
  // Analyze sentiment for additional hashtags
  const sentimentTags = analyzeSentimentForHashtags(igSlides);

  // Combine all content-aware hashtags
  const allContentAware = [
    ...contentHashtags.contentBased,
    ...contentHashtags.emotionBased,
    ...contentHashtags.benefitBased,
    ...contentHashtags.lifestyleBased,
    ...keyPhrases,
    ...sentimentTags
  ];

  // Remove duplicates
  const uniqueContentAware = Array.from(new Set(allContentAware));

  // Merge with existing hashtags intelligently
  const enhanced = {
    ...existingHashtags,
    content: uniqueContentAware.slice(0, 10), // Add new category for content-based
    all: [] as string[]
  };

  // Rebuild the 'all' array with content-aware hashtags prioritized
  enhanced.all = [
    ...uniqueContentAware.slice(0, 10), // Prioritize content-aware
    ...enhanced.trending.slice(0, 5),
    ...enhanced.location.slice(0, 5),
    ...enhanced.features.slice(0, 5),
    ...enhanced.targeted.slice(0, 5)
  ];

  // Ensure we have exactly 30 unique hashtags
  enhanced.all = Array.from(new Set(enhanced.all)).slice(0, 30);

  // Add content-aware tip
  enhanced.tips = enhanced.tips + ' | Content-optimized: Your hashtags now reflect the actual messaging and emotions in your posts for better engagement!';

  return enhanced;
}