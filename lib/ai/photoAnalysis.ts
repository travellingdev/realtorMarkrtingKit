export interface PhotoInsights {
  rooms: RoomAnalysis[];
  features: string[];
  style: string[];
  lighting: string;
  condition: string;
  sellingPoints: string[];
  marketingAngles: string[];
  mustMentionFeatures?: string[]; // TOP features that MUST be in the listing
  headlineFeature?: string; // The ONE killer feature for opening lines
  emotionalTriggers?: string[]; // Light, space, luxury visible in photos
  buyerProfile?: string; // Who would love this based on visuals
  lifestyleElements?: string[]; // Entertaining, family, work-from-home visible
  // New psychology-driven fields
  conversionHooks?: string[]; // Emotional opening lines that create immediate desire
  buyerBenefits?: { feature: string; benefit: string; emotion: string }[]; // Feature → Benefit → Emotion mapping
  lifestyleScenarios?: string[]; // "Picture yourself..." scenarios for different features
  urgencyTriggers?: string[]; // Scarcity/opportunity language specific to this property
  socialProofElements?: string[]; // Credibility indicators visible in photos
  // Channel optimization fields
  mlsKeywords?: string[]; // SEO-optimized keywords for MLS visibility
  propertyCategory?: 'luxury' | 'family' | 'investment' | 'starter' | 'urban'; // For targeted positioning
  marketingPriority?: 'features' | 'location' | 'value' | 'lifestyle'; // Primary selling angle
  heroCandidate?: {
    index: number;
    reason: string;
    score: number;
  };
}

export interface RoomAnalysis {
  type: 'kitchen' | 'living' | 'bedroom' | 'bathroom' | 'exterior' | 'dining' | 'office' | 'other';
  features: string[];
  condition: string;
  appeal: number; // 1-10 marketing appeal score
}

export interface HeroImageCandidate {
  index: number;
  filename: string;
  score: number;
  reasons: string[];
  roomType: string;
  marketingValue: number;
}

// Photo analysis scoring system
const ROOM_SCORES = {
  exterior: 10,
  kitchen: 9,
  living: 8,
  pool: 9,
  dining: 7,
  bedroom: 6,
  bathroom: 5,
  office: 4,
  garage: 2,
  utility: 1
} as const;

