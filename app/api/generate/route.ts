import { NextResponse } from 'next/server';
import { supabaseServer, supabaseAdmin } from '@/lib/supabaseClients';
import { generateOutputs, PayloadSchema } from '@/lib/generator';
import { generateOutputsWithAI } from '@/lib/ai';

export async function POST(req: Request) {
  const startedAt = Date.now();
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    console.warn('[api/generate] unauthenticated request');
    return NextResponse.json({ error: 'auth' }, { status: 401 });
  }
  console.log('[api/generate] begin', { userId: user.id });
  const body = await req.json().catch(() => ({}));
  const parse = PayloadSchema.safeParse(body);
  if (!parse.success) {
    console.warn('[api/generate] bad_request', { userId: user.id, issues: parse.error.issues?.slice?.(0, 3) });
    return NextResponse.json({ error: 'bad_request', details: parse.error.flatten() }, { status: 400 });
  }
  const payload = parse.data;
  const { data: kit, error } = await sb
    .from('kits')
    .insert({ user_id: user.id, payload, status: 'PROCESSING' })
    .select('*')
    .single();
  if (error) {
    console.error('[api/generate] insert kits failed', { userId: user.id, error });
    return NextResponse.json({ error: 'db' }, { status: 500 });
  }
  console.log('[api/generate] kit row created', { userId: user.id, kitId: kit.id });

  async function updateKitReady(outputs: any) {
    const { error: updErr } = await sb.from('kits').update({ status: 'READY', outputs }).eq('id', kit.id);
    if (!updErr) return true;
    console.error('[api/generate] update via user client failed', { kitId: kit.id, updErr });
    try {
      const admin = supabaseAdmin();
      const { error: adminErr } = await admin.from('kits').update({ status: 'READY', outputs }).eq('id', kit.id);
      if (adminErr) {
        console.error('[api/generate] update via admin client failed', { kitId: kit.id, adminErr });
        return false;
      }
      console.log('[api/generate] update via admin client success', { kitId: kit.id });
      return true;
    } catch (e: any) {
      console.error('[api/generate] admin update threw', { kitId: kit.id, error: String(e?.message || e) });
      return false;
    }
  }

  // Try AI first; fallback to local deterministic generator on failure
  try {
    const plan = 'FREE' as 'FREE' | 'PRO' | 'TEAM';
    const outputsAI = await generateOutputsWithAI(payload, plan);
    await updateKitReady(outputsAI);
    console.log('[api/generate] AI generation success', { userId: user.id, kitId: kit.id, ms: Date.now() - startedAt });
  } catch (e: any) {
    console.error('[api/generate] AI generation failed, falling back', { userId: user.id, kitId: kit.id, error: String(e?.message || e) });
    const outputsLocal = generateOutputs(payload);
    await updateKitReady(outputsLocal);
    console.log('[api/generate] local generation success', { userId: user.id, kitId: kit.id, ms: Date.now() - startedAt });
  }

  console.log('[api/generate] done', { userId: user.id, ms: Date.now() - startedAt });
  return NextResponse.json({ kitId: kit.id });
}