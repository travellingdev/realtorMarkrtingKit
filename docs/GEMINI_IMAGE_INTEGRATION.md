# Gemini API Integration for Image Generation

## Overview
Google's Gemini API offers powerful multimodal capabilities, including image generation through Imagen 3. Let's explore how to integrate it instead of DALL-E.

## Gemini vs DALL-E Comparison

| Feature | Gemini (Imagen 3) | DALL-E 3 |
|---------|-------------------|----------|
| **Pricing** | $0.002/image (1024x1024) | $0.040/image (1024x1024) |
| **Speed** | ~3-5 seconds | ~5-10 seconds |
| **Quality** | Excellent photorealism | Excellent artistic style |
| **API Availability** | Google Cloud Platform | OpenAI API |
| **Real Estate Focus** | Good architectural detail | Good lifestyle imagery |
| **Rate Limits** | 60 requests/minute | 5 images/minute |
| **Editing Capabilities** | Inpainting, Outpainting | Limited editing |

## Gemini Setup Requirements

### 1. API Access
```bash
# Google Cloud Project Setup
1. Create a Google Cloud Project
2. Enable Vertex AI API
3. Enable Gemini API (Imagen 3)
4. Create Service Account
5. Download credentials JSON
```

### 2. Environment Variables
```env
# .env.local
GOOGLE_APPLICATION_CREDENTIALS=./credentials/gemini-service-account.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GEMINI_API_KEY=your-api-key
GEMINI_MODEL=imagen-3  # or gemini-pro-vision for analysis
```

### 3. Installation
```bash
npm install @google-cloud/aiplatform
npm install @google/generative-ai
```

## Implementation Plan

### Phase 1: Image Analysis with Gemini
```typescript
// lib/features/heroImage/geminiAnalyzer.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzePhotoWithGemini(photoUrl: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
  const prompt = `
    Analyze this real estate photo for marketing purposes:
    1. Room type and key features
    2. Lighting quality (1-10)
    3. Composition score (1-10)
    4. Marketing potential (1-10)
    5. Best enhancement suggestions
    6. Target buyer appeal
    
    Return as JSON.
  `;
  
  const result = await model.generateContent([
    prompt,
    { inlineData: { data: photoUrl, mimeType: "image/jpeg" } }
  ]);
  
  return JSON.parse(result.response.text());
}
```

### Phase 2: Image Generation with Imagen 3
```typescript
// lib/features/heroImage/geminiGenerator.ts
import { VertexAI } from '@google-cloud/aiplatform';

const vertex = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID!,
  location: 'us-central1',
});

export async function generateHeroImageWithGemini({
  baseImage,
  enhancement,
  propertyType
}: {
  baseImage: string;
  enhancement: 'twilight' | 'blue-sky' | 'staging' | 'seasonal';
  propertyType: string;
}) {
  const model = vertex.preview.getGenerativeModel({
    model: 'imagen-3',
  });
  
  const prompts = {
    'twilight': `Transform this ${propertyType} exterior photo to golden hour/twilight with warm lighting, enhanced sky, professional real estate photography style`,
    'blue-sky': `Replace overcast sky with bright blue sky, few white clouds, enhance lighting, maintain architectural accuracy`,
    'staging': `Add modern furniture and decor to this empty room, contemporary style, warm and inviting, professional staging`,
    'seasonal': `Convert to autumn/fall season with colorful foliage, seasonal decorations, warm tones`,
  };
  
  const imageRequest = {
    prompt: prompts[enhancement],
    image: baseImage, // base64 encoded
    numImages: 1,
    aspectRatio: '16:9',
    outputConfig: {
      mimeType: 'image/jpeg',
      quality: 95,
    },
    safetySettings: {
      category: 'REAL_ESTATE',
      threshold: 'BLOCK_NONE',
    },
  };
  
  const response = await model.generateImages(imageRequest);
  return response.images[0];
}
```

### Phase 3: Advanced Editing with Gemini
```typescript
// lib/features/heroImage/geminiEditor.ts

export interface EditRequest {
  image: string;
  mask?: string; // For inpainting
  instruction: string;
}

export async function editImageWithGemini({
  image,
  mask,
  instruction
}: EditRequest) {
  // Imagen 3 supports:
  // 1. Inpainting - Replace specific areas
  // 2. Outpainting - Extend image boundaries
  // 3. Style Transfer - Change artistic style
  // 4. Object Removal - Remove unwanted elements
  
  const editRequest = {
    baseImage: image,
    mask: mask,
    prompt: instruction,
    editMode: mask ? 'inpaint' : 'instruct',
  };
  
  const response = await model.editImage(editRequest);
  return response.editedImage;
}
```

## Real Estate Specific Prompts

