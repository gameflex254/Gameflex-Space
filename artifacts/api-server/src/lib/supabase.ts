import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY ?? '';

let cachedClient: SupabaseClient | null | undefined;

export function getSupabaseClient() {
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    cachedClient = null;
    return null;
  }

  cachedClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}

export const supabase = getSupabaseClient();
