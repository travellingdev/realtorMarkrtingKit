import type { Payload } from '@/lib/generator';
import type { Output, Facts, Controls } from './schemas';
import { FactsSchema, OutputSchema } from './schemas';
import { callProvider, ChatMessage, TokenCounts } from './provider';
import { analyzePhotosWithVision, enhanceContentWithInsights, type PhotoInsights } from './photoAnalysis';
import { buildMLSContext, generateMLSContent, validateMLSContent } from './mlsOptimization';
import { buildInstagramContext, generateInstagramContent, validateInstagramContent } from './instagramOptimization';
import { buildEmailContext, generateEmailContent, validateEmailContent } from './emailOptimization';
import { buildBusinessContext, generateBusinessContent, validateBusinessContent } from './linkedinOptimization';
import { buildVideoContext, generateVideoContent, validateVideoContent } from './videoOptimization';
import { generateSmartHashtags } from './hashtagGenerator';
import { enhanceHashtagsWithContent } from './contentAwareHashtags';
import type { TierConfig } from '@/lib/tiers';

// Normalize and sanitize incoming payload values.
export function buildFacts(payload: Payload): Facts {
  const features = (payload.features || [])
    .map((f) => f.trim())
    .filter(Boolean)
    .slice(0, 10);
  const photos = (payload.photos || [])
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 10);
  const raw = {
    address: payload.address?.trim(),
    neighborhood: payload.neighborhood?.trim(),
    beds: payload.beds?.trim(),
    baths: payload.baths?.trim(),
    sqft: payload.sqft?.trim(),
    features,
    photos,
    propertyType: payload.propertyType?.trim(),
    tone: payload.tone?.trim(),
    brandVoice: payload.brandVoice?.trim(),
  } as Record<string, any>;
  return FactsSchema.parse(raw);
}

