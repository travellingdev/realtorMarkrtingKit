import { loadRazorpaySdk } from '@/lib/loadRazorpay';

export async function openCheckout(plan: 'PRO' | 'TEAM'): Promise<{ upgraded: boolean }> {
  // Must be called client-side
  const res = await fetch('/api/razorpay/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) return { upgraded: false };
  const data = await res.json();
  const Razorpay = await loadRazorpaySdk();
  const rzp = new Razorpay({ key: data.key, order_id: data.order.id });
  await new Promise<void>((resolve) => {
    rzp.on('payment.failed', () => resolve());
    rzp.on('payment.success', () => resolve());
    rzp.open();
  });
  // Poll /api/me until plan changes from FREE
  const start = Date.now();
  while (Date.now() - start < 30000) {
    const me = await fetch('/api/me');
    if (me.ok) {
      const j = await me.json();
      if (j?.plan && j.plan !== 'FREE') return { upgraded: true };
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return { upgraded: false };
}


