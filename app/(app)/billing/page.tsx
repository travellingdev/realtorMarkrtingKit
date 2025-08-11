import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function BillingPage() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect('/?returnTo=/billing');

  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  const plan = profile?.plan || 'FREE';

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <div className="mt-6 rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
        <div className="text-sm text-white/60">Current plan</div>
        <div className="mt-1">{plan}</div>
        <div className="mt-6 flex gap-3">
          <a href="/?openBilling=1" className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:opacity-90">Go Pro</a>
          <a href="/?openBilling=1" className="rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-900 hover:opacity-90">Team</a>
        </div>
        <div className="mt-6 text-sm text-white/60">Checkout opens a secure Razorpay widget. After payment your plan updates automatically.</div>
      </div>
    </main>
  );
}