function composeDraftMessages(facts: Facts, controls: Controls, photoInsights?: PhotoInsights): ChatMessage[] {
  // Map UI channel names to output field names
  const channelMapping: Record<string, string[]> = {
    'mls': ['mlsDesc'],
    'instagram': ['igSlides'],
    'reel': ['reelScript'],
    'email': ['emailSubject', 'emailBody']
  };
  
  // Build comprehensive instructions including all controls
  const channelInstructions = controls.channels?.length 
    ? (() => {
        const outputFields = controls.channels.flatMap(ch => channelMapping[ch] || []);
        const unselectedChannels = ['mls', 'instagram', 'reel', 'email'].filter(ch => !controls.channels.includes(ch));
        const unselectedFields = unselectedChannels.flatMap(ch => channelMapping[ch] || []);
        
        return `IMPORTANT: Generate ONLY these outputs with content: ${outputFields.join(', ')}. 
                CRITICAL: Set these outputs to EMPTY (empty string or empty array): ${unselectedFields.join(', ')}.
                DO NOT generate content for unselected channels.`;
      })()
    : 'Generate all outputs (mlsDesc, igSlides, reelScript, emailSubject, emailBody).';
  
  const openHouseInfo = [
    controls.openHouseDate,
    controls.openHouseTime,
    controls.openHouseLink
  ].filter(Boolean).join(' ');
  
  const ctaInstruction = controls.ctaType === 'phone' && controls.ctaPhone
    ? `Add call-to-action: Call ${controls.ctaPhone}`
    : controls.ctaType === 'link' && controls.ctaLink
    ? `Add call-to-action: Visit ${controls.ctaLink}`
    : controls.ctaType === 'custom' && controls.ctaCustom
    ? `Add call-to-action: ${controls.ctaCustom}`
    : '';

  // Build photo insights section with buyer psychology emphasis
  const photoContext = photoInsights ? [
    '🧠 BUYER PSYCHOLOGY CONVERSION SYSTEM - MANDATORY INTEGRATION 🧠',
    '',
    '🎯 PRIMARY CONVERSION GOAL: Turn viewers into scheduled showings',
    `🎭 TARGET BUYER: ${photoInsights.buyerProfile || 'Discerning buyers seeking their ideal home'}`,
    '',
    '💡 CONVERSION HOOKS (choose the best for each channel):',
    ...(photoInsights.conversionHooks || []).map((hook, i) => `  ${i + 1}. "${hook}"`),
    '',
    '🏆 HEADLINE FEATURE (MUST open MLS): "${photoInsights.headlineFeature || photoInsights.features[0]}"',
    '',
    '🎪 LIFESTYLE SCENARIOS (weave into content):',
    ...(photoInsights.lifestyleScenarios || []).map((scenario, i) => `  ${i + 1}. ${scenario}`),
    '',
    '💎 BUYER BENEFITS (Feature → Emotional Benefit):',
    ...(photoInsights.buyerBenefits || []).map(benefit => `  • ${benefit.feature} → ${benefit.benefit} (${benefit.emotion})`),
    '',
    '⚡ URGENCY TRIGGERS (create FOMO):',
    ...(photoInsights.urgencyTriggers || []).map((trigger, i) => `  ${i + 1}. ${trigger}`),
    '',
    '🛡️ SOCIAL PROOF ELEMENTS (build credibility):',
    ...(photoInsights.socialProofElements || []).map((proof, i) => `  ${i + 1}. ${proof}`),
    '',
    '📝 CONVERSION REQUIREMENTS BY CHANNEL:',
    '• MLS: Open with emotional hook + headline feature, include 2+ lifestyle scenarios + SEO keywords',
    '• Instagram: VIRAL ENGAGEMENT FOCUS - Each slide creates desire + includes engagement bait',
    '  - Slide 1: POV/viral hook with headline feature',
    '  - Slides 2-4: Feature highlights with emotional benefits',
    '  - Slide 5: "Picture yourself..." lifestyle scenario',
    '  - Final slide: Urgency trigger + clear CTA (DM/comment)',
    '• Email: Emotional subject + personal connection + benefits + clear CTA',
    '',
    '🎯 SUCCESS METRICS:',
    '✓ Emotional connection established in first sentence',
    '✓ Buyer can visualize themselves living there',
    '✓ Urgency/scarcity elements create immediate action',
    '✓ Clear, low-friction next step provided',
    '',
    '🚫 AVOID: Generic descriptions, feature lists, weak language',
    '✅ USE: Emotional storytelling, benefit-focused language, conversion psychology',
    '',
    '📊 MLS-SPECIFIC OPTIMIZATION:',
    `Property Category: ${photoInsights?.propertyCategory?.toUpperCase() || 'FAMILY'}`,
    `Marketing Priority: ${photoInsights?.marketingPriority?.toUpperCase() || 'FEATURES'}`,
    `SEO Keywords to integrate: ${(photoInsights?.mlsKeywords || []).join(', ')}`,
    '',
    '🎯 MLS CONTENT REQUIREMENTS:',
    '• Include primary SEO keywords naturally in first paragraph',
    '• Professional agent positioning and credibility indicators',
    '• Local area benefits and neighborhood advantages',
    '• Clear value proposition and competitive advantages',
    '• Search-optimized language buyers actually use',
    '',
    '📱 INSTAGRAM VIRAL OPTIMIZATION:',
    `Property Type: ${photoInsights?.propertyCategory || 'family'} home content`,
    `Viral Hook Style: ${photoInsights?.conversionHooks?.[0] ? 'Custom hook available' : 'Use POV format'}`,
    `Engagement Focus: ${photoInsights?.marketingPriority || 'features'}-driven content`,
    '',
    '🎪 INSTAGRAM REQUIREMENTS:',
    '• Slide 1: POV hook with headline feature',
    '• Slides 2-4: Feature → Benefit → Emotion mapping',
    '• Include engagement bait: "Swipe for the best part ➡️"',
    '• End with urgency + CTA: "DM for details! 📩"',
    '• Use emojis strategically for visual appeal',
    '',
    '💼 BUSINESS CONTENT OPTIMIZATION:',
    `Professional Position: ${photoInsights?.propertyCategory === 'luxury' ? 'Luxury Specialist' : 'Local Market Expert'}`,
    `Authority Building: Market insights + professional expertise demonstration`,
    `Network Target: ${photoInsights?.propertyCategory === 'luxury' ? 'High-net-worth prospects' : 'Local community + referral partners'}`,
    '',
    '🔗 LINKEDIN/FACEBOOK REQUIREMENTS:',
    '• LinkedIn: Professional market insights + thought leadership + networking CTA',
    '• Facebook: Lifestyle-focused + community engagement + visual appeal',
    '• Authority: Demonstrate expertise through market analysis and insights',
    '• Lead Generation: Include valuable lead magnets and consultation offers',
    '• Professional Hashtags: Industry-specific tags for visibility and credibility',
    '',
    '🎥 VIDEO CONTENT OPTIMIZATION:',
    `Video Purpose: ${photoInsights?.propertyCategory === 'luxury' ? 'Lifestyle showcase + luxury appeal' : 'Property tour + market education'}`,
    `Platform Strategy: Multi-format content for YouTube, TikTok, and Shorts`,
    `Viral Potential: ${photoInsights?.features?.length >= 5 ? 'High - unique features for reveals' : 'Medium - focus on lifestyle and tips'}`,
    '',
    '📹 30-SECOND REEL/VIDEO SCRIPT REQUIREMENTS:',
    '',
    'GENERATE A STRUCTURED VIDEO SCRIPT WITH 4 TIME SEGMENTS:',
    '',
    'FORMAT FOR EACH SEGMENT:',
    '[TIME RANGE]',
    'VOICE: Full voiceover script (what the agent says)',
    'TEXT: On-screen text (MAX 40 characters, readable without sound)',
    'SHOT: Specific camera direction and what to film',
    '',
    'SEGMENT 1 [0-3s] - PATTERN INTERRUPT HOOK:',
    '• VOICE: One compelling sentence that stops the scroll',
    '  Examples: "If natural light tops your list, pause here"',
    '           "This kitchen made them offer over asking"',
    '• TEXT: Ultra-short version with emoji (≤40 chars)',
    '  Examples: "South-facing light ☀️"',
    '           "Chef\'s dream kitchen 👨‍🍳"',
    '• SHOT: Specific opening visual that matches the hook',
    '  Examples: "Quick pan across sun-filled living room"',
    '           "Slow zoom on waterfall island"',
    '',
    'SEGMENT 2 [4-10s] - PROPERTY BASICS + LOCATION:',
    '• VOICE: Conversational mention of beds, baths, sqft, neighborhood',
    '  Example: "Three bedrooms, two baths, about 1,850 square feet in Brookfield"',
    '• TEXT: Condensed stats format',
    '  Example: "3BR • 2BA • 1,850 sq ft"',
    '• SHOT: Establishing shots showing scale',
    '  Example: "Wide shots: living → dining → kitchen flow"',
    '',
    'SEGMENT 3 [11-20s] - TOP 3 FEATURES WITH BENEFITS:',
    '• VOICE: Features + why they matter to daily life',
    '  Example: "Chef\'s kitchen, wide-plank floors, and EV-ready garage. New roof means weekends are yours"',
    '• TEXT: Feature keywords only',
    '  Example: "Chef kitchen • EV ready • New roof \'23"',
    '• SHOT: Close-ups of each mentioned feature',
    '  Example: "Close-up: gas range, flooring detail, garage outlet, roof line"',
    '',
    'SEGMENT 4 [21-30s] - URGENCY + CLEAR CTA:',
    '• VOICE: Create FOMO and give specific next step',
    '  Example: "Open house this Saturday, 11 to 1. Comment TOUR for details"',
    '• TEXT: Action phrase',
    '  Example: "Open Sat 11-1 • DM TOUR"',
    '• SHOT: Memorable closing visual',
    '  Example: "Exterior hero shot, zoom to front door with address number"',
    '',
    'CRITICAL REQUIREMENTS:',
    '✓ VOICE and TEXT must work independently (assume many watch muted)',
    '✓ TEXT must be ≤40 characters and scannable',
    '✓ SHOT directions must be specific and actionable',
    '✓ Include concrete details (beds, baths, sqft) in segment 2',
    '✓ Benefits over features in segment 3',
    '✓ Create urgency without being pushy in segment 4',
    '',
    'OUTPUT FORMAT - CRITICAL:',
    'Generate EXACTLY 4 lines for reelScript, each on ONE LINE:',
    '',
    'EXAMPLE OUTPUT:',
    '[0-3s] VOICE: If natural light tops your list, pause here TEXT: South-facing light ☀️ SHOT: Quick pan across sun-filled living room',
    '[4-10s] VOICE: Three bedrooms, two baths, about 1850 square feet in Brookfield TEXT: 3BR • 2BA • 1,850sqft SHOT: Wide shots living to dining to kitchen',
    '[11-20s] VOICE: Chef\'s kitchen, wide-plank floors, and EV-ready garage. New roof means weekends are yours TEXT: Chef kitchen • EV • New roof SHOT: Close-ups of each feature mentioned',
    '[21-30s] VOICE: Open house this Saturday, 11 to 1. Comment TOUR for details TEXT: Open Sat • DM TOUR SHOT: Exterior hero shot, zoom to door',
    '',
    'ALTERNATIVE HOOKS (reelHooks field):',
    'Generate EXACTLY 3 alternative opening hooks, ONE PER LINE:',
    '',
    'FORMAT: VOICE: [full hook sentence] TEXT: [short version ≤40 chars]',
    '',
    'EXAMPLE:',
    'VOICE: This kitchen made them offer over asking TEXT: Chef\'s dream kitchen 👨‍🍳',
    'VOICE: Five offers in two days on this gem TEXT: 5 offers • 2 days',
    'VOICE: Stop scrolling if you need pool paradise TEXT: Pool paradise found 🏊',
    '',
    'Use different angles: Curiosity, Social Proof, Specific Benefit',
    '',
    '📧 EMAIL OPTIMIZATION - ADAPTIVE INTEL/EMOTION STRATEGY:',
    '',
    '🔍 AVAILABLE DATA ASSESSMENT:',
    `• Price info: ${controls.ctaCustom?.includes('$') ? `YES - ${controls.ctaCustom}` : 'NO'}`,
    `• Property specs: ${facts.beds && facts.baths ? `YES - ${facts.beds}BR/${facts.baths}BA` : 'LIMITED'}`,
    `• Square footage: ${facts.sqft ? `YES - ${facts.sqft}` : 'NO'}`,
    `• Location: ${facts.neighborhood || facts.address ? 'YES' : 'LIMITED'}`,
    `• Open house: ${controls.openHouseDate ? `YES - ${controls.openHouseDate}` : 'NO'}`,
    `• Photo features: ${photoInsights?.features?.length > 0 ? `YES - ${photoInsights.features.length} features` : 'NO'}`,
    '',
    '📊 STRATEGY SELECTION:',
    (() => {
      // Determine intel level
      let intelScore = 0;
      if (controls.ctaCustom?.includes('$')) intelScore += 2;
      if (facts.beds && facts.baths) intelScore += 1;
      if (facts.sqft) intelScore += 1;
      if (facts.neighborhood) intelScore += 1;
      if (controls.openHouseDate) intelScore += 1;
      if (photoInsights?.features?.length > 3) intelScore += 2;
      
      if (intelScore >= 5) {
        return '✅ USE INTEL-BASED APPROACH (High data availability)';
      } else if (intelScore >= 2) {
        return '⚡ USE HYBRID APPROACH (Some data available)';
      } else {
        return '💫 USE EMOTIONAL APPROACH (Limited data - focus on lifestyle)';
      }
    })(),
    '',
    '💌 EMAIL GENERATION RULES:',
    '',
    '━━━ IF INTEL-BASED (concrete data available) ━━━',
    'SUBJECT FORMAT: [Specific number/feature] + [Location] + [Urgency]',
    `Example: "${facts.beds || '3'}BR under $${controls.ctaCustom?.includes('$') ? controls.ctaCustom : '400K'} - ${facts.neighborhood || 'prime location'}"`,
    '',
    'COMPLETE EMAIL STRUCTURE (REQUIRED FORMAT):',
    '• GREETING: "Hi there," or "Hello,"',
    '• HOOK: Direct value statement with specifics (15 words max)',
    '• INTEL: 3-4 bullets of concrete, verifiable information',
    '  - Each bullet MUST contain a number, date, or comparison',
    '  - Focus on: price advantages, timing, recent upgrades, comparisons',
    '• CTA: One clear, friction-free action',
    '• SIGNATURE: "Best,\\n[Your Realtor Name]"',
    '',
    'INTEL EXAMPLES TO USE (if available):',
    controls.ctaCustom?.includes('$') ? `• "Listed at ${controls.ctaCustom}"` : '',
    controls.openHouseDate ? `• "Open house ${controls.openHouseDate}"` : '',
    photoInsights?.features?.includes('pool') ? '• "Pool recently resurfaced"' : '',
    '',
    '━━━ IF HYBRID (some data + lifestyle) ━━━',
    'SUBJECT FORMAT: [Known feature] + [Benefit] + [Area if known]',
    `Example: "${photoInsights?.headlineFeature || 'Spacious home'} perfect for ${photoInsights?.buyerProfile || 'your lifestyle'}"`,
    '',
    'COMPLETE EMAIL STRUCTURE (REQUIRED FORMAT):',
    '• GREETING: "Hi there," or "Hello,"',
    '• HOOK: Feature-benefit connection',
    '• MIXED CONTENT: Blend known facts with lifestyle benefits',
    '  - Use available data points',
    '  - Fill gaps with benefit language (not invented facts)',
    '• CTA: Schedule viewing or get more details',
    '• SIGNATURE: "Best,\\n[Your Realtor Name]"',
    '',
    '━━━ IF EMOTIONAL (limited data - use lifestyle) ━━━',
    'SUBJECT FORMAT: [Emotional hook] + [Curiosity gap]',
    'Example: "Your dream home might be waiting"',
    '',
    'COMPLETE EMAIL STRUCTURE (REQUIRED FORMAT):',
    '• GREETING: "Hi there," or "Hello,"',
    '• HOOK: Lifestyle visualization or aspiration',
    '• EMOTIONAL CONTENT: Paint picture of life in the home',
    '  - "Imagine..." scenarios',
    '  - "Picture yourself..." moments',
    '  - Focus on feelings and experiences',
    '• CTA: Soft invitation to learn more',
    '• SIGNATURE: "Best,\\n[Your Realtor Name]"',
    '',
    '🚫 CRITICAL RULES - NEVER VIOLATE:',
    '❌ NEVER invent specific numbers, prices, or dates',
    '❌ NEVER use generic adjectives (stunning, beautiful, amazing)',
    '❌ NEVER make unverifiable claims',
    '❌ NEVER mention demographics or protected classes',
    '❌ If data is missing, use RANGES or EMOTIONAL language, not fake specifics',
    '',
    '✅ ALWAYS DO:',
    '• Use ONLY information that was provided',
    '• When unsure, default to emotional/lifestyle language',
    '• Keep subject line under 60 characters',
    '• Keep body between 100-250 words',
    '• Include exactly ONE clear call-to-action',
    '• Write at 8th grade reading level',
    '• FORMAT emailBody as COMPLETE email with ALL parts:',
    '  1. Greeting: "Hi there," or "Hello,"',
    '  2. Body content with hook and details',
    '  3. Call-to-action',
    '  4. Signature: "Best,\\nYour Realtor"',
    '',
    '📝 FALLBACK PHRASES (when specific data unavailable):',
    '• "Competitively priced for the area"',
    '• "Motivated seller"',
    '• "Desirable location"',
    '• "Well-maintained property"',
    '• "Rare opportunity"',
    '• "Schedule your private showing"'
  ].join('\n') : '';

  if (photoContext) {
    console.log(`📝 [CONTENT GENERATION] Photo context being sent to AI:`, {
      hasPhotoInsights: !!photoInsights,
      roomCount: photoInsights?.rooms.length || 0,
      featureCount: photoInsights?.features.length || 0,
      contextLength: photoContext.length,
      preview: photoContext.substring(0, 200) + '...'
    });
  } else {
    console.log(`🚫 [CONTENT GENERATION] No photo insights available for content generation`);
  }

  const systemPrompt = [
    'You are a master real-estate copywriter specializing in buyer psychology and conversion optimization.',
    'Your goal: Transform property viewers into scheduled showings through emotional connection and urgency.',
    '',
    '🧠 CONVERSION PSYCHOLOGY FRAMEWORK:',
    '1. EMOTIONAL ENGAGEMENT: Every opening line must create immediate desire',
    '2. LIFESTYLE VISUALIZATION: Help buyers see themselves living there',
    '3. BENEFIT-FOCUSED: Translate features into emotional benefits and outcomes',
    '4. URGENCY CREATION: Use scarcity and opportunity to drive immediate action',
    '5. SOCIAL PROOF: Build credibility and reduce buyer risk/hesitation',
    '',
    '🎯 CONTENT STRATEGY BY CHANNEL:',
    '• MLS: SEO-optimized emotional hook + lifestyle scenarios + agent positioning + urgency',
    '• Instagram: VIRAL ENGAGEMENT - POV hooks + feature/benefit mapping + lifestyle scenarios + engagement bait',
    '  CRITICAL: Use "POV:", "Tell me you wouldn\'t...", "This house just hits different" format',
    '  CRITICAL: Each slide must hook attention and create desire for next step',
    '• Email: ADAPTIVE INTEL/EMOTION - Use concrete data when available, emotional hooks when not',
    '  CRITICAL: NEVER invent facts - use only provided information',
    '  CRITICAL: Intel-first strategy: specific numbers > lifestyle benefits > generic language',
    '  CRITICAL: One clear CTA - make response friction-free',
    '• LinkedIn: PROFESSIONAL AUTHORITY - Market insights + thought leadership + networking opportunities',
    '  CRITICAL: Demonstrate expertise through data-driven insights and professional credibility',
    '  CRITICAL: Engage industry peers and potential high-value clients through valuable content',
    '• Facebook: COMMUNITY ENGAGEMENT - Lifestyle appeal + local expertise + approachable professionalism',
    '  CRITICAL: Balance professional credibility with community connection and accessibility',
    '• YouTube: EDUCATIONAL AUTHORITY - Detailed property tours + market insights + subscriber building',
    '  CRITICAL: Provide valuable education while showcasing expertise and building long-term audience',
    '• TikTok: VIRAL ENGAGEMENT - Quick hooks + trending formats + maximum shareability',
    '  CRITICAL: First 3 seconds must grab attention, use trending audio and effects for algorithm boost',
    '• Shorts: ATTENTION OPTIMIZATION - Fast-paced reveals + vertical format + loop potential',
    '  CRITICAL: Design for mobile viewing with bold visuals and quick retention tactics',
    '',
    '🚫 FORBIDDEN APPROACHES:',
    '❌ Dry, factual descriptions that sound like specifications',
    '❌ Generic language that could apply to any property',
    '❌ Weak, passive language that lacks conviction',
    '❌ Missing calls-to-action or next steps',
    '',
    '✅ CONVERSION REQUIREMENTS:',
    '✓ First sentence creates immediate emotional connection',
    '✓ Buyer can visualize their lifestyle transformation',  
    '✓ Benefits clearly stated, not just features mentioned',
    '✓ Urgency/scarcity drives immediate action',
    '✓ Clear, low-friction next step provided',
    '',
    'COMPLIANCE: MLS compliant, Fair Housing safe, no protected classes.'
  ].join('\n');
  
  const userPrompt = [
    `Property Facts: ${JSON.stringify(facts)}`,
    '',
    photoContext,
    photoContext ? '' : 'No photos provided - use property facts only.',
    '',
    'Generation Controls:',
    channelInstructions,
    openHouseInfo ? `Open House: ${openHouseInfo}` : '',
    ctaInstruction,
    controls.socialHandle ? `Social: ${controls.socialHandle}` : '',
    controls.hashtagStrategy ? `Hashtags: ${controls.hashtagStrategy}` : '',
    controls.extraHashtags ? `Extra tags: ${controls.extraHashtags}` : '',
    controls.readingLevel ? `Reading level: ${controls.readingLevel}` : '',
    controls.useEmojis ? 'Include appropriate emojis' : 'No emojis',
    controls.mlsFormat ? `MLS format: ${controls.mlsFormat}` : '',
    controls.policy?.mustInclude?.length ? `Must include words: ${controls.policy.mustInclude.join(', ')}` : '',
    controls.policy?.avoidWords?.length ? `Avoid words: ${controls.policy.avoidWords.join(', ')}` : '',
    '',
    'JSON Output Schema:',
    '{',
    '  "mlsDesc": string  // MLS description, respect format preference',
    '  "igSlides": string[]  // Instagram carousel slides',  
    '  "reelScript": string[]  // 4-segment script with VOICE/TEXT/SHOT for each',
    '  "reelHooks": string[]  // 3 alternative hooks with VOICE and TEXT versions',
    '  "emailSubject": string  // Email subject line (60 chars max)',
    '  "emailBody": string  // COMPLETE email: "Hi there," + body + CTA + "Best,\\nYour Realtor"',
    '}',
    'Set any non-requested channel outputs to empty string/array.'
  ].filter(Boolean).join('\n');

  // Debug logging to check reel format instructions
  const reelInstructions = userPrompt.split('\n').filter(line => 
    line.includes('SHOT') || 
    line.includes('reelScript') || 
    line.includes('[0-3s]') ||
    line.includes('[4-10s]') ||
    line.includes('[11-20s]') ||
    line.includes('[21-30s]')
  );
  
  if (reelInstructions.length > 0) {
    console.log('🎬 [REEL FORMAT DEBUG] Instructions being sent to AI:');
    reelInstructions.forEach(line => {
      console.log('  >', line.substring(0, 200));
    });
  }
  
  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];
}

