/**
 * Real Gemini API Client for Image Generation and Analysis
 * This is the ACTUAL implementation that connects to Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Analyze a real estate photo using Gemini Vision
 */
export async function analyzePropertyPhoto(imageUrl: string) {
  try {
    console.log('[Gemini] Starting photo analysis with Gemini Vision');
    
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_VISION_MODEL || "gemini-1.5-flash" 
    });
    
    // Fetch image as base64
    const imageData = await fetchImageAsBase64(imageUrl);
    
    const prompt = `
      You are a professional real estate photography expert. Analyze this property photo and provide a detailed assessment.
      
      Provide your analysis in the following JSON format:
      {
        "roomType": "exterior/living_room/kitchen/bedroom/bathroom/etc",
        "score": 0-100,
        "lighting": {
          "quality": 0-10,
          "type": "natural/artificial/mixed",
          "timeOfDay": "morning/afternoon/evening/night"
        },
        "composition": {
          "score": 0-10,
          "strengths": ["list of compositional strengths"],
          "improvements": ["suggested improvements"]
        },
        "marketability": {
          "score": 0-10,
          "targetBuyer": "family/luxury/investor/first-time",
          "keySellingPoints": ["list of key selling points"]
        },
        "enhancements": {
          "recommended": ["twilight", "sky_replacement", "declutter", "staging"],
          "priority": "highest priority enhancement",
          "expectedImprovement": 0-100
        },
        "description": "A compelling 2-3 sentence description for marketing"
      }
      
      Be specific and practical in your recommendations.
    `;
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData,
          mimeType: "image/jpeg"
        }
      }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      console.log('[Gemini] Analysis complete:', analysis);
      return analysis;
    }
    
    throw new Error('Failed to parse Gemini response');
    
  } catch (error) {
    console.error('[Gemini] Analysis error:', error);
    throw error;
  }
}

/**
 * Generate an enhanced hero image using Gemini
 * Note: Gemini doesn't directly generate images, but we can use it to create detailed prompts
 * and instructions for image enhancement
 */
export async function generateEnhancedImage(
  imageUrl: string,
  enhancement: string,
  propertyDetails?: {
    price?: string;
    beds?: string;
    baths?: string;
    type?: string;
  }
) {
  try {
    console.log('[Gemini] Starting image enhancement generation');
    
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_VISION_MODEL || "gemini-1.5-flash" 
    });
    
    // Fetch image as base64
    const imageData = await fetchImageAsBase64(imageUrl);
    
    // Enhancement-specific prompts
    const enhancementPrompts = {
      twilight: `
        Describe how to transform this property photo into a stunning twilight/golden hour shot:
        - What lighting adjustments are needed (brightness, warmth, contrast)?
        - What color grading would create the perfect sunset ambiance?
        - Should windows have warm interior lights visible?
        - What sky colors and gradients would be most appealing?
        Provide specific RGB/HSL values and adjustment percentages.
      `,
      brightness: `
        Analyze this property photo and describe how to enhance it for maximum appeal:
        - What brightness and contrast adjustments would optimize the image?
        - Which areas need shadow/highlight recovery?
        - What saturation and vibrance settings would make it pop?
        - Should any color temperature adjustments be made?
        Provide specific adjustment values.
      `,
      sky: `
        Describe how to enhance or replace the sky in this property photo:
        - What type of sky would best complement the property (clear blue, dramatic clouds, sunset)?
        - What color palette would work best?
        - How should the lighting be adjusted to match the new sky?
        - What environmental reflections need to be considered?
        Provide specific color values and lighting adjustments.
      `,
      staging: `
        Describe how to virtually stage this property photo:
        - What furniture style would appeal to the target market?
        - What color scheme and decor would enhance the space?
        - How should the lighting be adjusted for a warm, inviting feel?
        - What lifestyle elements would increase emotional appeal?
        Provide specific staging recommendations.
      `,
      seasonal: `
        Describe how to add seasonal appeal to this property photo:
        - What seasonal elements would enhance curb appeal (fall foliage, spring flowers, holiday decorations)?
        - How should colors be adjusted for the season?
        - What lighting changes would complement the seasonal theme?
        - What atmospheric effects would add charm?
        Provide specific seasonal enhancement details.
      `
    };
    
    const selectedPrompt = enhancementPrompts[enhancement as keyof typeof enhancementPrompts] || enhancementPrompts.brightness;
    
    const result = await model.generateContent([
      `You are a professional real estate photo editor. ${selectedPrompt}
      
      Also provide a JSON object with these specific enhancement parameters:
      {
        "filters": {
          "brightness": 1.0,
          "contrast": 1.0,
          "saturation": 1.0,
          "temperature": 0,
          "tint": 0,
          "highlights": 0,
          "shadows": 0,
          "vibrance": 0,
          "clarity": 0
        },
        "colorGrading": {
          "highlights": "#RRGGBB",
          "midtones": "#RRGGBB",
          "shadows": "#RRGGBB"
        },
        "overlays": {
          "gradient": "linear-gradient(...)",
          "vignette": 0.0
        },
        "description": "Marketing description of the enhanced image"
      }`,
      {
        inlineData: {
          data: imageData,
          mimeType: "image/jpeg"
        }
      }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const enhancementData = JSON.parse(jsonMatch[0]);
      console.log('[Gemini] Enhancement parameters generated:', enhancementData);
      
      // Return enhancement data that can be applied client-side or server-side
      return {
        success: true,
        enhancement: enhancementData,
        originalUrl: imageUrl,
        description: enhancementData.description
      };
    }
    
    throw new Error('Failed to parse enhancement response');
    
  } catch (error) {
    console.error('[Gemini] Enhancement generation error:', error);
    throw error;
  }
}

