export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabaseServer } from '@/lib/supabaseClients';

// Defer Razorpay instantiation to request time to avoid build-time env errors

export async function POST(req: Request) {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: 'auth' }, { status: 401 });
  const { plan } = await req.json();
  const amount = plan === 'TEAM' ? Number(process.env.TEAM_PRICE_PAISE) : Number(process.env.PRO_PRICE_PAISE);
  const currency = process.env.CURRENCY || 'INR';
  if (!amount) return NextResponse.json({ error: 'config' }, { status: 500 });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: 'config' }, { status: 500 });
  }
  const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await rzp.orders.create({ amount, currency, receipt: `${user.id}-${plan}-${Date.now()}` });
  return NextResponse.json({ order, key: process.env.RAZORPAY_KEY_ID, plan });
}