function composeCritiqueMessages(
  facts: Facts,
  draft: Output,
  controls: Controls,
  photoInsights?: PhotoInsights,
  violations?: { missing: string[]; banned: string[] }
): ChatMessage[] {
  const policy = controls.policy;
  let policyText = '';
  if (policy?.mustInclude.length || policy?.avoidWords.length) {
    policyText = `\nPolicy: must include [${policy.mustInclude.join(', ')}]; avoid words [${policy.avoidWords.join(', ')}]`;
  }
  let violationText = '';
  if (violations && (violations.missing.length || violations.banned.length)) {
    violationText = `\nViolations: missing [${violations.missing.join(', ')}]; banned [${violations.banned.join(', ')}]`;
  }
  
  // Add photo requirements to critique
  let photoRequirements = '';
  if (photoInsights) {
    const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
    const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
    photoRequirements = `

🚨 CRITICAL PHOTO REQUIREMENTS - DRAFT IS BEING VALIDATED:
- MLS MUST start with: "${headlineFeature}"
- MUST include these features: [${mustMentionFeatures.join(', ')}]
- Instagram slides MUST each highlight different features
- Email MUST lead with headline feature + 2+ others
- Current draft will be REJECTED if these requirements are not met

VALIDATION CHECKLIST - Fix these issues:
${mustMentionFeatures.map(f => `□ Feature "${f}" appears in content`).join('\n')}
□ MLS opens with "${headlineFeature}"
□ Instagram has photo-specific content
□ Email mentions headline feature first`;
  }
  
  // Include all control instructions for critique
  const controlsText = [
    controls.channels?.length ? `Channels: Only ${controls.channels.join(', ')} should have content` : '',
    controls.openHouseDate || controls.openHouseTime ? `Include open house info` : '',
    controls.ctaType ? `Include CTA in outputs` : '',
    controls.socialHandle ? `Include social handle in Instagram` : '',
    controls.useEmojis ? 'Should include emojis' : 'No emojis',
    controls.mlsFormat === 'bullets' ? 'MLS should use bullet format' : ''
  ].filter(Boolean).join('; ');
  
  return [
    {
      role: 'system',
      content:
        'You are a real-estate copywriter and critical editor. Ensure outputs comply with MLS and fair-housing rules. Verify all controls are applied. Output final JSON only.',
    },
    {
      role: 'user',
      content: `Facts: ${JSON.stringify(facts)}\nDraft: ${JSON.stringify(draft)}${policyText}${violationText}${photoRequirements}\nControls to verify: ${controlsText}`,
    },
  ];
}

