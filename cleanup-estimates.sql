-- Clean up duplicate emissions estimates
-- Run this in your Supabase SQL Editor

-- Delete all existing estimates to start fresh
DELETE FROM emissions_estimates;

-- Verify cleanup
SELECT COUNT(*) as remaining_estimates FROM emissions_estimates;

-- Check how many products we have (should be ~59)
SELECT COUNT(*) as total_products FROM transaction_products;

-- Optional: See which products exist
SELECT 
  id, 
  name, 
  category, 
  total,
  quantity
FROM transaction_products 
ORDER BY created_at DESC 
LIMIT 10; 