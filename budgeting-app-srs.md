# Personal Budgeting Web App - Software Requirements Specification

## System Design

### Overview
- **Application Type**: Single-page web application (SPA) with server-side rendering
- **Deployment Model**: Static site deployment on Vercel with Supabase backend services
- **User Model**: Single-user personal finance application with secure authentication
- **Data Processing**: Client-side CSV/PDF parsing with secure cloud storage
- **Offline Support**: Basic offline viewing with online-required uploads and sync

### Core System Components
- **Frontend Application**: React-based web interface
- **Authentication Service**: Supabase Auth with email/password
- **Database**: Supabase PostgreSQL with real-time subscriptions
- **File Processing**: Client-side parsing libraries with Supabase Storage
- **Email Service**: Resend or EmailJS for budget reminders
- **Deployment**: Vercel static hosting with automatic deployments

## Architecture Pattern

### Pattern: Jamstack with Backend-as-a-Service (BaaS)
- **Frontend**: Static React application pre-built and served from CDN
- **Backend**: Supabase provides database, authentication, real-time, and storage
- **API Layer**: Supabase auto-generated REST and GraphQL APIs
- **Build Process**: Vercel handles build optimization and deployment

### Benefits for Beginner Developer
- **Minimal backend code**: Supabase handles server-side complexity
- **Automatic scaling**: Vercel and Supabase scale automatically
- **Built-in security**: Authentication and row-level security included
- **Fast development**: Pre-built services reduce custom code requirements
- **Great documentation**: Both platforms have excellent learning resources

## State Management

### Client-Side State: React Context + useState
- **Global State**: React Context for user authentication and app settings
- **Local State**: useState hooks for component-specific data
- **Server State**: Supabase real-time subscriptions for live data updates
- **Form State**: React Hook Form for transaction inputs and budget setup

### State Structure
```
AppContext {
  user: { id, email, preferences }
  theme: 'light' | 'dark'
  notifications: { budgetReminders, alerts }
}

TransactionState {
  transactions: Transaction[]
  categories: Category[]
  filters: { dateRange, category, searchTerm }
  pagination: { page, limit, total }
}

BudgetState {
  monthlyBudgets: Budget[]
  currentProgress: BudgetProgress[]
  alerts: BudgetAlert[]
}
```

## Data Flow

### Upload and Processing Flow
1. **File Upload**: User drags/drops CSV → Supabase Storage
2. **Client Parsing**: JavaScript CSV parser processes file
3. **Data Validation**: Client validates transaction format
4. **Category Assignment**: Auto-categorization using rule engine
5. **Database Insert**: Batch insert transactions via Supabase client
6. **Real-time Update**: UI updates automatically via subscriptions

### Authentication Flow
1. **Login**: Supabase Auth handles email/password verification
2. **Session**: JWT token stored in localStorage (Supabase default)
3. **Authorization**: Row Level Security ensures user data isolation
4. **Logout**: Supabase client clears session and redirects

### Budget Monitoring Flow
1. **Real-time Calculation**: Database triggers calculate spending totals
2. **Alert Generation**: Client-side logic checks budget thresholds
3. **Notification Display**: React components show budget status
4. **Email Reminders**: Scheduled via Supabase Edge Functions

## Technical Stack

### Frontend Framework
- **React 18**: Component-based UI with hooks
- **Next.js 14**: Full-stack React framework with app router
- **TypeScript**: Type safety for better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

### UI Components & Libraries
- **Headless UI**: Accessible React components
- **Heroicons**: Clean SVG icon system
- **Recharts**: React charts for financial visualizations
- **React Hook Form**: Form handling with validation
- **Date-fns**: Date manipulation utilities

### File Processing
- **PapaParse**: CSV parsing and validation
- **PDF-lib**: PDF statement parsing (if needed)
- **File-type**: File format detection and validation

### Backend Services (Supabase)
- **Database**: PostgreSQL with real-time subscriptions
- **Authentication**: Built-in auth with email verification
- **Storage**: File uploads for statements and exports
- **Edge Functions**: Serverless functions for email notifications
- **Row Level Security**: Database-level access control

### Development Tools
- **Vercel**: Deployment and hosting platform
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality

## Authentication Process

### User Registration
1. User submits email/password via Supabase Auth signup
2. Supabase sends email verification link
3. User confirms email to activate account
4. Default user preferences created in database
5. Redirect to onboarding dashboard

### Login Process
1. User enters credentials in login form
2. Supabase Auth validates and returns session
3. JWT token stored automatically by Supabase client
4. User redirected to dashboard with authenticated state
5. Row Level Security applies to all database queries

