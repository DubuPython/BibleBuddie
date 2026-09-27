// frontend/src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// You will need to add these two variables to your frontend Vercel Environment Variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);