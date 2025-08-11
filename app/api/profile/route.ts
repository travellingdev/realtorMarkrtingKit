import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { display_name, avatar_url, marketing_opt_in, timezone, locale } = body || {};
  const update: Record<string, unknown> = {};
  if (typeof display_name === 'string') update.display_name = display_name.slice(0, 80);
  if (typeof avatar_url === 'string') update.avatar_url = avatar_url;
  if (typeof marketing_opt_in === 'boolean') update.marketing_opt_in = marketing_opt_in;
  if (typeof timezone === 'string') update.timezone = timezone;
  if (typeof locale === 'string') update.locale = locale;
  if (Object.keys(update).length === 0) return NextResponse.json({ ok: true });
  const { error } = await sb.from('profiles').update(update).eq('id', user.id);
  if (error) return NextResponse.json({ error: 'db' }, { status: 500 });
  return NextResponse.json({ ok: true });
}


