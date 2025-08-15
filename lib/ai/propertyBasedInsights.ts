import type { Facts } from './schemas';
import type { PhotoInsights, RoomAnalysis } from './photoAnalysis';

/**
 * Generate buyer psychology insights based on property facts alone
 * This is used when no photos are provided but we still need compelling content
 */
export function generatePropertyBasedInsights(facts: Facts): PhotoInsights {
  console.log('🏠 [PROPERTY INSIGHTS] Generating buyer psychology from property facts', {
    hasAddress: !!facts.address,
    hasBeds: !!facts.beds,
    hasBaths: !!facts.baths,
    hasSqft: !!facts.sqft,
    hasFeatures: facts.features.length,
    propertyType: facts.propertyType,
    tone: facts.tone
  });

  // Analyze property characteristics
  const analysis = analyzePropertyCharacteristics(facts);
  
  // Generate conversion elements based on property data
  const conversionHooks = generateConversionHooks(facts, analysis);
  const buyerBenefits = generateBuyerBenefits(facts, analysis);
  const lifestyleScenarios = generateLifestyleScenarios(facts, analysis);
  const urgencyTriggers = generateUrgencyTriggers(facts, analysis);
  const socialProofElements = generateSocialProofElements(facts, analysis);
  const mlsKeywords = generateMLSKeywords(facts, analysis);

  const insights: PhotoInsights = {
    rooms: generateRoomAnalysis(facts),
    features: facts.features.length ? facts.features : generateDefaultFeatures(facts, analysis),
    style: [analysis.architecturalStyle],
    lighting: analysis.lightingAssumption,
    condition: analysis.conditionAssumption,
    sellingPoints: generateSellingPoints(facts, analysis),
    marketingAngles: generateMarketingAngles(facts, analysis),
    mustMentionFeatures: selectMustMentionFeatures(facts, analysis),
    headlineFeature: selectHeadlineFeature(facts, analysis),
    emotionalTriggers: analysis.emotionalTriggers,
    buyerProfile: analysis.buyerProfile,
    lifestyleElements: analysis.lifestyleElements,
    
    // Psychology-driven fields
    conversionHooks,
    buyerBenefits,
    lifestyleScenarios,
    urgencyTriggers,
    socialProofElements,
    
    // Channel optimization
    mlsKeywords,
    propertyCategory: analysis.propertyCategory,
    marketingPriority: analysis.marketingPriority,
    
    heroCandidate: {
      index: 0,
      reason: 'text-based property appeal',
      score: analysis.appealScore
    }
  };

  console.log('✨ [PROPERTY INSIGHTS] Generated insights:', {
    conversionHooks: conversionHooks.length,
    buyerBenefits: buyerBenefits.length,
    lifestyleScenarios: lifestyleScenarios.length,
    urgencyTriggers: urgencyTriggers.length,
    headlineFeature: insights.headlineFeature,
    buyerProfile: insights.buyerProfile,
    propertyCategory: insights.propertyCategory,
    marketingPriority: insights.marketingPriority
  });

  return insights;
}

interface PropertyAnalysis {
  propertyCategory: 'luxury' | 'family' | 'investment' | 'starter' | 'urban';
  marketingPriority: 'features' | 'location' | 'value' | 'lifestyle';
  architecturalStyle: string;
  lightingAssumption: string;
  conditionAssumption: string;
  emotionalTriggers: string[];
  buyerProfile: string;
  lifestyleElements: string[];
  appealScore: number;
  priceRange: 'budget' | 'mid' | 'premium' | 'luxury';
  targetDemo: 'first-time' | 'family' | 'professional' | 'downsizer' | 'investor';
}

