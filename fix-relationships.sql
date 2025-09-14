-- Fix foreign key relationship between transaction_products and emissions_estimates
-- Run this in your Supabase SQL Editor

-- First, make sure emissions_estimates table exists with proper foreign key
DROP TABLE IF EXISTS emissions_estimates CASCADE;

CREATE TABLE emissions_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES transaction_products(id) ON DELETE CASCADE,
  factor_source text DEFAULT 'category',
  factor_id text,
  method text DEFAULT 'category',
  estimated_co2e_kg numeric,
  confidence integer DEFAULT 50,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE emissions_estimates ENABLE ROW LEVEL SECURITY;

-- Permissive policy for testing
DROP POLICY IF EXISTS "Allow all for testing estimates" ON emissions_estimates;
CREATE POLICY "Allow all for testing estimates" ON emissions_estimates FOR ALL USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_estimates_product_id ON emissions_estimates(product_id);
CREATE INDEX IF NOT EXISTS idx_estimates_method ON emissions_estimates(method); 