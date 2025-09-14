-- Check current state of database
-- Run this in your Supabase SQL Editor

-- Check products count
SELECT COUNT(*) as total_products FROM transaction_products;

-- Check estimates count  
SELECT COUNT(*) as total_estimates FROM emissions_estimates;

-- Check if estimates are linked to products
SELECT 
  tp.name,
  tp.category,
  tp.total,
  ee.estimated_co2e_kg,
  ee.method,
  ee.confidence
FROM transaction_products tp
LEFT JOIN emissions_estimates ee ON tp.id = ee.product_id
ORDER BY tp.created_at DESC
LIMIT 10;

-- Check for any products without estimates
SELECT 
  COUNT(*) as products_without_estimates
FROM transaction_products tp
LEFT JOIN emissions_estimates ee ON tp.id = ee.product_id
WHERE ee.product_id IS NULL;
