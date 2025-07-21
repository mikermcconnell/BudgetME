'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Transaction } from '@/types'

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState(0)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent transactions
        const { data: transactionData } = await supabase
          .from('transactions')
          .select(`
            *,
            category:categories(name, color)
          `)
          .order('transaction_date', { ascending: false })
          .limit(10)

        if (transactionData) {
          setTransactions(transactionData)
          
          // Calculate total expenses
          const total = transactionData.reduce((sum, t) => sum + Number(t.amount), 0)
          setTotalExpenses(total)

          // Calculate current month expenses
          const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
          const monthlyTotal = transactionData
            .filter(t => t.transaction_date.startsWith(currentMonth))
            .reduce((sum, t) => sum + Number(t.amount), 0)
          setMonthlyExpenses(monthlyTotal)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral/20 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-neutral/20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-neutral">Overview of your financial activity</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral mb-1">This Month's Expenses</p>
              <p className="text-2xl font-bold text-foreground">
                ${Math.abs(monthlyExpenses).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <span className="text-2xl">💳</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral mb-1">Quick Upload</p>
              <p className="text-sm text-primary">Add new expenses</p>
            </div>
            <a 
              href="/expenses"
              className="p-3 bg-warning/10 rounded-lg hover:bg-warning/20 transition-colors"
            >
              <span className="text-2xl">📄</span>
            </a>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent Transactions</h2>
            <a 
              href="/expenses" 
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View all
            </a>
          </div>
        </div>
        
        <div className="p-6">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-foreground mb-2">No transactions yet</h3>
              <p className="text-neutral mb-6">Upload your first bank statement to get started</p>
              <a 
                href="/expenses"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Upload Statement
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-neutral/10 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: transaction.category?.color || '#6B7280' }}
                    >
                      {transaction.category?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <p className="text-sm text-neutral">
                        {transaction.category?.name || 'Uncategorized'} • {new Date(transaction.transaction_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      -${Math.abs(Number(transaction.amount)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}