function analyzePropertyCharacteristics(facts: Facts): PropertyAnalysis {
  const beds = parseInt(facts.beds || '0');
  const baths = parseFloat(facts.baths || '0');
  const sqft = parseInt(facts.sqft || '0');
  const features = facts.features;
  const propertyType = facts.propertyType?.toLowerCase() || '';
  const neighborhood = facts.neighborhood?.toLowerCase() || '';

  // Determine property category
  let propertyCategory: PropertyAnalysis['propertyCategory'] = 'family';
  let priceRange: PropertyAnalysis['priceRange'] = 'mid';
  let targetDemo: PropertyAnalysis['targetDemo'] = 'family';

  // Luxury indicators
  const luxuryFeatures = ['pool', 'spa', 'wine', 'gourmet', 'marble', 'granite', 'hardwood', 'crown molding', 'fireplace', 'master suite', 'walk-in closet'];
  const luxuryCount = features.filter(f => 
    luxuryFeatures.some(lf => f.toLowerCase().includes(lf))
  ).length;

  if (sqft > 3000 || luxuryCount >= 3 || propertyType.includes('luxury') || propertyType.includes('estate')) {
    propertyCategory = 'luxury';
    priceRange = 'luxury';
    targetDemo = 'professional';
  } else if (beds >= 4 || sqft > 2000) {
    propertyCategory = 'family';
    priceRange = 'mid';
    targetDemo = 'family';
  } else if (beds <= 2 || propertyType.includes('starter') || propertyType.includes('condo')) {
    propertyCategory = 'starter';
    priceRange = 'budget';
    targetDemo = 'first-time';
  } else if (neighborhood.includes('downtown') || neighborhood.includes('urban') || propertyType.includes('urban')) {
    propertyCategory = 'urban';
    priceRange = 'mid';
    targetDemo = 'professional';
  }

  // Investment property indicators
  if (propertyType.includes('investment') || features.some(f => f.toLowerCase().includes('rental'))) {
    propertyCategory = 'investment';
    targetDemo = 'investor';
  }

  // Determine marketing priority
  let marketingPriority: PropertyAnalysis['marketingPriority'] = 'features';
  if (features.length >= 5) {
    marketingPriority = 'features';
  } else if (neighborhood && facts.address) {
    marketingPriority = 'location';
  } else if (propertyCategory === 'starter' || propertyCategory === 'investment') {
    marketingPriority = 'value';
  } else {
    marketingPriority = 'lifestyle';
  }

  // Generate buyer profile
  const buyerProfiles = {
    luxury: 'Successful professionals seeking a distinguished home that reflects their achievements',
    family: 'Growing families looking for space, comfort, and lasting memories',
    starter: 'First-time buyers ready to establish roots and build equity',
    urban: 'Career-focused individuals who value convenience and modern amenities',
    investment: 'Savvy investors seeking profitable opportunities and rental potential'
  };

  // Generate emotional triggers
  const emotionalTriggers = generateEmotionalTriggers(propertyCategory, features, facts);

  // Generate lifestyle elements
  const lifestyleElements = generateLifestyleElements(propertyCategory, features, beds, baths);

  // Calculate appeal score
  let appealScore = 5; // Base score
  if (features.length >= 3) appealScore += 2;
  if (beds >= 3) appealScore += 1;
  if (baths >= 2) appealScore += 1;
  if (sqft > 1500) appealScore += 1;
  if (luxuryCount > 0) appealScore += luxuryCount;

  return {
    propertyCategory,
    marketingPriority,
    architecturalStyle: determineArchitecturalStyle(facts),
    lightingAssumption: 'good', // Neutral assumption
    conditionAssumption: 'good', // Neutral assumption
    emotionalTriggers,
    buyerProfile: buyerProfiles[propertyCategory],
    lifestyleElements,
    appealScore: Math.min(appealScore, 10),
    priceRange,
    targetDemo
  };
}