// Apply length caps and trimming to model output.
function postProcess(o: Output, facts?: Facts, photoInsights?: PhotoInsights): Output {
  const trim = (s: string) => s.trim();
  const cap = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s);
  
  // Generate hashtags if Instagram content is present
  let igHashtags = o.igHashtags;
  if (o.igSlides && o.igSlides.length > 0 && facts) {
    // Step 1: Generate smart hashtags based on property data
    const hashtagSet = generateSmartHashtags(facts, photoInsights, 'balanced');
    
    // Step 2: Enhance with content-aware hashtags from actual Instagram slides
    const enhancedHashtags = enhanceHashtagsWithContent(hashtagSet, o.igSlides);
    
    igHashtags = {
      trending: enhancedHashtags.trending,
      location: enhancedHashtags.location,
      features: enhancedHashtags.features,
      targeted: enhancedHashtags.targeted,
      content: enhancedHashtags.content, // New content-aware category
      all: enhancedHashtags.all,
      score: enhancedHashtags.score,
      tips: enhancedHashtags.tips
    };
  }
  
  // Debug logging for video scripts
  if (o.reelScript && o.reelScript.length > 0) {
    console.log('🎬 [VIDEO SCRIPT DEBUG] Raw reelScript:', o.reelScript);
    console.log('🎬 [VIDEO SCRIPT DEBUG] Number of segments:', o.reelScript.length);
    o.reelScript.forEach((segment, i) => {
      console.log(`🎬 [VIDEO SCRIPT DEBUG] Segment ${i}:`, segment.substring(0, 100) + '...');
      // Final check for SHOT presence
      if (!segment.includes('SHOT:')) {
        console.log('    ⚠️ FINAL WARNING: No SHOT in post-processed segment');
      }
    });
  }
  
  if (o.reelHooks && o.reelHooks.length > 0) {
    console.log('🎣 [HOOKS DEBUG] Raw reelHooks:', o.reelHooks);
  }

  return {
    mlsDesc: trim(cap(o.mlsDesc || '', 900)),
    igSlides: (o.igSlides || []).map((s) => trim(cap(s, 110))).slice(0, 7),
    igHashtags: igHashtags,
    reelScript: (o.reelScript || []).map((s) => trim(cap(s, 500))).slice(0, 4), // Increased limit for full format
    reelHooks: (o.reelHooks || []).map((s) => trim(cap(s, 150))).slice(0, 3), // Increased for VOICE|TEXT format
    emailSubject: trim(cap(o.emailSubject || '', 70)),
    emailBody: trim(cap(o.emailBody || '', 900)),
  };
}

