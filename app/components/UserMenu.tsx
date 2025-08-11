"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '@/app/providers/UserProvider';
import { openCheckout } from '@/lib/billing';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function UserMenu() {
  const { user, quota, plan, refresh } = useUser();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      if (!menuRef.current || !btnRef.current) return;
      if (!menuRef.current.contains(e.target as Node) && !btnRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  useEffect(() => {
    if (open) {
      const first = menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
      first?.focus();
    }
  }, [open]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') {
      setOpen(false);
      btnRef.current?.focus();
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
      if (!items || items.length === 0) return;
      const current = document.activeElement;
      let index = Array.from(items).findIndex((item) => item === current);
      if (index === -1) index = 0;
      else if (e.key === 'ArrowDown') index = (index + 1) % items.length;
      else index = (index - 1 + items.length) % items.length;
      items[index].focus();
    }
    if (e.key === 'Tab') {
      setOpen(false);
      if (e.shiftKey) {
        e.preventDefault();
        btnRef.current?.focus();
      }
    }
  }

  if (!user) return null;
  const used = quota?.used ?? 0;
  const limit = quota?.limit ?? 2;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white text-neutral-900 text-sm font-bold"
      >
        {user.avatar_url ? (
          <img src={user.avatar_url} alt="User avatar" className="h-full w-full object-cover" />
        ) : (
          (user.email || 'U').slice(0, 1).toUpperCase()
        )}
      </button>
      {open && (
        <div ref={menuRef} role="menu" aria-label="User menu" onKeyDown={onKeyDown} tabIndex={-1} className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-neutral-900/90 p-2 shadow-xl">
          <div className="px-3 py-2 text-xs text-white/60">{user.email}</div>
          <a href="/account" className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10" role="menuitem">My Account</a>
          <a href="/usage" className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10" role="menuitem">Usage & Plan</a>
          <button onClick={async()=>{ const r = await openCheckout('PRO'); if(r.upgraded) setOpen(false); }} className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-white/10" role="menuitem">Upgrade</button>
          <a href="/support" className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10" role="menuitem">Support</a>
          <a href="/billing" className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10" role="menuitem">Billing</a>
          <div className="mx-2 my-2 h-px bg-white/10" />
          <button
            onClick={async () => {
              const sb = supabaseBrowser();
              await sb.auth.signOut();
              setOpen(false);
              refresh();
            }}
            className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-white/10"
            role="menuitem"
          >
            Sign out
          </button>
          <div className="px-3 pb-2 text-xs text-white/60">Free kits: {Math.min(used, limit)} / {limit}</div>
        </div>
      )}
    </div>
  );
}


