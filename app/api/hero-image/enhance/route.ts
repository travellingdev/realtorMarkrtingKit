import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// This is a simpler enhancement API that uses sharp for real image processing
// instead of DALL-E which is better for generation than enhancement

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      imageUrl, 
      mode = 'listing-ready',
      enhancement = 'auto'
    } = body;
    
    console.log('[Image Enhance] Starting image enhancement:', {
      mode,
      enhancement,
      imageUrl: imageUrl?.substring(0, 50)
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
        console.error('[Image Enhance] Blob URL received - need base64 or regular URL');
        throw new Error('Blob URLs cannot be processed server-side. Please send base64 or regular URL.');
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
      
      // Apply enhancements using sharp
      let sharpInstance = sharp(imageBuffer);
      
      // Get image metadata
      const metadata = await sharpInstance.metadata();
      console.log('[Image Enhance] Image metadata:', {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      });
      
      // Apply enhancements based on mode and enhancement type
      if (mode === 'listing-ready' || enhancement === 'brightness') {
        // Professional real estate photo enhancements
        sharpInstance = sharpInstance
          .normalize() // Enhance contrast by stretching luminance
          .modulate({
            brightness: 1.1, // Slightly increase brightness
            saturation: 1.15, // Slightly increase saturation for vibrant colors
            lightness: 0     // Keep lightness neutral
          })
          .sharpen({       // Subtle sharpening for clarity
            sigma: 0.5,
            m1: 0.5,
            m2: 0.3
          })
          .gamma(2.2)      // Apply standard gamma correction
          .resize(2048, null, { // Resize for web while maintaining aspect ratio
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({          // Convert to optimized JPEG
            quality: 90,
            progressive: true,
            mozjpeg: true
          });
      } else if (mode === 'bright') {
        // Make it bright as requested
        sharpInstance = sharpInstance
          .modulate({
            brightness: 1.3, // Significantly increase brightness
            saturation: 1.1, // Slightly increase saturation
          })
          .gamma(2.4)       // Lighter gamma for brighter image
          .jpeg({
            quality: 90,
            progressive: true
          });
      } else if (mode === 'twilight') {
        // Golden hour effect
        sharpInstance = sharpInstance
          .modulate({
            brightness: 0.9,
            saturation: 1.2,
            hue: 15 // Shift towards warmer tones
          })
          .tint({ r: 255, g: 200, b: 150 }) // Add warm tint
          .jpeg({
            quality: 90,
            progressive: true
          });
      }
      
      // Convert to buffer
      const enhancedBuffer = await sharpInstance.toBuffer();
      
      // Convert to base64 data URL for response
      const base64Image = `data:image/jpeg;base64,${enhancedBuffer.toString('base64')}`;
      
      console.log('[Image Enhance] Enhancement complete');
      
      return NextResponse.json({
        success: true,
        editedUrl: base64Image,
        mode: mode,
        message: 'Image successfully enhanced',
        metadata: {
          originalSize: imageBuffer.length,
          enhancedSize: enhancedBuffer.length,
          format: 'jpeg'
        }
      });
      
    } catch (processingError: any) {
      console.error('[Image Enhance] Processing error:', processingError);
      
      return NextResponse.json(
        { 
          error: 'Failed to enhance image',
          details: processingError?.message || 'Unknown error'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[Image Enhance] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check if the service is available
export async function GET() {
  return NextResponse.json({
    available: true,
    message: 'Image enhancement service is available',
    modes: ['listing-ready', 'bright', 'twilight'],
    features: [
      'Brightness adjustment',
      'Color correction',
      'Contrast enhancement',
      'Sharpening',
      'Web optimization'
    ]
  });
}