import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase_url_here')) {
  throw new Error(
    'Missing Supabase environment variables. Please update your .env.local file with your Supabase project URL and anon key.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)