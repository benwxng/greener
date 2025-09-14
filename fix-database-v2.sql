-- Updated fix for Supabase database schema
-- Run this in your Supabase SQL Editor

-- First, let's recreate the transaction_products table with all needed columns
DROP TABLE IF EXISTS transaction_products CASCADE;

CREATE TABLE transaction_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid, -- Optional foreign key for now
  external_id text,
  name text NOT NULL,
  quantity integer DEFAULT 1,
  unit_price numeric,
  total numeric,
  url text,
  category text,
  auto_categorized boolean DEFAULT true,
  transaction_id_original text, -- Store original transaction ID as text
  created_at timestamptz DEFAULT now()
);

-- Ensure other core tables exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_user_id text UNIQUE NOT NULL,
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

-- Enable RLS but with permissive policies for testing
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE emissions_estimates ENABLE ROW LEVEL SECURITY;

-- Temporarily allow all access for testing
DROP POLICY IF EXISTS "Allow all for testing" ON transaction_products;
CREATE POLICY "Allow all for testing" ON transaction_products FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for testing users" ON users;
CREATE POLICY "Allow all for testing users" ON users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for testing estimates" ON emissions_estimates;
CREATE POLICY "Allow all for testing estimates" ON emissions_estimates FOR ALL USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_external_id ON transaction_products(external_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON transaction_products(category);
CREATE INDEX IF NOT EXISTS idx_products_transaction_original ON transaction_products(transaction_id_original); 