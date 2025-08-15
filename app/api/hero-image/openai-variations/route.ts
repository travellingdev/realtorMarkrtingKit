import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import sharp from 'sharp';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      imageUrl, 
      n = 2  // Generate 2 variations by default
    } = body;
    
    console.log('[OpenAI Variations] Starting image variations generation');
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('[OpenAI Variations] No API key configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }
    
    try {
      // Handle different image URL formats
      let imageBuffer: Buffer;
      
      if (imageUrl.startsWith('blob:')) {
        console.error('[OpenAI Variations] Blob URL received - need base64 or regular URL');
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
      
      // Convert to PNG and resize to 1024x1024 (DALL-E requirements)
      console.log('[OpenAI Variations] Preparing image for DALL-E...');
      const pngBuffer = await sharp(imageBuffer)
        .resize(1024, 1024, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toBuffer();
      
      // Convert to File object for OpenAI
      const imageArray = new Uint8Array(pngBuffer);
      const imageFile = new File([imageArray], 'image.png', { type: 'image/png' });
      
      console.log('[OpenAI Variations] Calling DALL-E variations API...');
      
      // Call DALL-E variations API
      // This creates variations of the existing image
      const response = await openai.images.createVariation({
        model: "dall-e-2",
        image: imageFile,
        n: n,
        size: "1024x1024",
        response_format: "url"
      });
      
      console.log('[OpenAI Variations] DALL-E response received');
      
      if (response.data && response.data.length > 0) {
        return NextResponse.json({
          success: true,
          variations: response.data.map(item => item.url),
          message: 'Image variations created successfully',
          count: response.data.length
        });
      } else {
        throw new Error('No variations in response');
      }
      
    } catch (openAIError: any) {
      console.error('[OpenAI Variations] DALL-E API error:', openAIError);
      
      // Handle specific OpenAI errors
      if (openAIError?.error?.code === 'invalid_api_key') {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key' },
          { status: 401 }
        );
      }
      
      if (openAIError?.error?.code === 'rate_limit_exceeded') {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to create variations',
          details: openAIError?.message || 'Unknown error'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[OpenAI Variations] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check if OpenAI is configured
export async function GET() {
  return NextResponse.json({
    configured: !!process.env.OPENAI_API_KEY,
    message: process.env.OPENAI_API_KEY 
      ? 'OpenAI Variations API is configured' 
      : 'OpenAI API key not found in environment variables'
  });
}