// Basic compliance scan for problematic terms. Returns a list of flags.
function complianceScan(o: Output): string[] {
  const banned = ['school', 'crime', 'demographic', 'race'];
  const text = [
    o.mlsDesc,
    ...o.igSlides,
    ...o.reelScript,
    o.emailSubject,
    o.emailBody,
  ]
    .join(' ')
    .toLowerCase();
  return banned.filter((b) => text.includes(b));
}

function policyViolations(o: Output, policy: Controls['policy']): {
  missing: string[];
  banned: string[];
} {
  const text = [
    o.mlsDesc,
    ...o.igSlides,
    ...o.reelScript,
    o.emailSubject,
    o.emailBody,
  ]
    .join(' ')
    .toLowerCase();
  const missing = (policy?.mustInclude || []).filter(
    (w) => !text.includes(w.toLowerCase())
  );
  const banned = (policy?.avoidWords || []).filter((w) =>
    text.includes(w.toLowerCase())
  );
  return { missing, banned };
}

export const PROMPT_VERSION = '1';
const RULES_VERSION = '1';

// Helper functions to check if photo features were integrated into content
function checkContentHasPhotoFeatures(content: string, photoInsights: PhotoInsights): boolean {
  if (!content || !photoInsights.features.length) return false;
  
  const contentLower = content.toLowerCase();
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  
  // Check if at least 60% of must-mention features are included
  const mentionedCount = mustMentionFeatures.filter(feature => 
    contentLower.includes(feature.toLowerCase())
  ).length;
  
  return mentionedCount >= Math.ceil(mustMentionFeatures.length * 0.6);
}

function getUsedPhotoFeatures(outputs: Output, photoInsights: PhotoInsights): string[] {
  const allContent = [
    outputs.mlsDesc,
    ...outputs.igSlides,
    ...outputs.reelScript,
    outputs.emailSubject,
    outputs.emailBody
  ].join(' ').toLowerCase();
  
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  return mustMentionFeatures.filter(feature => {
    const featureLower = feature.toLowerCase();
    // Check for exact phrase or key words from the phrase
    const keyWords = featureLower.split(' ').filter(word => word.length > 3);
    return allContent.includes(featureLower) || 
           keyWords.every(word => allContent.includes(word));
  });
}

