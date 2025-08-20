import { createClient } from 'supabase';

const supabaseUrl = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error('SUPABASE_URL is not set');

export const supabase = createClient(supabaseUrl, anonKey || serviceRoleKey);
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);


