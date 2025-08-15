import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import sharp from 'sharp';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Enhancement prompts focused on real estate
const ENHANCEMENT_PROMPTS = {
  'listing-ready': `Professional real estate photo with perfect lighting, vibrant colors, and sharp details. Make the property look inviting and well-maintained.`,
  
  'bright': `Bright, well-lit real estate photo with natural daylight. Enhance brightness and remove shadows while keeping it realistic.`,
  
  'twilight': `Golden hour real estate photo with warm, inviting twilight lighting. Add soft warm glow while maintaining architectural accuracy.`,
  
  'luxury': `High-end luxury real estate photo with premium quality. Rich colors, perfect composition, magazine-quality presentation.`
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      imageUrl, 
      mode = 'listing-ready',
      quality = 'medium' // low, medium, high
    } = body;
    
    console.log('[OpenAI Enhance] Starting image enhancement with high fidelity:', {
      mode,
      quality,
      imageUrl: imageUrl?.substring(0, 50)
    });
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('[OpenAI Enhance] No API key configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }
    
    let imageFile: File;
    
    try {
      // Handle different image URL formats
      let imageBuffer: Buffer;
      
      if (imageUrl.startsWith('blob:')) {
        console.error('[OpenAI Enhance] Blob URL received - need base64 or regular URL');
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
      
      // Convert to PNG and resize to 1024x1024 (OpenAI requirements)
      console.log('[OpenAI Enhance] Preparing image for enhancement...');
      const pngBuffer = await sharp(imageBuffer)
        .resize(1024, 1024, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toBuffer();
      
      // Convert to File object for OpenAI
      const imageArray = new Uint8Array(pngBuffer);
      imageFile = new File([imageArray], 'image.png', { type: 'image/png' });
      
      // Get the enhancement prompt
      const prompt = ENHANCEMENT_PROMPTS[mode as keyof typeof ENHANCEMENT_PROMPTS] || ENHANCEMENT_PROMPTS['listing-ready'];
      
      console.log('[OpenAI Enhance] Using gpt-image-1 with high input fidelity...');
      console.log('[OpenAI Enhance] Prompt:', prompt);
      
      // For overall image enhancement, we'll try without a mask first
      // The edit API might work better for reference-based generation
      
      try {
        // Try using the image as both input and reference
        // According to docs, edit can use images as reference
        const response = await openai.images.edit({
          model: "gpt-image-1",
          image: [imageFile], // Try as array for reference-based generation
          prompt: prompt,
          input_fidelity: "high",  // Critical for preserving original
          quality: quality as any,  // Quality setting
          n: 1,
          size: "1024x1024",
        } as any);
        
        if (response.data && response.data[0]) {
          const resultUrl = response.data[0].url || response.data[0].b64_json;
          if (resultUrl) {
            console.log('[OpenAI Enhance] Enhancement successful without mask');
            const finalUrl = resultUrl.startsWith('data:') 
              ? resultUrl 
              : response.data[0].url 
              ? response.data[0].url 
              : `data:image/png;base64,${resultUrl}`;
            
            return NextResponse.json({
              success: true,
              editedUrl: finalUrl,
              mode: mode,
              prompt: prompt,
              message: 'Image enhanced with high fidelity AI (no mask)',
              settings: {
                model: 'gpt-image-1',
                input_fidelity: 'high',
                quality: quality,
                mask: 'none'
              }
            });
          }
        }
      } catch (noMaskError: any) {
        console.log('[OpenAI Enhance] Edit without mask failed, trying with transparent image as mask...');
        
        // If no mask doesn't work, try with a fully transparent image as mask
        // This tells the API to edit the entire image
        const transparentMaskBuffer = await sharp(pngBuffer)
          .ensureAlpha()
          .extractChannel('alpha')
          .negate() // Invert to make it fully transparent
          .toBuffer();
        
        const maskBuffer = await sharp({
          create: {
            width: 1024,
            height: 1024,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 } // Fully transparent = edit everything
          }
        })
        .png()
        .toBuffer();
        
        const maskArray = new Uint8Array(maskBuffer);
        const maskFile = new File([maskArray], 'mask.png', { type: 'image/png' });
        
        // Try with fully transparent mask
        const response = await openai.images.edit({
          model: "gpt-image-1",
          image: imageFile,
          mask: maskFile,
          prompt: prompt,
          input_fidelity: "high",
          quality: quality as any,
          n: 1,
          size: "1024x1024",
        } as any);
        
        if (response.data && response.data[0]) {
          const resultUrl = response.data[0].url || response.data[0].b64_json;
          if (resultUrl) {
            console.log('[OpenAI Enhance] Enhancement successful with transparent mask');
            const finalUrl = resultUrl.startsWith('data:') 
              ? resultUrl 
              : response.data[0].url 
              ? response.data[0].url 
              : `data:image/png;base64,${resultUrl}`;
            
            return NextResponse.json({
              success: true,
              editedUrl: finalUrl,
              mode: mode,
              prompt: prompt,
              message: 'Image enhanced with AI (full edit)',
              settings: {
                model: 'gpt-image-1',
                input_fidelity: 'high',
                quality: quality,
                mask: 'transparent'
              }
            });
          }
        }
      }
      
      throw new Error('No image URL in response');
      
    } catch (openAIError: any) {
      console.error('[OpenAI Enhance] Error:', openAIError);
      
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
      
      // Try generation as fallback (no edit)
      console.log('[OpenAI Enhance] Trying generation as fallback...');
      
      try {
        const generationResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: `${ENHANCEMENT_PROMPTS[mode as keyof typeof ENHANCEMENT_PROMPTS]} Photorealistic, professional real estate photography.`,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "natural"
        });
        
        if (generationResponse.data && generationResponse.data[0]?.url) {
          return NextResponse.json({
            success: true,
            editedUrl: generationResponse.data[0].url,
            mode: mode,
            message: 'Generated new image (enhancement unavailable)',
            fallback: true,
            settings: {
              model: 'dall-e-3',
              method: 'generation'
            }
          });
        }
      } catch (genError) {
        console.error('[OpenAI Enhance] Generation fallback also failed:', genError);
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to enhance image',
          details: openAIError?.message || 'Unknown error'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[OpenAI Enhance] Error:', error);
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
      ? 'OpenAI Enhancement API is configured' 
      : 'OpenAI API key not found in environment variables',
    features: {
      models: ['gpt-image-1', 'dall-e-3'],
      modes: Object.keys(ENHANCEMENT_PROMPTS),
      quality: ['low', 'medium', 'high'],
      input_fidelity: 'high'
    }
  });
}