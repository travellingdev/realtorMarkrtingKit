// Server-only best-effort event logger. Do not import from client bundles.
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function logEvent(type: string, meta?: Record<string, unknown>, userId?: string | null) {
  try {
    const admin = supabaseAdmin();
    await admin.from('events').insert({ type, meta: meta ?? null, user_id: userId ?? null }).select('id').single();
  } catch {
    // best-effort only; ignore failures
  }
}