function generateConversionHooks(facts: Facts, analysis: PropertyAnalysis): string[] {
  const hooks: string[] = [];
  const beds = facts.beds;
  const neighborhood = facts.neighborhood || 'this desirable area';
  const features = facts.features;

  // Category-specific hooks
  switch (analysis.propertyCategory) {
    case 'luxury':
      hooks.push('Your search for the perfect sanctuary ends here');
      hooks.push('Finally, a home that matches your success');
      hooks.push('Step into the lifestyle you\'ve earned');
      break;
    case 'family':
      hooks.push('Picture your family creating memories here');
      hooks.push('The home where your story unfolds');
      hooks.push('Everything your family needs, all in one place');
      break;
    case 'starter':
      hooks.push('Your homeownership journey starts here');
      hooks.push('Stop paying someone else\'s mortgage');
      hooks.push('The perfect first home awaits');
      break;
    case 'urban':
      hooks.push('City living at its finest');
      hooks.push('Everything you need, right at your doorstep');
      hooks.push('Urban convenience meets modern comfort');
      break;
    case 'investment':
      hooks.push('Smart money sees the opportunity');
      hooks.push('The investment property you\'ve been waiting for');
      hooks.push('Passive income potential in prime location');
      break;
  }

  // Feature-driven hooks
  if (features.length > 0) {
    const topFeature = features[0];
    hooks.push(`If ${topFeature.toLowerCase()} matters to you, pause here`);
  }

  // Location-driven hooks
  if (beds) {
    hooks.push(`${beds}-bedroom living in ${neighborhood} awaits`);
  }

  return hooks.slice(0, 3); // Return top 3 hooks
}

function generateBuyerBenefits(facts: Facts, analysis: PropertyAnalysis): Array<{feature: string; benefit: string; emotion: string}> {
  const benefits: Array<{feature: string; benefit: string; emotion: string}> = [];
  
  // Add bedroom/bathroom benefits
  if (facts.beds) {
    benefits.push({
      feature: `${facts.beds} bedrooms`,
      benefit: 'space for everyone and everything',
      emotion: 'comfort and privacy'
    });
  }

  if (facts.baths && parseFloat(facts.baths) >= 2) {
    benefits.push({
      feature: `${facts.baths} bathrooms`,
      benefit: 'no more morning rush conflicts',
      emotion: 'convenience and harmony'
    });
  }

  // Add square footage benefits
  if (facts.sqft) {
    const sqft = parseInt(facts.sqft);
    if (sqft > 2000) {
      benefits.push({
        feature: `${facts.sqft} square feet`,
        benefit: 'room to breathe and grow',
        emotion: 'freedom and possibility'
      });
    } else {
      benefits.push({
        feature: `${facts.sqft} square feet`,
        benefit: 'perfectly sized for comfortable living',
        emotion: 'contentment and efficiency'
      });
    }
  }

  // Add feature-specific benefits
  facts.features.forEach(feature => {
    const featureLower = feature.toLowerCase();
    
    if (featureLower.includes('kitchen')) {
      benefits.push({
        feature: feature,
        benefit: 'create culinary memories with loved ones',
        emotion: 'joy and connection'
      });
    } else if (featureLower.includes('yard') || featureLower.includes('garden')) {
      benefits.push({
        feature: feature,
        benefit: 'private outdoor retreat for relaxation',
        emotion: 'peace and rejuvenation'
      });
    } else if (featureLower.includes('garage')) {
      benefits.push({
        feature: feature,
        benefit: 'protected parking and extra storage',
        emotion: 'security and organization'
      });
    } else if (featureLower.includes('fireplace')) {
      benefits.push({
        feature: feature,
        benefit: 'cozy gathering spot for cold evenings',
        emotion: 'warmth and intimacy'
      });
    } else {
      benefits.push({
        feature: feature,
        benefit: 'enhanced comfort and convenience',
        emotion: 'satisfaction and pride'
      });
    }
  });

  // Add location benefits
  if (facts.neighborhood) {
    benefits.push({
      feature: `${facts.neighborhood} location`,
      benefit: 'established community with amenities nearby',
      emotion: 'belonging and convenience'
    });
  }

  return benefits.slice(0, 5); // Return top 5 benefits
}

