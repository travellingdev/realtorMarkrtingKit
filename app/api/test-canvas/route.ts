import { NextRequest, NextResponse } from 'next/server';

/**
 * Test endpoint to verify Canvas processing works
 * This creates a simple test image with obvious visual changes
 */
export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL required' }, { status: 400 });
    }
    
    // Return test instructions for client-side processing
    return NextResponse.json({
      success: true,
      instructions: {
        enhancement: 'test',
        overlays: {
          badge: 'CANVAS TEST',
          testBorder: true,
          testText: 'PROCESSED'
        }
      }
    });
  } catch (error) {
    console.error('[test-canvas] Error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}