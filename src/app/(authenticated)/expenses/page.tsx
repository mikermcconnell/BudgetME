'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'
import { parseFile, type ParseResult } from '@/lib/fileParser'
import type { Transaction, Category } from '@/types'

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Fetch transactions and categories
  const fetchData = useCallback(async () => {
    try {
      const [transactionsResponse, categoriesResponse] = await Promise.all([
        supabase
          .from('transactions')
          .select(`
            *,
            category:categories(name, color)
          `)
          .order('transaction_date', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .order('name')
      ])

      if (transactionsResponse.data) {
        setTransactions(transactionsResponse.data)
      }
      
      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // File drop handler
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setUploading(true)
    setParseResult(null)

    try {
      const result = await parseFile(file)
      setParseResult(result)
      
      if (result.success && result.transactions.length > 0) {
        setShowPreview(true)
      }
    } catch (error) {
      console.error('Error parsing file:', error)
      setParseResult({
        success: false,
        transactions: [],
        errors: ['Failed to parse file'],
        totalRows: 0,
        validRows: 0
      })
    } finally {
      setUploading(false)
    }
  }, [])

  // Import transactions to database
  const handleImport = async () => {
    if (!parseResult?.transactions.length) return

    setUploading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Auto-categorize transactions
      const transactionsToImport = parseResult.transactions.map(tx => {
        let categoryId = null
        
        // Simple auto-categorization based on description keywords
        const description = tx.description.toLowerCase()
        const matchingCategory = categories.find(cat => {
          const catName = cat.name.toLowerCase()
          return description.includes(catName) || 
                 (catName.includes('food') && (description.includes('restaurant') || description.includes('grocery'))) ||
                 (catName.includes('gas') && description.includes('gas')) ||
                 (catName.includes('shopping') && (description.includes('amazon') || description.includes('target')))
        })
        
        if (matchingCategory) {
          categoryId = matchingCategory.id
        }

        return {
          user_id: user.id,
          amount: tx.amount,
          description: tx.description,
          category_id: categoryId,
          transaction_date: tx.date,
          notes: tx.notes
        }
      })

      const { error } = await supabase
        .from('transactions')
        .insert(transactionsToImport)

      if (error) throw error

      // Refresh data and close preview
      await fetchData()
      setShowPreview(false)
      setParseResult(null)
      
    } catch (error) {
      console.error('Error importing transactions:', error)
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  })

  if (loading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral/20 rounded w-1/4"></div>
          <div className="h-32 bg-neutral/20 rounded-lg"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-neutral/20 rounded"></div>
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Expenses</h1>
        <p className="text-neutral">Upload bank statements and manage your transactions</p>
      </div>

      {/* Upload Area */}
      <div className="mb-8">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-neutral/30 hover:border-primary/50'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} disabled={uploading} />
          
          <div className="text-4xl mb-4">📄</div>
          
          {uploading ? (
            <div>
              <p className="text-lg font-medium text-foreground mb-2">Processing file...</p>
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : isDragActive ? (
            <p className="text-lg text-primary">Drop your file here...</p>
          ) : (
            <div>
              <p className="text-lg font-medium text-foreground mb-2">
                Drop your bank statement here, or click to select
              </p>
              <p className="text-neutral mb-4">
                Supports CSV, XLS, and XLSX files from major banks
              </p>
              <div className="inline-flex px-4 py-2 bg-primary text-white rounded-lg">
                Choose File
              </div>
            </div>
          )}
        </div>

        {/* Parse Results */}
        {parseResult && (
          <div className="mt-4 p-4 bg-card rounded-lg border">
            {parseResult.success ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-success">
                      ✓ Found {parseResult.validRows} valid transactions out of {parseResult.totalRows} rows
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="px-3 py-1 text-sm border border-primary text-primary rounded hover:bg-primary/10"
                    >
                      {showPreview ? 'Hide' : 'Preview'}
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={uploading}
                      className="px-4 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                    >
                      Import All
                    </button>
                  </div>
                </div>
                
                {parseResult.errors.length > 0 && (
                  <div className="text-sm text-warning">
                    <p className="font-medium">Warnings:</p>
                    <ul className="list-disc list-inside">
                      {parseResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-error">
                <p className="font-medium">❌ Failed to parse file</p>
                <ul className="list-disc list-inside mt-2">
                  {parseResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        {showPreview && parseResult?.transactions && (
          <div className="mt-4 p-4 bg-card rounded-lg border">
            <h3 className="font-semibold text-foreground mb-3">Preview ({parseResult.transactions.length} transactions)</h3>
            <div className="max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {parseResult.transactions.slice(0, 10).map((tx, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-background rounded text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-neutral">{tx.date} • {tx.category || 'Uncategorized'}</p>
                    </div>
                    <p className="font-semibold">${tx.amount.toFixed(2)}</p>
                  </div>
                ))}
                {parseResult.transactions.length > 10 && (
                  <p className="text-center text-neutral py-2">
                    ... and {parseResult.transactions.length - 10} more transactions
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="bg-card rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">All Transactions</h2>
            <div className="text-sm text-neutral">
              {transactions.length} transactions
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-foreground mb-2">No transactions yet</h3>
              <p className="text-neutral">Upload your first bank statement to get started</p>
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
                      ${Math.abs(Number(transaction.amount)).toFixed(2)}
                    </p>
                    {transaction.notes && (
                      <p className="text-xs text-neutral">{transaction.notes}</p>
                    )}
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