### Best Prompts for Property Enhancement
```typescript
const REAL_ESTATE_PROMPTS = {
  exterior: {
    luxury: "Professional twilight real estate photography, golden hour lighting, dramatic sky, upscale residential, architectural digest quality",
    family: "Bright sunny day, blue sky, green lawn, welcoming family home, professional real estate photo",
    modern: "Contemporary architecture, dramatic lighting, minimalist landscape, professional photography",
  },
  
  interior: {
    staging: "Professionally staged, modern furniture, warm lighting, inviting atmosphere, high-end real estate photography",
    empty: "Clean, bright, spacious empty room, natural light, move-in ready, professional real estate photo",
    kitchen: "Gourmet kitchen, styled with fresh flowers and fruit, warm lighting, professional interior photography",
  },
  
  enhancements: {
    sky: "Replace sky with perfect blue sky, scattered white clouds, maintain all architectural details exactly",
    lighting: "Enhance natural lighting, brighten shadows, maintain realistic appearance, professional quality",
    lawn: "Lush green lawn, well-maintained landscaping, enhance curb appeal",
    remove: "Remove [object], maintain photorealistic quality, seamless editing",
  }
};
```

## Cost Analysis

### Gemini Pricing (More Affordable)
```
Image Generation (Imagen 3):
- 1024x1024: $0.002 per image
- 2048x2048: $0.008 per image

Image Analysis (Gemini Pro Vision):
- $0.00025 per image analyzed

Monthly cost for 1000 generations:
- Gemini: $2.00 + $0.25 = $2.25
- DALL-E: $40.00 + analysis via GPT-4 = ~$45
```

## Integration with Current System

### 1. Update Config
```typescript
// lib/features/heroImage/config.ts
export const HERO_IMAGE_CONFIG = {
  // ...existing config
  
  provider: process.env.IMAGE_PROVIDER || 'gemini', // 'gemini' or 'openai'
  
  gemini: {
    model: 'imagen-3',
    maxRetries: 3,
    timeout: 10000,
    defaultQuality: 95,
  },
};
```

### 2. Update API Route
```typescript
// app/api/hero-image/generate/route.ts
import { generateHeroImageWithGemini } from '@/lib/features/heroImage/geminiGenerator';
import { generateHeroImageWithDALLE } from '@/lib/features/heroImage/dalleGenerator';

export async function POST(req: Request) {
  const { provider } = HERO_IMAGE_CONFIG;
  
  if (provider === 'gemini') {
    return await generateHeroImageWithGemini(params);
  } else {
    return await generateHeroImageWithDALLE(params);
  }
}
```

## Safety & Compliance

### Gemini Safety Features
```typescript
const safetySettings = {
  // Gemini provides built-in safety for:
  harmCategory: {
    HARM_CATEGORY_HATE_SPEECH: 'BLOCK_NONE',
    HARM_CATEGORY_DANGEROUS_CONTENT: 'BLOCK_NONE',
    HARM_CATEGORY_HARASSMENT: 'BLOCK_NONE',
    HARM_CATEGORY_SEXUALLY_EXPLICIT: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  
  // Real estate specific
  realEstateCompliance: {
    noMisleadingEnhancements: true,
    preserveArchitecturalAccuracy: true,
    virtualStagingWatermark: true,
  }
};
```

## Advantages of Gemini for Real Estate

1. **Cost Effective**: 20x cheaper than DALL-E
2. **Better Photorealism**: Imagen 3 excels at realistic photos
3. **Faster Generation**: 3-5 seconds vs 5-10 seconds
4. **Better Editing**: Inpainting and outpainting support
5. **Google Integration**: Works with Google Street View, Maps
6. **Higher Rate Limits**: 60/min vs 5/min

## Implementation Timeline

### Week 1: Setup & Analysis
- [ ] Set up Google Cloud Project
- [ ] Implement Gemini photo analysis
- [ ] Test scoring algorithm with Gemini

### Week 2: Generation
- [ ] Implement Imagen 3 generation
- [ ] Create enhancement presets
- [ ] Test with real property photos

### Week 3: Advanced Features
- [ ] Implement inpainting (remove objects)
- [ ] Add outpainting (extend views)
- [ ] Create style variations

### Week 4: Optimization
- [ ] Implement caching
- [ ] Add batch processing
- [ ] Performance optimization

## Sample Implementation

```typescript
// Complete example
async function enhancePropertyPhoto(
  photoUrl: string,
  enhancement: string,
  propertyType: string
) {
  try {
    // Step 1: Analyze with Gemini Vision
    const analysis = await analyzePhotoWithGemini(photoUrl);
    
    // Step 2: Generate enhanced version with Imagen 3
    if (analysis.score > 70) {
      const enhanced = await generateHeroImageWithGemini({
        baseImage: photoUrl,
        enhancement: enhancement as any,
        propertyType,
      });
      
      return {
        original: photoUrl,
        enhanced,
        analysis,
        cost: 0.002, // $0.002 per image
      };
    }
    
    return {
      error: 'Photo quality too low for enhancement',
      analysis,
    };
  } catch (error) {
    console.error('Gemini enhancement failed:', error);
    throw error;
  }
}
```

## Next Steps

1. **Get API Access**: Apply for Vertex AI / Imagen 3 access
2. **Test Integration**: Start with photo analysis using Gemini Pro Vision
3. **Gradual Rollout**: Test with small subset before full deployment
4. **Monitor Costs**: Track usage and optimize prompts

Gemini offers a more cost-effective and powerful solution for real estate image enhancement compared to DALL-E, with better photorealism and editing capabilities.