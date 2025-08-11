"use client";
import React, { createContext, useContext, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

type Quota = { used: number; limit: number; extraUnlocked: boolean } | null;
type UserState = {
  user: any | null;
  plan: string | null;
  quota: Quota;
  loading: boolean;
  error: any;
  refresh: () => void;
};

const UserContext = createContext<UserState>({
  user: null,
  plan: null,
  quota: null,
  loading: true,
  error: null,
  refresh: () => {},
});

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data, error, isLoading, mutate: localMutate } = useSWR('/api/me', fetcher, { revalidateOnFocus: false });

  useEffect(() => {
    const sb = supabaseBrowser();
    const { data: sub } = sb.auth.onAuthStateChange(() => {
      // revalidate globally and locally
      mutate('/api/me');
      localMutate();
    });
    return () => { sub.subscription.unsubscribe(); };
  }, [localMutate]);

  const value: UserState = {
    user: data?.user ?? null,
    plan: data?.plan ?? null,
    quota: data?.quota ?? null,
    loading: isLoading,
    error,
    refresh: () => localMutate(),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}