function generateLifestyleScenarios(facts: Facts, analysis: PropertyAnalysis): string[] {
  const scenarios: string[] = [];
  const beds = parseInt(facts.beds || '0');
  const features = facts.features;

  // Category-specific scenarios
  switch (analysis.propertyCategory) {
    case 'luxury':
      scenarios.push('Picture yourself entertaining guests in sophisticated comfort');
      scenarios.push('Imagine unwinding in your private retreat after successful days');
      break;
    case 'family':
      scenarios.push('Picture weekend mornings with coffee while kids play safely nearby');
      scenarios.push('Imagine hosting family gatherings and creating lasting memories');
      break;
    case 'starter':
      scenarios.push('Picture yourself getting ready for work in your own space');
      scenarios.push('Imagine decorating and making this place truly yours');
      break;
    case 'urban':
      scenarios.push('Picture walking to your favorite coffee shop on weekend mornings');
      scenarios.push('Imagine hosting friends without worrying about parking');
      break;
    case 'investment':
      scenarios.push('Picture steady rental income flowing to your account each month');
      scenarios.push('Imagine the equity building while tenants pay down your mortgage');
      break;
  }

  // Feature-driven scenarios
  if (beds >= 3) {
    scenarios.push('Picture having a dedicated home office or guest room');
  }

  if (features.some(f => f.toLowerCase().includes('kitchen'))) {
    scenarios.push('Imagine preparing meals in a space designed for cooking');
  }

  if (features.some(f => f.toLowerCase().includes('yard'))) {
    scenarios.push('Picture summer barbecues and outdoor relaxation');
  }

  return scenarios.slice(0, 3); // Return top 3 scenarios
}

function generateUrgencyTriggers(facts: Facts, analysis: PropertyAnalysis): string[] {
  const triggers: string[] = [];
  
  // Market-based urgency
  triggers.push('Properties like this don\'t stay available long');
  triggers.push('Smart buyers recognize quality when they see it');
  
  // Category-specific urgency
  switch (analysis.propertyCategory) {
    case 'luxury':
      triggers.push('Prestigious properties in this area are rarely available');
      break;
    case 'family':
      triggers.push('Perfect family homes in good neighborhoods move quickly');
      break;
    case 'starter':
      triggers.push('First-time buyer opportunities at this level are competitive');
      break;
    case 'urban':
      triggers.push('Urban properties with these amenities are in high demand');
      break;
    case 'investment':
      triggers.push('Savvy investors act fast on properties with this potential');
      break;
  }

  // Feature-based urgency
  if (facts.features.length >= 3) {
    triggers.push('Multiple desirable features rarely come together like this');
  }

  if (facts.neighborhood) {
    triggers.push(`${facts.neighborhood} location adds immediate value and desirability`);
  }

  return triggers.slice(0, 3); // Return top 3 triggers
}

function generateSocialProofElements(facts: Facts, analysis: PropertyAnalysis): string[] {
  const elements: string[] = [];
  
  // General credibility indicators
  elements.push('Professional listing with detailed property information');
  elements.push('Comprehensive property details demonstrate transparency');
  
  // Feature-based credibility
  if (facts.features.length >= 3) {
    elements.push('Multiple verified features indicate well-maintained property');
  }

  // Location-based credibility
  if (facts.neighborhood) {
    elements.push(`Established ${facts.neighborhood} location with proven market value`);
  }

  // Size-based credibility
  if (facts.sqft) {
    elements.push('Accurate square footage measurements available for verification');
  }

  // Category-specific credibility
  switch (analysis.propertyCategory) {
    case 'luxury':
      elements.push('Premium property positioning with luxury market expertise');
      break;
    case 'family':
      elements.push('Family-focused features designed for comfortable living');
      break;
    case 'starter':
      elements.push('First-time buyer friendly with clear value proposition');
      break;
  }

  return elements.slice(0, 4); // Return top 4 elements
}

function generateMLSKeywords(facts: Facts, analysis: PropertyAnalysis): string[] {
  const keywords: string[] = [];
  
  // Basic property keywords
  if (facts.beds) keywords.push(`${facts.beds} bedroom`);
  if (facts.baths) keywords.push(`${facts.baths} bathroom`);
  if (facts.sqft) keywords.push(`${facts.sqft} sq ft`);
  
  // Property type keywords
  keywords.push(facts.propertyType?.toLowerCase() || 'home');
  
  // Location keywords
  if (facts.neighborhood) {
    keywords.push(facts.neighborhood.toLowerCase());
    keywords.push(`${facts.neighborhood.toLowerCase()} homes`);
  }
  
  // Feature keywords
  facts.features.forEach(feature => {
    const words = feature.toLowerCase().split(' ');
    words.forEach(word => {
      if (word.length > 3 && !keywords.includes(word)) {
        keywords.push(word);
      }
    });
  });
  
  // Category-specific keywords
  switch (analysis.propertyCategory) {
    case 'luxury':
      keywords.push('luxury homes', 'premium property', 'executive home');
      break;
    case 'family':
      keywords.push('family home', 'move-in ready', 'established neighborhood');
      break;
    case 'starter':
      keywords.push('starter home', 'first time buyer', 'affordable home');
      break;
    case 'urban':
      keywords.push('urban living', 'city home', 'downtown property');
      break;
    case 'investment':
      keywords.push('investment property', 'rental income', 'real estate investment');
      break;
  }
  
  return keywords.slice(0, 10); // Return top 10 keywords
}

