import type { Payload } from '@/lib/generator';
import type { Outputs } from '@/types/kit';
import { generateKit } from './pipeline';

export async function generateOutputsWithAI(payload: Payload, plan: 'FREE' | 'PRO' | 'TEAM' = 'FREE'): Promise<Outputs> {
  const { outputs } = await generateKit(payload, plan);
  return outputs;
}

