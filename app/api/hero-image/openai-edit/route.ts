import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import sharp from 'sharp';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Enhancement prompts for each mode
const ENHANCEMENT_PROMPTS = {
  'listing-ready': `Exact same property photo but 30% brighter with better contrast. Keep all architectural details identical. Professional real estate photo.`,
  
  'staging': `Add modern virtual staging furniture to this empty room. Make it look lived-in and welcoming.`
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      imageUrl, 
      mode = 'listing-ready',
      enhancement = 'brightness' // Can be used for specific enhancements
    } = body;
    
    console.log('[OpenAI Edit] Starting image editing:', {
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
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('[OpenAI Edit] No API key configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }
    
    // Declare variables outside try block for access in catch
    let imageFile: File;
    let maskFile: File;
    let prompt: string;
    
    try {
      // Handle different image URL formats
      let imageBuffer: Buffer;
      
      if (imageUrl.startsWith('blob:')) {
        // Blob URLs can't be fetched server-side
        console.error('[OpenAI Edit] Blob URL received - need base64 or regular URL');
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
      
      // Convert JPEG to PNG and resize to 1024x1024 (DALL-E requirements)
      console.log('[OpenAI Edit] Converting and resizing image to 1024x1024 PNG for DALL-E...');
      const pngBuffer = await sharp(imageBuffer)
        .resize(1024, 1024, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toBuffer();
      
      // Convert to File object for OpenAI
      // Use Uint8Array to ensure compatibility
      const imageArray = new Uint8Array(pngBuffer);
      imageFile = new File([imageArray], 'image.png', { type: 'image/png' });
      
      // Determine the prompt based on mode and enhancement
      prompt = ENHANCEMENT_PROMPTS[mode as keyof typeof ENHANCEMENT_PROMPTS] || ENHANCEMENT_PROMPTS['listing-ready'];
      
      // Add enhancement-specific instructions if needed
      if (enhancement === 'twilight') {
        prompt += '\nConvert to golden hour/twilight lighting with warm glow.';
      } else if (enhancement === 'sky') {
        prompt += '\nReplace overcast sky with bright blue sky and white clouds.';
      } else if (enhancement === 'seasonal') {
        prompt += '\nAdd seasonal appeal with appropriate foliage and decorations.';
      }
      
      console.log('[OpenAI Edit] Creating strategic mask for DALL-E edit');
      
      // Test with fully transparent mask to see if it can enhance while seeing original
      console.log('[OpenAI Edit] Creating fully transparent mask for complete enhancement...');
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
      maskFile = new File([maskArray], 'mask.png', { type: 'image/png' });
      
      // Try using gpt-image-1 model for better editing
      console.log('[OpenAI Edit] Trying gpt-image-1 model for editing...');
      
      // Call image edit API with gpt-image-1 model with high input fidelity
      const response = await openai.images.edit({
        model: "gpt-image-1",  // Latest model with better editing
        image: imageFile,
        mask: maskFile,
        prompt: prompt,  // Use the specific prompt without additions
        input_fidelity: "high",  // Preserve original image details
        quality: "high",  // High quality for best results
        n: 1,
        size: "1024x1024",
      } as any);
      
      console.log('[OpenAI Edit] DALL-E response received');
      
      if (response.data && response.data[0]?.url) {
        return NextResponse.json({
          success: true,
          editedUrl: response.data[0].url,
          mode: mode,
          prompt: prompt,
          message: 'Image enhanced with AI editing',
          model: 'gpt-image-1'
        });
      } else {
        throw new Error('No image URL in response');
      }
      
    } catch (openAIError: any) {
      console.error('[OpenAI Edit] DALL-E API error:', openAIError);
      
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
      
      // If gpt-image-1 fails, try dall-e-2 as fallback
      console.log('[OpenAI Edit] gpt-image-1 failed, trying dall-e-2 as fallback...');
      
      try {
        // Try with dall-e-2 model (no input_fidelity parameter for dall-e-2)
        const fallbackResponse = await openai.images.edit({
          model: "dall-e-2",
          image: imageFile,
          mask: maskFile,
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        });
        
        if (fallbackResponse.data && fallbackResponse.data[0]?.url) {
          return NextResponse.json({
            success: true,
            editedUrl: fallbackResponse.data[0].url,
            mode: mode,
            prompt: prompt,
            message: 'Image edited with DALL-E 2 (fallback)',
            model: 'dall-e-2'
          });
        }
      } catch (fallbackError) {
        console.error('[OpenAI Edit] DALL-E 2 fallback also failed:', fallbackError);
      }
      
      // If both models fail, try generation as last resort
      console.log('[OpenAI Edit] Both edit models failed, trying generation...');
      
      try {
        const generationPrompt = `Real estate photo: ${ENHANCEMENT_PROMPTS[mode as keyof typeof ENHANCEMENT_PROMPTS] || ENHANCEMENT_PROMPTS['listing-ready']}. Photorealistic, professional quality.`;
        
        const generationResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: generationPrompt,
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
            prompt: generationPrompt,
            message: 'Image generated with AI (edit not available)',
            fallback: true,
            model: 'dall-e-3'
          });
        }
      } catch (genError) {
        console.error('[OpenAI Edit] Generation fallback also failed:', genError);
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to edit image with AI',
          details: openAIError?.message || 'Unknown error'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[OpenAI Edit] Error:', error);
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
      ? 'OpenAI API is configured' 
      : 'OpenAI API key not found in environment variables'
  });
}