// Helper functions
function generateRoomAnalysis(facts: Facts): RoomAnalysis[] {
  const rooms: RoomAnalysis[] = [];
  
  if (facts.beds) {
    const bedCount = parseInt(facts.beds);
    for (let i = 0; i < Math.min(bedCount, 3); i++) {
      rooms.push({
        type: 'bedroom',
        features: ['comfortable space', 'natural light'],
        condition: 'good',
        appeal: 6
      });
    }
  }
  
  if (facts.baths) {
    const bathCount = Math.floor(parseFloat(facts.baths));
    for (let i = 0; i < Math.min(bathCount, 2); i++) {
      rooms.push({
        type: 'bathroom',
        features: ['functional layout', 'updated fixtures'],
        condition: 'good',
        appeal: 6
      });
    }
  }
  
  // Add kitchen and living room as defaults
  rooms.push({
    type: 'kitchen',
    features: ['meal preparation', 'storage space'],
    condition: 'good',
    appeal: 7
  });
  
  rooms.push({
    type: 'living',
    features: ['gathering space', 'natural light'],
    condition: 'good',
    appeal: 7
  });
  
  return rooms;
}

function generateDefaultFeatures(facts: Facts, analysis: PropertyAnalysis): string[] {
  const features = [];
  
  if (facts.beds) features.push(`${facts.beds} comfortable bedrooms`);
  if (facts.baths) features.push(`${facts.baths} well-appointed bathrooms`);
  if (facts.sqft) features.push(`${facts.sqft} square feet of living space`);
  
  // Add category-appropriate features
  switch (analysis.propertyCategory) {
    case 'luxury':
      features.push('Premium finishes', 'Sophisticated design', 'Quality construction');
      break;
    case 'family':
      features.push('Family-friendly layout', 'Practical storage', 'Safe environment');
      break;
    case 'starter':
      features.push('Move-in ready condition', 'Efficient use of space', 'Low maintenance');
      break;
    case 'urban':
      features.push('Modern conveniences', 'Urban amenities', 'Accessible location');
      break;
    case 'investment':
      features.push('Rental-ready condition', 'Desirable location', 'Strong market appeal');
      break;
  }
  
  return features.slice(0, 6);
}

function generateSellingPoints(facts: Facts, analysis: PropertyAnalysis): string[] {
  const points = [];
  
  // Size-based selling points
  if (facts.sqft && parseInt(facts.sqft) > 1500) {
    points.push('Spacious living areas for comfortable daily life');
  }
  
  // Location-based selling points
  if (facts.neighborhood) {
    points.push(`Desirable ${facts.neighborhood} location with community amenities`);
  }
  
  // Feature-based selling points
  if (facts.features.length > 0) {
    points.push('Multiple appealing features enhance everyday living');
  }
  
  // Category-specific selling points
  switch (analysis.propertyCategory) {
    case 'luxury':
      points.push('Prestigious address with luxury appointments');
      break;
    case 'family':
      points.push('Perfect setup for family life and growth');
      break;
    case 'starter':
      points.push('Ideal entry point into homeownership');
      break;
    case 'urban':
      points.push('Urban convenience with modern lifestyle benefits');
      break;
    case 'investment':
      points.push('Strong rental potential in desirable area');
      break;
  }
  
  return points.slice(0, 4);
}

