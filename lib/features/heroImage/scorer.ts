/**
 * Hero Image Scoring Algorithm
 * Evaluates photos to select the best hero image
 */

export interface PhotoScore {
  photoUrl: string;
  photoIndex: number;
  totalScore: number;
  reasoning: string;
  scores: {
    emotional: number;
    technical: number;
    marketing: number;
    story: number;
    uniqueness: number;
    psychology: number;
  };
  details: {
    roomType?: string;
    features?: string[];
    lighting?: string;
    composition?: string;
    bestFor?: string[];
  };
}

export interface HeroImageAnalysis {
  bestPhoto: PhotoScore;
  alternatives: PhotoScore[];
  insights: {
    propertyHighlight: string;
    enhancementSuggestions: string[];
    marketingAngle: string;
  };
}

// Room priority based on property type
const ROOM_PRIORITY: Record<string, string[]> = {
  'Luxury Home': [
    'exterior_twilight', 'grand_entrance', 'kitchen_gourmet',
    'master_suite', 'pool_area', 'view_shot'
  ],
  'Family Home': [
    'exterior_day', 'kitchen_family', 'living_room',
    'backyard', 'kids_room', 'neighborhood'
  ],
  'Starter Home': [
    'exterior_curb', 'living_room', 'kitchen',
    'master_bedroom', 'backyard', 'bathroom'
  ],
  'Condo': [
    'view_balcony', 'living_room', 'kitchen',
    'building_exterior', 'amenities', 'master'
  ],
  'Investment Property': [
    'exterior_street', 'kitchen', 'living_room',
    'rental_ready', 'neighborhood', 'parking'
  ],
};

// Special cases that get bonus points
const HERO_WORTHY_FEATURES = [
  { feature: 'sunset', bonus: 15, reason: 'Golden hour shots get 47% more clicks' },
  { feature: 'pool', bonus: 12, reason: 'Lifestyle amenity that drives interest' },
  { feature: 'mountain_view', bonus: 12, reason: 'Unique natural feature' },
  { feature: 'ocean_view', bonus: 15, reason: 'Premium location indicator' },
  { feature: 'grand_entrance', bonus: 10, reason: 'Sets expectations immediately' },
  { feature: 'modern_kitchen', bonus: 10, reason: 'Most searched feature' },
  { feature: 'fireplace', bonus: 8, reason: 'Emotional warmth and comfort' },
  { feature: 'architectural_detail', bonus: 10, reason: 'Memorable differentiation' },
  { feature: 'outdoor_living', bonus: 8, reason: 'Extends living space' },
  { feature: 'spa_bathroom', bonus: 8, reason: 'Luxury lifestyle indicator' },
];

/**
 * Score emotional impact of a photo
 */
function scoreEmotionalImpact(analysis: any): number {
  let score = 60; // Base score
  
  // Check for emotional triggers
  if (analysis.description?.includes('cozy') || analysis.description?.includes('warm')) score += 10;
  if (analysis.description?.includes('stunning') || analysis.description?.includes('breathtaking')) score += 15;
  if (analysis.description?.includes('spacious') || analysis.description?.includes('open')) score += 8;
  if (analysis.description?.includes('bright') || analysis.description?.includes('airy')) score += 8;
  if (analysis.description?.includes('luxurious') || analysis.description?.includes('elegant')) score += 12;
  
  // Lifestyle indicators
  if (analysis.lifestyle_potential) score += 10;
  if (analysis.entertaining_space) score += 8;
  if (analysis.family_friendly) score += 7;
  
  return Math.min(100, score);
}

/**
 * Score technical quality
 */