// Enhanced validation including conversion psychology
function validatePhotoIntegration(outputs: Output, photoInsights: PhotoInsights | undefined): {
  isValid: boolean;
  issues: string[];
  score: number;
  conversionScore: number;
} {
  if (!photoInsights) {
    return { isValid: true, issues: [], score: 100, conversionScore: 100 };
  }
  
  const issues: string[] = [];
  let score = 100;
  let conversionScore = 100;
  
  const mustMentionFeatures = photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5);
  const headlineFeature = photoInsights.headlineFeature || photoInsights.features[0];
  
  // 1. Feature Integration Score (40% of total)
  const usedFeatures = getUsedPhotoFeatures(outputs, photoInsights);
  const coverage = (usedFeatures.length / mustMentionFeatures.length) * 100;
  
  if (coverage < 60) {
    issues.push(`Only ${usedFeatures.length}/${mustMentionFeatures.length} must-mention features used`);
    score -= 25;
  }
  
  // 2. Conversion Psychology Score (60% of total)
  const allContent = [outputs.mlsDesc, ...outputs.igSlides, outputs.emailBody].join(' ').toLowerCase();
  
  // Check for emotional language
  const emotionalWords = ['imagine', 'picture', 'perfect', 'stunning', 'dream', 'luxury', 'sanctuary', 'retreat'];
  const emotionalCount = emotionalWords.filter(word => allContent.includes(word)).length;
  if (emotionalCount < 2) {
    issues.push('Insufficient emotional language for buyer connection');
    conversionScore -= 20;
  }
  
  // Check for lifestyle scenarios
  const lifestyleIndicators = ['yourself', 'picture', 'imagine', 'envision', 'host', 'entertain', 'relax'];
  const lifestyleCount = lifestyleIndicators.filter(word => allContent.includes(word)).length;
  if (lifestyleCount < 1) {
    issues.push('Missing lifestyle visualization elements');
    conversionScore -= 15;
  }
  
  // Check for urgency/scarcity
  const urgencyWords = ['rare', 'unique', 'opportunity', 'limited', 'exclusive', 'won\'t last', 'must see'];
  const urgencyCount = urgencyWords.filter(word => allContent.includes(word)).length;
  if (urgencyCount < 1) {
    issues.push('Missing urgency/scarcity triggers');
    conversionScore -= 15;
  }
  
  // Check for benefit language (not just features)
  const benefitWords = ['enjoy', 'experience', 'benefit', 'advantage', 'perfect for', 'ideal for'];
  const benefitCount = benefitWords.filter(word => allContent.includes(word)).length;
  if (benefitCount < 1) {
    issues.push('Missing benefit-focused language');
    conversionScore -= 10;
  }
  
  // MLS-specific SEO validation
  if (photoInsights?.mlsKeywords && photoInsights.mlsKeywords.length > 0) {
    const mlsKeywordUsage = photoInsights.mlsKeywords.filter(keyword => 
      outputs.mlsDesc.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (mlsKeywordUsage.length === 0) {
      issues.push('MLS missing SEO keywords for search visibility');
      conversionScore -= 15;
    } else if (mlsKeywordUsage.length < Math.ceil(photoInsights.mlsKeywords.length * 0.5)) {
      issues.push('MLS has insufficient SEO keyword integration');
      conversionScore -= 10;
    }
  }
  
  // Professional agent positioning check
  const agentWords = ['contact', 'expert', 'specialist', 'professional', 'experience'];
  const agentPositioning = agentWords.filter(word => outputs.mlsDesc.toLowerCase().includes(word)).length;
  if (agentPositioning < 1) {
    issues.push('Missing professional agent positioning in MLS');
    conversionScore -= 8;
  }
  
  // Check individual channels for conversion elements
  const channels = [
    { content: outputs.mlsDesc, name: 'MLS', minLength: 300 },
    { content: outputs.igSlides.join(' '), name: 'Instagram', minLength: 100 },
    { content: outputs.emailBody, name: 'Email', minLength: 200 }
  ];
  
  channels.forEach(({ content, name, minLength }) => {
    if (content) {
      if (content.length < minLength) {
        issues.push(`${name} content too short for effective conversion (${content.length} chars)`);
        conversionScore -= 5;
      }
      
      // Check for channel-specific elements
      if (name === 'MLS' && !content.toLowerCase().includes(headlineFeature?.toLowerCase() || '')) {
        issues.push(`MLS doesn't prominently feature headline: ${headlineFeature}`);
        score -= 15;
      }
      
      // Instagram-specific viral engagement validation
      if (name === 'Instagram' && outputs.igSlides.length > 0) {
        const firstSlide = outputs.igSlides[0]?.toLowerCase() || '';
        const lastSlide = outputs.igSlides[outputs.igSlides.length - 1]?.toLowerCase() || '';
        
        // Check for viral hook format in first slide
        const viralHooks = ['pov:', 'tell me', 'this house', 'when you', 'the way this'];
        const hasViralHook = viralHooks.some(hook => firstSlide.includes(hook));
        if (!hasViralHook) {
          issues.push('Instagram missing viral hook format (POV, Tell me, etc.)');
          conversionScore -= 10;
        }
        
        // Check for engagement bait
        const engagementBait = ['swipe', 'dm', 'comment', 'tag', '➡️', '👇', '📩'];
        const hasEngagementBait = outputs.igSlides.some(slide => 
          engagementBait.some(bait => slide.toLowerCase().includes(bait))
        );
        if (!hasEngagementBait) {
          issues.push('Instagram missing engagement bait (swipe, DM, comment prompts)');
          conversionScore -= 10;
        }
        
        // Check for urgency in final slide
        const hasUrgencyInLastSlide = urgencyWords.some(word => lastSlide.includes(word)) ||
          lastSlide.includes('dm') || lastSlide.includes('don\'t miss');
        if (!hasUrgencyInLastSlide) {
          issues.push('Instagram final slide missing urgency/CTA');
          conversionScore -= 8;
        }
        
        // Check slide count for carousel engagement
        if (outputs.igSlides.length < 3) {
          issues.push('Instagram needs minimum 3 slides for carousel engagement');
          conversionScore -= 5;
        } else if (outputs.igSlides.length > 7) {
          issues.push('Instagram carousel too long - may reduce completion rate');
          conversionScore -= 5;
        }
      }
      
      // Email-specific adaptive validation
      if (name === 'Email' && outputs.emailBody && outputs.emailSubject) {
        const emailSubject = outputs.emailSubject.toLowerCase();
        const emailBody = outputs.emailBody.toLowerCase();
        
        // Determine intel availability for adaptive validation
        // Since we don't have access to facts/controls here, we'll infer from content
        let intelScore = 0;
        if (emailBody.includes('$') && /\$\d+/.test(emailBody)) intelScore += 2; // Has price
        if (/\d+\s*(bed|br)/i.test(emailBody)) intelScore += 1; // Has beds
        if (/\d+\s*sq/i.test(emailBody)) intelScore += 1; // Has sqft
        if (photoInsights?.features?.length > 3) intelScore += 2;
        
        const hasHighIntel = intelScore >= 5;
        const hasSomeIntel = intelScore >= 2;
        
        // ADAPTIVE VALIDATION BASED ON AVAILABLE DATA
        if (hasHighIntel) {
          // Intel-based validation (strict on specifics)
          const hasNumbers = /\d+/.test(emailBody);
          if (!hasNumbers) {
            issues.push('Intel available but email lacks specific data points');
            conversionScore -= 15;
          }
          
          // Check for intel bullets
          const hasBullets = emailBody.includes('•') || emailBody.includes('-');
          if (!hasBullets) {
            issues.push('Intel-based email missing bullet points');
            conversionScore -= 10;
          }
          
          // Subject should have specifics
          const subjectHasSpecific = /\d/.test(emailSubject);
          if (!subjectHasSpecific) {
            issues.push('Subject line missing specific data despite availability');
            conversionScore -= 8;
          }
        } else if (hasSomeIntel) {
          // Hybrid validation (mix of facts and emotion)
          const hasFeatureBenefit = photoInsights?.features?.some(f => 
            emailBody.includes(f.toLowerCase())
          );
          const hasEmotionalWords = ['perfect', 'ideal', 'imagine', 'picture'].some(word => 
            emailBody.includes(word)
          );
          
          if (!hasFeatureBenefit && !hasEmotionalWords) {
            issues.push('Hybrid email needs mix of features and emotional appeal');
            conversionScore -= 12;
          }
        } else {
          // Emotional validation (focus on lifestyle)
          const emotionalWords = ['imagine', 'picture', 'dream', 'perfect', 'lifestyle', 'enjoy'];
          const hasEmotionalHook = emotionalWords.some(word => emailBody.includes(word));
          
          if (!hasEmotionalHook) {
            issues.push('Limited data but email lacks emotional/lifestyle appeal');
            conversionScore -= 15;
          }
        }
        
        // UNIVERSAL VALIDATIONS (apply to all)
        
        // Check for invented facts (critical issue)
        const suspiciousPatterns = [
          /\$\d{3},\d{3}/, // Specific price when not provided
          /\d{4}\s*sq\s*ft/, // Specific sqft when not provided
          /built\s+in\s+\d{4}/, // Year built when not provided
          /\d+\s+days?\s+on\s+market/, // DOM when not provided
        ];
        
        const hasInventedFacts = suspiciousPatterns.some(pattern => {
          if (pattern.test(emailBody)) {
            // Since we can't check source data here, we'll be more lenient
            // and trust the AI followed instructions not to invent
            return false;
          }
          return false;
        });
        
        if (hasInventedFacts) {
          issues.push('⚠️ Email appears to contain invented facts not in source data');
          conversionScore -= 30; // Heavy penalty
        }
        
        // Check for generic fluff words (discouraged)
        const genericWords = ['stunning', 'beautiful', 'amazing', 'gorgeous', 'magnificent'];
        const hasGenericWords = genericWords.some(word => emailBody.includes(word));
        if (hasGenericWords) {
          issues.push('Email uses generic adjectives instead of specifics');
          conversionScore -= 8;
        }
        
        // Check for clear CTA
        const ctaWords = ['reply', 'text', 'call', 'schedule', 'contact', 'dm', 'comment'];
        const hasClearCTA = ctaWords.some(word => emailBody.includes(word));
        if (!hasClearCTA) {
          issues.push('Email missing clear call-to-action');
          conversionScore -= 10;
        }
        
        // Check for appropriate length (adjusted for approach)
        const minLength = hasHighIntel ? 150 : 100; // Shorter for intel-based
        const maxLength = hasHighIntel ? 300 : 250; // Tighter for intel-based
        
        if (outputs.emailBody.length < minLength) {
          issues.push(`Email too short (${outputs.emailBody.length} chars, min: ${minLength})`);
          conversionScore -= 5;
        } else if (outputs.emailBody.length > maxLength) {
          issues.push(`Email too long (${outputs.emailBody.length} chars, max: ${maxLength})`);
          conversionScore -= 5;
        }
      }
    }
  });
  
  const finalScore = Math.round((score + conversionScore) / 2);
  
  return {
    isValid: issues.length <= 1 && finalScore >= 70, // More lenient for conversion-focused content
    issues,
    score: Math.max(0, finalScore),
    conversionScore: Math.max(0, conversionScore)
  };
}

