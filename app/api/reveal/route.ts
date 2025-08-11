import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClients';

export async function POST() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  const used = profile?.quota_used || 0;
  const limit = 2 + (profile?.quota_extra || 0);
  if (used >= limit && (profile?.plan || 'FREE') === 'FREE') {
    return NextResponse.json({ error: 'paywall', used, limit }, { status: 402 });
  }
  await sb.from('profiles').update({ quota_used: used + 1 }).eq('id', user.id);
  return NextResponse.json({ ok: true, used: used + 1, limit });
}