import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClients';
import { generateOutputs, PayloadSchema } from '@/lib/generator';
import { generateOutputsWithAI } from '@/lib/ai';

export async function POST(req: Request) {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const parse = PayloadSchema.safeParse(body);
  if (!parse.success) return NextResponse.json({ error: 'bad_request', details: parse.error.flatten() }, { status: 400 });
  const payload = parse.data;
  const { data: kit, error } = await sb
    .from('kits')
    .insert({ user_id: user.id, payload, status: 'PROCESSING' })
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: 'db' }, { status: 500 });

  // Try AI first; fallback to local deterministic generator on failure
  try {
    const plan = 'FREE' as 'FREE' | 'PRO' | 'TEAM'; // You can fetch from profiles if needed
    const outputsAI = await generateOutputsWithAI(payload, plan);
    await sb.from('kits').update({ status: 'READY', outputs: outputsAI }).eq('id', kit.id);
  } catch (e) {
    const outputsLocal = generateOutputs(payload);
    await sb.from('kits').update({ status: 'READY', outputs: outputsLocal }).eq('id', kit.id);
  }

  return NextResponse.json({ kitId: kit.id });
}