import { headers } from 'next/headers';
import { supabaseServer } from './supabaseServer';

export interface ServerUser {
  id: string;
  email: string | null;
  avatar_url: string | null;
}

export interface ServerAuthData {
  user: ServerUser | null;
  plan: string;
  quota: {
    used: number;
    limit: number;
    extraUnlocked: boolean;
  } | null;
}

/**
 * Get user data from middleware headers (instant, no DB call)
 * This is populated by middleware.ts on every request
 */
export function getServerAuthFromHeaders(): ServerAuthData | null {
  try {
    const headersList = headers();
    const userDataHeader = headersList.get('x-user-data');
    
    if (!userDataHeader) {
      return null;
    }
    
    // Decode the base64 encoded user data
    const userData = JSON.parse(Buffer.from(userDataHeader, 'base64').toString());
    return userData;
  } catch (error) {
    console.error('Failed to parse user data from headers:', error);
    return null;
  }
}

/**
 * Get fresh user data from database (use sparingly, causes loading)
 * Only use this when you need absolutely fresh data
 */
export async function getServerAuthFromDB(): Promise<ServerAuthData> {
  const supabase = supabaseServer();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        user: null,
        plan: 'FREE',
        quota: null,
      };
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return {
      user: {
        id: user.id,
        email: user.email || null,
        avatar_url: profile?.avatar_url || null,
      },
      plan: profile?.plan || 'FREE',
      quota: {
        used: profile?.quota_used || 0,
        limit: 2 + (profile?.quota_extra || 0),
        extraUnlocked: (profile?.quota_extra || 0) > 0,
      },
    };
  } catch (error) {
    console.error('Failed to get server auth from DB:', error);
    return {
      user: null,
      plan: 'FREE',
      quota: null,
    };
  }
}

/**
 * Check if user is authenticated (instant check from headers)
 */
export function isAuthenticated(): boolean {
  const headersList = headers();
  return headersList.get('x-authenticated') === 'true';
}