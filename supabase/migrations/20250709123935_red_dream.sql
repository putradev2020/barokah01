/*
  # Seed Initial Data

  1. Printer Brands and Models
  2. Problem Categories and Problems
  3. Sample Technicians
  4. Sample Data for Testing
*/

-- Insert printer brands
INSERT INTO printer_brands (name) VALUES
  ('Canon'),
  ('Epson'),
  ('HP'),
  ('Brother'),
  ('Samsung'),
  ('Fuji Xerox')
ON CONFLICT (name) DO NOTHING;

-- Insert printer models for Canon
INSERT INTO printer_models (brand_id, name, type)
SELECT pb.id, model.name, model.type
FROM printer_brands pb,
(VALUES
  ('PIXMA G2010', 'inkjet'),
  ('IP2770', 'inkjet'),
  ('MP287', 'multifunction'),
  ('G3010', 'multifunction'),
  ('G4010', 'multifunction'),
  ('TS3340', 'multifunction'),
  ('LBP2900', 'laser'),
  ('G1010', 'inkjet'),
  ('G2020', 'inkjet'),
  ('MG2570S', 'multifunction'),
  ('TR4570S', 'multifunction')
) AS model(name, type)
WHERE pb.name = 'Canon'
ON CONFLICT DO NOTHING;

-- Insert printer models for Epson
INSERT INTO printer_models (brand_id, name, type)
SELECT pb.id, model.name, model.type
FROM printer_brands pb,
(VALUES
  ('L3110', 'multifunction'),
  ('L120', 'inkjet'),
  ('L360', 'multifunction'),
  ('L565', 'multifunction'),
  ('L5290', 'multifunction'),
  ('L1800', 'inkjet'),
  ('WF-2851', 'multifunction'),
  ('L3150', 'multifunction'),
  ('L4150', 'multifunction'),
  ('L6160', 'multifunction'),
  ('L220', 'inkjet'),
  ('L310', 'inkjet')
) AS model(name, type)
WHERE pb.name = 'Epson'
ON CONFLICT DO NOTHING;

-- Insert printer models for HP
INSERT INTO printer_models (brand_id, name, type)
SELECT pb.id, model.name, model.type
FROM printer_brands pb,
(VALUES
  ('DeskJet 2135', 'multifunction'),
  ('Ink Tank 315', 'multifunction'),
  ('LaserJet M1132', 'laser'),
  ('2775', 'multifunction'),
  ('Smart Tank 515', 'multifunction'),
  ('LaserJet P1102', 'laser'),
  ('DeskJet 1112', 'inkjet'),
  ('Ink Tank 419', 'multifunction'),
  ('LaserJet M404n', 'laser')
) AS model(name, type)
WHERE pb.name = 'HP'
ON CONFLICT DO NOTHING;

-- Insert printer models for Brother
INSERT INTO printer_models (brand_id, name, type)
SELECT pb.id, model.name, model.type
FROM printer_brands pb,
(VALUES
  ('DCP-T420W', 'multifunction'),
  ('HL-1201', 'laser'),
  ('MFC-T920DW', 'multifunction'),
  ('DCP-L2520D', 'laser'),
  ('MFC-J3530DW', 'multifunction'),
  ('DCP-T310', 'multifunction'),
  ('HL-L2375DW', 'laser')
) AS model(name, type)
WHERE pb.name = 'Brother'
ON CONFLICT DO NOTHING;

-- Insert printer models for Samsung
INSERT INTO printer_models (brand_id, name, type)
SELECT pb.id, model.name, model.type
FROM printer_brands pb,
(VALUES
  ('M2020', 'laser'),
  ('M2070', 'multifunction'),
  ('SL-M2021W', 'laser'),
  ('Xpress M2835DW', 'laser'),
  ('SL-M2885FW', 'multifunction')
) AS model(name, type)
WHERE pb.name = 'Samsung'
ON CONFLICT DO NOTHING;

-- Insert printer models for Fuji Xerox
INSERT INTO printer_models (brand_id, name, type)
SELECT pb.id, model.name, model.type
FROM printer_brands pb,
(VALUES
  ('DocuPrint M115w', 'laser'),
  ('P225db', 'laser'),
  ('CM115w', 'multifunction'),
  ('P265DW', 'laser'),
  ('CM225fw', 'multifunction')
) AS model(name, type)
WHERE pb.name = 'Fuji Xerox'
ON CONFLICT DO NOTHING;

-- Insert problem categories
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

-- Insert problems for "Masalah Pencetakan"
INSERT INTO problems (category_id, name, description, severity, estimated_time, estimated_cost)
SELECT pc.id, problem.name, problem.description, problem.severity, problem.estimated_time, problem.estimated_cost
FROM problem_categories pc,
(VALUES
  ('Hasil cetak putus-putus', 'Teks atau gambar tercetak tidak lengkap, putus-putus, atau bergaris', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000'),
  ('Hasil cetak bergaris', 'Muncul garis horizontal atau vertical pada hasil cetakan', 'medium', '1 - 3 hari Jam Kerja', 'Rp 75.000 - 150.000'),
  ('Warna tidak sesuai', 'Warna hasil cetakan tidak akurat atau berubah', 'medium', '1 - 3 hari Jam Kerja', 'Rp 60.000 - 120.000'),
  ('Tidak keluar tinta', 'Printer tidak mengeluarkan tinta sama sekali', 'high', '1 - 3 hari Jam Kerja', 'Rp 100.000 - 200.000'),
  ('Hasil cetak buram/kabur', 'Teks atau gambar tercetak tidak tajam dan terlihat buram', 'medium', '1 - 3 hari Jam Kerja', 'Rp 60.000 - 120.000'),
  ('Hasil cetak pudar', 'Cetakan terlihat pudar atau tidak pekat', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000')
) AS problem(name, description, severity, estimated_time, estimated_cost)
WHERE pc.name = 'Masalah Pencetakan'
ON CONFLICT DO NOTHING;

-- Insert sample technicians
INSERT INTO technicians (name, phone, email, specialization, experience, rating) VALUES
  ('Budi Santoso', '+62853-6814-8449', 'budi@barokahprinter.com', ARRAY['Canon', 'Epson'], 5, 4.8),
  ('Andi Pratama', '+62853-6814-8449', 'andi@barokahprinter.com', ARRAY['HP', 'Brother'], 4, 4.7),
  ('Sari Wulandari', '+62853-6814-8449', 'sari@barokahprinter.com', ARRAY['Samsung', 'Fuji Xerox'], 6, 4.9),
  ('Dedi Kurniawan', '+62853-6814-8449', 'dedi@barokahprinter.com', ARRAY['Canon', 'HP'], 3, 4.6),
  ('Rina Marlina', '+62853-6814-8449', 'rina@barokahprinter.com', ARRAY['Epson', 'Brother'], 4, 4.8)
ON CONFLICT DO NOTHING;