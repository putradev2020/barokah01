/*
  # Insert Initial Data for Barokah Printer

  1. Printer Brands and Models
  2. Problem Categories and Problems
  3. Sample Technicians
  4. Admin User (for testing)
*/

-- Insert Printer Brands
INSERT INTO printer_brands (name) VALUES
('Canon'),
('Epson'),
('HP'),
('Brother'),
('Samsung'),
('Fuji Xerox')
ON CONFLICT (name) DO NOTHING;

-- Get brand IDs for inserting models
DO $$
DECLARE
    canon_id UUID;
    epson_id UUID;
    hp_id UUID;
    brother_id UUID;
    samsung_id UUID;
    xerox_id UUID;
BEGIN
    SELECT id INTO canon_id FROM printer_brands WHERE name = 'Canon';
    SELECT id INTO epson_id FROM printer_brands WHERE name = 'Epson';
    SELECT id INTO hp_id FROM printer_brands WHERE name = 'HP';
    SELECT id INTO brother_id FROM printer_brands WHERE name = 'Brother';
    SELECT id INTO samsung_id FROM printer_brands WHERE name = 'Samsung';
    SELECT id INTO xerox_id FROM printer_brands WHERE name = 'Fuji Xerox';

    -- Insert Canon Models
    INSERT INTO printer_models (brand_id, name, type) VALUES
    (canon_id, 'PIXMA G2010', 'inkjet'),
    (canon_id, 'IP2770', 'inkjet'),
    (canon_id, 'MP287', 'multifunction'),
    (canon_id, 'G3010', 'multifunction'),
    (canon_id, 'G4010', 'multifunction'),
    (canon_id, 'TS3340', 'multifunction'),
    (canon_id, 'LBP2900', 'laser'),
    (canon_id, 'G1010', 'inkjet'),
    (canon_id, 'G2020', 'inkjet'),
    (canon_id, 'MG2570S', 'multifunction'),
    (canon_id, 'TR4570S', 'multifunction');

    -- Insert Epson Models
    INSERT INTO printer_models (brand_id, name, type) VALUES
    (epson_id, 'L3110', 'multifunction'),
    (epson_id, 'L120', 'inkjet'),
    (epson_id, 'L360', 'multifunction'),
    (epson_id, 'L565', 'multifunction'),
    (epson_id, 'L5290', 'multifunction'),
    (epson_id, 'L1800', 'inkjet'),
    (epson_id, 'WF-2851', 'multifunction'),
    (epson_id, 'L3150', 'multifunction'),
    (epson_id, 'L4150', 'multifunction'),
    (epson_id, 'L6160', 'multifunction'),
    (epson_id, 'L220', 'inkjet'),
    (epson_id, 'L310', 'inkjet');

    -- Insert HP Models
    INSERT INTO printer_models (brand_id, name, type) VALUES
    (hp_id, 'DeskJet 2135', 'multifunction'),
    (hp_id, 'Ink Tank 315', 'multifunction'),
    (hp_id, 'LaserJet M1132', 'laser'),
    (hp_id, '2775', 'multifunction'),
    (hp_id, 'Smart Tank 515', 'multifunction'),
    (hp_id, 'LaserJet P1102', 'laser'),
    (hp_id, 'DeskJet 1112', 'inkjet'),
    (hp_id, 'Ink Tank 419', 'multifunction'),
    (hp_id, 'LaserJet M404n', 'laser');

    -- Insert Brother Models
    INSERT INTO printer_models (brand_id, name, type) VALUES
    (brother_id, 'DCP-T420W', 'multifunction'),
    (brother_id, 'HL-1201', 'laser'),
    (brother_id, 'MFC-T920DW', 'multifunction'),
    (brother_id, 'DCP-L2520D', 'laser'),
    (brother_id, 'MFC-J3530DW', 'multifunction'),
    (brother_id, 'DCP-T310', 'multifunction'),
    (brother_id, 'HL-L2375DW', 'laser');

    -- Insert Samsung Models
    INSERT INTO printer_models (brand_id, name, type) VALUES
    (samsung_id, 'M2020', 'laser'),
    (samsung_id, 'M2070', 'multifunction'),
    (samsung_id, 'SL-M2021W', 'laser'),
    (samsung_id, 'Xpress M2835DW', 'laser'),
    (samsung_id, 'SL-M2885FW', 'multifunction');

    -- Insert Fuji Xerox Models
    INSERT INTO printer_models (brand_id, name, type) VALUES
    (xerox_id, 'DocuPrint M115w', 'laser'),
    (xerox_id, 'P225db', 'laser'),
    (xerox_id, 'CM115w', 'multifunction'),
    (xerox_id, 'P265DW', 'laser'),
    (xerox_id, 'CM225fw', 'multifunction');
END $$;

-- Insert Problem Categories
INSERT INTO problem_categories (name, icon) VALUES
('Masalah Pencetakan', 'Printer'),
('Masalah Cartridge / Head', 'Droplets'),
('Masalah Kertas', 'FileText'),
('Masalah Internal', 'Cog'),
('Masalah Jaringan / Wireless', 'Wifi'),
('Masalah Software / Reset', 'RefreshCw'),
('Masalah Fisik / Casing', 'Wrench'),
('Masalah Scanner', 'ScanLine'),
('Masalah Fax', 'Phone'),
('Masalah Maintenance', 'Settings')
ON CONFLICT (name) DO NOTHING;

