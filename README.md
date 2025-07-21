# BudgetMe - Personal Finance Tracker

A single-user personal budgeting web app that simplifies financial management for everyday users. Upload credit card statements from major banks, automatically categorize transactions, track income and expenses, and visualize financial trends through clean, mobile-friendly dashboards.

## Features

- **🔐 Secure Authentication** - Email/password authentication with Supabase
- **💳 Statement Upload** - Support for CSV/XLS/XLSX files from major banks (Amex, Visa, Mastercard, Chase)
- **🤖 Auto-Categorization** - Intelligent transaction categorization with machine learning
- **📊 Dashboard** - Real-time financial overview with key metrics
- **💰 Budget Tracking** - Set monthly budgets and monitor spending
- **📱 Mobile-Friendly** - Responsive design for all devices
- **🔄 Real-time Sync** - Cross-device synchronization via Supabase

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI, Heroicons
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Charts**: Recharts
- **File Processing**: PapaParse, React Dropzone
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BudgetMe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the SQL schema from `database/schema.sql` in your Supabase SQL editor

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (authenticated)/    # Protected routes
│   │   ├── dashboard/      # Main dashboard
│   │   ├── expenses/       # Transaction management
│   │   ├── income/         # Income tracking
│   │   ├── budget/         # Budget setup
│   │   └── reports/        # Data visualization
│   ├── login/              # Authentication pages
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

The app uses the following main tables:

- **profiles** - User profile information
- **categories** - Expense categories (default + custom)
- **transactions** - User transactions
- **income** - Income records
- **monthly_budgets** - Budget limits per category
- **statement_uploads** - Upload tracking

Row Level Security (RLS) ensures users can only access their own data.

## Supported Bank Formats

The CSV parser supports statements from:

- **American Express** - Standard CSV export
- **Visa** - Various bank formats
- **Mastercard** - Standard formats
- **Chase** - Chase-specific CSV format
- **Generic** - Common CSV formats with standard columns

### Required CSV Columns

At minimum, your CSV should contain:
- **Date** - Transaction date
- **Description** - Transaction description
- **Amount** - Transaction amount

Optional columns:
- **Category** - Pre-categorized transactions
- **Notes** - Additional notes

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues:
1. Check the [documentation](./docs/)
2. Search existing issues
3. Create a new issue with detailed information

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Bank account linking (Plaid integration)
- [ ] Investment tracking
- [ ] Bill reminders
- [ ] Export to tax software
- [ ] Multi-currency support