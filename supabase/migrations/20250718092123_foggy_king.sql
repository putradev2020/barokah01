/*
  # Fix booking timeline RLS policy for anonymous inserts

  1. Security Changes
    - Add policy to allow anonymous users to insert into booking_timeline table
    - This is needed because the booking creation process triggers timeline creation
    - The trigger functions run with the same permissions as the user creating the booking

  2. Notes
    - This allows the database triggers to create timeline entries when bookings are created
    - The policy ensures anonymous users can insert timeline records during booking creation
*/

-- Add policy to allow anonymous users to insert into booking_timeline
CREATE POLICY "Allow anonymous insert for booking timeline"
  ON booking_timeline
  FOR INSERT
  TO anon
  WITH CHECK (true);