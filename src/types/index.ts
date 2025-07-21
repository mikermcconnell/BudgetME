export interface User {
  id: string
  email: string
  display_name?: string
  created_at: string
}

export interface Profile {
  id: string
  display_name?: string
  theme: 'light' | 'dark'
  budget_reminder_enabled: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  color?: string
  icon?: string
  is_default: boolean
  user_id?: string
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  description: string
  category_id?: string
  transaction_date: string
  notes?: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface Income {
  id: string
  user_id: string
  amount: number
  source: string
  income_date: string
  is_recurring: boolean
  notes?: string
  created_at: string
}

export interface MonthlyBudget {
  id: string
  user_id: string
  category_id: string
  amount: number
  month: string // YYYY-MM-01 format
  created_at: string
  category?: Category
}

export interface StatementUpload {
  id: string
  user_id: string
  filename: string
  upload_date: string
  processed_count?: number
  status: 'processing' | 'completed' | 'error'
}