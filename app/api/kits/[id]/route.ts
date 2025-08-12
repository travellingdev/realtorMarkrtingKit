import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseClients';

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const sb = supabaseServer();
  console.log('[api/kits/:id] fetch', { kitId: ctx.params.id });
  const { data: kit, error } = await sb.from('kits').select('*').eq('id', ctx.params.id).single();
  if (error) {
    console.error('[api/kits/:id] db error', { kitId: ctx.params.id, error });
  }
  if (!kit) {
    console.warn('[api/kits/:id] not found', { kitId: ctx.params.id });
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  console.log('[api/kits/:id] return', { kitId: ctx.params.id, status: kit.status });
  return NextResponse.json({ status: kit.status, outputs: kit.outputs });
}