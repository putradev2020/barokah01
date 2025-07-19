/*
  # Fix RLS policies for technicians table

  1. Security Updates
    - Drop existing restrictive policies that prevent INSERT operations
    - Create separate policies for each operation (SELECT, INSERT, UPDATE, DELETE)
    - Allow authenticated users full access to manage technicians
    - Maintain public read access for active technicians

  2. Changes Made
    - Fixed INSERT policy to allow authenticated users to add technicians
    - Ensured proper permissions for admin dashboard functionality
    - Maintained security by keeping RLS enabled
*/

-- Drop existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Anyone can read technicians" ON technicians;
DROP POLICY IF EXISTS "Authenticated users can manage technicians" ON technicians;

-- Create separate policies for better control and clarity

-- Allow public read access to active technicians
CREATE POLICY "Public can read active technicians"
  ON technicians
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Allow authenticated users to read all technicians (including inactive)
CREATE POLICY "Authenticated users can read all technicians"
  ON technicians
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert new technicians
CREATE POLICY "Authenticated users can insert technicians"
  ON technicians
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update technicians
CREATE POLICY "Authenticated users can update technicians"
  ON technicians
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete technicians (soft delete by setting is_active = false)
CREATE POLICY "Authenticated users can delete technicians"
  ON technicians
  FOR DELETE
  TO authenticated
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;