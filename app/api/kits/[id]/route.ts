import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClients';

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const sb = supabaseServer();
  const { data: kit } = await sb.from('kits').select('*').eq('id', ctx.params.id).single();
  if (!kit) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ status: kit.status, outputs: kit.outputs });
}