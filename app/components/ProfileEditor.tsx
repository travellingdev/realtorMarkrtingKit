"use client";
import React, { useState } from 'react';
import { useUser } from '@/app/providers/UserProvider';

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
];

const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
];

export default function ProfileEditor({
  initialDisplayName,
  initialAvatarUrl,
  initialMarketingOptIn,
  initialTimezone,
  initialLocale,
}: {
  initialDisplayName?: string | null;
  initialAvatarUrl?: string | null;
  initialMarketingOptIn?: boolean | null;
  initialTimezone?: string | null;
  initialLocale?: string | null;
}) {
  const { refresh } = useUser();
  const [displayName, setDisplayName] = useState(initialDisplayName || '');
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl || '');
  const [marketingOptIn, setMarketingOptIn] = useState<boolean>(initialMarketingOptIn ?? true);
  const [timezone, setTimezone] = useState(initialTimezone || 'UTC');
  const [locale, setLocale] = useState(initialLocale || 'en');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const onSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName,
          avatar_url: avatarUrl,
          marketing_opt_in: marketingOptIn,
          timezone,
          locale,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setMsg('Saved');
      setTimeout(() => setMsg(''), 1500);
      await refresh();
    } catch {
      setMsg('Save failed');
      setTimeout(() => setMsg(''), 1500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 space-y-4"
    >
      <div>
        <label htmlFor="displayName" className="text-sm text-white/60">
          Display name
        </label>
        <input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={80}
          className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-400/60"
        />
      </div>
      <div>
        <label htmlFor="avatarUrl" className="text-sm text-white/60">
          Avatar URL
        </label>
        <input
          id="avatarUrl"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-400/60"
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          id="mkt"
          type="checkbox"
          checked={marketingOptIn}
          onChange={(e) => setMarketingOptIn(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="mkt" className="text-sm text-white/80">
          I’d like to receive product tips and updates
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="timezone" className="text-sm text-white/60">
            Timezone
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-400/60"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="locale" className="text-sm text-white/60">
            Locale
          </label>
          <select
            id="locale"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-400/60"
          >
            {LOCALES.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className={
            saving
              ? 'rounded-2xl bg-white/60 text-neutral-900 px-4 py-2 font-semibold cursor-not-allowed'
              : 'rounded-2xl bg-white text-neutral-900 px-4 py-2 font-semibold hover:opacity-90'
          }
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {msg && <span className="text-sm text-white/70">{msg}</span>}
      </div>
    </form>
  );
}


