-- Greener App Database Schema for Supabase

-- Users of your app
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_user_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User preferences and goals
CREATE TABLE user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  monthly_carbon_target numeric DEFAULT 10.0,
  currency text DEFAULT 'USD',
  notifications_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Each merchant account linked via Knot (Amazon, Walmart, Uber, etc.)
CREATE TABLE merchant_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  merchant_id text NOT NULL, -- Knot merchant id
  status text,               -- e.g. authenticated, disconnected
  created_at timestamptz DEFAULT now()
);

-- Order-level transaction
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  merchant_account_id uuid REFERENCES merchant_accounts(id) ON DELETE CASCADE,
  knot_transaction_id text NOT NULL, -- Knot's transaction id
  order_datetime timestamptz,
  total_amount numeric,
  currency text,
  status text, -- e.g. PENDING, SHIPPED, DELIVERED
  raw_json jsonb, -- full Knot response for debugging
  created_at timestamptz DEFAULT now()
);

-- Line items inside each transaction
CREATE TABLE transaction_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  external_id text, -- Knot's product external_id
  name text,
  quantity integer,
  unit_price numeric,
  total numeric,
  url text,
  category text, -- Fashion, Electronics, Health & Personal Care, etc.
  auto_categorized boolean DEFAULT true, -- track if auto-categorized or manually set
  created_at timestamptz DEFAULT now()
);

-- Emissions estimates per product
CREATE TABLE emissions_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES transaction_products(id) ON DELETE CASCADE,
  factor_source text, -- e.g. "climatiq", "manual-category"
  factor_id text,
  method text, -- "pcf" | "category" | "spend"
  estimated_co2e_kg numeric,
  confidence int, -- 0-100
  created_at timestamptz DEFAULT now()
);

-- Optional: store suggested greener swaps
CREATE TABLE product_alternatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES transaction_products(id) ON DELETE CASCADE,
  alt_name text,
  alt_url text,
  co2e_kg numeric,
  savings_percent numeric,
  created_at timestamptz DEFAULT now()
);

-- Performance indexes
CREATE INDEX idx_users_external_user_id ON users(external_user_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_merchant_accounts_user_id ON merchant_accounts(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_datetime ON transactions(order_datetime);
CREATE INDEX idx_transaction_products_transaction_id ON transaction_products(transaction_id);
CREATE INDEX idx_transaction_products_category ON transaction_products(category);
CREATE INDEX idx_emissions_estimates_product_id ON emissions_estimates(product_id);
CREATE INDEX idx_product_alternatives_product_id ON product_alternatives(product_id);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE emissions_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_alternatives ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = external_user_id);

CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = user_preferences.user_id 
    AND users.external_user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view own merchant accounts" ON merchant_accounts
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = merchant_accounts.user_id 
    AND users.external_user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view own transactions" ON transactions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = transactions.user_id 
    AND users.external_user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view own transaction products" ON transaction_products
  FOR ALL USING (EXISTS (
    SELECT 1 FROM transactions 
    JOIN users ON users.id = transactions.user_id
    WHERE transactions.id = transaction_products.transaction_id 
    AND users.external_user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view own emissions estimates" ON emissions_estimates
  FOR ALL USING (EXISTS (
    SELECT 1 FROM transaction_products 
    JOIN transactions ON transactions.id = transaction_products.transaction_id
    JOIN users ON users.id = transactions.user_id
    WHERE transaction_products.id = emissions_estimates.product_id 
    AND users.external_user_id = auth.uid()::text
  ));

CREATE POLICY "Users can view own product alternatives" ON product_alternatives
  FOR ALL USING (EXISTS (
    SELECT 1 FROM transaction_products 
    JOIN transactions ON transactions.id = transaction_products.transaction_id
    JOIN users ON users.id = transactions.user_id
    WHERE transaction_products.id = product_alternatives.product_id 
    AND users.external_user_id = auth.uid()::text
  ));

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 