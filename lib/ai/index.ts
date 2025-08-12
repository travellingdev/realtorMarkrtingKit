import type { Payload } from '@/lib/generator';
import type { Outputs } from '@/types/kit';
import { buildFacts, generateKit } from './pipeline';

export async function generateOutputsWithAI(payload: Payload, plan: 'FREE' | 'PRO' | 'TEAM' = 'FREE'): Promise<Outputs> {
  const facts = buildFacts(payload);
  const { outputs } = await generateKit({ facts, controls: { plan } });
  return outputs as Outputs;
}

