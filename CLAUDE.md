# CLAUDE.md - Instructions for Claude AI Assistant

## Project Overview

This is a personal budgeting web application called "BudgetMe" that helps users track expenses, manage budgets, and visualize financial data. The app is designed for single-user personal finance management with secure authentication.

## Tech Stack & Architecture

- **Framework**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI, Heroicons
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, Real-time)
- **Charts**: Recharts for financial visualizations
- **File Processing**: PapaParse for CSV parsing, React Dropzone for uploads
- **Deployment**: Vercel (recommended)

## Key Features

1. **Authentication**: Supabase Auth with email/password
2. **Statement Upload**: CSV/XLS/XLSX support for major banks (Amex, Visa, Mastercard, Chase)
3. **Auto-Categorization**: Intelligent transaction categorization
4. **Dashboard**: Real-time financial overview and metrics
5. **Budget Tracking**: Monthly budget setup and monitoring
6. **Income Tracking**: Manual income entry and management
7. **Reports**: Interactive charts and data export
8. **Mobile-First**: Responsive design for all devices

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (authenticated)/    # Protected routes group
│   │   ├── dashboard/      # Financial overview
│   │   ├── expenses/       # Transaction management
│   │   ├── income/         # Income tracking
│   │   ├── budget/         # Budget setup
│   │   └── reports/        # Data visualization
│   ├── login/              # Public auth pages
│   ├── signup/
│   └── globals.css         # Global styles
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI components
│   └── Navigation.tsx      # Main navigation
├── lib/                    # Utility libraries
│   ├── supabase.ts         # Supabase client
│   ├── auth.ts             # Authentication helpers
│   ├── csvParser.ts        # CSV parsing logic
│   ├── categorization.ts   # Auto-categorization
│   └── utils.ts            # General utilities
└── types/                  # TypeScript type definitions
```

## Database Schema

Core tables with Row Level Security (RLS):
- **profiles**: User profile information
- **categories**: Expense categories (default + custom)
- **transactions**: User transactions with amounts and descriptions
- **income**: Income records (recurring and one-time)
- **monthly_budgets**: Budget limits per category per month
- **statement_uploads**: Upload tracking and processing status

## UI Design Guidelines

### Layout
- **Tab-based interface**: Clean horizontal tabs (Dashboard, Expenses, Income, Budget, Reports)
- **Single-focus content**: No split views, each tab is self-contained
- **Card-based design**: Consistent 16px padding, 12px gaps, 8px border radius
- **Mobile-responsive**: Bottom tab bar on mobile, responsive grids

### Color Scheme (Mint-inspired)
- **Primary Blue**: #0F73EE (navigation, primary actions)
- **Success Green**: #00C896 (positive balances, on-budget)
- **Warning Orange**: #FF8C42 (approaching budget limits)
- **Alert Red**: #FF5A5A (over-budget, errors)
- **Neutral Gray**: #6B7280 (secondary text, borders)
- **Background**: #F9FAFB
- **Card White**: #FFFFFF

### Typography
- **Primary Font**: Inter, system fonts
- **Monospace**: For currency amounts
- **Scale**: H1 (32px), H2 (24px), H3 (18px), Body (16px), Small (14px), Caption (12px)

## Development Commands

Based on typical Next.js project structure:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` or `npm run typecheck` - TypeScript checking

## File Upload & Processing

- **Supported formats**: CSV, XLS, XLSX from major banks
- **Processing flow**: Client-side parsing → validation → auto-categorization → batch insert
- **Bank support**: Amex, Visa, Mastercard, Chase, generic formats
- **Required columns**: Date, Description, Amount (Category optional)

## Authentication & Security

- **Supabase Auth**: Email/password with email verification
- **Row Level Security**: Database-level user data isolation
- **Session management**: JWT tokens, automatic refresh
- **Protected routes**: `/dashboard`, `/expenses`, `/income`, `/budget`, `/reports`, `/settings`

## State Management

- **Global State**: React Context for auth and app settings
- **Local State**: useState for component-specific data
- **Server State**: Supabase real-time subscriptions
- **Form State**: React Hook Form for inputs and validation

## Key Interactions

1. **File Upload**: Drag-drop with progress indicators and error handling
2. **Transaction Management**: Inline editing, bulk operations, filtering
3. **Budget Setup**: Category-based limits with progress tracking
4. **Data Visualization**: Interactive charts with filtering options
5. **Mobile Navigation**: Touch-friendly with swipe actions

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Deployment

- **Primary**: Vercel with automatic deployments
- **Database**: Supabase PostgreSQL with real-time subscriptions
- **Storage**: Supabase Storage for statement uploads
- **Scaling**: Both platforms handle automatic scaling

## Important Notes for Development

1. **Security**: Never expose sensitive financial data, follow WCAG accessibility guidelines
2. **Performance**: Use Supabase real-time for live updates, implement proper loading states
3. **Error Handling**: Comprehensive feedback for upload failures and validation errors
4. **Mobile-First**: Ensure touch-friendly interactions and responsive layouts
5. **Data Validation**: Client-side validation with server-side backup
6. **Testing**: Focus on CSV parsing, categorization accuracy, and auth flows

## Common Tasks

- Adding new bank format: Update `csvParser.ts` with format-specific parsing
- New transaction category: Add to `categories` table with proper RLS policies  
- Chart customization: Modify Recharts components in reports section
- UI improvements: Follow Tailwind + Headless UI patterns
- Authentication features: Leverage Supabase Auth built-in methods