import type { Output } from './schemas';
import { OutputJsonSchema, OutputSchema } from './schemas';

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

const MODEL_FREE = process.env.OPENAI_MODEL_FREE || 'gpt-5-2025-08-07';
const MODEL_PRO = process.env.OPENAI_MODEL_PRO || 'gpt-5-2025-08-07';

async function request(messages: ChatMessage[], model: string, apiKey: string, timeoutMs: number): Promise<Output> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 1,
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'kit', schema: OutputJsonSchema },
        },
        messages,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`OpenAI error: ${res.status} ${txt}`);
    }
    const data: any = await res.json();
    const content = data?.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return OutputSchema.parse(parsed);
  } finally {
    clearTimeout(timeout);
  }
}

// Call the OpenAI provider with JSON schema validation. Retries once on invalid
// JSON or schema mismatch.
export async function callProvider(
  messages: ChatMessage[],
  plan: 'FREE' | 'PRO' | 'TEAM' = 'FREE',
  options?: { timeoutMs?: number }
): Promise<Output> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');
  const model = plan === 'FREE' ? MODEL_FREE : MODEL_PRO;
  const timeoutMs = options?.timeoutMs ?? 15000;

  let lastErr: any;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await request(messages, model, apiKey, timeoutMs);
    } catch (err) {
      lastErr = err;
      // Retry once on JSON parse or validation errors
      if (attempt === 0) continue;
    }
  }
  throw lastErr;
}

