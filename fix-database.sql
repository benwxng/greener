-- Fix for missing category column and ensure all tables exist
-- Run this in your Supabase SQL Editor

-- First, let's make sure the transaction_products table exists with all needed columns
CREATE TABLE IF NOT EXISTS transaction_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid,
  external_id text,
  name text,
  quantity integer DEFAULT 1,
  unit_price numeric,
  total numeric,
  url text,
  category text,  -- This is the missing column!
  auto_categorized boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Add the category column if it doesn't exist (this is the fix)
ALTER TABLE transaction_products 
ADD COLUMN IF NOT EXISTS category text;

-- Add auto_categorized column if it doesn't exist
ALTER TABLE transaction_products 
ADD COLUMN IF NOT EXISTS auto_categorized boolean DEFAULT true;

-- Ensure other tables exist too
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_user_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS merchant_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  merchant_id text NOT NULL,
  status text DEFAULT 'authenticated',
  created_at timestamptz DEFAULT now()
);

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

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE emissions_estimates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR ALL USING (auth.uid()::text = external_user_id);

DROP POLICY IF EXISTS "Users can manage own merchant accounts" ON merchant_accounts;
CREATE POLICY "Users can manage own merchant accounts" ON merchant_accounts
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = merchant_accounts.user_id 
    AND users.external_user_id = auth.uid()::text
  ));

DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions" ON transactions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = transactions.user_id 
    AND users.external_user_id = auth.uid()::text
  ));

DROP POLICY IF EXISTS "Users can view own products" ON transaction_products;
CREATE POLICY "Users can view own products" ON transaction_products
  FOR ALL USING (true); -- Temporarily allow all access for testing

DROP POLICY IF EXISTS "Users can view own estimates" ON emissions_estimates;
CREATE POLICY "Users can view own estimates" ON emissions_estimates
  FOR ALL USING (true); -- Temporarily allow all access for testing 