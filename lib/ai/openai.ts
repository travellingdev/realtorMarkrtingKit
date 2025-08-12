import type { Payload } from '@/lib/generator';
import type { Outputs } from '@/types/kit';

type OpenAIChatResponse = {
  choices: Array<{
    message: { role: string; content: string };
  }>;
};

const MODEL_FREE = process.env.OPENAI_MODEL_FREE || 'gpt-4o-mini';
const MODEL_PRO = process.env.OPENAI_MODEL_PRO || 'gpt-5';

function buildPrompt(payload: Payload): string {
  const safe = (v?: string) => (v ? v : '');
  const features = (payload.features || []).slice(0, 10).join(', ');
  return [
    'You are a real-estate copywriter. Produce MLS-compliant, fair-housing-safe content. No sensitive descriptors. Keep it specific and concise. Output JSON only, matching the schema exactly.',
    '',
    'Rules:',
    '- Do not mention protected classes, schools quality, crime, or demographics.',
    '- Prefer concrete features/benefits. Avoid unverifiable claims.',
    '- Respect requested tone and property type.',
    '',
    'Inputs:',
    `address: ${safe(payload.address)}`,
    `neighborhood: ${safe(payload.neighborhood)}`,
    `beds: ${safe(payload.beds)}; baths: ${safe(payload.baths)}; sqft: ${safe(payload.sqft)}`,
    `features: ${features}`,
    `photos: ${(payload.photos || []).join(', ')}`,
    `propertyType: ${safe(payload.propertyType)}`,
    `tone: ${safe(payload.tone)}`,
    `brandVoice: ${safe(payload.brandVoice)}`,
    '',
    'JSON schema (keys and guidance):',
    '{',
    '  "mlsDesc": string  // <= 900 chars, MLS-safe, can include brand voice lightly',
    '  "igSlides": string[] // 5-7 short lines, <= 110 chars each',
    '  "reelScript": string[] // exactly 3 lines: Hook (0-3s), Middle (4-20s), CTA (21-30s)',
    '  "emailSubject": string // <= 70 chars',
    '  "emailBody": string // <= 900 chars, friendly, bullet list ok',
    '}',
  ].join('\n');
}

export async function generateOutputsWithOpenAI(payload: Payload, plan: 'FREE' | 'PRO' | 'TEAM' = 'FREE', options?: { timeoutMs?: number }): Promise<Outputs> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const model = plan === 'FREE' ? MODEL_FREE : MODEL_PRO;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 15000);
  try {
    console.log('[openai] request', { model, plan });
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: buildPrompt(payload) },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      console.error('[openai] error', { status: res.status, txt: txt?.slice?.(0, 500) });
      throw new Error(`OpenAI error: ${res.status} ${txt}`);
    }
    const data = (await res.json()) as OpenAIChatResponse;
    const content = data.choices?.[0]?.message?.content || '{}';
    console.log('[openai] success');
    const parsed = JSON.parse(content);
    // Basic shape validation
    if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON from AI');
    const outputs: Outputs = {
      mlsDesc: String(parsed.mlsDesc || ''),
      igSlides: Array.isArray(parsed.igSlides) ? parsed.igSlides.map((x: any) => String(x)) : [],
      reelScript: Array.isArray(parsed.reelScript) ? parsed.reelScript.map((x: any) => String(x)) : [],
      emailSubject: String(parsed.emailSubject || ''),
      emailBody: String(parsed.emailBody || ''),
    };
    return outputs;
  } finally {
    clearTimeout(timeout);
  }
}


