import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { supabaseServer, supabaseAdmin } from '@/lib/supabaseClients';
import { generateOutputs, PayloadSchema } from '@/lib/generator';
import { buildFacts, generateKit, PROMPT_VERSION } from '@/lib/ai/pipeline';
import { ControlsSchema } from '@/lib/ai/schemas';

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
  const payload = body.payload;
  const rawControls = body.controls ?? {};
  const payloadParse = PayloadSchema.safeParse(payload);
  if (!payloadParse.success) {
    console.warn('[api/generate] bad_request', { userId: user.id, issues: payloadParse.error.issues?.slice?.(0, 3) });
    return NextResponse.json({ error: 'bad_request', details: payloadParse.error.flatten() }, { status: 400 });
  }
  const controlsParse = ControlsSchema.safeParse(rawControls);
  if (!controlsParse.success) {
    console.warn('[api/generate] bad_request', { userId: user.id, issues: controlsParse.error.issues?.slice?.(0, 3) });
    return NextResponse.json({ error: 'bad_request', details: controlsParse.error.flatten() }, { status: 400 });
  }
  const payloadData = payloadParse.data;
  const controlsData = controlsParse.data;
  const facts = buildFacts(payloadData);
  const promptVersion = PROMPT_VERSION;
  const factsHash = createHash('sha256')
    .update(JSON.stringify({ facts, controls: controlsData, promptVersion }))
    .digest('hex');
  const { data: kit, error } = await sb
    .from('kits')
    .insert({
      user_id: user.id,
      payload: payloadData,
      status: 'PROCESSING',
      facts_hash: factsHash,
    })
    .select('*')
    .single();
  if (error) {
    console.error('[api/generate] insert kits failed', { userId: user.id, error });
    return NextResponse.json({ error: 'db' }, { status: 500 });
  }
  console.log('[api/generate] kit row created', { userId: user.id, kitId: kit.id });

  async function updateKitReady(fields: any) {
    const { error: updErr } = await sb.from('kits').update({ status: 'READY', ...fields }).eq('id', kit.id);
    if (!updErr) return true;
    console.error('[api/generate] update via user client failed', { kitId: kit.id, updErr });
    try {
      const admin = supabaseAdmin();
      const { error: adminErr } = await admin.from('kits').update({ status: 'READY', ...fields }).eq('id', kit.id);
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

  const { data: cachedRows } = await sb
    .from('kits')
    .select('outputs, flags, latency_ms, token_counts, quality_score, id')
    .eq('facts_hash', factsHash)
    .eq('status', 'READY')
    .gt('created_at', new Date(Date.now() - 3600_000).toISOString())
    .order('created_at', { ascending: false })
    .limit(1);
  const cache = cachedRows?.[0];
  if (cache?.outputs) {
    await updateKitReady({
      outputs: cache.outputs,
      flags: cache.flags,
      latency_ms: cache.latency_ms,
      token_counts: cache.token_counts,
      quality_score: cache.quality_score,
      prompt_version: promptVersion,
    });
    console.log('[api/generate] cache hit', { userId: user.id, kitId: kit.id, sourceKit: cache.id });
    console.log('[api/generate] done', { userId: user.id, ms: Date.now() - startedAt });
    return NextResponse.json({ kitId: kit.id });
  }

  // Try AI first; fallback to local deterministic generator on failure
  try {
    const { outputs, flags, promptVersion, tokenCounts } = await generateKit({ facts, controls: controlsData });
    const latencyMs = Date.now() - startedAt;
    const qualityScore = Math.max(0, 100 - flags.length * 10);
    await updateKitReady({
      outputs,
      flags,
      latency_ms: latencyMs,
      token_counts: tokenCounts,
      quality_score: qualityScore,
      prompt_version: promptVersion,
    });
    console.log('[api/generate] AI generation success', { userId: user.id, kitId: kit.id, ms: latencyMs });
  } catch (e: any) {
    console.error('[api/generate] AI generation failed, falling back', { userId: user.id, kitId: kit.id, error: String(e?.message || e) });
    const outputsLocal = generateOutputs(payloadData);
    const latencyMs = Date.now() - startedAt;
    await updateKitReady({
      outputs: outputsLocal,
      flags: [],
      latency_ms: latencyMs,
      token_counts: { prompt: 0, completion: 0, total: 0 },
      quality_score: 100,
      prompt_version: null,
    });
    console.log('[api/generate] local generation success', { userId: user.id, kitId: kit.id, ms: latencyMs });
  }

  console.log('[api/generate] done', { userId: user.id, ms: Date.now() - startedAt });
  return NextResponse.json({ kitId: kit.id });
}
