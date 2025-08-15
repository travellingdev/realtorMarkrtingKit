/**
 * Advanced Instagram Hashtag Generation System
 * Implements the 9-3-9-9 strategy for optimal reach and engagement
 */

import type { Facts } from './schemas';
import type { PhotoInsights } from './photoAnalysis';

export interface HashtagSet {
  trending: string[];
  location: string[];
  features: string[];
  targeted: string[];
  all: string[];
  score?: number;
  tips?: string;
}

// Trending hashtags for 2024 (should be updated regularly)
const TRENDING_HASHTAGS_2024 = {
  general: [
    '#realestate2024',
    '#justlisted',
    '#dreamhome',
    '#homesweethome',
    '#househunting2024'
  ],
  luxury: [
    '#luxuryrealestate',
    '#luxuryhomes',
    '#milliondollarlisting',
    '#luxurylifestyle',
    '#modernluxury'
  ],
  investment: [
    '#investmentproperty',
    '#realestateinvesting',
    '#propertyinvestment',
    '#passiveincome',
    '#rentalincome'
  ],
  firstTime: [
    '#firsttimehomebuyer',
    '#newbeginnings',
    '#homeownership',
    '#americandream',
    '#starterhome'
  ]
};

// High-reach hashtags (1M+ posts)
const HIGH_REACH_HASHTAGS = [
  '#realestate',
  '#realtor',
  '#home',
  '#property',
  '#forsale',
  '#house',
  '#realtorlife',
  '#househunting',
  '#newhome'
];

// Medium-reach hashtags (100K-1M posts)
const MEDIUM_REACH_HASHTAGS = [
  '#openhouse',
  '#homeforsale',
  '#realestateagent',
  '#properties',
  '#homebuyers',
  '#listing',
  '#realestateinvestor',
  '#homesearch',
  '#propertyforsale'
];

// Niche hashtags (<100K posts) - higher conversion potential
const NICHE_HASHTAGS = {
  eco: ['#ecohome', '#sustainableliving', '#greenbuilding', '#energyefficient'],
  smart: ['#smarthome', '#homeautomation', '#connectedhome', '#intelligentliving'],
  pool: ['#poolhome', '#backyardoasis', '#poolside', '#outdoorliving'],
  view: ['#viewproperty', '#scenicviews', '#panoramicviews', '#roomwithaview'],
  modern: ['#modernhome', '#contemporaryliving', '#architecturaldesign', '#minimalistliving'],
  traditional: ['#traditionalhome', '#classicarchitecture', '#timelessdesign', '#charmingHome']
};

/**
 * Generate smart hashtags based on property data and insights
 */
export function generateSmartHashtags(
  facts: Facts,
  photoInsights?: PhotoInsights,
  strategy: 'balanced' | 'reach' | 'niche' = 'balanced'
): HashtagSet {
  const hashtags: HashtagSet = {
    trending: [],
    location: [],
    features: [],
    targeted: [],
    all: [],
    score: 0,
    tips: ''
  };

  // 1. TRENDING HASHTAGS (5-6 tags)
  hashtags.trending = selectTrendingHashtags(facts, photoInsights);

  // 2. LOCATION HASHTAGS (7-8 tags)
  hashtags.location = generateLocationHashtags(facts);

  // 3. FEATURE HASHTAGS (8-10 tags)
  hashtags.features = generateFeatureHashtags(facts, photoInsights);

  // 4. TARGETED/NICHE HASHTAGS (7-9 tags)
  hashtags.targeted = generateTargetedHashtags(facts, photoInsights, strategy);

  // Ensure we have exactly 30 hashtags
  const allHashtags = [
    ...hashtags.trending,
    ...hashtags.location,
    ...hashtags.features,
    ...hashtags.targeted
  ];

  // Remove duplicates
  const uniqueHashtags = Array.from(new Set(allHashtags));

  // Trim to 30 if over
  if (uniqueHashtags.length > 30) {
    hashtags.all = uniqueHashtags.slice(0, 30);
  } else {
    hashtags.all = uniqueHashtags;
    // Add more if under 30
    const needed = 30 - uniqueHashtags.length;
    const additional = getAdditionalHashtags(needed, uniqueHashtags);
    hashtags.all = [...uniqueHashtags, ...additional];
  }

  // Calculate performance score
  hashtags.score = calculateHashtagScore(hashtags);

  // Add contextual tips
  hashtags.tips = generateHashtagTips(facts, strategy);

  return hashtags;
}

