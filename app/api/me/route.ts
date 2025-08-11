import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ user: null, quota: null }, { status: 200 });
  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  const freeLimit = 2 + (profile?.quota_extra || 0);
  return NextResponse.json({
    user,
    quota: { used: profile?.quota_used || 0, limit: freeLimit, extraUnlocked: (profile?.quota_extra || 0) > 0 },
    plan: profile?.plan || 'FREE',
  });
}