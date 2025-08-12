import type { Payload } from '@/lib/generator';
import type { Output, Facts, Controls } from './schemas';
import { FactsSchema, OutputSchema } from './schemas';
import { callProvider, ChatMessage } from './provider';

// Normalize and sanitize incoming payload values.
export function buildFacts(payload: Payload): Facts {
  const features = (payload.features || [])
    .map((f) => f.trim())
    .filter(Boolean)
    .slice(0, 10);
  const raw = {
    address: payload.address?.trim(),
    neighborhood: payload.neighborhood?.trim(),
    beds: payload.beds?.trim(),
    baths: payload.baths?.trim(),
    sqft: payload.sqft?.trim(),
    features,
    propertyType: payload.propertyType?.trim(),
    tone: payload.tone?.trim(),
    brandVoice: payload.brandVoice?.trim(),
  } as Record<string, any>;
  return FactsSchema.parse(raw);
}

function composeDraftMessages(facts: Facts): ChatMessage[] {
  return [
    {
      role: 'system',
      content:
        'You are a real-estate copywriter. Produce MLS-compliant, fair-housing-safe content. Output JSON only matching the schema exactly.',
    },
    {
      role: 'user',
      content: `Facts: ${JSON.stringify(facts)}`,
    },
  ];
}

function composeCritiqueMessages(facts: Facts, draft: Output): ChatMessage[] {
  return [
    {
      role: 'system',
      content:
        'You are a real-estate copywriter and critical editor. Ensure outputs comply with MLS and fair-housing rules. Output final JSON only.',
    },
    {
      role: 'user',
      content: `Facts: ${JSON.stringify(facts)}\nDraft: ${JSON.stringify(draft)}`,
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

const PROMPT_VERSION = '1';
const RULES_VERSION = '1';

export async function generateKit({
  facts,
  controls,
}: {
  facts: Facts;
  controls: Controls;
}): Promise<{ outputs: Output; flags: string[]; promptVersion: string; rulesVersion: string }> {
  const plan = controls.plan;
  const draft = await callProvider(composeDraftMessages(facts), plan);
  let final = draft;
  try {
    final = await callProvider(composeCritiqueMessages(facts, draft), plan);
  } catch (err) {
    console.warn('[pipeline] critique pass failed', err);
  }
  const outputs = postProcess(OutputSchema.parse(final));
  const flags = complianceScan(outputs);
  return { outputs, flags, promptVersion: PROMPT_VERSION, rulesVersion: RULES_VERSION };
}

