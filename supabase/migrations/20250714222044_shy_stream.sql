/*
  # Complete Database Schema for Barokah Printer

  1. New Tables
    - `admin_users` - Admin authentication and management
    - `customers` - Customer information
    - `printer_brands` - Printer brand master data
    - `printer_models` - Printer model data linked to brands
    - `problem_categories` - Problem category master data
    - `problems` - Specific problems linked to categories
    - `technicians` - Technician information and availability
    - `service_bookings` - Main booking/order table
    - `booking_timeline` - Timeline tracking for each booking

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for authenticated users
    - Add policies for anonymous users where needed

  3. Functions
    - Auto-generate booking IDs
    - Update timestamp triggers
    - Timeline creation triggers

  4. Relationships
    - Foreign key constraints between related tables
    - Cascade deletes where appropriate
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to generate booking ID
CREATE OR REPLACE FUNCTION generate_booking_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    counter INTEGER;
BEGIN
    -- Get current date in YYMMDD format
    SELECT 'BRK' || TO_CHAR(CURRENT_DATE, 'YYMMDD') INTO new_id;
    
    -- Get count of bookings today
    SELECT COUNT(*) + 1 INTO counter
    FROM service_bookings 
    WHERE DATE(created_at) = CURRENT_DATE;
    
    -- Append counter with zero padding
    new_id := new_id || LPAD(counter::TEXT, 3, '0');
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle new booking
CREATE OR REPLACE FUNCTION handle_new_booking()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate booking ID if not provided
    IF NEW.id IS NULL OR NEW.id = '' THEN
        NEW.id = generate_booking_id();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to create timeline after booking
CREATE OR REPLACE FUNCTION create_timeline_after_booking()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert initial timeline entries
    INSERT INTO booking_timeline (booking_id, status, title, description, completed, completed_at) VALUES
    (NEW.id, 'pending', 'Booking Diterima', 'Booking Anda telah diterima dan sedang diproses', true, CURRENT_TIMESTAMP),
    (NEW.id, 'confirmed', 'Booking Dikonfirmasi', 'Teknisi telah ditugaskan dan akan datang sesuai jadwal', false, NULL),
    (NEW.id, 'in-progress', 'Teknisi Dalam Perjalanan', 'Teknisi sedang dalam perjalanan ke lokasi Anda', false, NULL),
    (NEW.id, 'servicing', 'Sedang Diperbaiki', 'Printer sedang dalam proses perbaikan', false, NULL),
    (NEW.id, 'completed', 'Service Selesai', 'Printer telah berhasil diperbaiki dan berfungsi normal', false, NULL);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Printer Brands Table
CREATE TABLE IF NOT EXISTS printer_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Printer Models Table
CREATE TABLE IF NOT EXISTS printer_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES printer_brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Problem Categories Table
CREATE TABLE IF NOT EXISTS problem_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    icon TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Problems Table
CREATE TABLE IF NOT EXISTS problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES problem_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    severity TEXT DEFAULT 'medium',
    estimated_time TEXT,
    estimated_cost TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Technicians Table
CREATE TABLE IF NOT EXISTS technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    specialization TEXT[] DEFAULT '{}',
    experience INTEGER DEFAULT 0,
    rating NUMERIC DEFAULT 0.0,
    is_available BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Service Bookings Table
CREATE TABLE IF NOT EXISTS service_bookings (
    id TEXT PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    printer_brand_id UUID REFERENCES printer_brands(id),
    printer_model_id UUID REFERENCES printer_models(id),
    problem_category_id UUID REFERENCES problem_categories(id),
    problem_description TEXT,
    service_type TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    technician_id UUID REFERENCES technicians(id),
    estimated_cost TEXT,
    actual_cost TEXT,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Booking Timeline Table
CREATE TABLE IF NOT EXISTS booking_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT REFERENCES service_bookings(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE printer_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE printer_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_timeline ENABLE ROW LEVEL SECURITY;

-- Admin Users Policies
CREATE POLICY "Admin users can read own data" ON admin_users
    FOR SELECT TO authenticated
    USING (auth.uid()::text = id::text);

CREATE POLICY "Admin users can update own data" ON admin_users
    FOR UPDATE TO authenticated
    USING (auth.uid()::text = id::text);

-- Customers Policies
CREATE POLICY "Anyone can read customers" ON customers
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Anyone can insert customers" ON customers
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can manage customers" ON customers
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Printer Brands Policies
CREATE POLICY "Anyone can read printer brands" ON printer_brands
    FOR SELECT TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "Authenticated users can manage printer brands" ON printer_brands
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Printer Models Policies
CREATE POLICY "Anyone can read printer models" ON printer_models
    FOR SELECT TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "Authenticated users can manage printer models" ON printer_models
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Problem Categories Policies
CREATE POLICY "Anyone can read problem categories" ON problem_categories
    FOR SELECT TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "Authenticated users can manage problem categories" ON problem_categories
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Problems Policies
CREATE POLICY "Anyone can read problems" ON problems
    FOR SELECT TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "Authenticated users can manage problems" ON problems
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Technicians Policies
CREATE POLICY "Anyone can read technicians" ON technicians
    FOR SELECT TO anon, authenticated
    USING (is_active = true);

CREATE POLICY "Authenticated users can manage technicians" ON technicians
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Service Bookings Policies
CREATE POLICY "Anyone can read bookings" ON service_bookings
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Anyone can insert bookings" ON service_bookings
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can manage bookings" ON service_bookings
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Booking Timeline Policies
CREATE POLICY "Anyone can read timeline" ON booking_timeline
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Authenticated users can manage timeline" ON booking_timeline
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create triggers for updated_at columns
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at
    BEFORE UPDATE ON technicians
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_bookings_updated_at
    BEFORE UPDATE ON service_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for booking ID generation and timeline creation
CREATE TRIGGER set_booking_id_and_timeline
    BEFORE INSERT ON service_bookings
    FOR EACH ROW EXECUTE FUNCTION handle_new_booking();

CREATE TRIGGER create_timeline_trigger
    AFTER INSERT ON service_bookings
    FOR EACH ROW EXECUTE FUNCTION create_timeline_after_booking();