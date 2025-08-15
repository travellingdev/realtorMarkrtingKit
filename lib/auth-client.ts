import { supabaseBrowser } from './supabaseBrowser';

/**
 * Handle client-side login
 * Refreshes the page to trigger middleware auth update
 */
export async function clientLogin(email: string, password: string) {
  const supabase = supabaseBrowser();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Force a hard refresh to update server-side auth
  // This ensures middleware runs and updates auth headers
  window.location.href = '/';
  
  return data;
}

/**
 * Handle client-side signup
 * Refreshes the page to trigger middleware auth update
 */
export async function clientSignup(email: string, password: string) {
  const supabase = supabaseBrowser();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Force a hard refresh to update server-side auth
  window.location.href = '/';
  
  return data;
}

/**
 * Handle client-side logout
 * Refreshes the page to clear server-side auth
 */
export async function clientLogout() {
  const supabase = supabaseBrowser();
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
  
  // Force a hard refresh to clear server-side auth
  window.location.href = '/';
}

/**
 * Refresh auth without page reload (for background updates)
 * Use sparingly - prefer server-side auth
 */
export async function refreshAuth() {
  const response = await fetch('/api/me', {
    method: 'GET',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to refresh auth');
  }
  
  return response.json();
}