/**
 * Select trending hashtags based on property type
 */
function selectTrendingHashtags(facts: Facts, insights?: PhotoInsights): string[] {
  const trending: string[] = [];
  
  // Always include top general trending
  trending.push(...TRENDING_HASHTAGS_2024.general.slice(0, 3));

  // Add category-specific trending
  if (insights?.propertyCategory === 'luxury' || facts.propertyType?.includes('luxury')) {
    trending.push(...TRENDING_HASHTAGS_2024.luxury.slice(0, 2));
  } else if (insights?.buyerProfile?.includes('first')) {
    trending.push(...TRENDING_HASHTAGS_2024.firstTime.slice(0, 2));
  } else if (insights?.buyerProfile?.includes('investor')) {
    trending.push(...TRENDING_HASHTAGS_2024.investment.slice(0, 2));
  }

  return trending.slice(0, 6);
}

/**
 * Generate location-based hashtags
 */
function generateLocationHashtags(facts: Facts): string[] {
  const locationTags: string[] = [];
  
  if (facts.neighborhood) {
    const cleanNeighborhood = facts.neighborhood.toLowerCase().replace(/[^a-z0-9]/g, '');
    locationTags.push(
      `#${cleanNeighborhood}`,
      `#${cleanNeighborhood}homes`,
      `#${cleanNeighborhood}realestate`
    );
  }

  if (facts.address) {
    const parts = facts.address.split(',');
    if (parts.length >= 2) {
      const city = parts[1].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const state = parts[2]?.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      
      locationTags.push(
        `#${city}`,
        `#${city}homes`,
        `#${city}realestate`
      );
      
      if (state) {
        locationTags.push(
          `#${state}realestate`,
          `#${state}homes`
        );
      }
    }
  }

  return locationTags.slice(0, 8);
}

/**
 * Generate feature-based hashtags
 */
function generateFeatureHashtags(facts: Facts, insights?: PhotoInsights): string[] {
  const featureTags: string[] = [];
  
  // Property type tags
  if (facts.propertyType) {
    const type = facts.propertyType.toLowerCase();
    if (type.includes('single')) {
      featureTags.push('#singlefamilyhome', '#familyhome');
    } else if (type.includes('condo')) {
      featureTags.push('#condoliving', '#condoforsale');
    } else if (type.includes('town')) {
      featureTags.push('#townhouse', '#townhome');
    }
  }

  // Bed/bath tags
  if (facts.beds) {
    featureTags.push(`#${facts.beds}bedroom`, `#${facts.beds}br`);
  }
  if (facts.baths) {
    featureTags.push(`#${facts.baths}bathroom`);
  }

  // Feature-specific tags
  if (insights?.features) {
    insights.features.forEach(feature => {
      const cleanFeature = feature.toLowerCase();
      if (cleanFeature.includes('pool')) {
        featureTags.push('#poolhome', '#backyardpool');
      } else if (cleanFeature.includes('kitchen')) {
        featureTags.push('#modernkitchen', '#gourmetkitchen');
      } else if (cleanFeature.includes('view')) {
        featureTags.push('#stunningviews', '#viewproperty');
      } else if (cleanFeature.includes('garage')) {
        featureTags.push('#garageincluded');
      }
    });
  }

  // Style tags from photo analysis
  if (insights?.style && insights.style.length > 0) {
    const styleString = insights.style.join(' ').toLowerCase();
    if (styleString.includes('modern')) {
      featureTags.push('#modernarchitecture', '#moderndesign');
    } else if (styleString.includes('traditional')) {
      featureTags.push('#traditionalhome', '#classicdesign');
    } else if (styleString.includes('contemporary')) {
      featureTags.push('#contemporaryhome');
    }
  }

  return featureTags.slice(0, 10);
}