export async function analyzePhotosWithVision(
  photoUrls: string[],
  maxRetries: number = 2
): Promise<PhotoInsights> {
  const startTime = Date.now();
  console.log(`🔍 [PHOTO ANALYSIS START] Processing ${photoUrls.length} photos`, {
    urls: photoUrls.map(url => `${url.substring(0, 50)}...`),
    timestamp: new Date().toISOString()
  });

  if (!photoUrls.length) {
    console.log(`❌ [PHOTO ANALYSIS] No photos provided - returning empty insights`);
    return {
      rooms: [],
      features: [],
      style: [],
      lighting: 'unknown',
      condition: 'unknown',
      sellingPoints: [],
      marketingAngles: []
    };
  }

  // Limit photos to reduce processing time (was causing timeouts)
  const photoLimit = Math.min(photoUrls.length, 3); // Max 3 photos to prevent timeout
  const photosToAnalyze = photoUrls.slice(0, photoLimit);
  
  console.log(`📊 [PHOTO ANALYSIS] Using ${photosToAnalyze.length}/${photoUrls.length} photos (limit: ${photoLimit})`);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 [PHOTO ANALYSIS] Attempt ${attempt}/${maxRetries} - calling OpenAI Vision API`);
      
      const analysisPrompt = buildPhotoAnalysisPrompt(photosToAnalyze);
      console.log(`📝 [PHOTO ANALYSIS] Prompt length: ${analysisPrompt.length} characters`);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 2000,
          temperature: 0.3,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: 'You are a professional real estate photography analyst. Provide detailed, accurate insights for marketing purposes. Always return valid JSON.'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: analysisPrompt
                },
                ...photosToAnalyze.map(url => ({
                  type: 'image_url',
                  image_url: { url, detail: 'high' }
                }))
              ]
            }
          ]
        })
      });

      console.log(`🌐 [PHOTO ANALYSIS] OpenAI API Response Status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`❌ [PHOTO ANALYSIS] API error ${response.status}:`, errorText);
        
        // Don't retry on certain errors
        if (response.status === 401 || response.status === 403) {
          console.error('🔐 [PHOTO ANALYSIS] Authentication error - check OPENAI_API_KEY');
          break;
        }
        
        // Retry on server errors or rate limits
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`⏳ [PHOTO ANALYSIS] Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        console.log(`🔄 [PHOTO ANALYSIS] All retries failed - using fallback analysis`);
        return getFallbackAnalysis(photoUrls);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      console.log(`📦 [PHOTO ANALYSIS] Raw API Response:`, {
        hasContent: !!content,
        contentLength: content?.length || 0,
        tokensUsed: data.usage?.total_tokens || 0,
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0
      });
      
      if (!content) {
        console.error('❌ [PHOTO ANALYSIS] No content in response');
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        return getFallbackAnalysis(photoUrls);
      }

      console.log(`📄 [PHOTO ANALYSIS] Raw AI Response:`, content.substring(0, 500) + '...');

      // Parse and validate JSON response
      let insights: PhotoInsights;
      try {
        insights = JSON.parse(content);
        
        console.log(`🧠 [PHOTO ANALYSIS] Parsed Insights:`, {
          roomCount: insights.rooms?.length || 0,
          featureCount: insights.features?.length || 0,
          sellingPointsCount: insights.sellingPoints?.length || 0,
          style: insights.style?.join(', ') || 'none',
          condition: insights.condition || 'unknown'
        });
        
        // Validate required fields
        if (!insights.rooms || !Array.isArray(insights.rooms)) {
          throw new Error('Invalid rooms data in response');
        }
        
        // Ensure proper structure
        insights.rooms = insights.rooms.map((room: any, index: number) => {
          console.log(`🏠 [PHOTO ANALYSIS] Room ${index + 1}:`, {
            type: room.type,
            features: room.features?.length || 0,
            condition: room.condition,
            appeal: room.appeal
          });
          return {
            type: room.type || 'other',
            features: Array.isArray(room.features) ? room.features : [],
            condition: room.condition || 'good',
            appeal: typeof room.appeal === 'number' ? room.appeal : 5
          };
        });
        
        insights.features = Array.isArray(insights.features) ? insights.features : [];
        insights.style = Array.isArray(insights.style) ? insights.style : [];
        insights.sellingPoints = Array.isArray(insights.sellingPoints) ? insights.sellingPoints : [];
        insights.marketingAngles = Array.isArray(insights.marketingAngles) ? insights.marketingAngles : [];
        insights.mustMentionFeatures = Array.isArray(insights.mustMentionFeatures) ? insights.mustMentionFeatures : insights.features.slice(0, 5);
        insights.emotionalTriggers = Array.isArray(insights.emotionalTriggers) ? insights.emotionalTriggers : [];
        insights.lifestyleElements = Array.isArray(insights.lifestyleElements) ? insights.lifestyleElements : [];
        insights.conversionHooks = Array.isArray(insights.conversionHooks) ? insights.conversionHooks : [];
        insights.buyerBenefits = Array.isArray(insights.buyerBenefits) ? insights.buyerBenefits : [];
        insights.lifestyleScenarios = Array.isArray(insights.lifestyleScenarios) ? insights.lifestyleScenarios : [];
        insights.urgencyTriggers = Array.isArray(insights.urgencyTriggers) ? insights.urgencyTriggers : [];
        insights.socialProofElements = Array.isArray(insights.socialProofElements) ? insights.socialProofElements : [];
        insights.mlsKeywords = Array.isArray(insights.mlsKeywords) ? insights.mlsKeywords : [];
        insights.propertyCategory = insights.propertyCategory || 'family';
        insights.marketingPriority = insights.marketingPriority || 'features';

        console.log(`✨ [PHOTO ANALYSIS] Key Features Found:`, insights.features.slice(0, 5));
        console.log(`💎 [PHOTO ANALYSIS] Selling Points:`, insights.sellingPoints.slice(0, 3));
        console.log(`📈 [PHOTO ANALYSIS] Marketing Angles:`, insights.marketingAngles.slice(0, 3));
        console.log(`🔥 [PHOTO ANALYSIS] Must-Mention Features:`, insights.mustMentionFeatures?.slice(0, 5) || 'none');
        console.log(`🎯 [PHOTO ANALYSIS] Headline Feature:`, insights.headlineFeature || 'none');
        console.log(`❤️ [PHOTO ANALYSIS] Emotional Triggers:`, insights.emotionalTriggers?.join(', ') || 'none');
        console.log(`👥 [PHOTO ANALYSIS] Target Buyer:`, insights.buyerProfile || 'general');
        console.log(`🎪 [PHOTO ANALYSIS] Conversion Hooks:`, insights.conversionHooks?.slice(0, 2) || 'none');
        console.log(`🎭 [PHOTO ANALYSIS] Buyer Benefits:`, insights.buyerBenefits?.length || 0, 'feature→benefit mappings');
        console.log(`🏡 [PHOTO ANALYSIS] Lifestyle Scenarios:`, insights.lifestyleScenarios?.slice(0, 2) || 'none');
        console.log(`⏰ [PHOTO ANALYSIS] Urgency Triggers:`, insights.urgencyTriggers?.slice(0, 2) || 'none');
        console.log(`🔍 [PHOTO ANALYSIS] MLS Keywords:`, insights.mlsKeywords?.slice(0, 3) || 'none');
        console.log(`🏠 [PHOTO ANALYSIS] Property Category:`, insights.propertyCategory || 'unclassified');
        console.log(`🎯 [PHOTO ANALYSIS] Marketing Priority:`, insights.marketingPriority || 'features');
        
      } catch (parseError) {
        console.error('[analyzePhotosWithVision] JSON parse error:', parseError);
        console.error('[analyzePhotosWithVision] Raw content:', content);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        return getFallbackAnalysis(photoUrls);
      }

      // Add hero candidate selection
      insights.heroCandidate = selectHeroImage(insights.rooms);
      
      const totalTime = Date.now() - startTime;
      console.log(`✅ [PHOTO ANALYSIS COMPLETE] Success in ${totalTime}ms:`, {
        roomsAnalyzed: insights.rooms.length,
        featuresFound: insights.features.length,
        sellingPoints: insights.sellingPoints.length,
        heroCandidate: insights.heroCandidate ? `Photo ${insights.heroCandidate.index + 1} (${insights.heroCandidate.reason})` : 'none',
        totalTime: `${totalTime}ms`
      });
      
      return insights;
      
    } catch (error) {
      console.error(`[analyzePhotosWithVision] Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`[analyzePhotosWithVision] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  console.error('[analyzePhotosWithVision] All attempts failed, using fallback');
  return getFallbackAnalysis(photoUrls);
}

function buildPhotoAnalysisPrompt(photoUrls: string[]): string {
  return `You are analyzing ${photoUrls.length} high-resolution real estate photos. Your goal is to identify the MOST COMPELLING selling features that will convert viewers into buyers.

