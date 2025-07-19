/*
  # Fix printer models RLS policy for INSERT operations

  1. Security Changes
    - Add policy to allow anonymous users to insert printer models
    - This resolves the "new row violates row-level security policy" error

  2. Changes
    - Add INSERT policy for anonymous (anon) role on printer_models table
*/

-- Add policy to allow anonymous users to insert printer models
CREATE POLICY "Allow anonymous insert for printer models"
  ON printer_models
  FOR INSERT
  TO anon
  WITH CHECK (true);