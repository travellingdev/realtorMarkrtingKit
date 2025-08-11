import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import UserMenu from '@/app/components/UserMenu';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    const path = headers().get('x-pathname') ?? '/';
    redirect(`/?returnTo=${encodeURIComponent(path)}`);
  }
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-900/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="text-sm text-white/70 hover:text-white">
            &larr; Back to app
          </a>
          <UserMenu />
        </div>
      </header>
      {children}
    </>
  );
}

