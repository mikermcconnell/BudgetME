# Personal Budgeting Web App - Complete Project Documentation

## Table of Contents
1. [Product Requirements Document](#product-requirements-document)
2. [Software Requirements Specification](#software-requirements-specification)
3. [UI Design Document](#ui-design-document)

---

## Product Requirements Document

### 1. Elevator Pitch

A single-user personal budgeting web app that simplifies financial management for everyday users. Upload credit card statements from major banks (Amex, Mastercard, Visa), automatically categorize transactions, track income and expenses, and visualize financial trends through clean, mobile-friendly dashboards. Set monthly budgets, receive optional reminders, and stay on top of your money with practical features designed for clarity over complexity.

### 2. Who is this app for

**Primary Users:** Everyday people who want to take control of their personal finances without complex financial software

**Target Demographics:**
- Individuals seeking practical expense tracking solutions
- Users who prefer uploading statements over manual entry
- People who want monthly budget planning capabilities
- Users who need cross-device synchronization for their financial data

**Use Cases:**
- Monthly budget planning and review
- Everyday expense tracking and categorization
- Financial trend analysis and spending insights
- Budget progress monitoring and overage alerts

### 3. Functional Requirements

#### 💳 Expense Tracking
- **Credit Card Statement Upload Support:**
  - Amex, Mastercard, and Visa statement formats
  - Automatic parsing of supported formats into transaction records
  - Fallback manual column mapping for unsupported/malformed files
- **Transaction Management:**
  - Manual add/edit/delete capabilities for expenses
  - Automatic category assignment using predefined categories
  - Optional notes and tags for individual transactions
  - Transaction search and filtering capabilities

#### 💰 Income Tracking
- Manual input for both recurring and one-time income
- Income categorization (Salary, Gifts, Side Jobs, etc.)
- Income vs. expense comparison and tracking

#### 📊 Dashboard & Visualization
- **Financial Visualizations:**
  - Income vs. expenses over time (line/bar charts)
  - Category breakdowns (pie charts, bar charts, stacked bar charts)
  - Monthly and yearly trend analysis
  - Budget progress indicators with overage alerts
- **Filtering Options:**
  - Custom date range selection
  - Category-specific filtering
  - Transaction search capabilities

#### 🎯 Budgets & Notifications
- Monthly budget target setting per category
- Total monthly budget cap configuration
- Optional monthly email reminders for statement uploads
- Budget progress tracking with near-limit and overage alerts
- User-configurable reminder preferences

#### 🔄 Data Management
- Cross-device synchronization using Supabase backend
- Monthly/yearly data export (CSV or PDF format)
- Data backup and recovery capabilities

#### 🔒 Security & Privacy
- Encrypted data storage for financial information
- Secure file upload handling for statements
- User authentication and session management
- No direct bank account linking - file upload only approach

### 4. User Stories

#### First-Time User Onboarding
- **As a new user,** I want to create an account and immediately upload my first credit card statement so I can see my recent transactions categorized automatically
- **As a new user,** I want the app to guide me through the initial setup process so I understand how to use the core features

#### Regular Usage - Expense Management
- **As a regular user,** I want to upload my monthly credit card statements so my transactions are automatically imported and categorized
- **As a user,** I want to manually add cash transactions or edit incorrect categorizations so my records are complete and accurate
- **As a user,** I want to add notes to specific transactions so I can remember context for unusual expenses

#### Budget Planning & Monitoring
- **As a budget-conscious user,** I want to set monthly spending limits per category so I can control my finances
- **As a user,** I want to see visual alerts when I'm approaching or exceeding my budget limits so I can adjust my spending
- **As a user,** I want to receive optional monthly reminders to upload new statements so I stay current with my tracking

#### Analysis & Insights
- **As a user,** I want to view spending trends over time so I can understand my financial patterns
- **As a user,** I want to filter my data by date ranges and categories so I can analyze specific aspects of my finances
- **As a user,** I want to export my financial data so I can use it for taxes or other purposes

#### Cross-Device Access
- **As a mobile user,** I want to access my budget data on my phone so I can check spending while I'm out
- **As a user,** I want my data to sync across my devices so I can manage my budget from anywhere

### 5. User Interface

#### Layout & Navigation
- **Responsive Design:** Fully functional on mobile and desktop devices
- **Side Panel Navigation:** Drawer-style navigation for main sections:
  - Dashboard (default view)
  - Expenses
  - Income  
  - Budgets
  - Settings
- **Theme Support:** Light/dark mode toggle in settings

#### Key Interface Components
- **Dashboard:** Clean, card-based layout showing financial summaries and charts
- **Upload Interface:** Drag-and-drop file upload with clear progress indicators and error feedback
- **Transaction Lists:** Sortable, filterable tables with inline editing capabilities
- **Budget Setup:** Intuitive forms for setting category limits and preferences
- **Charts & Visualizations:** Interactive charts using Recharts or Chart.js
- **Settings Panel:** User preferences, theme toggle, and notification settings

#### User Experience Principles
- **Clarity First:** Clean, practical forms and clear visual hierarchy
- **Error Handling:** Comprehensive feedback for upload failures, parsing errors, and validation issues
- **Mobile Optimization:** Touch-friendly controls and responsive layouts
- **Loading States:** Clear progress indicators for file processing and data operations

#### Technical Implementation
- **Frontend:** React-based component architecture
- **Backend:** Supabase for data storage and user authentication
- **File Processing:** Modular CSV/PDF parser with bank-specific configurations
- **Notifications:** EmailJS or Resend for optional email reminders
- **Data Visualization:** Recharts or Chart.js for financial charts and graphs

### Success Metrics
- **Primary Goal:** Achieve 50%+ user return rate
- **Secondary Metrics:** 
  - Average time to first successful statement upload
  - Monthly active users maintaining budget tracking
  - User satisfaction with automatic categorization accuracy

---

## Software Requirements Specification

### System Design

#### Overview
- **Application Type**: Single-page web application (SPA) with server-side rendering
- **Deployment Model**: Static site deployment on Vercel with Supabase backend services
- **User Model**: Single-user personal finance application with secure authentication
- **Data Processing**: Client-side CSV/PDF parsing with secure cloud storage
- **Offline Support**: Basic offline viewing with online-required uploads and sync

#### Core System Components
- **Frontend Application**: React-based web interface
- **Authentication Service**: Supabase Auth with email/password
- **Database**: Supabase PostgreSQL with real-time subscriptions
- **File Processing**: Client-side parsing libraries with Supabase Storage
- **Email Service**: Resend or EmailJS for budget reminders
- **Deployment**: Vercel static hosting with automatic deployments

### Architecture Pattern

#### Pattern: Jamstack with Backend-as-a-Service (BaaS)
- **Frontend**: Static React application pre-built and served from CDN
- **Backend**: Supabase provides database, authentication, real-time, and storage
- **API Layer**: Supabase auto-generated REST and GraphQL APIs
- **Build Process**: Vercel handles build optimization and deployment

#### Benefits for Beginner Developer
- **Minimal backend code**: Supabase handles server-side complexity
- **Automatic scaling**: Vercel and Supabase scale automatically
- **Built-in security**: Authentication and row-level security included
- **Fast development**: Pre-built services reduce custom code requirements
- **Great documentation**: Both platforms have excellent learning resources

### State Management

#### Client-Side State: React Context + useState
- **Global State**: React Context for user authentication and app settings
- **Local State**: useState hooks for component-specific data
- **Server State**: Supabase real-time subscriptions for live data updates
- **Form State**: React Hook Form for transaction inputs and budget setup

#### State Structure
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

### Data Flow

#### Upload and Processing Flow
1. **File Upload**: User drags/drops CSV → Supabase Storage
2. **Client Parsing**: JavaScript CSV parser processes file
3. **Data Validation**: Client validates transaction format
4. **Category Assignment**: Auto-categorization using rule engine
5. **Database Insert**: Batch insert transactions via Supabase client
6. **Real-time Update**: UI updates automatically via subscriptions

#### Authentication Flow
1. **Login**: Supabase Auth handles email/password verification
2. **Session**: JWT token stored in localStorage (Supabase default)
3. **Authorization**: Row Level Security ensures user data isolation
4. **Logout**: Supabase client clears session and redirects

#### Budget Monitoring Flow
1. **Real-time Calculation**: Database triggers calculate spending totals
2. **Alert Generation**: Client-side logic checks budget thresholds
3. **Notification Display**: React components show budget status
4. **Email Reminders**: Scheduled via Supabase Edge Functions

### Technical Stack

#### Frontend Framework
- **React 18**: Component-based UI with hooks
- **Next.js 14**: Full-stack React framework with app router
- **TypeScript**: Type safety for better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

#### UI Components & Libraries
- **Headless UI**: Accessible React components
- **Heroicons**: Clean SVG icon system
- **Recharts**: React charts for financial visualizations
- **React Hook Form**: Form handling with validation
- **Date-fns**: Date manipulation utilities

#### File Processing
- **PapaParse**: CSV parsing and validation
- **PDF-lib**: PDF statement parsing (if needed)
- **File-type**: File format detection and validation

#### Backend Services (Supabase)
- **Database**: PostgreSQL with real-time subscriptions
- **Authentication**: Built-in auth with email verification
- **Storage**: File uploads for statements and exports
- **Edge Functions**: Serverless functions for email notifications
- **Row Level Security**: Database-level access control

#### Development Tools
- **Vercel**: Deployment and hosting platform
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality

### Authentication Process

#### User Registration
1. User submits email/password via Supabase Auth signup
2. Supabase sends email verification link
3. User confirms email to activate account
4. Default user preferences created in database
5. Redirect to onboarding dashboard

#### Login Process
1. User enters credentials in login form
2. Supabase Auth validates and returns session
3. JWT token stored automatically by Supabase client
4. User redirected to dashboard with authenticated state
5. Row Level Security applies to all database queries

#### Session Management
- **Automatic Refresh**: Supabase handles JWT refresh tokens
- **Persistent Sessions**: User stays logged in across browser sessions
- **Logout**: Clear session and redirect to login page
- **Security**: All database access filtered by authenticated user ID

### Route Design

#### Public Routes
- `/` - Landing page with app overview
- `/login` - Authentication form
- `/signup` - User registration form
- `/forgot-password` - Password reset request

#### Protected Routes (Require Authentication)
- `/dashboard` - Financial overview and quick actions
- `/expenses` - Transaction management and upload
- `/income` - Income tracking and management
- `/budget` - Budget setup and monitoring
- `/reports` - Data visualization and exports
- `/settings` - User preferences and account management

#### Route Implementation
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

### API Design

#### Supabase Auto-Generated APIs
Supabase automatically provides REST and GraphQL APIs based on database schema:

#### Core Data Operations
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

#### Custom Edge Functions
```typescript
// Supabase Edge Functions for business logic
POST /functions/v1/process-statement    // Parse uploaded statement
POST /functions/v1/send-budget-reminder // Email reminder
POST /functions/v1/export-data         // Generate report export
```

#### Authentication Endpoints
```typescript
// Supabase Auth (built-in endpoints)
POST /auth/v1/signup         // User registration
POST /auth/v1/token          // Login
POST /auth/v1/logout         // Logout
POST /auth/v1/recover        // Password reset
```

### Database Design ERD

#### Core Tables

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

#### Relationships
- **One-to-Many**: User → Transactions, Categories, Budgets, Income
- **Many-to-One**: Transactions → Categories
- **One-to-One**: User → Profile
- **Unique Constraints**: One budget per category per month per user

#### Row Level Security (RLS) Policies
```sql
-- Users can only access their own data
CREATE POLICY user_data_isolation ON transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_categories ON categories
  FOR ALL USING (auth.uid() = user_id OR is_default = true);

CREATE POLICY user_budgets ON monthly_budgets
  FOR ALL USING (auth.uid() = user_id);
```

#### Indexes for Performance
```sql
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_budgets_user_month ON monthly_budgets(user_id, month);
```

---

## UI Design Document

### Layout Structure

#### Primary Layout Framework
- **Full-screen tab-based interface** with clean horizontal tab navigation at the top
- **Single-focus content area** below tabs that fills entire viewport
- **No split views or side panels** - each tab contains complete, self-contained experience
- **Persistent header** with app logo, user avatar, and settings access
- **Notification badges** on relevant tabs (Expenses, Budget) to indicate pending actions

#### Tab Organization
1. **Dashboard** - Financial overview and key metrics
2. **Expenses** - Transaction management and categorization  
3. **Income** - Income tracking and management
4. **Budget** - Budget setup and monitoring
5. **Reports** - Data visualization and export tools

### Core Components

#### Dashboard Tab
- **Hero metric card** prominently displaying current month's net income/expense
- **Quick status cards** in grid layout showing budget progress, recent uploads, spending alerts
- **Recent activity feed** with last 5-10 transactions
- **Upload prompt card** when statements are due

#### Expenses Tab
- **Upload zone** at top with drag-drop functionality and file status
- **Transaction table** with inline editing, sorting, and filtering controls
- **Category management panel** that slides up from bottom when needed
- **Bulk action toolbar** for multiple transaction operations

#### Income Tab
- **Add income button** prominently placed
- **Income summary cards** showing recurring vs one-time income
- **Simple list view** of income entries with edit/delete actions

#### Budget Tab
- **Category budget cards** in grid layout with progress bars and spending indicators
- **Total budget summary** at top with month-to-month comparison
- **Quick budget setup wizard** for new users

#### Reports Tab
- **Chart selection controls** at top (time period, chart type, categories)
- **Large visualization area** with interactive charts
- **Export controls** and data summary below charts

### Interaction Patterns

#### Navigation Flow
- **Single-click tab switching** with smooth fade transitions
- **Contextual actions** appear within each tab's content area
- **Modal overlays** for complex forms (budget setup, transaction editing)
- **Bottom-sheet slide-ups** for quick actions (category assignment, notes)

#### File Upload Process
- **Drag-and-drop visual feedback** with animated upload zone
- **Progress indicators** during file processing
- **Success/error states** with clear next-step guidance
- **Preview tables** before final transaction import

#### Data Interaction
- **Hover states** on all interactive elements
- **Inline editing** for transaction details (click to edit)
- **Bulk selection** with checkboxes for multiple transactions
- **Quick filters** via dropdown and search bars

### Visual Design Elements & Color Scheme

#### Color Palette (Mint-Inspired)
- **Primary Blue**: #0F73EE (navigation, primary actions)
- **Success Green**: #00C896 (positive balances, on-budget indicators)
- **Warning Orange**: #FF8C42 (approaching budget limits)
- **Alert Red**: #FF5A5A (over-budget, errors)
- **Neutral Gray**: #6B7280 (secondary text, borders)
- **Background**: #F9FAFB (main background)
- **Card White**: #FFFFFF (card backgrounds)

#### Visual Elements
- **Rounded corners** (8px radius) on all cards and buttons
- **Subtle shadows** for card elevation and depth
- **Progress bars** with gradient fills and smooth animations
- **Icon system** using Heroicons or similar modern icon set
- **Card-based layout** with consistent 16px padding and 12px gaps

### Mobile, Web App, Desktop Considerations

#### Desktop Primary (1200px+)
- **Optimized tab widths** with generous spacing
- **Grid layouts** utilizing full width (3-4 columns for cards)
- **Larger touch targets** while maintaining visual hierarchy
- **Keyboard shortcuts** for power users (tab navigation, quick actions)

#### Tablet Adaptation (768px-1199px)
- **Responsive grid collapse** to 2-column layouts
- **Touch-optimized interactions** with larger buttons
- **Maintained tab structure** with adjusted spacing

#### Mobile Considerations (320px-767px)
- **Tab navigation transforms** to bottom tab bar
- **Single-column layouts** for all content
- **Simplified data tables** with swipe actions
- **Collapsible sections** for better content organization
- **Mobile-first interactions** like swipe-to-delete

### Typography

#### Font Stack
- **Primary**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Monospace**: 'SF Mono', Monaco, 'Cascadia Code', monospace (for currency amounts)

#### Type Scale
- **Heading 1**: 32px, Semi-bold (main page titles)
- **Heading 2**: 24px, Semi-bold (section headers)
- **Heading 3**: 18px, Medium (card titles)
- **Body**: 16px, Regular (primary content)
- **Small**: 14px, Regular (secondary info, labels)
- **Caption**: 12px, Medium (metadata, timestamps)

#### Currency Display
- **Large amounts**: 24px, Medium, monospace
- **Standard amounts**: 16px, Medium, monospace
- **Small amounts**: 14px, Regular, monospace

### Accessibility

#### WCAG Compliance
- **Color contrast** minimum 4.5:1 for normal text, 3:1 for large text
- **Focus indicators** visible on all interactive elements
- **Alt text** for all meaningful images and icons
- **Semantic HTML** structure with proper heading hierarchy

#### Keyboard Navigation
- **Tab order** follows logical content flow
- **Skip links** for main content areas
- **Keyboard shortcuts** documented and accessible
- **Modal trap focus** during overlay interactions

#### Screen Reader Support
- **ARIA labels** for complex UI elements (charts, progress bars)
- **Live regions** for dynamic content updates (upload status, alerts)
- **Descriptive link text** and button labels
- **Table headers** properly associated with data cells

#### Additional Considerations
- **Reduced motion** support via CSS prefers-reduced-motion
- **High contrast mode** compatibility
- **Zoom support** up to 200% without horizontal scrolling
- **Clear error messages** with specific guidance for resolution