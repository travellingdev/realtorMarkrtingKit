import type { Payload } from '@/lib/generator';
import type { Output, Facts, Controls } from './schemas';
import { FactsSchema, OutputSchema } from './schemas';
import { callProvider, ChatMessage, TokenCounts } from './provider';

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
  const parts = [
    raw.beds && `${raw.beds} bed`,
    raw.baths && `${raw.baths} bath`,
    raw.propertyType,
  ].filter(Boolean) as string[];
  let summary = parts.join(' ');
  if (raw.neighborhood) {
    summary = summary
      ? `${summary} in ${raw.neighborhood}`
      : raw.neighborhood;
  }
  raw.summary = summary || undefined;
  return FactsSchema.parse(raw);
}

function composeDraftMessages(facts: Facts, controls: Controls): ChatMessage[] {
  return [
    {
      role: 'system',
      content:
        'You are a real-estate copywriter. Produce MLS-compliant, fair-housing-safe content. Output JSON only matching the schema exactly. mlsDesc about 900 chars. igSlides 5-7 captions, each ≤110 chars. reelScript 3 lines (hook, body, CTA) ≤200 chars each. emailSubject ≤70 chars; emailBody ≤900 chars.',
    },
    {
      role: 'user',
      content: `Facts: ${JSON.stringify(facts)}\nControls: ${JSON.stringify(controls)}`,
    },
  ];
}

function composeCritiqueMessages(
  facts: Facts,
  draft: Output,
  policy: Controls['policy'],
  violations?: { missing: string[]; banned: string[] }
): ChatMessage[] {
  let policyText = '';
  if (policy?.mustInclude.length || policy?.avoidWords.length) {
    policyText = `\nPolicy: must include [${policy.mustInclude.join(', ')}]; avoid words [${policy.avoidWords.join(', ')}]`;
  }
  let violationText = '';
  if (violations && (violations.missing.length || violations.banned.length)) {
    violationText = `\nViolations: missing [${violations.missing.join(', ')}]; banned [${violations.banned.join(', ')}]`;
  }
  return [
    {
      role: 'system',
      content:
        'You are a real-estate copywriter and critical editor. Ensure outputs comply with MLS and fair-housing rules. Keep structure: mlsDesc about 900 chars; igSlides 5-7 captions ≤110 chars; reelScript 3 lines (hook, body, CTA) ≤200 chars each; emailSubject ≤70 chars; emailBody ≤900 chars. Output final JSON only.',
    },
    {
      role: 'user',
      content: `Facts: ${JSON.stringify(facts)}\nDraft: ${JSON.stringify(draft)}${policyText}${violationText}`,
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
}> {
  const plan = controls.plan;
  const policy = controls.policy;
  let tokenCounts: TokenCounts = { prompt: 0, completion: 0, total: 0 };
  const draftRes = await callProvider(
    composeDraftMessages(facts, controls),
    plan
  );
  tokenCounts.prompt += draftRes.tokenCounts.prompt;
  tokenCounts.completion += draftRes.tokenCounts.completion;
  tokenCounts.total += draftRes.tokenCounts.total;
  let critique = draftRes.output;
  try {
    const critRes = await callProvider(
      composeCritiqueMessages(facts, critique, policy),
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
          composeCritiqueMessages(facts, parsed, policy, pv),
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
          composeCritiqueMessages(facts, outputs, policy, pv),
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
    };
  }
}

