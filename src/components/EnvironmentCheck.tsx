'use client'

import { useEffect, useState } from 'react'

export default function EnvironmentCheck({ children }: { children: React.ReactNode }) {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    const configured = supabaseUrl && 
                     supabaseAnonKey && 
                     !supabaseUrl.includes('your_supabase_url_here') &&
                     !supabaseAnonKey.includes('your_supabase_anon_key_here')

    setIsConfigured(Boolean(configured))
  }, [])

  if (isConfigured === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl mb-4">⚙️</div>
          <h1 className="text-2xl font-bold text-foreground">Setup Required</h1>
          <p className="text-neutral">
            Please configure your Supabase environment variables to continue.
          </p>
          <a 
            href="/setup"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            View Setup Instructions
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}