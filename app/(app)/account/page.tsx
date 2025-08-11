import { supabaseServer } from '@/lib/supabaseServer';
import ProfileEditor from '@/app/components/ProfileEditor';

export default async function AccountPage() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null; // Auth enforced by layout

  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  const plan = profile?.plan || 'FREE';
  const quotaUsed = profile?.quota_used || 0;
  const freeLimit = 2 + (profile?.quota_extra || 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold">My Account</h1>
      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
          <div className="text-sm text-white/60">Email</div>
          <div className="mt-1">{user.email}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
          <div className="text-sm text-white/60">Display name</div>
          <div className="mt-1">{profile?.display_name || '—'}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
          <div className="text-sm text-white/60">Plan</div>
          <div className="mt-1">{plan}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
          <div className="text-sm text-white/60">Created</div>
          <div className="mt-1">{new Date(user.created_at || Date.now()).toLocaleString()}</div>
        </div>
        {user.email_confirmed_at ? (
          <div className="text-sm text-green-400">Email verified</div>
        ) : (
          <div className="text-sm text-yellow-400">Email not verified</div>
        )}
        <div className="text-sm text-white/60">Usage: {Math.min(quotaUsed, freeLimit)} / {freeLimit}</div>
        <div className="mt-6 text-sm text-white/60">Timezone: {profile?.timezone || 'UTC'} · Locale: {profile?.locale || 'en'}</div>
        <div className="mt-6">
          <ProfileEditor
            initialDisplayName={profile?.display_name}
            initialAvatarUrl={profile?.avatar_url}
            initialMarketingOptIn={profile?.marketing_opt_in}
            initialTimezone={profile?.timezone}
            initialLocale={profile?.locale}
          />
        </div>
      </div>
    </main>
  );
}