Return a JSON object with this exact structure:

{
  "rooms": [
    {
      "type": "kitchen|living|bedroom|bathroom|exterior|dining|office|other",
      "features": ["specific visible features"],
      "condition": "excellent|good|needs_updates",
      "appeal": 8
    }
  ],
  "features": ["comprehensive list of ALL visible property features"],
  "style": ["architectural and design styles"],
  "lighting": "excellent|good|fair|poor",
  "condition": "move-in ready|good|needs updates|fixer",
  "sellingPoints": ["buyer-focused selling points"],
  "marketingAngles": ["lifestyle and demographic appeals"],
  "mustMentionFeatures": ["TOP 5 features that would make buyers schedule a viewing"],
  "headlineFeature": "The ONE killer feature that should open the listing",
  "emotionalTriggers": ["natural light|spaciousness|luxury|warmth|privacy visible"],
  "buyerProfile": "Description of who would fall in love with these specific visuals",
  "lifestyleElements": ["entertaining|family|work-from-home|relaxation benefits visible"],
  "conversionHooks": ["3 compelling opening lines that create immediate emotional desire"],
  "buyerBenefits": [{"feature": "pool", "benefit": "private resort experience", "emotion": "relaxation and pride"}],
  "lifestyleScenarios": ["Picture yourself..." scenarios that help buyers visualize living here"],
  "urgencyTriggers": ["Scarcity or opportunity elements specific to this property"],
  "socialProofElements": ["Quality indicators that build credibility and trust"],
  "mlsKeywords": ["SEO keywords buyers would search for this property type"],
  "propertyCategory": "luxury|family|investment|starter|urban - based on visual characteristics",
  "marketingPriority": "features|location|value|lifestyle - primary selling angle from photos"
}

CRITICAL BUYER PSYCHOLOGY ANALYSIS:

1. CONVERSION HOOKS: Create 3 opening lines that instantly trigger desire:
   - Use emotional language that creates immediate connection
   - Reference specific visual elements that create aspiration
   - Address the buyer's deepest home-buying motivations
   - Examples: "Your search for the perfect sanctuary ends here" / "Finally, a home that matches your success"

2. BUYER BENEFITS MAPPING: For each major feature, identify the emotional benefit:
   - Feature: What you see  
   - Benefit: What it provides the buyer
   - Emotion: How it makes them FEEL
   - Example: Pool → Private resort experience → Pride and relaxation

3. LIFESTYLE SCENARIOS: Create "Picture yourself..." moments for key features:
   - Specific, vivid scenarios buyers can immediately visualize
   - Connect features to life moments and memories
   - Use sensory details that create emotional connection
   - Example: "Picture yourself hosting summer evenings by this resort-style pool"

4. URGENCY TRIGGERS: Identify scarcity/opportunity elements:
   - Rare features in this price range or location
   - Market timing advantages
   - Unique characteristics that don't come available often
   - Competition indicators visible in photos

5. SOCIAL PROOF ELEMENTS: Credibility indicators that reduce buyer risk:
   - Quality of construction/materials visible
   - Professional staging/design elements
   - Maintenance standards and care level
   - Neighborhood quality indicators

6. BUYER PROFILE PSYCHOLOGY: Go beyond demographics to motivations:
   - What drives this buyer's housing decisions?
   - What fears/desires do these photos address?
   - What lifestyle transformation are they seeking?
   - How does this property solve their current frustrations?

7. MLS SEO OPTIMIZATION: Keywords buyers actually search for:
   - What search terms would buyers use to find this property?
   - Include location-specific keywords (neighborhood + property type)
   - Consider feature-based searches (pool homes, modern architecture)
   - Think about lifestyle searches (family homes, luxury living)

8. PROPERTY CATEGORIZATION: Determine primary market category:
   - "luxury": High-end finishes, premium location, exceptional features
   - "family": Kid-friendly spaces, safety, storage, suburban appeal
   - "investment": Rental potential, location advantages, ROI factors
   - "starter": Affordable charm, move-in ready, first-time buyer appeal
   - "urban": City convenience, modern amenities, professional lifestyle

9. MARKETING PRIORITY: What should lead the marketing message:
   - "features": Unique property characteristics dominate
   - "location": Neighborhood/area is the main selling point  
   - "value": Price point and investment opportunity focus
   - "lifestyle": Emotional transformation and life benefits

Focus on CONVERSION PSYCHOLOGY and SEARCH OPTIMIZATION. What would make someone say "I MUST see this property" AND find it online?`;
}

function selectHeroImage(rooms: RoomAnalysis[]): PhotoInsights['heroCandidate'] {
  if (!rooms.length) return undefined;

  // Use simplified logic here since this is just for initial insights
  // The unified heroSelection.ts will handle the full analysis
  let bestScore = 0;
  let bestIndex = 0;
  let bestReason = '';

  rooms.forEach((room, index) => {
    const baseScore = ROOM_SCORES[room.type] || 5;
    const conditionBonus = room.condition === 'excellent' ? 2 : room.condition === 'good' ? 1 : 0;
    const appealBonus = room.appeal > 8 ? 2 : room.appeal > 6 ? 1 : 0;
    
    const totalScore = baseScore + conditionBonus + appealBonus;
    
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestIndex = index;
      bestReason = `${room.type} with ${room.features.join(', ')} - high marketing appeal`;
    }
  });

  return {
    index: bestIndex,
    reason: bestReason,
    score: bestScore
  };
}

function getFallbackAnalysis(photoUrls: string[]): PhotoInsights {
  // Provide basic analysis when Vision API fails
  return {
    rooms: [
      {
        type: 'other',
        features: ['property photos'],
        condition: 'good',
        appeal: 7
      }
    ],
    features: ['well-maintained', 'attractive property', 'quality home'],
    style: ['residential'],
    lighting: 'good',
    condition: 'good',
    sellingPoints: ['attractive property', 'well-maintained condition'],
    marketingAngles: ['great opportunity', 'desirable location'],
    mustMentionFeatures: ['well-maintained', 'attractive property', 'quality home'],
    headlineFeature: 'well-maintained property',
    emotionalTriggers: ['quality', 'comfort'],
    buyerProfile: 'Buyers seeking a quality home',
    lifestyleElements: ['comfortable living'],
    conversionHooks: ['Your search for the perfect home ends here', 'Step into your ideal sanctuary', 'This quality home awaits your personal touch'],
    buyerBenefits: [
      { feature: 'well-maintained', benefit: 'move-in ready comfort', emotion: 'peace of mind' },
      { feature: 'attractive property', benefit: 'pride of ownership', emotion: 'satisfaction' },
      { feature: 'quality home', benefit: 'lasting value', emotion: 'security' }
    ],
    lifestyleScenarios: ['Picture yourself settling into this comfortable space', 'Imagine hosting friends in your new quality home'],
    urgencyTriggers: ['Quality homes in this condition move quickly', 'Don\'t miss this well-maintained opportunity'],
    socialProofElements: ['Professional maintenance standards', 'Move-in ready condition', 'Quality construction evident'],
    mlsKeywords: ['homes for sale', 'real estate listing', 'property for sale', 'quality home'],
    propertyCategory: 'family',
    marketingPriority: 'features',
    heroCandidate: {
      index: 0,
      reason: 'first photo selected as hero',
      score: 7
    }
  };
}

// Helper to enhance existing content with photo insights
export function enhanceContentWithInsights(
  baseContent: any,
  insights: PhotoInsights
): any {
  const visualFeatures = insights.features.join(', ');
  const sellingPoints = insights.sellingPoints.join(', ');
  
  return {
    ...baseContent,
    mlsDesc: enhanceMLSDescription(baseContent.mlsDesc, insights),
    igSlides: enhanceInstagramSlides(baseContent.igSlides, insights),
    reelScript: enhanceReelScript(baseContent.reelScript, insights),
    emailBody: enhanceEmailBody(baseContent.emailBody, insights)
  };
}

function enhanceMLSDescription(base: string, insights: PhotoInsights): string {
  if (!insights.features.length) return base;
  
  const features = insights.features.slice(0, 5).join(', ');
  const style = insights.style[0] || 'well-appointed';
  
  // Insert visual features naturally into the description
  return base.replace(
    /\. /g, 
    `. Featuring ${features}, this ${style} property `
  ).substring(0, 900); // Keep within MLS limits
}

function enhanceInstagramSlides(slides: string[], insights: PhotoInsights): string[] {
  if (!slides.length || !insights.sellingPoints.length) return slides;
  
  const enhanced = [...slides];
  
  // Add photo-specific callouts
  if (insights.sellingPoints.length > 0) {
    enhanced.push(`✨ ${insights.sellingPoints[0]} (swipe to see!)`);
  }
  
  // Reference hero image
  if (insights.heroCandidate) {
    enhanced.push(`📸 That main photo though! ${insights.heroCandidate.reason}`);
  }
  
  return enhanced;
}

function enhanceReelScript(script: string[], insights: PhotoInsights): string[] {
  if (!script.length) return script;
  
  const enhanced = [...script];
  
  // Make script match actual photos
  if (insights.rooms.length > 0) {
    const roomTypes = insights.rooms.map(r => r.type).join(', ');
    enhanced[1] = enhanced[1].replace(
      /\d+ bd\/\d+ ba/,
      `$& featuring ${roomTypes}`
    );
  }
  
  return enhanced;
}

function enhanceEmailBody(body: string, insights: PhotoInsights): string {
  if (!insights.marketingAngles.length) return body;
  
  const angle = insights.marketingAngles[0];
  return body + `\n\nThis property is ${angle} - the photos tell the whole story!`;
}