import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClients';

export async function POST() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  const newExtra = Math.max(1, (profile?.quota_extra || 0));
  await sb.from('profiles').update({ quota_extra: newExtra }).eq('id', user.id);
  return NextResponse.json({ ok: true, quota_extra: newExtra });
}