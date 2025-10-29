-- Migration script to fix the time field precision issue
-- Run this in your Supabase SQL Editor to update the existing database schema

-- ============================================
-- FIX TIME FIELD PRECISION
-- ============================================

-- Update the time field from DECIMAL(12,3) to DECIMAL(10,2)
-- This matches the validation logic in the application code
ALTER TABLE results 
ALTER COLUMN time TYPE DECIMAL(10, 2);

-- ============================================
-- VERIFY THE CHANGE
-- ============================================

-- Check the table structure to confirm the change
SELECT 
    column_name, 
    data_type, 
    numeric_precision, 
    numeric_scale 
FROM information_schema.columns 
WHERE table_name = 'results' 
AND column_name = 'time';

-- ============================================
-- NOTES
-- ============================================

-- DECIMAL(10,2) means:
-- - 10 total digits
-- - 2 decimal places
-- - Maximum value: 99,999,999.99
-- - This is more than sufficient for running times
-- - Even a 10-hour run would be 36,000 seconds, well within limits
