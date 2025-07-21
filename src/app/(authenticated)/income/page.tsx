'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Income } from '@/types'

export default function IncomePage() {
  const [income, setIncome] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    income_date: new Date().toISOString().split('T')[0],
    is_recurring: false,
    notes: ''
  })

  const fetchIncome = async () => {
    try {
      const { data } = await supabase
        .from('income')
        .select('*')
        .order('income_date', { ascending: false })

      if (data) {
        setIncome(data)
      }
    } catch (error) {
      console.error('Error fetching income:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncome()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('income')
        .insert([{
          user_id: user.id,
          source: formData.source,
          amount: parseFloat(formData.amount),
          income_date: formData.income_date,
          is_recurring: formData.is_recurring,
          notes: formData.notes || null
        }])

      if (error) throw error

      // Reset form and refresh data
      setFormData({
        source: '',
        amount: '',
        income_date: new Date().toISOString().split('T')[0],
        is_recurring: false,
        notes: ''
      })
      setShowForm(false)
      fetchIncome()
    } catch (error) {
      console.error('Error adding income:', error)
    }
  }

  const totalMonthlyIncome = income
    .filter(item => item.income_date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((sum, item) => sum + Number(item.amount), 0)

  const totalYearlyIncome = income
    .filter(item => item.income_date.startsWith(new Date().getFullYear().toString()))
    .reduce((sum, item) => sum + Number(item.amount), 0)

  if (loading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral/20 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Income</h1>
          <p className="text-neutral">Track your income sources and amounts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Add Income
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral mb-1">This Month</p>
              <p className="text-2xl font-bold text-success">
                ${totalMonthlyIncome.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral mb-1">This Year</p>
              <p className="text-2xl font-bold text-foreground">
                ${totalYearlyIncome.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral mb-1">Total Entries</p>
              <p className="text-2xl font-bold text-foreground">{income.length}</p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Income Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Add Income</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-neutral hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Source
                </label>
                <input
                  type="text"
                  required
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Salary, Freelance, Gift"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.income_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, income_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_recurring}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_recurring: e.target.checked }))}
                    className="rounded border-neutral/20 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Recurring income</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={2}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-neutral/20 text-foreground rounded-lg hover:bg-neutral/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Income List */}
      <div className="bg-card rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-foreground">Income History</h2>
        </div>
        
        <div className="p-6">
          {income.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-lg font-medium text-foreground mb-2">No income recorded yet</h3>
              <p className="text-neutral mb-6">Start by adding your first income entry</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Income
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {income.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-neutral/10 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                      <span className="text-success font-medium">$</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.source}</p>
                      <p className="text-sm text-neutral">
                        {new Date(item.income_date).toLocaleDateString()}
                        {item.is_recurring && ' • Recurring'}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-neutral mt-1">{item.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">
                      +${Number(item.amount).toFixed(2)}
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