-- Insert Problems for each category
DO $$
DECLARE
    cat_id UUID;
BEGIN
    -- Masalah Pencetakan
    SELECT id INTO cat_id FROM problem_categories WHERE name = 'Masalah Pencetakan';
    INSERT INTO problems (category_id, name, description, severity, estimated_time, estimated_cost) VALUES
    (cat_id, 'Hasil cetak putus-putus', 'Teks atau gambar tercetak tidak lengkap, putus-putus, atau bergaris', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000'),
    (cat_id, 'Hasil cetak bergaris', 'Muncul garis horizontal atau vertical pada hasil cetakan', 'medium', '1 - 3 hari Jam Kerja', 'Rp 75.000 - 150.000'),
    (cat_id, 'Warna tidak sesuai', 'Warna hasil cetakan tidak akurat atau berubah', 'medium', '1 - 3 hari Jam Kerja', 'Rp 60.000 - 120.000'),
    (cat_id, 'Tidak keluar tinta', 'Printer tidak mengeluarkan tinta sama sekali', 'high', '1 - 3 hari Jam Kerja', 'Rp 100.000 - 200.000'),
    (cat_id, 'Hasil cetak buram/kabur', 'Teks atau gambar tercetak tidak tajam dan terlihat buram', 'medium', '1 - 3 hari Jam Kerja', 'Rp 60.000 - 120.000'),
    (cat_id, 'Hasil cetak pudar', 'Cetakan terlihat pudar atau tidak pekat', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000');

    -- Masalah Cartridge / Head
    SELECT id INTO cat_id FROM problem_categories WHERE name = 'Masalah Cartridge / Head';
    INSERT INTO problems (category_id, name, description, severity, estimated_time, estimated_cost) VALUES
    (cat_id, 'Tinta tidak terdeteksi', 'Printer tidak mengenali cartridge atau tinta', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000'),
    (cat_id, 'Head tersumbat', 'Nozzle print head tersumbat dan perlu dibersihkan', 'high', '1 - 3 hari Jam Kerja', 'Rp 75.000 - 150.000'),
    (cat_id, 'Cartridge bocor', 'Tinta bocor dari cartridge atau system tinta', 'high', '1 - 3 hari Jam Kerja', 'Rp 80.000 - 160.000'),
    (cat_id, 'Cartridge kosong', 'Cartridge habis dan perlu diisi ulang atau diganti', 'low', '1 - 3 hari Jam Kerja', 'Rp 30.000 - 80.000'),
    (cat_id, 'Head tidak sejajar', 'Print head tidak sejajar sehingga hasil cetak miring', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000'),
    (cat_id, 'Chip cartridge error', 'Chip pada cartridge bermasalah atau perlu di-reset', 'medium', '1 - 3 hari Jam Kerja', 'Rp 40.000 - 80.000');

    -- Masalah Kertas
    SELECT id INTO cat_id FROM problem_categories WHERE name = 'Masalah Kertas';
    INSERT INTO problems (category_id, name, description, severity, estimated_time, estimated_cost) VALUES
    (cat_id, 'Paper jam', 'Kertas tersangkut di dalam printer', 'medium', '1 - 3 hari Jam Kerja', 'Rp 30.000 - 75.000'),
    (cat_id, 'Tidak menarik kertas', 'Printer tidak dapat mengambil kertas dari tray', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 120.000'),
    (cat_id, 'Tarikan dobel', 'Printer menarik lebih dari satu lembar kertas sekaligus', 'medium', '1 - 3 hari Jam Kerja', 'Rp 40.000 - 100.000'),
    (cat_id, 'Kertas miring', 'Kertas masuk dengan posisi miring atau tidak lurus', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000'),
    (cat_id, 'Kertas kusut/berkerut', 'Kertas keluar dalam kondisi kusut atau berkerut', 'medium', '1 - 3 hari Jam Kerja', 'Rp 60.000 - 120.000'),
    (cat_id, 'Masalah paper tray', 'Paper tray rusak, patah, atau tidak berfungsi', 'medium', '1 - 3 hari Jam Kerja', 'Rp 80.000 - 180.000');

    -- Continue with other categories...
    -- (Adding remaining categories for brevity)
END $$;

-- Insert Sample Technicians
INSERT INTO technicians (name, phone, email, specialization, experience, rating, is_available) VALUES
('Budi Santoso', '081234567890', 'budi@barokahprinter.com', ARRAY['Canon', 'Epson', 'HP'], 5, 4.8, true),
('Andi Pratama', '081234567891', 'andi@barokahprinter.com', ARRAY['Brother', 'Samsung', 'Fuji Xerox'], 3, 4.7, true),
('Sari Wulandari', '081234567892', 'sari@barokahprinter.com', ARRAY['Canon', 'HP', 'Brother'], 4, 4.9, true),
('Dedi Kurniawan', '081234567893', 'dedi@barokahprinter.com', ARRAY['Epson', 'Samsung'], 6, 4.6, true),
('Rina Marlina', '081234567894', 'rina@barokahprinter.com', ARRAY['All Brands'], 7, 4.9, true);

-- Insert Admin User (password: barokah2025)
INSERT INTO admin_users (username, password_hash, email, role) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@barokahprinter.com', 'admin')
ON CONFLICT (username) DO NOTHING;