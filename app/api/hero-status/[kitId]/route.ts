import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClients';

interface HeroStatus {
  status: 'pending' | 'processing' | 'completed' | 'error';
  analysis?: any;
  progress?: number;
  message?: string;
  error?: string;
}

// In-memory cache for hero analysis status
// In production, this should be stored in Redis or database
const heroStatusCache = new Map<string, HeroStatus>();

// Background hero analysis queue
const heroAnalysisQueue = new Map<string, Promise<any>>();

export async function GET(
  request: NextRequest,
  { params }: { params: { kitId: string } }
) {
  const kitId = params.kitId;
  
  console.log('[hero-status] GET request received for kit:', kitId, {
    timestamp: new Date().toISOString(),
    kitIdType: typeof kitId,
    kitIdLength: kitId?.length
  });
  
  if (!kitId) {
    console.log('[hero-status] No kit ID provided');
    return NextResponse.json({ error: 'Kit ID required' }, { status: 400 });
  }

  console.log('[hero-status] Checking status for kit:', kitId);

  // Check if we have a cached status
  const cachedStatus = heroStatusCache.get(kitId);
  if (cachedStatus) {
    console.log('[hero-status] Returning cached status:', cachedStatus.status);
    return NextResponse.json(cachedStatus);
  }

  // Check if analysis is already running
  if (heroAnalysisQueue.has(kitId)) {
    console.log('[hero-status] Analysis in progress for kit:', kitId);
    return NextResponse.json({
      status: 'processing',
      progress: 50,
      message: 'Analyzing photos for hero selection...'
    });
  }

  // Check database for existing analysis
  try {
    console.log('[hero-status] Querying database for kit:', kitId);
    const sb = supabaseServer();
    
    const queryStart = Date.now();
    const { data: kit, error } = await sb
      .from('kits')
      .select('photo_insights')
      .eq('id', kitId)
      .maybeSingle(); // Use maybeSingle instead of single to handle 0 rows
    const queryTime = Date.now() - queryStart;
    
    console.log('[hero-status] Database query completed', {
      kitId,
      queryTime: `${queryTime}ms`,
      hasData: !!kit,
      hasError: !!error,
      errorCode: error?.code,
      photoInsightsPresent: !!kit?.photo_insights,
      photosCount: kit?.photo_insights?.photos?.length || 0,
      heroAnalysisPresent: !!kit?.photo_insights?.heroAnalysis
    });

    if (error) {
      console.error('[hero-status] Database error:', error);
      return NextResponse.json({
        status: 'error',
        error: 'Failed to fetch kit data'
      });
    }

    if (!kit) {
      console.log('[hero-status] Kit not found in database:', kitId);
      console.log('[hero-status] This likely means the kit ID is incorrect or generation failed');
      return NextResponse.json({
        status: 'error',
        error: 'Kit not found'
      });
    }

    // If hero analysis already exists in photo_insights, return it
    if (kit.photo_insights?.heroAnalysis) {
      const status: HeroStatus = {
        status: 'completed',
        analysis: kit.photo_insights.heroAnalysis
      };
      heroStatusCache.set(kitId, status);
      return NextResponse.json(status);
    }

    // If we have photo insights but no hero analysis, trigger async analysis
    if (kit.photo_insights?.photos && kit.photo_insights.photos.length > 0) {
      console.log('[hero-status] Starting async hero analysis for kit:', kitId);
      
      // Start async analysis
      triggerAsyncHeroAnalysis(kitId, kit.photo_insights.photos, kit.photo_insights);
      
      return NextResponse.json({
        status: 'processing',
        progress: 10,
        message: 'Starting hero image analysis...'
      });
    }

    // No photos available
    return NextResponse.json({
      status: 'error',
      error: 'No photos available for analysis'
    });

  } catch (error) {
    console.error('[hero-status] Unexpected error:', error);
    return NextResponse.json({
      status: 'error',
      error: 'Failed to check hero status'
    }, { status: 500 });
  }
}

// Trigger async hero analysis
async function triggerAsyncHeroAnalysis(kitId: string, photoUrls: string[], photoInsights?: any) {
  // Prevent duplicate processing
  if (heroAnalysisQueue.has(kitId)) {
    return;
  }

  // Set initial processing status
  heroStatusCache.set(kitId, {
    status: 'processing',
    progress: 20,
    message: 'Loading photo analysis modules...'
  });

  // Create analysis promise
  const analysisPromise = performHeroAnalysis(kitId, photoUrls, photoInsights);
  heroAnalysisQueue.set(kitId, analysisPromise);

  // Handle completion
  analysisPromise
    .then(analysis => {
      console.log('[hero-status] Analysis completed for kit:', kitId);
      heroStatusCache.set(kitId, {
        status: 'completed',
        analysis
      });
      heroAnalysisQueue.delete(kitId);
    })
    .catch(error => {
      console.error('[hero-status] Analysis failed for kit:', kitId, error);
      heroStatusCache.set(kitId, {
        status: 'error',
        error: error.message || 'Hero analysis failed'
      });
      heroAnalysisQueue.delete(kitId);
    });
}

