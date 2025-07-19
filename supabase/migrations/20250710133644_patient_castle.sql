/*
  # Populate Printer and Problem Data

  1. Complete Printer Brands and Models Data
  2. Complete Problem Categories and Problems Data
  3. Ensure all data is properly structured for dynamic management
*/

-- Clear existing data to avoid conflicts
DELETE FROM problems;
DELETE FROM problem_categories;
DELETE FROM printer_models;
DELETE FROM printer_brands;

-- Insert printer brands
INSERT INTO printer_brands (name) VALUES
  ('Canon'),
  ('Epson'),
  ('HP'),
  ('Brother'),
  ('Samsung'),
  ('Fuji Xerox')
ON CONFLICT (name) DO NOTHING;

-- Insert Canon printer models
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
WHERE pb.name = 'Canon';

-- Insert Epson printer models
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
WHERE pb.name = 'Epson';

-- Insert HP printer models
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
WHERE pb.name = 'HP';

-- Insert Brother printer models
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
WHERE pb.name = 'Brother';

-- Insert Samsung printer models
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
WHERE pb.name = 'Samsung';

-- Insert Fuji Xerox printer models
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
WHERE pb.name = 'Fuji Xerox';

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
WHERE pc.name = 'Masalah Pencetakan';

-- Insert problems for "Masalah Cartridge / Head"
INSERT INTO problems (category_id, name, description, severity, estimated_time, estimated_cost)
SELECT pc.id, problem.name, problem.description, problem.severity, problem.estimated_time, problem.estimated_cost
FROM problem_categories pc,
(VALUES
  ('Tinta tidak terdeteksi', 'Printer tidak mengenali cartridge atau tinta', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000'),
  ('Head tersumbat', 'Nozzle print head tersumbat dan perlu dibersihkan', 'high', '1 - 3 hari Jam Kerja', 'Rp 75.000 - 150.000'),
  ('Cartridge bocor', 'Tinta bocor dari cartridge atau system tinta', 'high', '1 - 3 hari Jam Kerja', 'Rp 80.000 - 160.000'),
  ('Cartridge kosong', 'Cartridge habis dan perlu diisi ulang atau diganti', 'low', '1 - 3 hari Jam Kerja', 'Rp 30.000 - 80.000'),
  ('Head tidak sejajar', 'Print head tidak sejajar sehingga hasil cetak miring', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000'),
  ('Chip cartridge error', 'Chip pada cartridge bermasalah atau perlu di-reset', 'medium', '1 - 3 hari Jam Kerja', 'Rp 40.000 - 80.000')
) AS problem(name, description, severity, estimated_time, estimated_cost)
WHERE pc.name = 'Masalah Cartridge / Head';

-- Insert problems for "Masalah Kertas"
INSERT INTO problems (category_id, name, description, severity, estimated_time, estimated_cost)
SELECT pc.id, problem.name, problem.description, problem.severity, problem.estimated_time, problem.estimated_cost
FROM problem_categories pc,
(VALUES
  ('Paper jam', 'Kertas tersangkut di dalam printer', 'medium', '1 - 3 hari Jam Kerja', 'Rp 30.000 - 75.000'),
  ('Tidak menarik kertas', 'Printer tidak dapat mengambil kertas dari tray', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 120.000'),
  ('Tarikan dobel', 'Printer menarik lebih dari satu lembar kertas sekaligus', 'medium', '1 - 3 hari Jam Kerja', 'Rp 40.000 - 100.000'),
  ('Kertas miring', 'Kertas masuk dengan posisi miring atau tidak lurus', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000'),
  ('Kertas kusut/berkerut', 'Kertas keluar dalam kondisi kusut atau berkerut', 'medium', '1 - 3 hari Jam Kerja', 'Rp 60.000 - 120.000'),
  ('Masalah paper tray', 'Paper tray rusak, patah, atau tidak berfungsi', 'medium', '1 - 3 hari Jam Kerja', 'Rp 80.000 - 180.000')
) AS problem(name, description, severity, estimated_time, estimated_cost)
WHERE pc.name = 'Masalah Kertas';

-- Insert problems for "Masalah Internal"
INSERT INTO problems (category_id, name, description, severity, estimated_time, estimated_cost)
SELECT pc.id, problem.name, problem.description, problem.severity, problem.estimated_time, problem.estimated_cost
FROM problem_categories pc,
(VALUES
  ('Sensor error', 'Sensor internal printer bermasalah atau error', 'high', '1 - 3 hari Jam Kerja', 'Rp 100.000 - 250.000'),
  ('Motor tidak berfungsi', 'Motor penggerak printer rusak atau macet', 'high', '1 - 3 hari Jam Kerja', 'Rp 150.000 - 350.000'),
  ('Power supply mati', 'Printer tidak menyala atau power supply bermasalah', 'high', '1 - 3 hari Jam Kerja', 'Rp 120.000 - 300.000'),
  ('Mainboard bermasalah', 'Mainboard printer rusak atau mengalami kerusakan', 'high', '1 - 3 hari Jam Kerja', 'Rp 200.000 - 500.000'),
  ('Belt putus/kendor', 'Belt penggerak printer putus atau kendor', 'high', '1 - 3 hari Jam Kerja', 'Rp 100.000 - 200.000'),
  ('Gear rusak', 'Gear penggerak printer patah atau aus', 'high', '1 - 3 hari Jam Kerja', 'Rp 120.000 - 250.000')
) AS problem(name, description, severity, estimated_time, estimated_cost)
WHERE pc.name = 'Masalah Internal';

-- Insert problems for "Masalah Jaringan / Wireless"
INSERT INTO problems (category_id, name, description, severity, estimated_time, estimated_cost)
SELECT pc.id, problem.name, problem.description, problem.severity, problem.estimated_time, problem.estimated_cost
FROM problem_categories pc,
(VALUES
  ('Tidak terhubung WiFi', 'Printer tidak dapat terhubung ke jaringan WiFi', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000'),
  ('Tidak muncul di LAN', 'Printer tidak terdeteksi di jaringan lokal', 'medium', '1 - 3 hari Jam Kerja', 'Rp 60.000 - 120.000'),
  ('IP address conflict', 'Konflik IP address pada jaringan', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000'),
  ('Driver jaringan bermasalah', 'Driver untuk koneksi jaringan tidak berfungsi', 'medium', '1 - 3 hari Jam Kerja', 'Rp 60.000 - 120.000'),
  ('Bluetooth tidak berfungsi', 'Koneksi Bluetooth printer bermasalah', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000')
) AS problem(name, description, severity, estimated_time, estimated_cost)
WHERE pc.name = 'Masalah Jaringan / Wireless';

-- Insert problems for "Masalah Software / Reset"
INSERT INTO problems (category_id, name, description, severity, estimated_time, estimated_cost)
SELECT pc.id, problem.name, problem.description, problem.severity, problem.estimated_time, problem.estimated_cost
FROM problem_categories pc,
(VALUES
  ('Perlu reset EEPROM', 'Memory printer perlu di-reset untuk mengatasi error', 'high', '1 - 3 hari Jam Kerja', 'Rp 75.000 - 150.000'),
  ('Ink absorber full', 'Ink absorber penuh dan perlu di-reset atau diganti', 'high', '1 - 3 hari Jam Kerja', 'Rp 100.000 - 200.000'),
  ('Maintenance box full', 'Maintenance box printer penuh dan perlu diganti', 'medium', '1 - 3 hari Jam Kerja', 'Rp 80.000 - 160.000'),
  ('Firmware corrupt', 'Firmware printer rusak dan perlu di-update', 'high', '1 - 3 hari Jam Kerja', 'Rp 100.000 - 200.000'),
  ('Driver bermasalah', 'Driver printer tidak terinstall atau corrupt', 'medium', '1 - 3 hari Jam Kerja', 'Rp 40.000 - 80.000'),
  ('Reset counter', 'Counter printer perlu di-reset', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000')
) AS problem(name, description, severity, estimated_time, estimated_cost)
WHERE pc.name = 'Masalah Software / Reset';

-- Insert problems for "Masalah Fisik / Casing"
INSERT INTO problems (category_id, name, description, severity, estimated_time, estimated_cost)
SELECT pc.id, problem.name, problem.description, problem.severity, problem.estimated_time, estimated_cost
FROM problem_categories pc,
(VALUES
  ('Tutup rusak', 'Cover atau tutup printer rusak atau patah', 'low', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 150.000'),
  ('Engsel patah', 'Engsel cover atau scanner patah', 'medium', '1 - 3 hari Jam Kerja', 'Rp 75.000 - 200.000'),
  ('Tombol tidak berfungsi', 'Tombol power atau fungsi lain tidak berfungsi', 'medium', '1 - 3 hari Jam Kerja', 'Rp 60.000 - 150.000'),
  ('LCD rusak', 'Layar LCD printer pecah atau tidak berfungsi', 'high', '1 - 3 hari Jam Kerja', 'Rp 150.000 - 350.000'),
  ('Kabel rusak', 'Kabel power atau USB rusak atau putus', 'medium', '1 - 3 hari Jam Kerja', 'Rp 40.000 - 100.000'),
  ('Casing retak/pecah', 'Casing printer retak atau pecah', 'low', '1 - 3 hari Jam Kerja', 'Rp 60.000 - 150.000')
) AS problem(name, description, severity, estimated_time, estimated_cost)
WHERE pc.name = 'Masalah Fisik / Casing';

-- Insert problems for "Masalah Scanner"
INSERT INTO problems (category_id, name, description, severity, estimated_time, estimated_cost)
SELECT pc.id, problem.name, problem.description, problem.severity, problem.estimated_time, problem.estimated_cost
FROM problem_categories pc,
(VALUES
  ('Scanner tidak berfungsi', 'Scanner tidak dapat melakukan scan dokumen', 'medium', '1 - 3 hari Jam Kerja', 'Rp 70.000 - 150.000'),
  ('Motor scanner macet', 'Motor penggerak scanner macet atau rusak', 'high', '1 - 3 hari Jam Kerja', 'Rp 120.000 - 250.000'),
  ('ADF bermasalah', 'Automatic Document Feeder tidak berfungsi', 'medium', '1 - 3 hari Jam Kerja', 'Rp 100.000 - 200.000')
) AS problem(name, description, severity, estimated_time, estimated_cost)
WHERE pc.name = 'Masalah Scanner';

-- Insert problems for "Masalah Fax"
INSERT INTO problems (category_id, name, description, severity, estimated_time, estimated_cost)
SELECT pc.id, problem.name, problem.description, problem.severity, problem.estimated_time, estimated_cost
FROM problem_categories pc,
(VALUES
  ('Fax tidak bisa kirim', 'Tidak dapat mengirim fax ke nomor tujuan', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000'),
  ('Fax tidak bisa terima', 'Tidak dapat menerima fax dari pengirim', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000'),
  ('Line fax error', 'Koneksi line telepon untuk fax bermasalah', 'medium', '1 - 3 hari Jam Kerja', 'Rp 60.000 - 120.000')
) AS problem(name, description, severity, estimated_time, estimated_cost)
WHERE pc.name = 'Masalah Fax';

-- Insert problems for "Masalah Maintenance"
INSERT INTO problems (category_id, name, description, severity, estimated_time, estimated_cost)
SELECT pc.id, problem.name, problem.description, problem.severity, estimated_time, estimated_cost
FROM problem_categories pc,
(VALUES
  ('Perlu pembersihan menyeluruh', 'Printer kotor dan perlu dibersihkan secara menyeluruh', 'low', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000'),
  ('Perlu pelumasan', 'Komponen printer perlu dilumasi', 'low', '1 - 3 hari Jam Kerja', 'Rp 40.000 - 80.000'),
  ('Perlu kalibrasi', 'Printer perlu dikalibrasi untuk hasil optimal', 'medium', '1 - 3 hari Jam Kerja', 'Rp 50.000 - 100.000')
) AS problem(name, description, severity, estimated_time, estimated_cost)
WHERE pc.name = 'Masalah Maintenance';