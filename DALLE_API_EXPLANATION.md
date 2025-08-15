# DALL-E API Endpoints Explained

## Understanding the Three DALL-E APIs

### 1. **Image Generation** (`images.generate`)
```javascript
openai.images.generate({
  model: "dall-e-3",
  prompt: "A beautiful modern house with perfect lighting",
  n: 1,
  size: "1024x1024"
})
```
- **Purpose**: Create brand new images from text
- **Input**: Text prompt only
- **Output**: Completely new AI-generated images
- **Use Case**: Creating marketing visuals from descriptions

### 2. **Image Edit** (`images.edit`)
```javascript
openai.images.edit({
  model: "dall-e-2",
  image: originalImage,
  mask: maskImage,
  prompt: "Blue sky with white clouds",
  n: 1,
  size: "1024x1024"
})
```
- **Purpose**: Replace/regenerate specific parts of an image
- **Input**: Original image + mask + prompt
- **How it works**:
  - Transparent pixels in mask = areas to regenerate
  - Opaque pixels in mask = areas to keep unchanged
  - Prompt describes what to CREATE in transparent areas
- **Important**: The prompt does NOT enhance, it REPLACES
- **Use Case**: Removing objects, changing backgrounds, adding elements

### 3. **Image Variations** (`images.createVariation`)
```javascript
openai.images.createVariation({
  model: "dall-e-2",
  image: originalImage,
  n: 2,
  size: "1024x1024"
})
```
- **Purpose**: Create similar but different versions
- **Input**: Image only (NO PROMPT)
- **Output**: AI's interpretation of "similar" images
- **Use Case**: Exploring artistic variations

## Why Edit API Doesn't Work for "Make it Bright"

When you use the edit API with a fully transparent mask and prompt "Make it bright":
1. DALL-E sees the entire image should be regenerated (fully transparent)
2. It creates a NEW image based on "Make it bright"
3. It doesn't know what the original subject was
4. Result: A completely different bright image

When you use it with only sky transparent and prompt "Make it bright Beautiful blue sky":
1. DALL-E only regenerates the sky area
2. Rest of image stays exactly the same
3. Result: Same house with a new sky

## What We Actually Need for Real Estate Enhancement

**We need to ENHANCE, not REGENERATE**. Options:

### Option 1: Professional Photo Enhancement (Implemented)
- Use Sharp library for adjustments
- Brightness, contrast, saturation controls
- Preserves original image exactly
- Fast and predictable

### Option 2: AI Style Transfer (Future)
- Would need a different AI service
- Services like Imagen AI, Autoenhance.ai
- Designed specifically for photo enhancement

### Option 3: Creative Variations (Current DALL-E)
- Use variations API for artistic interpretations
- No control over specific enhancements
- Unpredictable results

## Current Implementation

```javascript
// When "Use Realistic Enhancement" is ON:
'/api/hero-image/enhance' // Sharp-based adjustments

// When "Use Realistic Enhancement" is OFF:
'/api/hero-image/openai-variations' // DALL-E variations (no prompt control)
```

## The Bottom Line

- **DALL-E Edit**: For replacing parts of images with AI-generated content
- **DALL-E Variations**: For creating similar artistic variations
- **Neither**: Can do controlled enhancement like "make it 20% brighter"
- **Sharp/Canvas**: Best for actual photo adjustments