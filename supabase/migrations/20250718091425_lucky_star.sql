/*
  # Fix printer brands INSERT policy

  1. Security Changes
    - Add policy to allow anonymous users to insert printer brands
    - This enables the admin dashboard to work without authentication
    
  Note: For production use, consider implementing proper authentication
  and restricting this policy to authenticated admin users only.
*/

-- Add policy to allow anonymous users to insert printer brands
CREATE POLICY "Allow anonymous insert for printer brands"
  ON printer_brands
  FOR INSERT
  TO anon
  WITH CHECK (true);