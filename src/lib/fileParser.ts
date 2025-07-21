import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import type { Transaction } from '@/types'

export interface ParsedTransaction {
  date: string
  description: string
  amount: number
  category?: string
  notes?: string
}

export interface ParseResult {
  success: boolean
  transactions: ParsedTransaction[]
  errors: string[]
  totalRows: number
  validRows: number
}

// Common bank formats and their column mappings
const BANK_FORMATS = {
  generic: {
    dateColumns: ['date', 'transaction date', 'posting date', 'trans date'],
    descriptionColumns: ['description', 'memo', 'payee', 'merchant', 'transaction description'],
    amountColumns: ['amount', 'debit amount', 'credit amount', 'transaction amount'],
    categoryColumns: ['category', 'type', 'transaction type']
  },
  chase: {
    dateColumns: ['transaction date', 'post date'],
    descriptionColumns: ['description'],
    amountColumns: ['amount'],
    categoryColumns: ['type', 'category']
  },
  amex: {
    dateColumns: ['date'],
    descriptionColumns: ['description'],
    amountColumns: ['amount'],
    categoryColumns: ['category']
  }
}

function normalizeColumnName(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '')
}

function findColumnIndex(headers: string[], possibleNames: string[]): number {
  const normalizedHeaders = headers.map(normalizeColumnName)
  
  for (const name of possibleNames) {
    const normalizedName = normalizeColumnName(name)
    const index = normalizedHeaders.findIndex(header => 
      header.includes(normalizedName) || normalizedName.includes(header)
    )
    if (index !== -1) return index
  }
  
  return -1
}

function parseAmount(value: string | number): number {
  if (typeof value === 'number') return Math.abs(value)
  
  const cleanValue = String(value)
    .replace(/[\$,\s()]/g, '')
    .replace(/[""]/g, '')
    .trim()
  
  if (!cleanValue || cleanValue === '-') return 0
  
  const amount = parseFloat(cleanValue)
  return isNaN(amount) ? 0 : Math.abs(amount)
}

function parseDate(value: string): string {
  if (!value) return new Date().toISOString().split('T')[0]
  
  try {
    // Handle various date formats
    const cleanValue = String(value).trim()
    
    // Try parsing as-is first
    let date = new Date(cleanValue)
    
    // If that fails, try common formats
    if (isNaN(date.getTime())) {
      // Try MM/DD/YYYY or DD/MM/YYYY
      const parts = cleanValue.split(/[\/\-\.]/)
      if (parts.length === 3) {
        const [part1, part2, part3] = parts
        
        // Assume MM/DD/YYYY for US banks
        date = new Date(parseInt(part3), parseInt(part1) - 1, parseInt(part2))
        
        // If still invalid, try DD/MM/YYYY
        if (isNaN(date.getTime())) {
          date = new Date(parseInt(part3), parseInt(part2) - 1, parseInt(part1))
        }
      }
    }
    
    if (isNaN(date.getTime())) {
      return new Date().toISOString().split('T')[0]
    }
    
    return date.toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

function detectBankFormat(headers: string[]): keyof typeof BANK_FORMATS {
  const normalizedHeaders = headers.map(normalizeColumnName)
  
  // Check for Chase-specific patterns
  if (normalizedHeaders.some(h => h.includes('post date') || h.includes('transaction date'))) {
    return 'chase'
  }
  
  // Check for Amex patterns
  if (normalizedHeaders.some(h => h === 'date' && normalizedHeaders.includes('description'))) {
    return 'amex'
  }
  
  return 'generic'
}

export async function parseFile(file: File): Promise<ParseResult> {
  const result: ParseResult = {
    success: false,
    transactions: [],
    errors: [],
    totalRows: 0,
    validRows: 0
  }

  try {
    let data: any[][]
    
    // Parse based on file type
    if (file.name.toLowerCase().endsWith('.csv')) {
      const text = await file.text()
      const parsed = Papa.parse(text, { 
        header: false,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
      })
      
      if (parsed.errors.length > 0) {
        result.errors = parsed.errors.map(err => err.message)
        return result
      }
      
      data = parsed.data as any[][]
    } else if (file.name.toLowerCase().match(/\.(xlsx?|xls)$/)) {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
    } else {
      result.errors.push('Unsupported file format. Please use CSV, XLS, or XLSX files.')
      return result
    }

    if (data.length < 2) {
      result.errors.push('File appears to be empty or has no data rows.')
      return result
    }

    const headers = data[0] as string[]
    const rows = data.slice(1)
    result.totalRows = rows.length

    // Detect bank format and find column indices
    const bankFormat = detectBankFormat(headers)
    const format = BANK_FORMATS[bankFormat]

    const dateIndex = findColumnIndex(headers, format.dateColumns)
    const descriptionIndex = findColumnIndex(headers, format.descriptionColumns)
    const amountIndex = findColumnIndex(headers, format.amountColumns)
    const categoryIndex = findColumnIndex(headers, format.categoryColumns)

    if (dateIndex === -1 || descriptionIndex === -1 || amountIndex === -1) {
      result.errors.push(
        `Could not find required columns. Expected: Date, Description, Amount. Found headers: ${headers.join(', ')}`
      )
      return result
    }

    // Parse each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      
      if (!row || row.length === 0) continue

      try {
        const date = parseDate(row[dateIndex])
        const description = String(row[descriptionIndex] || '').trim()
        const amount = parseAmount(row[amountIndex])
        const category = categoryIndex !== -1 ? String(row[categoryIndex] || '').trim() : undefined

        if (!description || amount === 0) {
          continue // Skip empty or zero-amount transactions
        }

        result.transactions.push({
          date,
          description,
          amount,
          category: category || undefined,
          notes: `Imported from ${file.name}`
        })
        
        result.validRows++
      } catch (error) {
        result.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    result.success = result.transactions.length > 0
    
    if (result.transactions.length === 0) {
      result.errors.push('No valid transactions found in the file.')
    }

  } catch (error) {
    result.errors.push(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return result
}