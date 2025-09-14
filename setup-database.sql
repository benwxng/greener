-- Greener App Database Setup
-- Run this in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_user_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  monthly_carbon_target numeric DEFAULT 10.0,
  currency text DEFAULT 'USD',
  notifications_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Merchant accounts
CREATE TABLE IF NOT EXISTS merchant_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  merchant_id text NOT NULL,
  status text DEFAULT 'authenticated',
  created_at timestamptz DEFAULT now()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  merchant_account_id uuid REFERENCES merchant_accounts(id) ON DELETE CASCADE,
  knot_transaction_id text NOT NULL,
  order_datetime timestamptz,
  total_amount numeric,
  currency text DEFAULT 'USD',
  status text,
  raw_json jsonb,
  created_at timestamptz DEFAULT now()
);

-- Transaction products
CREATE TABLE IF NOT EXISTS transaction_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  external_id text,
  name text,
  quantity integer DEFAULT 1,
  unit_price numeric,
  total numeric,
  url text,
  category text,
  auto_categorized boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Emissions estimates
CREATE TABLE IF NOT EXISTS emissions_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES transaction_products(id) ON DELETE CASCADE,
  factor_source text DEFAULT 'category',
  factor_id text,
  method text DEFAULT 'category',
  estimated_co2e_kg numeric,
  confidence integer DEFAULT 50,
  created_at timestamptz DEFAULT now()
);

-- Product alternatives
CREATE TABLE IF NOT EXISTS product_alternatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES transaction_products(id) ON DELETE CASCADE,
  alt_name text,
  alt_url text,
  co2e_kg numeric,
  savings_percent numeric,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE emissions_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_alternatives ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow users to see only their own data)
CREATE POLICY "Users can view own profile" ON users
  FOR ALL USING (auth.uid()::text = external_user_id);

CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = user_preferences.user_id 
    AND users.external_user_id = auth.uid()::text
  ));

CREATE POLICY "Users can manage own merchant accounts" ON merchant_accounts
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = merchant_accounts.user_id 
    AND users.external_user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view own transactions" ON transactions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = transactions.user_id 
    AND users.external_user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view own products" ON transaction_products
  FOR ALL USING (EXISTS (
    SELECT 1 FROM transactions 
    JOIN users ON users.id = transactions.user_id
    WHERE transactions.id = transaction_products.transaction_id 
    AND users.external_user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view own estimates" ON emissions_estimates
  FOR ALL USING (EXISTS (
    SELECT 1 FROM transaction_products 
    JOIN transactions ON transactions.id = transaction_products.transaction_id
    JOIN users ON users.id = transactions.user_id
    WHERE transaction_products.id = emissions_estimates.product_id 
    AND users.external_user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view own alternatives" ON product_alternatives
  FOR ALL USING (EXISTS (
    SELECT 1 FROM transaction_products 
    JOIN transactions ON transactions.id = transaction_products.transaction_id
    JOIN users ON users.id = transactions.user_id
    WHERE transaction_products.id = product_alternatives.product_id 
    AND users.external_user_id = auth.uid()::text
  ));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_external_id ON users(external_user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_products_transaction_id ON transaction_products(transaction_id);
CREATE INDEX IF NOT EXISTS idx_estimates_product_id ON emissions_estimates(product_id); 