/**
 * Generate targeted/niche hashtags based on strategy
 */
function generateTargetedHashtags(
  facts: Facts,
  insights?: PhotoInsights,
  strategy: 'balanced' | 'reach' | 'niche' = 'balanced'
): string[] {
  const targetedTags: string[] = [];

  if (strategy === 'reach') {
    // Focus on high-reach tags
    targetedTags.push(...HIGH_REACH_HASHTAGS.slice(0, 7));
  } else if (strategy === 'niche') {
    // Focus on niche conversion tags
    if (insights?.features?.some(f => f.toLowerCase().includes('pool'))) {
      targetedTags.push(...NICHE_HASHTAGS.pool);
    }
    if (insights?.features?.some(f => f.toLowerCase().includes('smart'))) {
      targetedTags.push(...NICHE_HASHTAGS.smart);
    }
    if (insights?.style?.some(s => s.toLowerCase().includes('modern'))) {
      targetedTags.push(...NICHE_HASHTAGS.modern);
    }
  } else {
    // Balanced approach
    targetedTags.push(...HIGH_REACH_HASHTAGS.slice(0, 3));
    targetedTags.push(...MEDIUM_REACH_HASHTAGS.slice(0, 3));
    
    // Add relevant niche tags
    if (insights?.features?.some(f => f.toLowerCase().includes('view'))) {
      targetedTags.push(...NICHE_HASHTAGS.view.slice(0, 2));
    }
  }

  // Buyer persona tags
  if (insights?.buyerProfile) {
    const profile = insights.buyerProfile.toLowerCase();
    if (profile.includes('family')) {
      targetedTags.push('#familyhome', '#familyfriendly');
    } else if (profile.includes('investor')) {
      targetedTags.push('#investmentopportunity', '#rentalready');
    } else if (profile.includes('luxury')) {
      targetedTags.push('#luxurybuyers', '#exclusivelisting');
    }
  }

  return targetedTags.slice(0, 9);
}

/**
 * Get additional hashtags to reach 30
 */
function getAdditionalHashtags(needed: number, existing: string[]): string[] {
  const additional: string[] = [];
  const allPossible = [
    ...MEDIUM_REACH_HASHTAGS,
    '#homestyle',
    '#houseoftheday',
    '#propertylisting',
    '#realestatetips',
    '#homebuying',
    '#propertymarket',
    '#houseforsale',
    '#newlisting',
    '#realtorsofinstagram'
  ];

  for (const tag of allPossible) {
    if (!existing.includes(tag)) {
      additional.push(tag);
      if (additional.length >= needed) break;
    }
  }

  return additional;
}

/**
 * Calculate hashtag performance score
 */
function calculateHashtagScore(hashtags: HashtagSet): number {
  let score = 0;
  
  // Check for good mix (max 10 points)
  if (hashtags.trending.length >= 5) score += 2.5;
  if (hashtags.location.length >= 6) score += 2.5;
  if (hashtags.features.length >= 8) score += 2.5;
  if (hashtags.targeted.length >= 7) score += 2.5;

  // Bonus for reaching 30 hashtags
  if (hashtags.all.length === 30) score += 0.5;

  // Ensure score is between 0 and 10
  return Math.min(10, Math.max(0, score));
}

/**
 * Generate contextual tips based on strategy
 */
function generateHashtagTips(facts: Facts, strategy: string): string {
  const tips = [
    'Post between 11 AM - 1 PM or 7 PM - 9 PM for maximum engagement',
    'Vary hashtags between posts to avoid shadowbanning',
    'Include location tags for local discovery',
    'Mix popular and niche tags for best results',
    'Add hashtags in first comment for cleaner captions'
  ];

  if (strategy === 'reach') {
    return 'Using high-reach strategy. ' + tips[3];
  } else if (strategy === 'niche') {
    return 'Using niche targeting. ' + tips[2];
  }
  
  return tips[Math.floor(Math.random() * tips.length)];
}