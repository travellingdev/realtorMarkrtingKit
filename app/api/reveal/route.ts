import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClients';

export async function POST() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    console.warn('[api/reveal] unauthenticated');
    return NextResponse.json({ error: 'auth' }, { status: 401 });
  }
  console.log('[api/reveal] begin', { userId: user.id });
  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  const used = profile?.quota_used || 0;
  const limit = 2 + (profile?.quota_extra || 0);
  if (used >= limit && (profile?.plan || 'FREE') === 'FREE') {
    console.log('[api/reveal] paywall', { userId: user.id, used, limit });
    return NextResponse.json({ error: 'paywall', used, limit }, { status: 402 });
  }
  const { error } = await sb.from('profiles').update({ quota_used: used + 1 }).eq('id', user.id);
  if (error) {
    console.error('[api/reveal] quota update failed', { userId: user.id, error });
    return NextResponse.json({ error: 'db' }, { status: 500 });
  }
  console.log('[api/reveal] incremented', { userId: user.id, used: used + 1 });
  return NextResponse.json({ ok: true, used: used + 1, limit });
}