/**
 * Generate marketing copy for a property using Gemini
 */
export async function generateMarketingCopy(
  imageUrl: string,
  propertyDetails: any
) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_VISION_MODEL || "gemini-1.5-flash" 
    });
    
    const imageData = await fetchImageAsBase64(imageUrl);
    
    const result = await model.generateContent([
      `Based on this property photo and details, create compelling marketing copy:
      
      Property Details:
      - Price: ${propertyDetails.price || 'Not specified'}
      - Beds: ${propertyDetails.beds || 'Not specified'}
      - Baths: ${propertyDetails.baths || 'Not specified'}
      - Type: ${propertyDetails.type || 'Residential'}
      
      Generate:
      1. A captivating headline (10 words max)
      2. A compelling description (50 words)
      3. Three key selling points
      4. Best target audience
      5. Suggested social media caption
      
      Format as JSON.`,
      {
        inlineData: {
          data: imageData,
          mimeType: "image/jpeg"
        }
      }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return null;
  } catch (error) {
    console.error('[Gemini] Marketing copy generation error:', error);
    throw error;
  }
}

/**
 * Helper function to fetch image as base64
 */
async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  try {
    // If it's already a data URL, extract the base64 part
    if (imageUrl.startsWith('data:')) {
      return imageUrl.split(',')[1];
    }
    
    // For blob URLs or external URLs, fetch and convert
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('[Gemini] Error fetching image as base64:', error);
    throw error;
  }
}

/**
 * Batch analyze multiple photos
 */
export async function batchAnalyzePhotos(imageUrls: string[]) {
  console.log(`[Gemini] Batch analyzing ${imageUrls.length} photos`);
  
  const results = await Promise.all(
    imageUrls.map(async (url, index) => {
      try {
        const analysis = await analyzePropertyPhoto(url);
        return { index, url, analysis, success: true };
      } catch (error) {
        console.error(`[Gemini] Failed to analyze photo ${index}:`, error);
        return { index, url, error, success: false };
      }
    })
  );
  
  return results;
}

/**
 * Get the best photo from a set based on Gemini analysis
 */
export async function selectBestHeroImage(imageUrls: string[]) {
  const analyses = await batchAnalyzePhotos(imageUrls);
  
  // Sort by score
  const successfulAnalyses = analyses
    .filter(r => r.success && r.analysis)
    .sort((a, b) => (b.analysis?.score || 0) - (a.analysis?.score || 0));
  
  if (successfulAnalyses.length === 0) {
    throw new Error('No photos could be analyzed');
  }
  
  return {
    bestPhoto: successfulAnalyses[0],
    alternatives: successfulAnalyses.slice(1, 4),
    allAnalyses: analyses
  };
}