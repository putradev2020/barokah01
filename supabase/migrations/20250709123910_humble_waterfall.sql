/*
  # Bookings System

  1. New Tables
    - `service_bookings`
      - `id` (text, primary key) - Custom format like BRK123456
      - `customer_id` (uuid, foreign key)
      - `printer_brand_id` (uuid, foreign key)
      - `printer_model_id` (uuid, foreign key)
      - `problem_category_id` (uuid, foreign key)
      - `problem_description` (text)
      - `service_type` (text)
      - `appointment_date` (date)
      - `appointment_time` (text)
      - `status` (text, default 'pending')
      - `technician_id` (uuid, foreign key)
      - `estimated_cost` (text)
      - `actual_cost` (text)
      - `notes` (text)
      - `rating` (integer)
      - `review` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `booking_timeline`
      - `id` (uuid, primary key)
      - `booking_id` (text, foreign key)
      - `status` (text)
      - `title` (text)
      - `description` (text)
      - `completed` (boolean, default false)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies

  3. Functions
    - Generate booking ID function
    - Auto-create timeline function
*/

-- Create service_bookings table
CREATE TABLE IF NOT EXISTS service_bookings (
  id text PRIMARY KEY,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  printer_brand_id uuid REFERENCES printer_brands(id),
  printer_model_id uuid REFERENCES printer_models(id),
  problem_category_id uuid REFERENCES problem_categories(id),
  problem_description text,
  service_type text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  status text DEFAULT 'pending',
  technician_id uuid REFERENCES technicians(id),
  estimated_cost text,
  actual_cost text,
  notes text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create booking_timeline table
CREATE TABLE IF NOT EXISTS booking_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id text REFERENCES service_bookings(id) ON DELETE CASCADE,
  status text NOT NULL,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_timeline ENABLE ROW LEVEL SECURITY;

-- Create policies for service_bookings
CREATE POLICY "Anyone can insert bookings"
  ON service_bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read bookings"
  ON service_bookings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage bookings"
  ON service_bookings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for booking_timeline
CREATE POLICY "Anyone can read timeline"
  ON booking_timeline FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage timeline"
  ON booking_timeline FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to generate booking ID
CREATE OR REPLACE FUNCTION generate_booking_id()
RETURNS text AS $$
DECLARE
  new_id text;
  counter integer;
BEGIN
  -- Get current count of bookings today
  SELECT COUNT(*) + 1 INTO counter
  FROM service_bookings
  WHERE DATE(created_at) = CURRENT_DATE;
  
  -- Generate ID with format BRK + YYYYMMDD + counter
  new_id := 'BRK' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD(counter::text, 3, '0');
  
  -- Check if ID already exists, if so increment counter
  WHILE EXISTS (SELECT 1 FROM service_bookings WHERE id = new_id) LOOP
    counter := counter + 1;
    new_id := 'BRK' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD(counter::text, 3, '0');
  END LOOP;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create default timeline
CREATE OR REPLACE FUNCTION create_booking_timeline(booking_id text)
RETURNS void AS $$
BEGIN
  INSERT INTO booking_timeline (booking_id, status, title, description, completed, completed_at) VALUES
    (booking_id, 'pending', 'Booking Diterima', 'Booking Anda telah diterima dan sedang diproses', true, now()),
    (booking_id, 'confirmed', 'Booking Dikonfirmasi', 'Teknisi telah ditugaskan dan akan datang sesuai jadwal', false, null),
    (booking_id, 'in-progress', 'Teknisi Dalam Perjalanan', 'Teknisi sedang dalam perjalanan ke lokasi Anda', false, null),
    (booking_id, 'servicing', 'Sedang Diperbaiki', 'Printer sedang dalam proses perbaikan', false, null),
    (booking_id, 'completed', 'Service Selesai', 'Printer telah berhasil diperbaiki dan berfungsi normal', false, null);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate booking ID and create timeline
CREATE OR REPLACE FUNCTION handle_new_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate booking ID if not provided
  IF NEW.id IS NULL OR NEW.id = '' THEN
    NEW.id := generate_booking_id();
  END IF;
  
  -- Set updated_at
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_id_and_timeline
  BEFORE INSERT ON service_bookings
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_booking();

-- Trigger to create timeline after booking insert
CREATE OR REPLACE FUNCTION create_timeline_after_booking()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_booking_timeline(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_timeline_trigger
  AFTER INSERT ON service_bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_timeline_after_booking();

-- Trigger for updated_at
CREATE TRIGGER update_service_bookings_updated_at 
  BEFORE UPDATE ON service_bookings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();