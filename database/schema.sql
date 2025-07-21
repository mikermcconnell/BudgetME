-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  display_name text,
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  budget_reminder_enabled boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create categories table
CREATE TABLE categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  color text DEFAULT '#6B7280',
  icon text,
  is_default boolean DEFAULT false,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default categories
INSERT INTO categories (name, color, icon, is_default) VALUES
  ('Food & Dining', '#FF8C42', '🍽️', true),
  ('Transportation', '#0F73EE', '🚗', true),
  ('Shopping', '#FF5A5A', '🛍️', true),
  ('Entertainment', '#00C896', '🎬', true),
  ('Bills & Utilities', '#6B7280', '📄', true),
  ('Healthcare', '#FF69B4', '🏥', true),
  ('Travel', '#9333EA', '✈️', true),
  ('Other', '#8B5CF6', '📦', true);

-- Create transactions table
CREATE TABLE transactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  description text NOT NULL,
  category_id uuid REFERENCES categories ON DELETE SET NULL,
  transaction_date date NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create income table
CREATE TABLE income (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  source text NOT NULL,
  income_date date NOT NULL,
  is_recurring boolean DEFAULT false,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create monthly_budgets table
CREATE TABLE monthly_budgets (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  month date NOT NULL, -- first day of month (YYYY-MM-01)
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, category_id, month)
);

-- Create statement_uploads table
CREATE TABLE statement_uploads (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  filename text NOT NULL,
  upload_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  processed_count integer,
  status text DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'error'))
);

-- Create indexes for performance
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_budgets_user_month ON monthly_budgets(user_id, month DESC);
CREATE INDEX idx_income_user_date ON income(user_id, income_date DESC);
CREATE INDEX idx_statement_uploads_user ON statement_uploads(user_id, upload_date DESC);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE statement_uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for categories
CREATE POLICY "Users can view categories" ON categories
  FOR SELECT USING (
    is_default = true OR auth.uid() = user_id
  );
CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for income
CREATE POLICY "Users can view own income" ON income
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own income" ON income
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own income" ON income
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own income" ON income
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for monthly_budgets
CREATE POLICY "Users can view own budgets" ON monthly_budgets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON monthly_budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON monthly_budgets
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON monthly_budgets
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for statement_uploads
CREATE POLICY "Users can view own uploads" ON statement_uploads
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own uploads" ON statement_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own uploads" ON statement_uploads
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, theme, budget_reminder_enabled)
  VALUES (NEW.id, NEW.email, 'light', true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on transactions
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();