import type { Payload } from '@/lib/generator';
import type { Outputs } from '@/types/kit';
import { generateOutputsWithOpenAI } from './openai';

export async function generateOutputsWithAI(payload: Payload, plan: 'FREE' | 'PRO' | 'TEAM' = 'FREE'): Promise<Outputs> {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  if (provider === 'openai') {
    return generateOutputsWithOpenAI(payload, plan);
  }
  // Default to OpenAI if unknown provider
  return generateOutputsWithOpenAI(payload, plan);
}