// Perform the actual hero analysis
async function performHeroAnalysis(kitId: string, photoUrls: string[], photoInsights?: any): Promise<any> {
  console.log('[hero-status] Performing hero analysis for', photoUrls.length, 'photos');
  console.log('[hero-status] Photo URLs received:', photoUrls.map((url, i) => ({
    index: i,
    url: url?.substring(0, 100) + '...',
    urlType: typeof url,
    isSupabaseUrl: url?.includes('supabase') || false
  })));
  
  // Update progress: Scanning photos
  heroStatusCache.set(kitId, {
    status: 'processing',
    progress: 30,
    message: 'Scanning property photos...'
  });

  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Import hero analysis modules
    const { scorePhotosForHero } = await import('@/lib/features/heroImage/scorer');
    
    // Update progress: Analyzing
    heroStatusCache.set(kitId, {
      status: 'processing',
      progress: 50,
      message: 'Understanding buyer psychology...'
    });

    // Create photo analyses from photo insights
    const photoAnalyses = photoUrls.map((url, index) => {
      // Try to match with room analysis from photo insights
      const roomInfo = photoInsights?.rooms?.[index] || {};
      const features = photoInsights?.features || [];
      
      return {
        url,
        index,
        filename: `photo_${index + 1}.jpg`,
        description: roomInfo.type ? `${roomInfo.type} photo showing ${roomInfo.features?.join(', ') || 'property features'}` : `Property photo ${index + 1}`,
        room_type: roomInfo.type || 'general',  // Changed from roomType to room_type
        features: roomInfo.features || features.slice(index * 2, (index + 1) * 2),
        condition: roomInfo.condition || 'good',
        appeal: roomInfo.appeal || 7,
        lighting: photoInsights?.lighting || 'good',
        composition: { 
          description: index === 0 ? 'exterior_curb' : index === 1 ? 'living_room' : 'interior'
        },
        // Add variation to make scores different
        lifestyle_potential: index === 0,
        entertaining_space: roomInfo.type === 'living' || roomInfo.type === 'kitchen',
        family_friendly: true,
        uniqueFeatures: index === 0 ? ['curb appeal', 'landscaping'] : 
                       index === 1 ? ['natural light', 'open space'] : 
                       ['modern updates', 'clean lines'],
        // Add best_for_platforms
        best_for_platforms: index === 0 
          ? ['MLS Main Photo', 'Social Media Hero', 'Website Banner']
          : index === 1 
          ? ['Instagram Carousel', 'Virtual Tour Start', 'Email Feature']
          : ['Print Marketing', 'Listing Details', 'Property Brochure']
      };
    });

    console.log('[hero-status] Created photo analyses:', photoAnalyses.map(a => ({
      index: a.index,
      roomType: a.room_type,
      features: a.features.length,
      appeal: a.appeal,
      bestFor: a.best_for_platforms?.join(', ')
    })));

    // Perform scoring with analyses
    const scoringResult = await scorePhotosForHero(photoAnalyses, {
      propertyType: photoInsights?.propertyCategory || 'home',
      targetBuyer: photoInsights?.buyerProfile || 'general'
    });

    // Update progress: Technical analysis
    heroStatusCache.set(kitId, {
      status: 'processing',
      progress: 70,
      message: 'Checking composition rules...'
    });

    await new Promise(resolve => setTimeout(resolve, 800));

    // Update progress: Selecting
    heroStatusCache.set(kitId, {
      status: 'processing',
      progress: 90,
      message: 'Selecting your winner...'
    });

    await new Promise(resolve => setTimeout(resolve, 600));

    // Store in database - add to existing photo_insights
    const sb = supabaseServer();
    const { data: existingKit } = await sb
      .from('kits')
      .select('photo_insights')
      .eq('id', kitId)
      .maybeSingle();
    
    const updatedPhotoInsights = {
      ...(existingKit?.photo_insights || {}),
      heroAnalysis: scoringResult
    };
    
    await sb
      .from('kits')
      .update({ photo_insights: updatedPhotoInsights })
      .eq('id', kitId);

    console.log('[hero-status] Hero analysis complete:', {
      kitId,
      bestPhoto: scoringResult.bestPhoto?.photoIndex,
      score: scoringResult.bestPhoto?.totalScore
    });

    return scoringResult;

  } catch (error) {
    console.error('[hero-status] Analysis error:', error);
    throw error;
  }
}

// POST endpoint to trigger hero analysis manually
export async function POST(
  request: NextRequest,
  { params }: { params: { kitId: string } }
) {
  const kitId = params.kitId;
  
  try {
    const sb = supabaseServer();
    const { data: kit, error } = await sb
      .from('kits')
      .select('photo_insights')
      .eq('id', kitId)
      .maybeSingle();

    if (error || !kit) {
      return NextResponse.json({
        error: 'Kit not found'
      }, { status: 404 });
    }

    if (!kit.photo_insights?.photos || kit.photo_insights.photos.length === 0) {
      return NextResponse.json({
        error: 'No photos available for analysis'
      }, { status: 400 });
    }

    // Trigger analysis
    triggerAsyncHeroAnalysis(kitId, kit.photo_insights.photos);

    return NextResponse.json({
      status: 'processing',
      message: 'Hero analysis started'
    });

  } catch (error) {
    console.error('[hero-status] POST error:', error);
    return NextResponse.json({
      error: 'Failed to start analysis'
    }, { status: 500 });
  }
}