### Session Management
- **Automatic Refresh**: Supabase handles JWT refresh tokens
- **Persistent Sessions**: User stays logged in across browser sessions
- **Logout**: Clear session and redirect to login page
- **Security**: All database access filtered by authenticated user ID

## Route Design

### Public Routes
- `/` - Landing page with app overview
- `/login` - Authentication form
- `/signup` - User registration form
- `/forgot-password` - Password reset request

### Protected Routes (Require Authentication)
- `/dashboard` - Financial overview and quick actions
- `/expenses` - Transaction management and upload
- `/income` - Income tracking and management
- `/budget` - Budget setup and monitoring
- `/reports` - Data visualization and exports
- `/settings` - User preferences and account management

### Route Implementation
```typescript
// Next.js 14 App Router Structure
app/
├── page.tsx                 // Landing page
├── login/page.tsx          // Login form
├── signup/page.tsx         // Registration
├── (authenticated)/        // Route group for protected pages
│   ├── layout.tsx         // Auth wrapper + navigation
│   ├── dashboard/page.tsx
│   ├── expenses/page.tsx
│   ├── income/page.tsx
│   ├── budget/page.tsx
│   ├── reports/page.tsx
│   └── settings/page.tsx
└── middleware.ts           // Route protection logic
```

## API Design

### Supabase Auto-Generated APIs
Supabase automatically provides REST and GraphQL APIs based on database schema:

### Core Data Operations
```typescript
// Transactions
GET    /rest/v1/transactions          // List user transactions
POST   /rest/v1/transactions          // Create new transaction
PATCH  /rest/v1/transactions?id=eq.1  // Update transaction
DELETE /rest/v1/transactions?id=eq.1  // Delete transaction

// Categories
GET    /rest/v1/categories            // List categories
POST   /rest/v1/categories            // Create custom category

// Budgets
GET    /rest/v1/monthly_budgets       // Get user budgets
POST   /rest/v1/monthly_budgets       // Create/update budget
```

### Custom Edge Functions
```typescript
// Supabase Edge Functions for business logic
POST /functions/v1/process-statement    // Parse uploaded statement
POST /functions/v1/send-budget-reminder // Email reminder
POST /functions/v1/export-data         // Generate report export
```

### Authentication Endpoints
```typescript
// Supabase Auth (built-in endpoints)
POST /auth/v1/signup         // User registration
POST /auth/v1/token          // Login
POST /auth/v1/logout         // Logout
POST /auth/v1/recover        // Password reset
```

## Database Design ERD

### Core Tables

```sql
-- Users (managed by Supabase Auth)
auth.users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  created_at timestamp
)

-- User Profiles
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  display_name text,
  theme text DEFAULT 'light',
  budget_reminder_enabled boolean DEFAULT true,
  created_at timestamp DEFAULT now()
)

-- Categories
categories (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  color text,
  icon text,
  is_default boolean DEFAULT false,
  user_id uuid REFERENCES auth.users,
  created_at timestamp DEFAULT now()
)

-- Transactions
transactions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  amount decimal(10,2) NOT NULL,
  description text NOT NULL,
  category_id uuid REFERENCES categories,
  transaction_date date NOT NULL,
  notes text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
)

-- Income Records
income (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  amount decimal(10,2) NOT NULL,
  source text NOT NULL,
  income_date date NOT NULL,
  is_recurring boolean DEFAULT false,
  notes text,
  created_at timestamp DEFAULT now()
)

-- Monthly Budgets
monthly_budgets (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  category_id uuid REFERENCES categories NOT NULL,
  amount decimal(10,2) NOT NULL,
  month date NOT NULL, -- first day of month
  created_at timestamp DEFAULT now(),
  UNIQUE(user_id, category_id, month)
)

-- Statement Uploads (tracking)
statement_uploads (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  filename text NOT NULL,
  upload_date timestamp DEFAULT now(),
  processed_count integer,
  status text DEFAULT 'processing'
)
```

### Relationships
- **One-to-Many**: User → Transactions, Categories, Budgets, Income
- **Many-to-One**: Transactions → Categories
- **One-to-One**: User → Profile
- **Unique Constraints**: One budget per category per month per user

### Row Level Security (RLS) Policies
```sql
-- Users can only access their own data
CREATE POLICY user_data_isolation ON transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_categories ON categories
  FOR ALL USING (auth.uid() = user_id OR is_default = true);

CREATE POLICY user_budgets ON monthly_budgets
  FOR ALL USING (auth.uid() = user_id);
```

### Indexes for Performance
```sql
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_budgets_user_month ON monthly_budgets(user_id, month);
```