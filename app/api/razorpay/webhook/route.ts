export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseClients';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (req.headers.get('x-razorpay-signature') || '').trim();
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!).update(body).digest('hex');
  if (signature !== expected) return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });

  const event = JSON.parse(body);
  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const receipt = event.payload?.order?.entity?.receipt as string | undefined;
    const userId = receipt?.split('-')[0];
    const plan = receipt?.includes('-TEAM-') ? 'TEAM' : 'PRO';
    if (userId) {
      const admin = supabaseAdmin();
      await admin.from('profiles').update({ plan }).eq('id', userId);
    }
  }
  return NextResponse.json({ ok: true });
}