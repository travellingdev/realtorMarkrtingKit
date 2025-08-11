import { supabaseServer } from '@/lib/supabaseServer';

export default async function UsagePage() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null; // Auth enforced by layout

  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  const plan = profile?.plan || 'FREE';
  const used = profile?.quota_used || 0;
  const limit = 2 + (profile?.quota_extra || 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Usage & Plan</h1>
      <div className="mt-6 rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
        <div className="flex items-center justify-between text-sm">
          <div>Free kits used</div>
          <div>{Math.min(used, limit)} / {limit}</div>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-white/10">
          <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${Math.min(100, Math.round((Math.min(used, limit)/Math.max(1, limit))*100))}%` }} />
        </div>
        <div className="mt-4 flex gap-3">
          <a href="/?openSurvey=1" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">Get 1 more free kit</a>
          <a href="/?openBilling=1" className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:opacity-90">Upgrade</a>
        </div>
        <div className="mt-6 text-sm text-white/60">Current plan: {plan}</div>
      </div>
    </main>
  );
}


