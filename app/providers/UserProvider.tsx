"use client";
import React, { createContext, useContext, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

type Quota = { used: number; limit: number; extraUnlocked: boolean } | null;
interface User {
  email?: string | null;
  avatar_url?: string | null;
  [key: string]: any;
}

type UserState = {
  user: User | null;
  plan: string | null;
  quota: Quota;
  loading: boolean;
  error: any;
  refresh: () => void;
  isInitialized: boolean;
};

const UserContext = createContext<UserState>({
  user: null,
  plan: null,
  quota: null,
  loading: false,
  error: null,
  refresh: () => {},
  isInitialized: false,
});

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface UserProviderProps {
  children: React.ReactNode;
  initialData?: {
    user: User | null;
    plan: string | null;
    quota: Quota;
  };
}

export function UserProvider({ children, initialData }: UserProviderProps) {
  // Use initial data from server, only fetch if not provided
  const { data, error, isLoading, mutate: localMutate } = useSWR(
    '/api/me', 
    fetcher, 
    { 
      fallbackData: initialData,
      revalidateOnFocus: false,
      revalidateOnMount: !initialData, // Only fetch on mount if no initial data
      dedupingInterval: 5000,
      revalidateIfStale: false,
    }
  );

  // No need for initial load tracking - we have server data
  const [isInitialized] = React.useState(!!initialData);

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
    user: data?.user ?? initialData?.user ?? null,
    plan: data?.plan ?? initialData?.plan ?? null,
    quota: data?.quota ?? initialData?.quota ?? null,
    loading: isLoading && !initialData,
    error,
    refresh: () => localMutate(),
    isInitialized,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}


