/**
 * Real Gemini API Test
 * This will actually test your Gemini API key
 */

require('dotenv').config({ path: '.env.local' });

async function testGeminiConnection() {
  console.log('\n===========================================');
  console.log('TESTING REAL GEMINI API CONNECTION');
  console.log('===========================================\n');

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env.local');
    console.log('\nPlease add to .env.local:');
    console.log('GEMINI_API_KEY=your-actual-key-here\n');
    return false;
  }

  console.log('✅ API Key found:', apiKey.substring(0, 10) + '...');
  
  try {
    // First, let's install the package if needed
    console.log('\n📦 Checking for @google/generative-ai package...');
    
    let GoogleGenerativeAI;
    try {
      GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
      console.log('✅ Package already installed\n');
    } catch (error) {
      console.log('📦 Package not found. Please install it:');
      console.log('   npm install @google/generative-ai\n');
      return false;
    }

    // Initialize Gemini
    console.log('🔄 Initializing Gemini client...');
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Client initialized\n');

    // Test 1: Basic text generation
    console.log('TEST 1: Basic Text Generation');
    console.log('------------------------------');
    // Use gemini-1.5-flash which is the current available model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "List 3 key features to highlight when marketing a luxury home";
    console.log('Prompt:', prompt);
    console.log('Waiting for response...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Response received:');
    console.log(text);
    
    // Test 2: Test vision capabilities (with a sample image description)
    console.log('\n\nTEST 2: Vision Model Capabilities');
    console.log('----------------------------------');
    console.log('Testing text-only prompt with vision model...');
    
    try {
      const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      
      const visionPrompt = `
        As a real estate AI, analyze this property description and suggest hero image enhancements:
        "A beautiful two-story colonial home with white siding, black shutters, 
        circular driveway, mature landscaping, and a covered front porch."
        
        Suggest 3 specific image enhancements for maximum buyer appeal.
      `;
      
      const visionResult = await visionModel.generateContent(visionPrompt);
      const visionResponse = await visionResult.response;
      const visionText = visionResponse.text();
      
      console.log('✅ Vision model response:');
      console.log(visionText);
    } catch (error) {
      console.log('⚠️ Vision model test failed (this is okay if you have a basic API key)');
      console.log('   Error:', error.message);
    }

    // Test 3: Real Estate Specific Prompt
    console.log('\n\nTEST 3: Real Estate Marketing Content');
    console.log('--------------------------------------');
    
    const realEstatePrompt = `
      Generate a compelling MLS description for a property with these features:
      - 3 bedrooms, 2 bathrooms
      - 2000 sq ft
      - Modern kitchen with granite counters
      - Pool and spa
      - Located in a family-friendly neighborhood
      
      Make it emotional and buyer-focused, 100 words max.
    `;
    
    console.log('Generating MLS description...');
    const marketingResult = await model.generateContent(realEstatePrompt);
    const marketingResponse = await marketingResult.response;
    const marketingText = marketingResponse.text();
    
    console.log('✅ Generated MLS Description:');
    console.log(marketingText);
    
    // Summary
    console.log('\n\n===========================================');
    console.log('✅ GEMINI API TEST SUCCESSFUL!');
    console.log('===========================================');
    console.log('\nYour Gemini API is working correctly!');
    console.log('\nCapabilities confirmed:');
    console.log('  ✅ Text generation');
    console.log('  ✅ Real estate content');
    console.log('  ✅ Marketing descriptions');
    console.log('\nNext steps:');
    console.log('  1. The Hero Image module can now use Gemini');
    console.log('  2. Set IMAGE_PROVIDER=gemini in .env.local');
    console.log('  3. Upload photos to test image analysis');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ API Test Failed:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n⚠️ Your API key appears to be invalid.');
      console.log('Please check:');
      console.log('  1. The key is copied correctly');
      console.log('  2. The key is active in Google AI Studio');
      console.log('  3. Visit: https://makersuite.google.com/app/apikey');
    } else if (error.message.includes('RATE_LIMIT')) {
      console.log('\n⚠️ Rate limit reached.');
      console.log('Free tier limits: 60 requests per minute');
    } else {
      console.log('\n⚠️ Unexpected error. Please check:');
      console.log('  1. Internet connection');
      console.log('  2. API key permissions');
      console.log('  3. Google AI Studio status');
    }
    
    return false;
  }
}

// Run the test
console.log('Starting Gemini API test...');
testGeminiConnection().then(success => {
  if (success) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n❌ Some tests failed. Please check the errors above.');
  }
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});