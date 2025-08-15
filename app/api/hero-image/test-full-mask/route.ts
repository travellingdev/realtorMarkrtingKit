import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import sharp from 'sharp';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, instruction = "make it 30% brighter" } = body;
    
    console.log('[Test Full Mask] Testing with instruction:', instruction);
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    // Handle image loading
    let imageBuffer: Buffer;
    if (imageUrl.startsWith('data:')) {
      const base64Data = imageUrl.split(',')[1];
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      const response = await fetch(imageUrl);
      imageBuffer = Buffer.from(await response.arrayBuffer());
    }
    
    // Convert to PNG
    const pngBuffer = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: 'cover', position: 'center' })
      .png()
      .toBuffer();
    
    const imageFile = new File([new Uint8Array(pngBuffer)], 'image.png', { type: 'image/png' });
    
    // Create fully transparent mask
    const maskBuffer = await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Fully transparent
      }
    }).png().toBuffer();
    
    const maskFile = new File([new Uint8Array(maskBuffer)], 'mask.png', { type: 'image/png' });
    
    // Test different prompts
    const prompts = {
      'make it brighter': 'Exact same real estate photo but significantly brighter. Keep every architectural detail identical.',
      'make it 30% brighter': 'Same property, same angle, same everything, but increase brightness by 30%. Professional real estate photo.',
      'enhance brightness': 'Enhance brightness and exposure while keeping the exact same property and composition.',
      'improve lighting': 'Improve lighting and brightness. Keep architecture, composition, and all details exactly the same.',
    };
    
    const prompt = prompts[instruction as keyof typeof prompts] || instruction;
    
    console.log('[Test Full Mask] Using prompt:', prompt);
    
    try {
      // Try with gpt-image-1 and high fidelity
      const response = await openai.images.edit({
        model: "gpt-image-1",
        image: imageFile,
        mask: maskFile,
        prompt: prompt,
        input_fidelity: "high",
        quality: "high",
        n: 1,
        size: "1024x1024",
      } as any);
      
      if (response.data && response.data[0]?.url) {
        return NextResponse.json({
          success: true,
          editedUrl: response.data[0].url,
          prompt: prompt,
          message: 'Test complete with full mask',
          details: {
            maskType: 'fully transparent (edit everything)',
            model: 'gpt-image-1',
            input_fidelity: 'high',
            instruction: instruction
          }
        });
      }
    } catch (error: any) {
      console.error('[Test Full Mask] Error:', error);
      
      // Try dall-e-2 as fallback
      try {
        const response = await openai.images.edit({
          model: "dall-e-2",
          image: imageFile,
          mask: maskFile,
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        });
        
        if (response.data && response.data[0]?.url) {
          return NextResponse.json({
            success: true,
            editedUrl: response.data[0].url,
            prompt: prompt,
            message: 'Test complete with dall-e-2',
            details: {
              maskType: 'fully transparent',
              model: 'dall-e-2',
              instruction: instruction
            }
          });
        }
      } catch (fallbackError) {
        console.error('[Test Full Mask] Fallback error:', fallbackError);
      }
    }
    
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    
  } catch (error) {
    console.error('[Test Full Mask] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}