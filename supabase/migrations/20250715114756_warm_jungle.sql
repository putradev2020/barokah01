/*
  # Add Gallery Management Table

  1. New Tables
    - `gallery_images`
      - `id` (uuid, primary key)
      - `title` (text)
      - `alt_text` (text)
      - `image_url` (text)
      - `category` (text)
      - `is_active` (boolean)
      - `sort_order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `gallery_images` table
    - Add policies for public read and admin management
*/

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  alt_text text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'service',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policies for gallery images
CREATE POLICY "Anyone can read active gallery images"
  ON gallery_images
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage gallery images"
  ON gallery_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample gallery data
INSERT INTO gallery_images (title, alt_text, image_url, category, sort_order) VALUES
('Service Printer Canon', 'Barokah Printer Service Canon', 'https://down-id.img.susercontent.com/file/id-11134207-7r98z-llk42fcyg5jm03.webp', 'service', 1),
('Service Printer Epson', 'Barokah Printer Service Epson', 'https://down-id.img.susercontent.com/file/id-11134207-7r98o-lkyobliz8zunf8.webp', 'service', 2),
('Workshop Barokah Printer', 'Workshop Barokah Printer', 'https://down-id.img.susercontent.com/file/id-11134207-7r98u-lw57ldwk417id2@resize_w900_nl.webp', 'workshop', 3),
('Tim Teknisi', 'Tim Teknisi Barokah Printer', 'https://down-id.img.susercontent.com/file/id-11134207-7qul3-ljl0nd6x6t3s8b@resize_w900_nl.webp', 'team', 4),
('Produk Printer', 'Produk Printer Tersedia', 'https://down-id.img.susercontent.com/file/id-11134207-7r98s-lm4hcsmsx3bz25@resize_w900_nl.webp', 'products', 5),
('Toko Barokah Printer', 'Toko Barokah Printer', 'https://down-id.img.susercontent.com/file/id-11134207-7rase-m3ehhb64cac841.webp', 'store', 6),
('Peralatan Service', 'Peralatan Service Printer', 'https://down-id.img.susercontent.com/file/id-11134207-7rbk8-mai4w85px5wkba@resize_w900_nl.webp', 'equipment', 7),
('Spare Part Brother', 'Spare Part Printer Brother', 'https://down-id.img.susercontent.com/file/id-11134207-7r990-llblt22h7xwpa5', 'parts', 8);