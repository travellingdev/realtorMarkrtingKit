// Client-side helpers to preserve user intent across auth
export type IntentAction = 'reveal' | 'copyAll' | 'generate';
export type Intent = { action: IntentAction; meta?: Record<string, unknown> };

const KEY = 'rk.intent';

export function saveIntent(intent: Intent) {
  try {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(KEY, JSON.stringify(intent));
  } catch {}
}

export function readIntent(): Intent | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Intent;
  } catch {
    return null;
  }
}

export function clearIntent() {
  try {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(KEY);
  } catch {}
}


