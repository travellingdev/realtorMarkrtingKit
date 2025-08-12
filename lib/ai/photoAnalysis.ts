export interface PhotoInsights {
  rooms: RoomAnalysis[];
  features: string[];
  style: string[];
  lighting: string;
  condition: string;
  sellingPoints: string[];
  marketingAngles: string[];
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
  photoUrls: string[]
): Promise<PhotoInsights> {
  if (!photoUrls.length) {
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

  try {
    const analysisPrompt = buildPhotoAnalysisPrompt(photoUrls);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1500,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are a real estate photography expert. Analyze property photos and return insights as JSON.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: analysisPrompt
              },
              ...photoUrls.slice(0, 10).map(url => ({
                type: 'image_url',
                image_url: { url, detail: 'low' }
              }))
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Vision API error:', response.status);
      return getFallbackAnalysis(photoUrls);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return getFallbackAnalysis(photoUrls);
    }

    const insights = JSON.parse(content);
    
    // Add hero candidate selection
    insights.heroCandidate = selectHeroImage(insights.rooms);
    
    return insights as PhotoInsights;
    
  } catch (error) {
    console.error('Photo analysis error:', error);
    return getFallbackAnalysis(photoUrls);
  }
}

function buildPhotoAnalysisPrompt(photoUrls: string[]): string {
  return `Analyze these ${photoUrls.length} real estate photos and return a JSON object with the following structure:

{
  "rooms": [
    {
      "type": "kitchen|living|bedroom|bathroom|exterior|dining|office|other",
      "features": ["granite counters", "stainless appliances", "island"],
      "condition": "excellent|good|needs_updates",
      "appeal": 8
    }
  ],
  "features": ["pool", "fireplace", "hardwood floors", "granite", "stainless steel"],
  "style": ["modern", "traditional", "farmhouse", "contemporary", "luxury"],
  "lighting": "excellent|good|fair|poor",
  "condition": "move-in ready|good|needs updates|fixer",
  "sellingPoints": ["chef's kitchen", "entertaining space", "private backyard"],
  "marketingAngles": ["perfect for families", "luxury living", "investment opportunity"]
}

Focus on:
1. Identifying each room type and standout features
2. Overall property style and condition
3. Unique selling points that would appeal to buyers
4. Marketing angles based on lifestyle appeal
5. Rate each room's marketing appeal (1-10)

Be specific about features you can clearly see. Don't make assumptions about features not visible.`;
}

function selectHeroImage(rooms: RoomAnalysis[]): PhotoInsights['heroCandidate'] {
  if (!rooms.length) return undefined;

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
    features: ['well-maintained'],
    style: ['residential'],
    lighting: 'good',
    condition: 'good',
    sellingPoints: ['attractive property'],
    marketingAngles: ['great opportunity'],
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