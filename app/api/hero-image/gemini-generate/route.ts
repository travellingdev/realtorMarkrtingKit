import { NextRequest, NextResponse } from 'next/server';
import { analyzePropertyPhoto, generateEnhancedImage, generateMarketingCopy } from '@/lib/gemini/client';
import { ImageProcessor } from '@/lib/imageProcessor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      imageUrl, 
      enhancement = 'brightness',
      platform = 'mls',
      propertyDetails,
      useAI = true 
    } = body;
    
    console.log('[gemini-generate] Starting generation with:', {
      enhancement,
      platform,
      useAI
    });
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }
    
    // Step 1: Analyze the image with Gemini
    let analysis = null;
    let enhancementParams = null;
    let marketingCopy = null;
    
    if (useAI) {
      try {
        console.log('[gemini-generate] Analyzing with Gemini Vision...');
        analysis = await analyzePropertyPhoto(imageUrl);
        
        console.log('[gemini-generate] Getting enhancement parameters from Gemini...');
        const enhancementResult = await generateEnhancedImage(
          imageUrl,
          enhancement,
          propertyDetails
        );
        enhancementParams = enhancementResult.enhancement;
        
        // Generate marketing copy if property details provided
        if (propertyDetails) {
          console.log('[gemini-generate] Generating marketing copy...');
          marketingCopy = await generateMarketingCopy(imageUrl, propertyDetails);
        }
      } catch (aiError) {
        console.error('[gemini-generate] AI processing error:', aiError);
        // Continue with client-side processing if AI fails
      }
    }
    
    // Step 2: Apply enhancements using Canvas (client-side will handle this better)
    // For now, return the Gemini analysis and enhancement parameters
    // The client will apply these using the ImageProcessor
    
    const response = {
      success: true,
      original: imageUrl,
      analysis,
      enhancementParams,
      marketingCopy,
      platform,
      enhancement,
      // Instructions for client-side processing
      processingInstructions: {
        filters: enhancementParams?.filters || getDefaultFilters(enhancement),
        overlays: {
          badge: propertyDetails?.badge || 'JUST LISTED',
          price: propertyDetails?.price,
          bedsBaths: propertyDetails?.beds && propertyDetails?.baths 
            ? `${propertyDetails.beds} BD | ${propertyDetails.baths} BA`
            : undefined,
          agentInfo: propertyDetails?.agentInfo
        },
        platform,
        enhancement
      }
    };
    
    console.log('[gemini-generate] Returning enhancement data for client processing');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('[gemini-generate] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process image with Gemini',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Get default filters if Gemini fails
 */
function getDefaultFilters(enhancement: string) {
  const defaults: Record<string, any> = {
    brightness: {
      brightness: 1.15,
      contrast: 1.1,
      saturation: 1.1,
      temperature: 0,
      vibrance: 10
    },
    twilight: {
      brightness: 0.95,
      contrast: 1.2,
      saturation: 1.3,
      temperature: -20,
      tint: 10,
      highlights: -30,
      shadows: 20
    },
    sky: {
      brightness: 1.1,
      contrast: 1.05,
      saturation: 1.2,
      vibrance: 15,
      clarity: 10
    },
    staging: {
      brightness: 1.05,
      contrast: 1.05,
      saturation: 1.05,
      temperature: 5,
      clarity: 5
    },
    seasonal: {
      brightness: 1.1,
      contrast: 1.1,
      saturation: 0.9,
      temperature: -10,
      tint: 5
    }
  };
  
  return defaults[enhancement] || defaults.brightness;
}