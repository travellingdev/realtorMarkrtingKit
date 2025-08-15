import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// This is a simple, predictable enhancement using Sharp
// No AI generation - just real photo processing

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      imageUrl, 
      brightness = 1.2,  // 20% brighter by default
      saturation = 1.1,  // 10% more vibrant
      contrast = 1.1     // 10% more contrast
    } = body;
    
    console.log('[Simple Enhance] Starting enhancement:', {
      brightness,
      saturation,
      contrast
    });
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }
    
    try {
      // Handle different image URL formats
      let imageBuffer: Buffer;
      
      if (imageUrl.startsWith('blob:')) {
        console.error('[Simple Enhance] Blob URL received - need base64 or regular URL');
        throw new Error('Blob URLs cannot be processed server-side.');
      } else if (imageUrl.startsWith('data:')) {
        // Handle base64 data URLs
        const base64Data = imageUrl.split(',')[1];
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        // Regular URL - fetch the image
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error('Failed to fetch image');
        }
        const imageBlob = await imageResponse.blob();
        imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
      }
      
      // Apply simple, predictable enhancements
      const enhancedBuffer = await sharp(imageBuffer)
        .modulate({
          brightness: brightness,
          saturation: saturation,
        })
        .linear(contrast, -(128 * (contrast - 1))) // Adjust contrast
        .sharpen({ sigma: 0.5 })  // Subtle sharpening
        .jpeg({
          quality: 95,
          progressive: true,
          mozjpeg: true
        })
        .toBuffer();
      
      // Convert to base64 data URL
      const base64Image = `data:image/jpeg;base64,${enhancedBuffer.toString('base64')}`;
      
      console.log('[Simple Enhance] Enhancement complete');
      
      return NextResponse.json({
        success: true,
        editedUrl: base64Image,
        settings: {
          brightness,
          saturation,
          contrast
        },
        message: 'Image enhanced successfully'
      });
      
    } catch (error: any) {
      console.error('[Simple Enhance] Processing error:', error);
      
      return NextResponse.json(
        { 
          error: 'Failed to enhance image',
          details: error?.message || 'Unknown error'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[Simple Enhance] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint
export async function GET() {
  return NextResponse.json({
    available: true,
    message: 'Simple enhancement service is available',
    features: [
      'Brightness adjustment (default: +20%)',
      'Saturation boost (default: +10%)',
      'Contrast enhancement (default: +10%)',
      'Subtle sharpening',
      'Web optimization'
    ]
  });
}