function scoreTechnicalQuality(analysis: any): number {
  let score = 70; // Base score
  
  // Composition
  if (analysis.composition?.rule_of_thirds) score += 5;
  if (analysis.composition?.leading_lines) score += 5;
  if (analysis.composition?.symmetry) score += 3;
  if (analysis.composition?.depth) score += 5;
  
  // Lighting
  if (analysis.lighting === 'golden_hour') score += 15;
  else if (analysis.lighting === 'natural_bright') score += 10;
  else if (analysis.lighting === 'well_lit') score += 5;
  
  // Clarity
  if (analysis.sharpness === 'excellent') score += 5;
  if (analysis.exposure === 'perfect') score += 5;
  
  // Deductions
  if (analysis.issues?.dark) score -= 10;
  if (analysis.issues?.blurry) score -= 15;
  if (analysis.issues?.cluttered) score -= 8;
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Score marketing power
 */
function scoreMarketingPower(analysis: any, propertyType: string): number {
  let score = 65; // Base score
  
  // Thumbnail impact
  if (analysis.strong_focal_point) score += 10;
  if (analysis.eye_catching) score += 10;
  
  // Social media worthy
  if (analysis.instagram_worthy) score += 8;
  if (analysis.shareable) score += 7;
  
  // Platform optimization
  if (analysis.works_as_hero) score += 10;
  if (analysis.works_square_crop) score += 5;
  
  // Memorable elements
  if (analysis.unique_feature) score += 10;
  if (analysis.conversation_starter) score += 8;
  
  return Math.min(100, score);
}

/**
 * Score storytelling potential
 */
function scoreStoryTelling(analysis: any): number {
  let score = 60; // Base score
  
  // Lifestyle narrative
  if (analysis.morning_coffee_spot) score += 8;
  if (analysis.entertaining_space) score += 10;
  if (analysis.private_retreat) score += 8;
  if (analysis.work_from_home) score += 7;
  if (analysis.family_gathering) score += 9;
  
  // Aspirational elements
  if (analysis.luxury_lifestyle) score += 12;
  if (analysis.dream_feature) score += 10;
  if (analysis.success_indicator) score += 8;
  
  // Scene setting
  if (analysis.time_of_day === 'golden_hour') score += 10;
  if (analysis.seasonal_appeal) score += 5;
  if (analysis.activity_implied) score += 7;
  
  return Math.min(100, score);
}

/**
 * Score uniqueness
 */
function scoreUniqueness(analysis: any, otherPhotos: any[]): number {
  let score = 50; // Base score
  
  // Distinctive features
  if (analysis.architectural_unique) score += 15;
  if (analysis.natural_feature_unique) score += 12;
  if (analysis.luxury_amenity) score += 10;
  if (analysis.character_detail) score += 8;
  
  // Rarity in this set
  const roomType = analysis.room_type;
  const sameRoomCount = otherPhotos.filter(p => p.room_type === roomType).length;
  if (sameRoomCount === 1) score += 10; // Only photo of this space
  
  // Conversation starter
  if (analysis.wow_factor) score += 15;
  if (analysis.unexpected_feature) score += 10;
  
  return Math.min(100, score);
}

/**
 * Score buyer psychology match
 */
function scoreBuyerPsychology(analysis: any, propertyType: string, targetBuyer?: string): number {
  let score = 60; // Base score
  
  // Immediate desire triggers
  if (analysis.move_in_ready) score += 10;
  if (analysis.problem_solver) score += 8;
  if (analysis.aspirational) score += 12;
  
  // Target buyer match
  if (targetBuyer === 'family') {
    if (analysis.kid_friendly) score += 10;
    if (analysis.safe_neighborhood) score += 8;
    if (analysis.good_schools_implied) score += 7;
  } else if (targetBuyer === 'luxury') {
    if (analysis.exclusivity) score += 12;
    if (analysis.status_symbol) score += 10;
    if (analysis.privacy) score += 8;
  } else if (targetBuyer === 'investor') {
    if (analysis.rental_appeal) score += 10;
    if (analysis.low_maintenance) score += 8;
    if (analysis.value_visible) score += 8;
  }
  
  return Math.min(100, score);
}

/**
 * Main scoring function
 */
export async function scorePhotosForHero(
  photoAnalyses: any[],
  propertyData: {
    propertyType: string;
    price?: number;
    targetBuyer?: string;
    features?: string[];
  }
): Promise<HeroImageAnalysis> {
  const scores: PhotoScore[] = [];
  
  for (let i = 0; i < photoAnalyses.length; i++) {
    const analysis = photoAnalyses[i];
    
    // Calculate individual scores
    const emotional = scoreEmotionalImpact(analysis);
    const technical = scoreTechnicalQuality(analysis);
    const marketing = scoreMarketingPower(analysis, propertyData.propertyType);
    const story = scoreStoryTelling(analysis);
    const uniqueness = scoreUniqueness(analysis, photoAnalyses);
    const psychology = scoreBuyerPsychology(analysis, propertyData.propertyType, propertyData.targetBuyer);
    
    // Apply weights
    const totalScore = 
      emotional * 0.30 +
      technical * 0.20 +
      marketing * 0.25 +
      story * 0.15 +
      uniqueness * 0.10 +
      psychology * 0.10;
    
    // Check for hero-worthy features and add bonus
    let bonus = 0;
    let bonusReasons: string[] = [];
    for (const feature of HERO_WORTHY_FEATURES) {
      if (analysis.description?.toLowerCase().includes(feature.feature) ||
          analysis.features?.includes(feature.feature)) {
        bonus += feature.bonus;
        bonusReasons.push(feature.reason);
      }
    }
    
    const finalScore = Math.min(100, totalScore + bonus);
    
    // Generate reasoning
    const reasoning = generateReasoning(
      analysis,
      { emotional, technical, marketing, story, uniqueness, psychology },
      bonusReasons,
      propertyData
    );
    
    scores.push({
      photoUrl: analysis.url || `photo_${i}`,
      photoIndex: i,
      totalScore: finalScore,
      reasoning,
      scores: { emotional, technical, marketing, story, uniqueness, psychology },
      details: {
        roomType: analysis.room_type,
        features: analysis.features,
        lighting: analysis.lighting,
        composition: analysis.composition?.description,
        bestFor: analysis.best_for_platforms,
      },
    });
  }
  
  // Sort by score
  scores.sort((a, b) => b.totalScore - a.totalScore);
  
  // Get best and alternatives
  const bestPhoto = scores[0];
  const alternatives = scores.slice(1, 4); // Top 3 alternatives
  
  // Generate insights
  const insights = generateInsights(bestPhoto, propertyData);
  
  return {
    bestPhoto,
    alternatives,
    insights,
  };
}

/**
 * Generate human-readable reasoning
 */
function generateReasoning(
  analysis: any,
  scores: any,
  bonusReasons: string[],
  propertyData: any
): string {
  const reasons: string[] = [];
  
  // Highlight strongest score category
  const categories = Object.entries(scores).sort((a, b) => (b[1] as number) - (a[1] as number));
  const strongest = categories[0];
  
  if (strongest[0] === 'emotional' && (strongest[1] as number) > 80) {
    reasons.push('Creates strong emotional connection with buyers');
  } else if (strongest[0] === 'technical' && (strongest[1] as number) > 85) {
    reasons.push('Exceptional photo quality with perfect lighting');
  } else if (strongest[0] === 'marketing' && (strongest[1] as number) > 85) {
    reasons.push('Highly shareable and attention-grabbing');
  } else if (strongest[0] === 'story' && (strongest[1] as number) > 80) {
    reasons.push('Tells compelling lifestyle story');
  }
  
  // Add bonus reasons
  if (bonusReasons.length > 0) {
    reasons.push(bonusReasons[0]); // Add most important bonus
  }
  
  // Add specific feature callout
  if (analysis.standout_feature) {
    reasons.push(`Showcases ${analysis.standout_feature}`);
  }
  
  return reasons.join('. ') || 'Strong overall appeal across all criteria';
}

/**
 * Generate marketing insights
 */
function generateInsights(bestPhoto: PhotoScore, propertyData: any): any {
  const insights = {
    propertyHighlight: '',
    enhancementSuggestions: [] as string[],
    marketingAngle: '',
  };
  
  // Property highlight
  if (bestPhoto.details.features?.includes('view')) {
    insights.propertyHighlight = 'Stunning views are your key selling point';
  } else if (bestPhoto.details.features?.includes('pool')) {
    insights.propertyHighlight = 'Resort-style living is your main draw';
  } else if (bestPhoto.details.roomType?.includes('kitchen')) {
    insights.propertyHighlight = 'Heart of the home appeals to modern buyers';
  } else {
    insights.propertyHighlight = 'Strong curb appeal creates instant interest';
  }
  
  // Enhancement suggestions based on scores
  if (bestPhoto.scores.technical < 70) {
    insights.enhancementSuggestions.push('Enhance lighting for better impact');
  }
  if (bestPhoto.details.lighting !== 'golden_hour') {
    insights.enhancementSuggestions.push('Convert to twilight for premium feel');
  }
  if (bestPhoto.details.roomType?.includes('empty')) {
    insights.enhancementSuggestions.push('Add virtual staging to show potential');
  }
  
  // Marketing angle
  if (bestPhoto.scores.emotional > 85) {
    insights.marketingAngle = 'Lead with lifestyle and emotional appeal';
  } else if (bestPhoto.scores.uniqueness > 85) {
    insights.marketingAngle = 'Highlight unique features that set this apart';
  } else if (bestPhoto.scores.marketing > 85) {
    insights.marketingAngle = 'Perfect for social media marketing campaign';
  } else {
    insights.marketingAngle = 'Focus on practical benefits and value';
  }
  
  return insights;
}