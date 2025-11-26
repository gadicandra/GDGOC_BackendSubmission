import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validasi agar tidak error saat runtime
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error('Pastikan semua variabel SUPABASE ada di .env');
}

// ANONYMOUS
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// ADMIN / SERVICE ROLE
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});