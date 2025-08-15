'use client';
import React from 'react';
import { LogIn } from 'lucide-react';
import UserMenu from './UserMenu';
import { useUser } from '@/app/providers/UserProvider';

interface AuthStatusProps {
  freeKitsUsed: number;
  freeLimit: number;
  onSignIn: () => void;
}

export default function AuthStatus({ freeKitsUsed, freeLimit, onSignIn }: AuthStatusProps) {
  const { user, loading, isInitialized } = useUser();
  
  // Only show loading if we don't have initial server data
  // With middleware, we should never see this
  if (loading && !isInitialized) {
    return (
      <div className="inline-flex items-center gap-3">
        <div className="animate-pulse">
          <div className="h-8 w-24 bg-white/10 rounded-2xl"></div>
        </div>
      </div>
    );
  }
  
  // Show sign in button if not authenticated
  if (!user) {
    return (
      <button
        onClick={onSignIn}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
      >
        <LogIn className="h-4 w-4" /> Sign in
      </button>
    );
  }
  
  // Show user menu if authenticated
  return (
    <div className="inline-flex items-center gap-3">
      <span className="text-xs text-white/70">
        Free kits used: {Math.min(freeKitsUsed, freeLimit)} / {freeLimit}
      </span>
      <UserMenu />
    </div>
  );
}