'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { MonthlyBudget, Category, Transaction } from '@/types'

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(true)
  const [spending, setSpending] = useState<Record<string, number>>({})

  const fetchData = async () => {
    try {
      const [budgetsResponse, categoriesResponse, spendingResponse] = await Promise.all([
        supabase
          .from('monthly_budgets')
          .select(`
            *,
            category:categories(name, color, icon)
          `)
          .eq('month', currentMonth + '-01')
          .order('created_at'),
        
        supabase
          .from('categories')
          .select('*')
          .order('name'),

        // Get spending for current month by category
        supabase
          .from('transactions')
          .select('category_id, amount')
          .gte('transaction_date', currentMonth + '-01')
          .lt('transaction_date', new Date(new Date(currentMonth + '-01').getTime() + 32 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
      ])

      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data)
      }

      if (budgetsResponse.data) {
        setBudgets(budgetsResponse.data)
      }

      // Calculate spending by category
      if (spendingResponse.data) {
        const spendingByCategory: Record<string, number> = {}
        spendingResponse.data.forEach((transaction: any) => {
          const categoryId = transaction.category_id || 'uncategorized'
          spendingByCategory[categoryId] = (spendingByCategory[categoryId] || 0) + Number(transaction.amount)
        })
        setSpending(spendingByCategory)
      }
    } catch (error) {
      console.error('Error fetching budget data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentMonth])

  const handleBudgetUpdate = async (categoryId: string, amount: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const budgetAmount = parseFloat(amount) || 0

      if (budgetAmount === 0) {
        // Delete budget if amount is 0
        await supabase
          .from('monthly_budgets')
          .delete()
          .eq('user_id', user.id)
          .eq('category_id', categoryId)
          .eq('month', currentMonth + '-01')
      } else {
        // Upsert budget
        await supabase
          .from('monthly_budgets')
          .upsert({
            user_id: user.id,
            category_id: categoryId,
            amount: budgetAmount,
            month: currentMonth + '-01'
          }, {
            onConflict: 'user_id,category_id,month'
          })
      }

      fetchData()
    } catch (error) {
      console.error('Error updating budget:', error)
    }
  }

  const getBudgetProgress = (categoryId: string, budgetAmount: number) => {
    const spent = spending[categoryId] || 0
    const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0
    return {
      spent,
      percentage: Math.min(percentage, 100),
      remaining: Math.max(budgetAmount - spent, 0),
      isOverBudget: spent > budgetAmount
    }
  }

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0)
  const totalSpent = Object.values(spending).reduce((sum, amount) => sum + amount, 0)

  if (loading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral/20 rounded w-1/4"></div>
          <div className="h-32 bg-neutral/20 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-neutral/20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Budget</h1>
          <p className="text-neutral">Set and monitor your monthly spending limits</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <input
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="px-3 py-2 border border-neutral/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Total Budget Summary */}
      <div className="bg-card p-6 rounded-lg shadow-sm border mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-neutral mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-primary">${totalBudget.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-neutral mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-foreground">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-neutral mb-1">Remaining</p>
            <p className={`text-2xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-success' : 'text-error'}`}>
              ${(totalBudget - totalSpent).toFixed(2)}
            </p>
          </div>
        </div>

        {totalBudget > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral">Overall Progress</span>
              <span className="text-foreground">{Math.round((totalSpent / totalBudget) * 100)}%</span>
            </div>
            <div className="w-full bg-neutral/20 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  totalSpent > totalBudget ? 'bg-error' : totalSpent > totalBudget * 0.8 ? 'bg-warning' : 'bg-success'
                }`}
                style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const existingBudget = budgets.find(b => b.category_id === category.id)
          const budgetAmount = existingBudget ? Number(existingBudget.amount) : 0
          const progress = getBudgetProgress(category.id, budgetAmount)

          return (
            <div key={category.id} className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: category.color || '#6B7280' }}
                  >
                    {category.icon || category.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                </div>
                <div className="text-right">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Budget"
                    value={budgetAmount || ''}
                    onChange={(e) => handleBudgetUpdate(category.id, e.target.value)}
                    className="w-24 px-2 py-1 text-sm border border-neutral/20 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-right"
                  />
                </div>
              </div>

              {budgetAmount > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral">Spent</span>
                    <span className={`font-medium ${progress.isOverBudget ? 'text-error' : 'text-foreground'}`}>
                      ${progress.spent.toFixed(2)} / ${budgetAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="w-full bg-neutral/20 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress.isOverBudget ? 'bg-error' : 
                        progress.percentage > 80 ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral">
                      {progress.isOverBudget ? 'Over budget' : 'Remaining'}
                    </span>
                    <span className={`font-medium ${
                      progress.isOverBudget ? 'text-error' : 'text-success'
                    }`}>
                      {progress.isOverBudget ? '-' : ''}${Math.abs(progress.remaining).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {budgetAmount === 0 && progress.spent > 0 && (
                <div className="text-center py-2">
                  <p className="text-sm text-neutral">Spent: ${progress.spent.toFixed(2)}</p>
                  <p className="text-xs text-warning">No budget set</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-medium text-foreground mb-2">No categories available</h3>
          <p className="text-neutral">Categories will appear once you upload your first transaction</p>
        </div>
      )}
    </div>
  )
}