function generateMarketingAngles(facts: Facts, analysis: PropertyAnalysis): string[] {
  const angles = [];
  
  // Primary marketing angle based on analysis
  switch (analysis.marketingPriority) {
    case 'features':
      angles.push('Feature-rich property offering exceptional value');
      break;
    case 'location':
      angles.push('Prime location with immediate area benefits');
      break;
    case 'value':
      angles.push('Smart investment with immediate and long-term benefits');
      break;
    case 'lifestyle':
      angles.push('Lifestyle transformation waiting for the right buyer');
      break;
  }
  
  // Secondary angles
  angles.push('Move-in ready with thoughtful updates throughout');
  angles.push('Rare opportunity in established neighborhood');
  
  return angles.slice(0, 3);
}

function selectMustMentionFeatures(facts: Facts, analysis: PropertyAnalysis): string[] {
  const features = [];
  
  // Always mention core specs
  if (facts.beds) features.push(`${facts.beds} bedrooms`);
  if (facts.baths) features.push(`${facts.baths} bathrooms`);
  if (facts.sqft) features.push(`${facts.sqft} square feet`);
  
  // Add top user-provided features
  features.push(...facts.features.slice(0, 3));
  
  // Add location if available
  if (facts.neighborhood) features.push(`${facts.neighborhood} location`);
  
  return features.slice(0, 5);
}

function selectHeadlineFeature(facts: Facts, analysis: PropertyAnalysis): string {
  // Prioritize user-provided features
  if (facts.features.length > 0) {
    return facts.features[0];
  }
  
  // Fall back to property specs
  if (facts.beds && facts.baths) {
    return `${facts.beds}-bedroom, ${facts.baths}-bathroom home`;
  }
  
  // Location-based headline
  if (facts.neighborhood) {
    return `${facts.neighborhood} property`;
  }
  
  // Category-based headline
  switch (analysis.propertyCategory) {
    case 'luxury': return 'luxury property with premium appointments';
    case 'family': return 'perfect family home with thoughtful design';
    case 'starter': return 'ideal starter home in great condition';
    case 'urban': return 'modern urban living with convenience';
    case 'investment': return 'prime investment opportunity';
    default: return 'well-maintained property with great potential';
  }
}

function determineArchitecturalStyle(facts: Facts): string {
  const type = facts.propertyType?.toLowerCase() || '';
  
  if (type.includes('luxury') || type.includes('estate')) return 'luxury residential';
  if (type.includes('condo') || type.includes('urban')) return 'contemporary';
  if (type.includes('family') || type.includes('traditional')) return 'traditional';
  
  return 'residential';
}

function generateEmotionalTriggers(category: string, features: string[], facts: Facts): string[] {
  const triggers = ['comfort', 'quality'];
  
  // Add category-specific triggers
  switch (category) {
    case 'luxury':
      triggers.push('prestige', 'sophistication', 'exclusivity');
      break;
    case 'family':
      triggers.push('safety', 'community', 'memories');
      break;
    case 'starter':
      triggers.push('achievement', 'independence', 'potential');
      break;
    case 'urban':
      triggers.push('convenience', 'energy', 'accessibility');
      break;
    case 'investment':
      triggers.push('opportunity', 'growth', 'income');
      break;
  }
  
  // Add feature-based triggers
  if (features.some(f => f.toLowerCase().includes('light'))) triggers.push('brightness');
  if (features.some(f => f.toLowerCase().includes('space'))) triggers.push('spaciousness');
  
  return triggers.slice(0, 5);
}

function generateLifestyleElements(category: string, features: string[], beds: string | undefined, baths: string | undefined): string[] {
  const elements = ['comfortable living'];
  
  // Add category-specific elements
  switch (category) {
    case 'luxury':
      elements.push('sophisticated entertaining', 'executive lifestyle');
      break;
    case 'family':
      elements.push('family gatherings', 'child-friendly spaces', 'homework areas');
      break;
    case 'starter':
      elements.push('independence', 'personal space', 'hosting friends');
      break;
    case 'urban':
      elements.push('walkable lifestyle', 'urban amenities', 'professional convenience');
      break;
    case 'investment':
      elements.push('rental appeal', 'tenant satisfaction', 'property management');
      break;
  }
  
  // Add space-based elements
  if (parseInt(beds || '0') >= 3) {
    elements.push('flexible room usage', 'guest accommodation');
  }
  
  if (parseFloat(baths || '0') >= 2) {
    elements.push('convenient daily routines');
  }
  
  return elements.slice(0, 4);
}