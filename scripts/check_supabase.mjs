import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load backend .env
dotenv.config({ path: './artifacts/api-server/.env' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;

console.log('Using SUPABASE_URL=', SUPABASE_URL ? SUPABASE_URL.slice(0, 40) + '...' : SUPABASE_URL);
console.log('Has key:', Boolean(SUPABASE_KEY));

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing URL or key.');
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

(async () => {
  try {
    console.log('Listing tables via RPC / trying a simple query on profiles...');
    const { data, error } = await supabase.from('profiles').select('user_id, username').limit(1);
    if (error) {
      console.error('Query error:', error.message || error);
      process.exit(3);
    }
    console.log('Query success, sample row:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(4);
  }
})();