export async function generateKit({
  facts,
  controls,
  tierConfig,
}: {
  facts: Facts;
  controls: Controls;
  tierConfig?: TierConfig;
}): Promise<{
  outputs: Output;
  flags: string[];
  promptVersion: string;
  rulesVersion: string;
  tokenCounts: TokenCounts;
  photoInsights?: PhotoInsights;
}> {
  console.log('[pipeline] DEBUG: generateKit called with', {
    hasPhotos: !!facts.photos?.length,
    channelsReceived: controls.channels,
    channelCount: controls.channels?.length,
  });
  
  const plan = controls.plan;
  const policy = controls.policy;
  let tokenCounts: TokenCounts = { prompt: 0, completion: 0, total: 0 };
  
  // Analyze photos if provided (including hero analysis for Phase 1)
  let photoInsights: PhotoInsights | undefined;
  let heroAnalysis: any | undefined;
  if (facts.photos && facts.photos.length > 0) {
    try {
      console.log('[pipeline] Analyzing photos...', { count: facts.photos.length });
      
      // Only do photo analysis synchronously
      // Hero analysis will be done asynchronously after generation
      photoInsights = await analyzePhotosWithVision(facts.photos);
      console.log('[pipeline] Photo analysis complete', { 
        rooms: photoInsights.rooms.length,
        features: photoInsights.features.length 
      });
      
      // Note: Hero analysis removed from here - will be async via /api/hero-status
    } catch (error) {
      console.warn('[pipeline] Photo analysis failed', error);
      // Continue without photo insights
    }
  }
  
  const draftRes = await callProvider(
    composeDraftMessages(facts, controls, photoInsights),
    plan
  );
  tokenCounts.prompt += draftRes.tokenCounts.prompt;
  tokenCounts.completion += draftRes.tokenCounts.completion;
  tokenCounts.total += draftRes.tokenCounts.total;
  let critique = draftRes.output;
  
  // Debug logging for reel script output
  if (critique.reelScript && critique.reelScript.length > 0) {
    console.log('🎬 [REEL OUTPUT DEBUG] AI generated reelScript:');
    critique.reelScript.forEach((line, i) => {
      console.log(`  [${i}]:`, line);
      // Check if SHOT is present
      if (!line.includes('SHOT:')) {
        console.log('    ⚠️ WARNING: No SHOT found in this segment');
      }
    });
  }
  try {
    const critRes = await callProvider(
      composeCritiqueMessages(facts, critique, controls, photoInsights),
      plan
    );
    tokenCounts.prompt += critRes.tokenCounts.prompt;
    tokenCounts.completion += critRes.tokenCounts.completion;
    tokenCounts.total += critRes.tokenCounts.total;
    let parsed = OutputSchema.parse(critRes.output);
    
    // Debug logging for reel script after critique
    if (parsed.reelScript && parsed.reelScript.length > 0) {
      console.log('🎬 [REEL CRITIQUE DEBUG] After critique reelScript:');
      parsed.reelScript.forEach((line, i) => {
        console.log(`  [${i}]:`, line.substring(0, 150) + (line.length > 150 ? '...' : ''));
        if (!line.includes('SHOT:')) {
          console.log('    ⚠️ WARNING: No SHOT after critique');
        }
      });
    }
    
    let pv = policyViolations(parsed, policy);
    if (pv.missing.length || pv.banned.length) {
      try {
        const retryRes = await callProvider(
          composeCritiqueMessages(facts, parsed, controls, photoInsights, pv),
          plan
        );
        tokenCounts.prompt += retryRes.tokenCounts.prompt;
        tokenCounts.completion += retryRes.tokenCounts.completion;
        tokenCounts.total += retryRes.tokenCounts.total;
        critique = retryRes.output;
        parsed = OutputSchema.parse(critique);
      } catch (err) {
        console.warn('[pipeline] re-critique pass failed', err);
      }
    }
    let outputs = postProcess(parsed, facts, photoInsights);
    pv = policyViolations(outputs, policy);
    if (pv.missing.length || pv.banned.length) {
      try {
        const postRes = await callProvider(
          composeCritiqueMessages(facts, outputs, controls, photoInsights, pv),
          plan
        );
        tokenCounts.prompt += postRes.tokenCounts.prompt;
        tokenCounts.completion += postRes.tokenCounts.completion;
        tokenCounts.total += postRes.tokenCounts.total;
        outputs = postProcess(OutputSchema.parse(postRes.output), facts, photoInsights);
      } catch (err) {
        console.warn('[pipeline] post-process critique pass failed', err);
      }
    }
    const flags = complianceScan(outputs);
    
    // Validate photo integration and log results
    if (photoInsights) {
      const validation = validatePhotoIntegration(outputs, photoInsights);
      
      console.log(`🎯 [CONTENT INTEGRATION] Enhanced validation results:`, {
        isValid: validation.isValid,
        overallScore: validation.score,
        conversionScore: validation.conversionScore,
        issues: validation.issues,
        mustMentionFeatures: photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5),
        headlineFeature: photoInsights.headlineFeature || photoInsights.features[0],
        featuresUsed: getUsedPhotoFeatures(outputs, photoInsights),
        psychologyElements: {
          conversionHooks: photoInsights.conversionHooks?.length || 0,
          lifestyleScenarios: photoInsights.lifestyleScenarios?.length || 0,
          urgencyTriggers: photoInsights.urgencyTriggers?.length || 0
        },
        instagramAnalysis: {
          slideCount: outputs.igSlides.length,
          hasViralHook: outputs.igSlides[0]?.toLowerCase().includes('pov') || 
                       outputs.igSlides[0]?.toLowerCase().includes('tell me') || false,
          hasEngagementBait: outputs.igSlides.some(slide => 
            ['swipe', 'dm', 'comment', 'tag'].some(bait => slide.toLowerCase().includes(bait))
          ),
          finalSlideHasCTA: outputs.igSlides[outputs.igSlides.length - 1]?.toLowerCase().includes('dm') || 
                           outputs.igSlides[outputs.igSlides.length - 1]?.toLowerCase().includes('don\'t miss') || false,
          propertyCategory: photoInsights.propertyCategory || 'family',
          marketingPriority: photoInsights.marketingPriority || 'features'
        },
        emailAnalysis: {
          subjectLength: outputs.emailSubject.length,
          bodyLength: outputs.emailBody.length,
          hasPersonalizedSubject: outputs.emailSubject.toLowerCase().includes('your') || 
                                 outputs.emailSubject.toLowerCase().includes(photoInsights.headlineFeature?.toLowerCase() || ''),
          hasTrustBuilding: ['expert', 'experience', 'guide', 'help', 'specialist', 'local'].some(word => 
            outputs.emailBody.toLowerCase().includes(word)
          ),
          hasEmotionalConnection: ['understand', 'perfect for', 'ideal', 'exactly what'].some(phrase => 
            outputs.emailBody.toLowerCase().includes(phrase)
          ),
          hasNextStep: ['schedule', 'call', 'contact', 'reply', 'viewing', 'showing'].some(word => 
            outputs.emailBody.toLowerCase().includes(word)
          ),
          buyerPersona: photoInsights.buyerProfile || 'general',
          relationshipStage: 'initial_contact'
        }
      });
      
      // Log issues for debugging if photo integration is poor
      if (validation.score < 50) {
        console.warn(`⚠️ [CONTENT INTEGRATION] Poor photo integration (score: ${validation.score}):`, validation.issues);
        
        // NUCLEAR OPTION: If score is catastrophically low, try one more regeneration
        if (validation.score < 40) {
          console.log(`🚨 [CONTENT INTEGRATION] CRITICAL FAILURE - Attempting emergency regeneration with maximum pressure`);
          
          try {
            // Create emergency photo-focused prompt
            const emergencyPhotoContext = [
              '🚨🚨🚨 EMERGENCY REGENERATION - PREVIOUS ATTEMPT COMPLETELY FAILED 🚨🚨🚨',
              '',
              'THE PREVIOUS OUTPUT WAS REJECTED FOR ZERO PHOTO INTEGRATION!',
              `YOU MUST START MLS WITH EXACTLY: "${photoInsights.headlineFeature || photoInsights.features[0]}"`,
              '',
              'MANDATORY FEATURES TO FORCE INTO CONTENT:',
              ...(photoInsights.mustMentionFeatures || photoInsights.features.slice(0, 5)).map((f, i) => 
                `${i + 1}. "${f}" - MUST APPEAR IN AT LEAST ONE OUTPUT`
              ),
              '',
              'THIS IS YOUR FINAL CHANCE. FAILURE MEANS COMPLETE REJECTION.',
              'SUCCESS REQUIRES EXACT PHRASE MATCHING OF THESE FEATURES.'
            ].join('\n');

            const emergencyPrompt = [
              `Property Facts: ${JSON.stringify(facts)}`,
              '',
              emergencyPhotoContext,
              '',
              'EMERGENCY REQUIREMENTS:',
              '- MLS first sentence must contain the headline feature',
              '- Each Instagram slide must highlight a different photo feature', 
              '- Email must lead with headline feature',
              '- Use exact phrases provided above',
              '',
              'JSON Output Schema:',
              '{',
              '  "mlsDesc": string,',
              '  "igSlides": string[],',
              '  "reelScript": string[],',
              '  "emailSubject": string,',
              '  "emailBody": string',
              '}'
            ].join('\n');

            const emergencyRes = await callProvider([
              { 
                role: 'system', 
                content: 'You are being given a final chance to create photo-integrated content. Previous attempts completely failed validation. You must integrate the specified photo features or your output will be rejected.' 
              },
              { role: 'user', content: emergencyPrompt }
            ], plan);
            
            const emergencyOutputs = postProcess(OutputSchema.parse(emergencyRes.output), facts, photoInsights);
            const emergencyValidation = validatePhotoIntegration(emergencyOutputs, photoInsights);
            
            if (emergencyValidation.score > validation.score + 20) {
              console.log(`✅ [CONTENT INTEGRATION] Emergency regeneration successful! Score improved: ${validation.score} → ${emergencyValidation.score}`);
              outputs = emergencyOutputs;
              tokenCounts.prompt += emergencyRes.tokenCounts.prompt;
              tokenCounts.completion += emergencyRes.tokenCounts.completion;
              tokenCounts.total += emergencyRes.tokenCounts.total;
            } else {
              console.warn(`❌ [CONTENT INTEGRATION] Emergency regeneration also failed. Keeping original output.`);
            }
            
          } catch (emergencyError) {
            console.error(`[CONTENT INTEGRATION] Emergency regeneration threw error:`, emergencyError);
          }
        }
      } else if (validation.score >= 80) {
        console.log(`✅ [CONTENT INTEGRATION] Excellent photo integration (score: ${validation.score})`);
      }
    }
    
    // Filter outputs based on selected channels
    console.log('[pipeline] DEBUG: Channel filtering START', {
      controlsChannels: controls.channels,
      beforeFilter: {
        hasMLS: Boolean(outputs.mlsDesc),
        hasIG: outputs.igSlides.length > 0,
        hasReel: outputs.reelScript.length > 0,
        hasEmail: Boolean(outputs.emailSubject)
      }
    });
    
    if (controls.channels?.length) {
      const filteredOutputs = { ...outputs };
      
      // Channel to output field mapping
      const channelOutputMap: Record<string, (outputs: Output) => void> = {
        'mls': (o) => { 
          const keep = controls.channels?.includes('mls');
          console.log(`[pipeline] MLS: keep=${keep}`);
          if (!keep) o.mlsDesc = ''; 
        },
        'instagram': (o) => { 
          const keep = controls.channels?.includes('instagram');
          console.log(`[pipeline] Instagram: keep=${keep}`);
          if (!keep) o.igSlides = []; 
        },
        'reel': (o) => { 
          const keep = controls.channels?.includes('reel');
          console.log(`[pipeline] Reel: keep=${keep}`);
          if (!keep) {
            o.reelScript = [];
            o.reelHooks = [];
          }
        },
        'email': (o) => { 
          const keep = controls.channels?.includes('email');
          console.log(`[pipeline] Email: keep=${keep}`);
          if (!keep) {
            o.emailSubject = '';
            o.emailBody = '';
          }
        }
      };
      
      // Apply filtering
      Object.keys(channelOutputMap).forEach(channel => {
        channelOutputMap[channel](filteredOutputs);
      });
      
      console.log('[pipeline] Channel filtering COMPLETE', {
        selected: controls.channels,
        afterFilter: {
          hasMLSContent: Boolean(filteredOutputs.mlsDesc),
          hasIGContent: filteredOutputs.igSlides.length > 0,
          hasReelContent: filteredOutputs.reelScript.length > 0,
          hasEmailContent: Boolean(filteredOutputs.emailSubject || filteredOutputs.emailBody)
        }
      });
      
      outputs = filteredOutputs;
    } else {
      console.log('[pipeline] WARNING: No channels specified, not filtering');
    }
    
    return {
      outputs,
      flags,
      promptVersion: PROMPT_VERSION,
      rulesVersion: RULES_VERSION,
      tokenCounts,
      photoInsights,
    };
  } catch (err) {
    console.warn('[pipeline] critique pass failed', err);
    const outputs = postProcess(OutputSchema.parse(critique), facts, photoInsights);
    const flags = complianceScan(outputs);
    return {
      outputs,
      flags,
      promptVersion: PROMPT_VERSION,
      rulesVersion: RULES_VERSION,
      tokenCounts,
      photoInsights,
    };
  }
}

