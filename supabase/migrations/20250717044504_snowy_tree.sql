/*
  # Fix RLS policies for printer_models table

  1. Security Updates
    - Drop existing restrictive policies on printer_models table
    - Create new comprehensive policies for authenticated users
    - Ensure INSERT, SELECT, UPDATE, DELETE permissions work correctly
    
  2. Changes
    - Allow authenticated users to perform all operations on printer_models
    - Maintain data integrity while enabling admin functionality
    - Fix the RLS policy violation error for INSERT operations
*/

-- Drop existing policies for printer_models table
DROP POLICY IF EXISTS "Anyone can read printer models" ON printer_models;
DROP POLICY IF EXISTS "Authenticated users can manage printer models" ON printer_models;

-- Create new comprehensive policies for printer_models
CREATE POLICY "Authenticated users can read printer models"
  ON printer_models
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert printer models"
  ON printer_models
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update printer models"
  ON printer_models
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete printer models"
  ON printer_models
  FOR DELETE
  TO authenticated
  USING (true);

-- Also allow anonymous users to read printer models for public access
CREATE POLICY "Anyone can read active printer models"
  ON printer_models
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Ensure RLS is enabled
ALTER TABLE printer_models ENABLE ROW LEVEL SECURITY;