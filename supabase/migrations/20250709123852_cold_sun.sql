/*
  # Main Application Tables

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `email` (text)
      - `address` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `printer_brands`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)

    - `printer_models`
      - `id` (uuid, primary key)
      - `brand_id` (uuid, foreign key)
      - `name` (text)
      - `type` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)

    - `problem_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `icon` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)

    - `problems`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `severity` (text)
      - `estimated_time` (text)
      - `estimated_cost` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)

    - `technicians`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `email` (text)
      - `specialization` (text[])
      - `experience` (integer)
      - `rating` (decimal)
      - `is_available` (boolean, default true)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create printer_brands table
CREATE TABLE IF NOT EXISTS printer_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create printer_models table
CREATE TABLE IF NOT EXISTS printer_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES printer_brands(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create problem_categories table
CREATE TABLE IF NOT EXISTS problem_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  icon text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create problems table
CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES problem_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  severity text DEFAULT 'medium',
  estimated_time text,
  estimated_cost text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create technicians table
CREATE TABLE IF NOT EXISTS technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  specialization text[] DEFAULT '{}',
  experience integer DEFAULT 0,
  rating decimal DEFAULT 0.0,
  is_available boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE printer_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE printer_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for booking form)
CREATE POLICY "Anyone can read printer brands"
  ON printer_brands FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can read printer models"
  ON printer_models FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can read problem categories"
  ON problem_categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can read problems"
  ON problems FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can read technicians"
  ON technicians FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create policies for customers (allow insert for booking)
CREATE POLICY "Anyone can insert customers"
  ON customers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read customers"
  ON customers FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin policies (full access for authenticated admin users)
CREATE POLICY "Authenticated users can manage printer brands"
  ON printer_brands FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage printer models"
  ON printer_models FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage problem categories"
  ON problem_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage problems"
  ON problems FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage technicians"
  ON technicians FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage customers"
  ON customers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at 
  BEFORE UPDATE ON customers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at 
  BEFORE UPDATE ON technicians 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();