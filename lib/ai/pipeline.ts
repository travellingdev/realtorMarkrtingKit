import type { Payload } from '@/lib/generator';
import type { Output, Facts, Controls } from './schemas';
import { FactsSchema, OutputSchema } from './schemas';
import { callProvider, ChatMessage, TokenCounts } from './provider';
import { analyzePhotosWithVision, enhanceContentWithInsights, type PhotoInsights } from './photoAnalysis';

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
  // Build comprehensive instructions including all controls
  const channelInstructions = controls.channels?.length 
    ? `Generate ONLY these outputs: ${controls.channels.join(', ')}. Set other outputs to empty.`
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

  // Build photo insights section
  const photoContext = photoInsights ? [
    'PHOTO ANALYSIS INSIGHTS:',
    `Rooms identified: ${photoInsights.rooms.map(r => `${r.type} (${r.features.join(', ')})`).join('; ')}`,
    `Key features visible: ${photoInsights.features.join(', ')}`,
    `Property style: ${photoInsights.style.join(', ')}`,
    `Condition: ${photoInsights.condition}`,
    `Selling points: ${photoInsights.sellingPoints.join(', ')}`,
    `Marketing angles: ${photoInsights.marketingAngles.join(', ')}`,
    '',
    'IMPORTANT: Incorporate these visual insights naturally into your copy. Mention specific features you can see in the photos.'
  ].join('\n') : '';

  const systemPrompt = [
    'You are a real-estate copywriter. Produce MLS-compliant, fair-housing-safe content.',
    'Output JSON only matching the schema exactly.',
    'Rules:',
    '- No protected classes, school quality, crime, or demographics',
    '- Respect channel selection - only generate requested outputs', 
    '- Include all provided information (open house, CTAs, social handles)',
    '- Apply tone, format preferences, and policy requirements',
    '- If photo insights are provided, use them to create compelling, specific copy'
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
    '  "reelScript": string[]  // 3-part reel script',
    '  "emailSubject": string  // Email subject line',
    '  "emailBody": string  // Email body with CTA if provided',
    '}',
    'Set any non-requested channel outputs to empty string/array.'
  ].filter(Boolean).join('\n');

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];
}

function composeCritiqueMessages(
  facts: Facts,
  draft: Output,
  controls: Controls,
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
      content: `Facts: ${JSON.stringify(facts)}\nDraft: ${JSON.stringify(draft)}${policyText}${violationText}\nControls to verify: ${controlsText}`,
    },
  ];
}

// Apply length caps and trimming to model output.
function postProcess(o: Output): Output {
  const trim = (s: string) => s.trim();
  const cap = (s: string, n: number) => (s.length > n ? s.slice(0, n) : s);
  return {
    mlsDesc: trim(cap(o.mlsDesc || '', 900)),
    igSlides: (o.igSlides || []).map((s) => trim(cap(s, 110))).slice(0, 7),
    reelScript: (o.reelScript || []).map((s) => trim(cap(s, 200))).slice(0, 3),
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

export async function generateKit({
  facts,
  controls,
}: {
  facts: Facts;
  controls: Controls;
}): Promise<{
  outputs: Output;
  flags: string[];
  promptVersion: string;
  rulesVersion: string;
  tokenCounts: TokenCounts;
  photoInsights?: PhotoInsights;
}> {
  const plan = controls.plan;
  const policy = controls.policy;
  let tokenCounts: TokenCounts = { prompt: 0, completion: 0, total: 0 };
  
  // Analyze photos if provided
  let photoInsights: PhotoInsights | undefined;
  if (facts.photos && facts.photos.length > 0) {
    try {
      console.log('[pipeline] Analyzing photos...', { count: facts.photos.length });
      photoInsights = await analyzePhotosWithVision(facts.photos);
      console.log('[pipeline] Photo analysis complete', { 
        rooms: photoInsights.rooms.length,
        features: photoInsights.features.length 
      });
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
  try {
    const critRes = await callProvider(
      composeCritiqueMessages(facts, critique, controls),
      plan
    );
    tokenCounts.prompt += critRes.tokenCounts.prompt;
    tokenCounts.completion += critRes.tokenCounts.completion;
    tokenCounts.total += critRes.tokenCounts.total;
    let parsed = OutputSchema.parse(critRes.output);
    let pv = policyViolations(parsed, policy);
    if (pv.missing.length || pv.banned.length) {
      try {
        const retryRes = await callProvider(
          composeCritiqueMessages(facts, parsed, controls, pv),
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
    let outputs = postProcess(parsed);
    pv = policyViolations(outputs, policy);
    if (pv.missing.length || pv.banned.length) {
      try {
        const postRes = await callProvider(
          composeCritiqueMessages(facts, outputs, controls, pv),
          plan
        );
        tokenCounts.prompt += postRes.tokenCounts.prompt;
        tokenCounts.completion += postRes.tokenCounts.completion;
        tokenCounts.total += postRes.tokenCounts.total;
        outputs = postProcess(OutputSchema.parse(postRes.output));
      } catch (err) {
        console.warn('[pipeline] post-process critique pass failed', err);
      }
    }
    const flags = complianceScan(outputs);
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
    const outputs = postProcess(OutputSchema.parse(critique));
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

