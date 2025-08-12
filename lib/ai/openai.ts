import type { Payload } from '@/lib/generator';
import type { Outputs } from '@/types/kit';
import { z } from 'zod';

type OpenAIChatResponse = {
  choices: Array<{
    message: { role: string; content: string };
  }>;
};

const MODEL_FREE = process.env.OPENAI_MODEL_FREE || 'gpt-5-2025-08-07';
const MODEL_PRO = process.env.OPENAI_MODEL_PRO || 'gpt-5-2025-08-07';
const PROMPT_VERSION = process.env.OPENAI_PROMPT_VERSION || 'v2';
const DEFAULT_TIMEOUT_MS = Number(process.env.OPENAI_TIMEOUT_MS || 15000);
const CRITIQUE_PASS = (process.env.OPENAI_CRITIQUE_PASS ?? 'true').toLowerCase() !== 'false';
let OPENAI_ENV_LOGGED = false;
function toNum(s?: string) {
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function buildMessages(payload: Payload) {
  const facts = {
    address: payload.address || undefined,
    neighborhood: payload.neighborhood || undefined,
    beds: toNum(payload.beds),
    baths: toNum(payload.baths),
    sqft: toNum(payload.sqft),
    features: (payload.features || []).slice(0, 10),
    propertyType: payload.propertyType || undefined,
    tone: payload.tone || undefined,
    brandVoice: payload.brandVoice || undefined,
  } as const;

  const system = [
    'You generate real-estate marketing copy for licensed agents.',
    'Only use the following FACTS. If a detail is not present in FACTS, omit it. Do not invent new numbers, dates, or amenities.',
    'Fair Housing: avoid references to protected classes, schools quality, crime, or demographics.',
    'Return ONLY valid JSON that matches the required keys exactly. No comments or extra keys.',
  ].join(' ');

  const developer = [
    `PROMPT_VERSION: ${PROMPT_VERSION}`,
    '',
    'FACTS (ground truth):',
    JSON.stringify(facts),
    '',
    'RESPONSE KEYS (guidance):',
    JSON.stringify(
      {
        mlsDesc: 'string (<= 900 chars, MLS-safe; short sentences).',
        igSlides: 'array of 5-7 short strings; each <= 110 chars.',
        reelScript: 'array of exactly 3 strings: Hook (0–3s), Middle (4–20s), CTA (21–30s).',
        emailSubject: 'string (<= 70 chars).',
        emailBody: 'string (<= 900 chars; bullets allowed).',
      },
      null,
      2
    ),
    '',
    'Return ONLY a JSON object with exactly these keys: {"mlsDesc", "igSlides", "reelScript", "emailSubject", "emailBody"}.',
  ].join('\n');

  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: developer },
  ];
}

const OutputSchema = z.object({
  mlsDesc: z.string().max(900),
  igSlides: z.array(z.string().max(110)).min(5).max(7),
  reelScript: z.array(z.string()).length(3),
  emailSubject: z.string().max(70),
  emailBody: z.string().max(900),
});

function validateAndTighten(json: any) {
  const parsed = OutputSchema.safeParse(json);
  if (parsed.success) return parsed.data;
  throw new Error('invalid_output_schema');
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callOpenAIJson(
  messages: Array<{ role: 'system' | 'user'; content: string }>,
  {
    model,
    temperature,
    signal,
  }: { model: string; temperature: number; signal: AbortSignal }
) {
  const apiKey = process.env.OPENAI_API_KEY!;
  let lastErr: any;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, temperature, response_format: { type: 'json_object' }, messages }),
      signal,
    });
    if (res.ok) {
      const data = (await res.json()) as OpenAIChatResponse;
      return data.choices?.[0]?.message?.content || '{}';
    }
    lastErr = new Error(`openai_${res.status}`);
    // Backoff retry on 429/5xx only
    if (attempt === 0 && (res.status === 429 || res.status >= 500)) {
      await sleep(600);
      continue;
    }
    break;
  }
  throw lastErr;
}

function safeParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

async function generateOnce(payload: Payload, model: string, signal: AbortSignal) {
  const messagesA = buildMessages(payload);
  const draftStr = await callOpenAIJson(messagesA, { model, temperature: 0.3, signal });
  let draft = safeParse(draftStr);

  if (!CRITIQUE_PASS) return draft;

  const critiqueMessages: Array<{ role: 'system' | 'user'; content: string }> = [
    messagesA[0],
    {
      role: 'user',
      content: [
        'DRAFT:',
        JSON.stringify(draft, null, 2),
        'Fix ONLY: (1) facts vs FACTS, (2) MLS/fair-housing issues, (3) length/format caps. Return VALID JSON only; same keys.',
      ].join('\n'),
    },
  ];
  const revisedStr = await callOpenAIJson(critiqueMessages, { model, temperature: 0.2, signal });
  return safeParse(revisedStr);
}

export async function generateOutputsWithOpenAI(
  payload: Payload,
  plan: 'FREE' | 'PRO' | 'TEAM' = 'FREE',
  options?: { timeoutMs?: number }
): Promise<Outputs> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const model = plan === 'FREE' ? MODEL_FREE : MODEL_PRO;
  const controller = new AbortController();
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  if (!OPENAI_ENV_LOGGED) {
    const preview = `${apiKey.slice(0, 5)}…${apiKey.slice(-4)}`;
    console.log('[openai] env', {
      apiKey: preview,
      modelFree: MODEL_FREE,
      modelPro: MODEL_PRO,
      timeoutMs,
      promptVersion: PROMPT_VERSION,
      critiquePass: CRITIQUE_PASS,
    });
    OPENAI_ENV_LOGGED = true;
  }
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    console.log('[openai] request', { model, plan });
    let json = await generateOnce(payload, model, controller.signal);
    try {
      const valid = validateAndTighten(json);
      const outputs: Outputs = {
        mlsDesc: valid.mlsDesc,
        igSlides: valid.igSlides,
        reelScript: valid.reelScript,
        emailSubject: valid.emailSubject,
        emailBody: valid.emailBody,
      };
      return outputs;
    } catch {
      // One retry
      json = await generateOnce(payload, model, controller.signal);
      const valid2 = validateAndTighten(json);
      const outputs: Outputs = {
        mlsDesc: valid2.mlsDesc,
        igSlides: valid2.igSlides,
        reelScript: valid2.reelScript,
        emailSubject: valid2.emailSubject,
        emailBody: valid2.emailBody,
      };
      return outputs;
    }
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      console.error('[openai] abort (timeout)', { timeoutMs });
    }
    if (typeof e?.message === 'string' && e.message.startsWith('openai_')) {
      console.error('[openai] provider error', { code: e.message });
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}


