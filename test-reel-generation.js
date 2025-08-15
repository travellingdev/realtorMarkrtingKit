// Test script to debug reel generation format
const fetch = require('node-fetch');

async function testReelGeneration() {
  console.log('🎬 Testing Reel Script Generation...\n');
  
  // Test payload with photos
  const withPhotosPayload = {
    payload: {
      address: "123 Test Street",
      beds: "3",
      baths: "2",
      sqft: "2000",
      neighborhood: "Test Valley",
      features: ["Chef's kitchen", "Hardwood floors", "Pool"],
      photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
      propertyType: "Family Home",
      tone: "Professional"
    },
    controls: {
      channels: ["reel"],
      plan: "FREE"
    }
  };
  
  // Test payload without photos
  const withoutPhotosPayload = {
    payload: {
      address: "456 Demo Avenue",
      beds: "4",
      baths: "3",
      sqft: "2500",
      neighborhood: "Demo Hills",
      features: ["Updated kitchen", "New roof", "Large yard"],
      photos: [],
      propertyType: "Luxury Estate",
      tone: "Warm"
    },
    controls: {
      channels: ["reel"],
      plan: "FREE"
    }
  };
  
  // Mock the provider call to see what prompt is being sent
  console.log('📝 TESTING WITH PHOTOS:');
  console.log('Payload:', JSON.stringify(withPhotosPayload, null, 2));
  console.log('\n---\n');
  
  console.log('📝 TESTING WITHOUT PHOTOS:');
  console.log('Payload:', JSON.stringify(withoutPhotosPayload, null, 2));
  
  // Now let's check what the current pipeline would generate
  try {
    // Import the pipeline functions
    const { buildFacts } = require('./lib/ai/pipeline');
    const { buildPropertyContext } = require('./lib/ai/propertyInsights');
    
    console.log('\n🔍 CHECKING PROMPT GENERATION:\n');
    
    // Test with photos (photoInsights would be undefined in this test)
    const factsWithPhotos = buildFacts(withPhotosPayload.payload);
    console.log('Facts with photos:', factsWithPhotos);
    
    // Test without photos - this should trigger property context
    const factsWithoutPhotos = buildFacts(withoutPhotosPayload.payload);
    const propertyContext = buildPropertyContext(factsWithoutPhotos, withoutPhotosPayload.controls);
    
    console.log('\n📄 PROPERTY CONTEXT (first 1000 chars):');
    console.log(propertyContext.substring(0, 1000));
    
    // Look for SHOT instructions in the context
    console.log('\n🎯 CHECKING FOR SHOT INSTRUCTIONS:');
    const shotLines = propertyContext.split('\n').filter(line => 
      line.toLowerCase().includes('shot') || 
      line.includes('VOICE:') || 
      line.includes('TEXT:')
    );
    
    shotLines.forEach(line => {
      console.log('  >', line.substring(0, 150));
    });
    
    // Check the exact format being requested
    console.log('\n📋 REEL FORMAT INSTRUCTIONS:');
    const formatLines = propertyContext.split('\n').filter(line => 
      line.includes('[0-3s]') || 
      line.includes('[4-10s]') || 
      line.includes('[11-20s]') || 
      line.includes('[21-30s]')
    );
    
    formatLines.forEach(line => {
      console.log('  >', line);
    });
    
  } catch (error) {
    console.error('Error during test:', error.message);
  }
}

// Run the test
testReelGeneration().catch(console.error);