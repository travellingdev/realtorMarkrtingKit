/**
 * Test script to verify enhanced no-photo content generation
 * Run with: node test-no-photo-generation.js
 */

async function testNoPhotoGeneration() {
  console.log('🧪 Testing enhanced no-photo content generation...\n');

  // Test basic property facts (similar to what a user might enter)
  const testPayload = {
    address: "123 Maple Street",
    beds: "3",
    baths: "2",
    sqft: "1850",
    neighborhood: "Brookfield Heights",
    features: ["Updated kitchen", "Hardwood floors", "Fenced yard", "Two-car garage"],
    photos: [], // No photos provided
    propertyType: "Family Home",
    tone: "Warm & Lifestyle",
    brandVoice: "Friendly, professional, and approachable"
  };

  const controls = {
    channels: ['mls', 'instagram', 'reel', 'email'],
    openHouseDate: "Saturday, November 16th",
    openHouseTime: "1:00 PM - 3:00 PM",
    ctaType: "phone",
    ctaPhone: "(555) 123-4567",
    useEmojis: true,
    mlsFormat: "paragraph"
  };

  try {
    console.log('📝 Sending request to /api/generate...');
    
    const response = await fetch('http://localhost:3006/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: testPayload,
        controls: controls,
        anonymousId: 'test-no-photos-' + Date.now()
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API request failed:', response.status, errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ Generation completed!\n');

    // Check if we got outputs
    if (result.outputs) {
      console.log('📊 RESULTS ANALYSIS:');
      console.log('===================');
      
      // Check MLS content
      if (result.outputs.mlsDesc) {
        console.log('\n🏠 MLS DESCRIPTION:');
        console.log('Length:', result.outputs.mlsDesc.length, 'characters');
        console.log('Preview:', result.outputs.mlsDesc.substring(0, 150) + '...');
        
        // Check for conversion elements
        const hasEmotionalHook = /picture|imagine|perfect|dream|stunning/i.test(result.outputs.mlsDesc);
        const hasFeatures = testPayload.features.some(f => result.outputs.mlsDesc.toLowerCase().includes(f.toLowerCase()));
        const hasLocation = result.outputs.mlsDesc.toLowerCase().includes(testPayload.neighborhood.toLowerCase());
        
        console.log('✓ Emotional language:', hasEmotionalHook ? '✅' : '❌');
        console.log('✓ User features included:', hasFeatures ? '✅' : '❌');
        console.log('✓ Location mentioned:', hasLocation ? '✅' : '❌');
      } else {
        console.log('\n❌ No MLS content generated');
      }

      // Check Instagram content
      if (result.outputs.igSlides && result.outputs.igSlides.length > 0) {
        console.log('\n📱 INSTAGRAM SLIDES:');
        console.log('Count:', result.outputs.igSlides.length, 'slides');
        console.log('Slides preview:');
        result.outputs.igSlides.forEach((slide, i) => {
          console.log(`  ${i + 1}. ${slide.substring(0, 60)}...`);
        });
        
        // Check for viral engagement elements
        const firstSlide = result.outputs.igSlides[0]?.toLowerCase() || '';
        const lastSlide = result.outputs.igSlides[result.outputs.igSlides.length - 1]?.toLowerCase() || '';
        
        const hasViralHook = /pov|tell me|this house|when you/i.test(firstSlide);
        const hasEngagementBait = /swipe|dm|comment|tag/i.test(lastSlide);
        
        console.log('✓ Viral hook format:', hasViralHook ? '✅' : '❌');
        console.log('✓ Engagement bait:', hasEngagementBait ? '✅' : '❌');
      } else {
        console.log('\n❌ No Instagram content generated');
      }

      // Check Reel content
      if (result.outputs.reelScript && result.outputs.reelScript.length > 0) {
        console.log('\n🎬 REEL SCRIPT:');
        console.log('Segments:', result.outputs.reelScript.length);
        result.outputs.reelScript.forEach((segment, i) => {
          if (typeof segment === 'object' && segment.voice) {
            console.log(`  ${i + 1}. [${segment.time}] Voice: ${segment.voice.substring(0, 60)}...`);
            console.log(`      Text: ${segment.text}`);
            console.log(`      Shot: ${segment.shot.substring(0, 60)}...`);
          } else {
            console.log(`  ${i + 1}. ${String(segment).substring(0, 100)}...`);
          }
        });
        
        // Check reel structure
        const hasProperStructure = result.outputs.reelScript.length === 4;
        const hasObjectFormat = typeof result.outputs.reelScript[0] === 'object';
        const allSegmentsComplete = result.outputs.reelScript.every(seg => 
          typeof seg === 'object' && seg.voice && seg.text && seg.shot
        );
        
        console.log('✓ 4 segments:', hasProperStructure ? '✅' : '❌');
        console.log('✓ Object format:', hasObjectFormat ? '✅' : '❌');
        console.log('✓ Complete segments:', allSegmentsComplete ? '✅' : '❌');
      } else {
        console.log('\n❌ No reel content generated');
      }

      // Check Email content
      if (result.outputs.emailSubject && result.outputs.emailBody) {
        console.log('\n📧 EMAIL CONTENT:');
        console.log('Subject:', result.outputs.emailSubject);
        console.log('Body length:', result.outputs.emailBody.length, 'characters');
        console.log('Body preview:', result.outputs.emailBody.substring(0, 150) + '...');
        
        // Check email structure
        const hasGreeting = /hi there|hello/i.test(result.outputs.emailBody);
        const hasSignature = /best,|sincerely,|your realtor/i.test(result.outputs.emailBody);
        const hasCTA = /call|contact|schedule|reply|viewing|showing/i.test(result.outputs.emailBody);
        
        console.log('✓ Proper greeting:', hasGreeting ? '✅' : '❌');
        console.log('✓ Professional signature:', hasSignature ? '✅' : '❌');
        console.log('✓ Clear call-to-action:', hasCTA ? '✅' : '❌');
      } else {
        console.log('\n❌ No email content generated');
      }

      // Check photo insights (should be property-based now)
      if (result.photo_insights) {
        console.log('\n🧠 PROPERTY-BASED INSIGHTS:');
        console.log('Features found:', result.photo_insights.features?.length || 0);
        console.log('Conversion hooks:', result.photo_insights.conversionHooks?.length || 0);
        console.log('Buyer profile:', result.photo_insights.buyerProfile || 'none');
        console.log('Property category:', result.photo_insights.propertyCategory || 'none');
        console.log('Marketing priority:', result.photo_insights.marketingPriority || 'none');
        
        if (result.photo_insights.conversionHooks?.length > 0) {
          console.log('Sample hook:', result.photo_insights.conversionHooks[0]);
        }
      } else {
        console.log('\n❌ No property insights generated');
      }

      console.log('\n🎯 OVERALL ASSESSMENT:');
      const hasRichContent = result.outputs.mlsDesc?.length > 200;
      const hasMultipleChannels = [result.outputs.mlsDesc, result.outputs.igSlides?.length, result.outputs.reelScript?.length, result.outputs.emailBody].filter(Boolean).length >= 3;
      const hasPropertyInsights = result.photo_insights?.conversionHooks?.length > 0;
      const hasReelContent = result.outputs.reelScript?.length === 4;
      
      console.log('✓ Rich content (>200 chars):', hasRichContent ? '✅' : '❌');
      console.log('✓ Multiple channels (3+):', hasMultipleChannels ? '✅' : '❌');
      console.log('✓ Property-based psychology:', hasPropertyInsights ? '✅' : '❌');
      console.log('✓ Reel script generated:', hasReelContent ? '✅' : '❌');
      
      if (hasRichContent && hasMultipleChannels && hasPropertyInsights && hasReelContent) {
        console.log('\n🎉 SUCCESS: Enhanced no-photo generation is working including reels!');
      } else {
        console.log('\n⚠️  ISSUES: Some aspects of no-photo generation need improvement');
      }

    } else if (result.kitId) {
      console.log('📋 Generation queued with ID:', result.kitId);
      console.log('💡 This suggests authenticated user flow - outputs will be available after polling');
    } else {
      console.log('❌ Unexpected response format:', result);
    }

  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testNoPhotoGeneration();
}

module.exports = { testNoPhotoGeneration };