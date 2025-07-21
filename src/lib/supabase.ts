import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Use dummy values during build time if environment variables are not set
const isDevelopment = process.env.NODE_ENV === 'development'
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'

const url = supabaseUrl && !supabaseUrl.includes('your_supabase_url_here') 
  ? supabaseUrl 
  : (isBuild ? 'https://dummy.supabase.co' : '')

const key = supabaseAnonKey && !supabaseAnonKey.includes('your_supabase_anon_key_here')
  ? supabaseAnonKey
  : (isBuild ? 'dummy-key' : '')

if (!url || !key) {
  if (isDevelopment) {
    throw new Error(
      'Missing Supabase environment variables. Please update your .env.local file with your Supabase project URL and anon key.'
    )
  }
}

export const supabase = createClient(
  url || 'https://dummy.supabase.co',
  key || 'dummy-key'
)