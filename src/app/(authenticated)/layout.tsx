'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
          router.push('/login')
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first navigation */}
      <div className="lg:hidden">
        {/* Mobile header */}
        <div className="bg-card shadow-sm border-b">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary">BudgetMe</h1>
              <button
                onClick={handleSignOut}
                className="text-neutral hover:text-foreground"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Mobile bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
          <div className="grid grid-cols-4 py-2">
            <a href="/dashboard" className="flex flex-col items-center py-2 px-1 text-xs">
              <span className="text-lg mb-1">📊</span>
              <span className="text-neutral">Dashboard</span>
            </a>
            <a href="/expenses" className="flex flex-col items-center py-2 px-1 text-xs">
              <span className="text-lg mb-1">💳</span>
              <span className="text-neutral">Expenses</span>
            </a>
            <a href="/budget" className="flex flex-col items-center py-2 px-1 text-xs">
              <span className="text-lg mb-1">🎯</span>
              <span className="text-neutral">Budget</span>
            </a>
            <a href="/income" className="flex flex-col items-center py-2 px-1 text-xs">
              <span className="text-lg mb-1">💰</span>
              <span className="text-neutral">Income</span>
            </a>
          </div>
        </div>
      </div>

      {/* Desktop navigation */}
      <div className="hidden lg:flex lg:h-screen">
        {/* Desktop sidebar */}
        <div className="w-64 bg-card shadow-sm border-r">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary mb-8">BudgetMe</h1>
            
            <nav className="space-y-2">
              <a 
                href="/dashboard" 
                className="flex items-center px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
              >
                <span className="mr-3 text-lg">📊</span>
                Dashboard
              </a>
              <a 
                href="/expenses" 
                className="flex items-center px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
              >
                <span className="mr-3 text-lg">💳</span>
                Expenses
              </a>
              <a 
                href="/income" 
                className="flex items-center px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
              >
                <span className="mr-3 text-lg">💰</span>
                Income
              </a>
              <a 
                href="/budget" 
                className="flex items-center px-4 py-3 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
              >
                <span className="mr-3 text-lg">🎯</span>
                Budget
              </a>
            </nav>

            <div className="mt-auto pt-8">
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-neutral hover:text-foreground text-sm"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop main content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

      {/* Mobile main content */}
      <div className="lg:hidden pb-20">
        {children}
      </div>
    </div>
  )
}