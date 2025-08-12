import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    console.log('[api/me] anonymous');
    return NextResponse.json({ user: null, quota: null }, { status: 200 });
  }
  console.log('[api/me] begin', { userId: user.id });
  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  const freeLimit = 2 + (profile?.quota_extra || 0);
  const resp = {
    user: { ...user, avatar_url: profile?.avatar_url || null },
    quota: { used: profile?.quota_used || 0, limit: freeLimit, extraUnlocked: (profile?.quota_extra || 0) > 0 },
    plan: profile?.plan || 'FREE',
  };
  console.log('[api/me] return', { userId: user.id, plan: resp.plan, used: resp.quota.used, limit: resp.quota.limit });
  return NextResponse.json(resp);
}