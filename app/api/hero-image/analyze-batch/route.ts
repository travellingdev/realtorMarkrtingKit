import { NextRequest, NextResponse } from 'next/server';
import { batchAnalyzePhotos, selectBestHeroImage } from '@/lib/gemini/client';

/**
 * Batch analyze multiple photos with Gemini to find the best hero image
 * This should be called BEFORE the user selects enhancements
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      photos, 
      propertyType = 'Residential',
      propertyDetails,
      targetMarket = 'family'
    } = body;
    
    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { error: 'No photos provided for analysis' },
        { status: 400 }
      );
    }
    
    console.log(`[analyze-batch] Analyzing ${photos.length} photos with Gemini...`);
    
    try {
      // Use Gemini to analyze ALL photos
      const selection = await selectBestHeroImage(photos);
      
      console.log('[analyze-batch] Gemini analysis complete');
      console.log(`[analyze-batch] Best photo: Index ${selection.bestPhoto.index}, Score: ${selection.bestPhoto.analysis?.score}`);
      
      // Format response for frontend
      const response = {
        success: true,
        bestPhoto: {
          photoUrl: selection.bestPhoto.url,
          photoIndex: selection.bestPhoto.index,
          totalScore: selection.bestPhoto.analysis?.score || 0,
          reasoning: selection.bestPhoto.analysis?.description || 'Selected by AI as the best marketing image',
          scores: {
            emotional: selection.bestPhoto.analysis?.marketability?.score * 10 || 0,
            technical: selection.bestPhoto.analysis?.lighting?.quality * 10 || 0,
            marketing: selection.bestPhoto.analysis?.marketability?.score * 10 || 0,
            story: selection.bestPhoto.analysis?.composition?.score * 10 || 0,
            uniqueness: 80, // Default
            psychology: 85, // Default
          },
          details: {
            roomType: selection.bestPhoto.analysis?.roomType || 'unknown',
            features: selection.bestPhoto.analysis?.marketability?.keySellingPoints || [],
            lighting: selection.bestPhoto.analysis?.lighting?.type || 'natural',
            composition: 'analyzed',
            bestFor: determineBestPlatforms(selection.bestPhoto.analysis),
          },
          geminiAnalysis: selection.bestPhoto.analysis // Include full Gemini analysis
        },
        alternatives: selection.alternatives.map((alt: any) => ({
          photoUrl: alt.url,
          photoIndex: alt.index,
          totalScore: alt.analysis?.score || 0,
          reasoning: alt.analysis?.description || 'Alternative option',
          scores: {
            emotional: alt.analysis?.marketability?.score * 10 || 0,
            technical: alt.analysis?.lighting?.quality * 10 || 0,
            marketing: alt.analysis?.marketability?.score * 10 || 0,
            story: alt.analysis?.composition?.score * 10 || 0,
            uniqueness: 70,
            psychology: 75,
          },
          details: {
            roomType: alt.analysis?.roomType || 'unknown',
            features: alt.analysis?.marketability?.keySellingPoints || [],
            lighting: alt.analysis?.lighting?.type || 'natural',
            composition: 'analyzed',
            bestFor: determineBestPlatforms(alt.analysis),
          },
          geminiAnalysis: alt.analysis
        })),
        insights: {
          propertyHighlight: selection.bestPhoto.analysis?.marketability?.keySellingPoints?.[0] || 
                            'Strong visual appeal for marketing',
          enhancementSuggestions: selection.bestPhoto.analysis?.enhancements?.recommended || 
                                 ['brightness', 'twilight', 'sky'],
          marketingAngle: selection.bestPhoto.analysis?.description || 
                         'Focus on key selling points and emotional appeal',
          aiRecommendation: selection.bestPhoto.analysis?.enhancements?.priority || 'brightness'
        },
        allAnalyses: selection.allAnalyses
      };
      
      return NextResponse.json(response);
      
    } catch (geminiError: any) {
      console.error('[analyze-batch] Gemini error:', geminiError);
      
      // Fallback to mock analysis if Gemini fails
      console.log('[analyze-batch] Falling back to mock analysis');
      return NextResponse.json({
        success: false,
        error: 'Gemini analysis failed, using fallback',
        bestPhoto: createMockAnalysis(photos[0], 0),
        alternatives: photos.slice(1, 4).map((url: string, idx: number) => 
          createMockAnalysis(url, idx + 1)
        ),
        insights: {
          propertyHighlight: 'Great property with strong appeal',
          enhancementSuggestions: ['brightness', 'twilight'],
          marketingAngle: 'Focus on curb appeal and lifestyle',
          aiRecommendation: 'brightness'
        }
      });
    }
    
  } catch (error) {
    console.error('[analyze-batch] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze photos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Determine best platforms based on photo analysis
 */
function determineBestPlatforms(analysis: any): string[] {
  if (!analysis) return ['mls'];
  
  const platforms = [];
  
  // MLS - always good for professional shots
  if (analysis.lighting?.quality > 7 || analysis.composition?.score > 7) {
    platforms.push('mls');
  }
  
  // Instagram - needs visual impact
  if (analysis.marketability?.score > 7 || analysis.roomType === 'exterior') {
    platforms.push('instagram');
  }
  
  // Facebook - family appeal
  if (analysis.marketability?.targetBuyer === 'family') {
    platforms.push('facebook');
  }
  
  // Email - clear and informative
  if (analysis.composition?.score > 6) {
    platforms.push('email');
  }
  
  return platforms.length > 0 ? platforms : ['mls', 'instagram'];
}

/**
 * Create mock analysis for fallback
 */
function createMockAnalysis(photoUrl: string, index: number) {
  const baseScore = 85 - (index * 5);
  return {
    photoUrl,
    photoIndex: index,
    totalScore: baseScore + Math.random() * 10,
    reasoning: 'Analyzed for marketing potential',
    scores: {
      emotional: baseScore,
      technical: baseScore + 5,
      marketing: baseScore + 2,
      story: baseScore - 3,
      uniqueness: 75,
      psychology: 80,
    },
    details: {
      roomType: index === 0 ? 'exterior' : 'interior',
      features: ['well-lit', 'spacious', 'appealing'],
      lighting: 'natural',
      composition: 'good',
      bestFor: ['mls', 'instagram'],
    }
  };
}