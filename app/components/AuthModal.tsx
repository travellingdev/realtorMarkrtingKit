'use client';
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import React from "react";

export default function AuthModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60" onClick={onClose} />
    <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/90 p-6">
      <div className="text-lg font-semibold">Sign in to continue</div>
      <p className="mt-1 text-sm text-white/70">Copy & download are unlocked after a quick sign-in.</p>
      <div className="mt-5 space-y-3">
        <button onClick={async () => {
          try {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
            if (!url || !key) {
              alert('Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
              return;
            }
            const sb = supabaseBrowser();
            const { data, error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
            if (error) {
              alert(`Google sign-in error: ${error.message}`);
              return;
            }
            if (data?.url) {
              window.location.href = data.url;
              return;
            }
            // Fallback: let caller refresh state
            onSuccess();
          } catch (e: any) {
            alert(`Google sign-in failed`);
          }
        }} className="w-full rounded-2xl bg-white text-neutral-900 px-4 py-2 font-semibold hover:opacity-90">Continue with Google</button>
        <button onClick={async () => {
          const email = prompt('Enter your email for magic link');
          if (!email) return;
          const sb = supabaseBrowser();
          const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
          if (!error) alert('Magic link sent. Check your email.');
        }} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10">Email magic link</button>
      </div>
      <button onClick={onClose} className="mt-4 w-full text-center text-sm text-white/60 hover:text-white">Maybe later</button>
    </div>
  </div>;
}
