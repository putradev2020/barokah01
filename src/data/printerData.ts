import { PrinterBrand, ProblemCategory } from '../types';

export const printerBrands: PrinterBrand[] = [
  {
    id: 'canon',
    name: 'Canon',
    models: [
      { id: 'pixma-g2010', name: 'PIXMA G2010', type: 'inkjet' },
      { id: 'ip2770', name: 'IP2770', type: 'inkjet' },
      { id: 'mp287', name: 'MP287', type: 'multifunction' },
      { id: 'g3010', name: 'G3010', type: 'multifunction' },
      { id: 'g4010', name: 'G4010', type: 'multifunction' },
      { id: 'ts3340', name: 'TS3340', type: 'multifunction' },
      { id: 'lbp2900', name: 'LBP2900', type: 'laser' },
      { id: 'g1010', name: 'G1010', type: 'inkjet' },
      { id: 'g2020', name: 'G2020', type: 'inkjet' },
      { id: 'mg2570s', name: 'MG2570S', type: 'multifunction' },
      { id: 'tr4570s', name: 'TR4570S', type: 'multifunction' }
    ]
  },
  {
    id: 'epson',
    name: 'Epson',
    models: [
      { id: 'l3110', name: 'L3110', type: 'multifunction' },
      { id: 'l120', name: 'L120', type: 'inkjet' },
      { id: 'l360', name: 'L360', type: 'multifunction' },
      { id: 'l565', name: 'L565', type: 'multifunction' },
      { id: 'l5290', name: 'L5290', type: 'multifunction' },
      { id: 'l1800', name: 'L1800', type: 'inkjet' },
      { id: 'wf-2851', name: 'WF-2851', type: 'multifunction' },
      { id: 'l3150', name: 'L3150', type: 'multifunction' },
      { id: 'l4150', name: 'L4150', type: 'multifunction' },
      { id: 'l6160', name: 'L6160', type: 'multifunction' },
      { id: 'l220', name: 'L220', type: 'inkjet' },
      { id: 'l310', name: 'L310', type: 'inkjet' }
    ]
  },
  {
    id: 'hp',
    name: 'HP',
    models: [
      { id: 'deskjet-2135', name: 'DeskJet 2135', type: 'multifunction' },
      { id: 'ink-tank-315', name: 'Ink Tank 315', type: 'multifunction' },
      { id: 'laserjet-m1132', name: 'LaserJet M1132', type: 'laser' },
      { id: '2775', name: '2775', type: 'multifunction' },
      { id: 'smart-tank-515', name: 'Smart Tank 515', type: 'multifunction' },
      { id: 'laserjet-p1102', name: 'LaserJet P1102', type: 'laser' },
      { id: 'deskjet-1112', name: 'DeskJet 1112', type: 'inkjet' },
      { id: 'ink-tank-419', name: 'Ink Tank 419', type: 'multifunction' },
      { id: 'laserjet-m404n', name: 'LaserJet M404n', type: 'laser' }
    ]
  },
  {
    id: 'brother',
    name: 'Brother',
    models: [
      { id: 'dcp-t420w', name: 'DCP-T420W', type: 'multifunction' },
      { id: 'hl-1201', name: 'HL-1201', type: 'laser' },
      { id: 'mfc-t920dw', name: 'MFC-T920DW', type: 'multifunction' },
      { id: 'dcp-l2520d', name: 'DCP-L2520D', type: 'laser' },
      { id: 'mfc-j3530dw', name: 'MFC-J3530DW', type: 'multifunction' },
      { id: 'dcp-t310', name: 'DCP-T310', type: 'multifunction' },
      { id: 'hl-l2375dw', name: 'HL-L2375DW', type: 'laser' }
    ]
  },
  {
    id: 'samsung',
    name: 'Samsung',
    models: [
      { id: 'm2020', name: 'M2020', type: 'laser' },
      { id: 'm2070', name: 'M2070', type: 'multifunction' },
      { id: 'sl-m2021w', name: 'SL-M2021W', type: 'laser' },
      { id: 'xpress-m2835dw', name: 'Xpress M2835DW', type: 'laser' },
      { id: 'sl-m2885fw', name: 'SL-M2885FW', type: 'multifunction' }
    ]
  },
  {
    id: 'fuji-xerox',
    name: 'Fuji Xerox',
    models: [
      { id: 'docuprint-m115w', name: 'DocuPrint M115w', type: 'laser' },
      { id: 'p225db', name: 'P225db', type: 'laser' },
      { id: 'cm115w', name: 'CM115w', type: 'multifunction' },
      { id: 'p265dw', name: 'P265DW', type: 'laser' },
      { id: 'cm225fw', name: 'CM225fw', type: 'multifunction' }
    ]
  }
];

export const problemCategories: ProblemCategory[] = [
  {
    id: 'printing-issues',
    name: 'Masalah Pencetakan',
    icon: 'Printer',
    problems: [
      {
        id: 'broken-print',
        name: 'Hasil cetak putus-putus',
        description: 'Teks atau gambar tercetak tidak lengkap, putus-putus, atau bergaris',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 100.000'
      },
      {
        id: 'striped-print',
        name: 'Hasil cetak bergaris',
        description: 'Muncul garis horizontal atau vertical pada hasil cetakan',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 75.000 - 150.000'
      },
      {
        id: 'wrong-colors',
        name: 'Warna tidak sesuai',
        description: 'Warna hasil cetakan tidak akurat atau berubah',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 60.000 - 120.000'
      },
      {
        id: 'no-ink-output',
        name: 'Tidak keluar tinta',
        description: 'Printer tidak mengeluarkan tinta sama sekali',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 100.000 - 200.000'
      },
      {
        id: 'blurry-print',
        name: 'Hasil cetak buram/kabur',
        description: 'Teks atau gambar tercetak tidak tajam dan terlihat buram',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 60.000 - 120.000'
      },
      {
        id: 'faded-print',
        name: 'Hasil cetak pudar',
        description: 'Cetakan terlihat pudar atau tidak pekat',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 100.000'
      },

    ]
  },
  {
    id: 'cartridge-head-issues',
    name: 'Masalah Cartridge / Head',
    icon: 'Droplets',
    problems: [
      {
        id: 'ink-not-detected',
        name: 'Tinta tidak terdeteksi',
        description: 'Printer tidak mengenali cartridge atau tinta',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 100.000'
      },
      {
        id: 'clogged-head',
        name: 'Head tersumbat',
        description: 'Nozzle print head tersumbat dan perlu dibersihkan',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 75.000 - 150.000'
      },
      {
        id: 'cartridge-leak',
        name: 'Cartridge bocor',
        description: 'Tinta bocor dari cartridge atau system tinta',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 80.000 - 160.000'
      },
      {
        id: 'cartridge-empty',
        name: 'Cartridge kosong',
        description: 'Cartridge habis dan perlu diisi ulang atau diganti',
        severity: 'low',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 30.000 - 80.000'
      },
      {
        id: 'head-alignment',
        name: 'Head tidak sejajar',
        description: 'Print head tidak sejajar sehingga hasil cetak miring',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 100.000'
      },
      {
        id: 'chip-error',
        name: 'Chip cartridge error',
        description: 'Chip pada cartridge bermasalah atau perlu di-reset',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 40.000 - 80.000'
      }
    ]
  },
  {
    id: 'paper-issues',
    name: 'Masalah Kertas',
    icon: 'FileText',
    problems: [
      {
        id: 'paper-jam',
        name: 'Paper jam',
        description: 'Kertas tersangkut di dalam printer',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 30.000 - 75.000'
      },
      {
        id: 'no-paper-pickup',
        name: 'Tidak menarik kertas',
        description: 'Printer tidak dapat mengambil kertas dari tray',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 120.000'
      },
      {
        id: 'double-feeding',
        name: 'Tarikan dobel',
        description: 'Printer menarik lebih dari satu lembar kertas sekaligus',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 40.000 - 100.000'
      },
      {
        id: 'paper-skew',
        name: 'Kertas miring',
        description: 'Kertas masuk dengan posisi miring atau tidak lurus',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 100.000'
      },
      {
        id: 'paper-wrinkled',
        name: 'Kertas kusut/berkerut',
        description: 'Kertas keluar dalam kondisi kusut atau berkerut',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 60.000 - 120.000'
      },
      {
        id: 'tray-problem',
        name: 'Masalah paper tray',
        description: 'Paper tray rusak, patah, atau tidak berfungsi',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 80.000 - 180.000'
      }
    ]
  },
  {
    id: 'internal-issues',
    name: 'Masalah Internal',
    icon: 'Cog',
    problems: [
      {
        id: 'sensor-error',
        name: 'Sensor error',
        description: 'Sensor internal printer bermasalah atau error',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 100.000 - 250.000'
      },
      {
        id: 'motor-failure',
        name: 'Motor tidak berfungsi',
        description: 'Motor penggerak printer rusak atau macet',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 150.000 - 350.000'
      },
      {
        id: 'power-supply-dead',
        name: 'Power supply mati',
        description: 'Printer tidak menyala atau power supply bermasalah',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 120.000 - 300.000'
      },
      {
        id: 'mainboard-error',
        name: 'Mainboard bermasalah',
        description: 'Mainboard printer rusak atau mengalami kerusakan',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 200.000 - 500.000'
      },
      {
        id: 'belt-broken',
        name: 'Belt putus/kendor',
        description: 'Belt penggerak printer putus atau kendor',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 100.000 - 200.000'
      },
      {
        id: 'gear-broken',
        name: 'Gear rusak',
        description: 'Gear penggerak printer patah atau aus',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 120.000 - 250.000'
      }
    ]
  },
  {
    id: 'network-issues',
    name: 'Masalah Jaringan / Wireless',
    icon: 'Wifi',
    problems: [
      {
        id: 'wifi-connection',
        name: 'Tidak terhubung WiFi',
        description: 'Printer tidak dapat terhubung ke jaringan WiFi',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 100.000'
      },
      {
        id: 'lan-not-detected',
        name: 'Tidak muncul di LAN',
        description: 'Printer tidak terdeteksi di jaringan lokal',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 60.000 - 120.000'
      },
      {
        id: 'ip-conflict',
        name: 'IP address conflict',
        description: 'Konflik IP address pada jaringan',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 100.000'
      },
      {
        id: 'driver-network',
        name: 'Driver jaringan bermasalah',
        description: 'Driver untuk koneksi jaringan tidak berfungsi',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 60.000 - 120.000'
      },
      {
        id: 'bluetooth-issue',
        name: 'Bluetooth tidak berfungsi',
        description: 'Koneksi Bluetooth printer bermasalah',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 100.000'
      }
    ]
  },
  {
    id: 'software-issues',
    name: 'Masalah Software / Reset',
    icon: 'RefreshCw',
    problems: [
      {
        id: 'eeprom-reset',
        name: 'Perlu reset EEPROM',
        description: 'Memory printer perlu di-reset untuk mengatasi error',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 75.000 - 150.000'
      },
      {
        id: 'ink-absorber-full',
        name: 'Ink absorber full',
        description: 'Ink absorber penuh dan perlu di-reset atau diganti',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 100.000 - 200.000'
      },
      {
        id: 'maintenance-box-full',
        name: 'Maintenance box full',
        description: 'Maintenance box printer penuh dan perlu diganti',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 80.000 - 160.000'
      },
      {
        id: 'firmware-corrupt',
        name: 'Firmware corrupt',
        description: 'Firmware printer rusak dan perlu di-update',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 100.000 - 200.000'
      },
      {
        id: 'driver-error',
        name: 'Driver bermasalah',
        description: 'Driver printer tidak terinstall atau corrupt',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 40.000 - 80.000'
      },
      {
        id: 'counter-reset',
        name: 'Reset counter',
        description: 'Counter printer perlu di-reset',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 100.000'
      }
    ]
  },
  {
    id: 'physical-issues',
    name: 'Masalah Fisik / Casing',
    icon: 'Wrench',
    problems: [
      {
        id: 'broken-cover',
        name: 'Tutup rusak',
        description: 'Cover atau tutup printer rusak atau patah',
        severity: 'low',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 150.000'
      },
      {
        id: 'broken-hinge',
        name: 'Engsel patah',
        description: 'Engsel cover atau scanner patah',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 75.000 - 200.000'
      },
      {
        id: 'button-not-working',
        name: 'Tombol tidak berfungsi',
        description: 'Tombol power atau fungsi lain tidak berfungsi',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 60.000 - 150.000'
      },
      {
        id: 'lcd-broken',
        name: 'LCD rusak',
        description: 'Layar LCD printer pecah atau tidak berfungsi',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 150.000 - 350.000'
      },
      {
        id: 'cable-damaged',
        name: 'Kabel rusak',
        description: 'Kabel power atau USB rusak atau putus',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 40.000 - 100.000'
      },
      {
        id: 'casing-crack',
        name: 'Casing retak/pecah',
        description: 'Casing printer retak atau pecah',
        severity: 'low',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 60.000 - 150.000'
      }
    ]
  },
  {
    id: 'scanner-issues',
    name: 'Masalah Scanner',
    icon: 'ScanLine',
    problems: [
      {
        id: 'scanner-not-working',
        name: 'Scanner tidak berfungsi',
        description: 'Scanner tidak dapat melakukan scan dokumen',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 70.000 - 150.000'
      },


      {
        id: 'scanner-motor-stuck',
        name: 'Motor scanner macet',
        description: 'Motor penggerak scanner macet atau rusak',
        severity: 'high',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 120.000 - 250.000'
      },
      {
        id: 'adf-problem',
        name: 'ADF bermasalah',
        description: 'Automatic Document Feeder tidak berfungsi',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 100.000 - 200.000'
      }
    ]
  },
  {
    id: 'fax-issues',
    name: 'Masalah Fax',
    icon: 'Phone',
    problems: [
      {
        id: 'fax-not-sending',
        name: 'Fax tidak bisa kirim',
        description: 'Tidak dapat mengirim fax ke nomor tujuan',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 100.000'
      },
      {
        id: 'fax-not-receiving',
        name: 'Fax tidak bisa terima',
        description: 'Tidak dapat menerima fax dari pengirim',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 100.000'
      },
      {
        id: 'fax-line-error',
        name: 'Line fax error',
        description: 'Koneksi line telepon untuk fax bermasalah',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 60.000 - 120.000'
      }
    ]
  },
  {
    id: 'maintenance-issues',
    name: 'Masalah Maintenance',
    icon: 'Settings',
    problems: [
      {
        id: 'cleaning-needed',
        name: 'Perlu pembersihan menyeluruh',
        description: 'Printer kotor dan perlu dibersihkan secara menyeluruh',
        severity: 'low',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 100.000'
      },
      {
        id: 'lubrication-needed',
        name: 'Perlu pelumasan',
        description: 'Komponen printer perlu dilumasi',
        severity: 'low',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 40.000 - 80.000'
      },
      {
        id: 'calibration-needed',
        name: 'Perlu kalibrasi',
        description: 'Printer perlu dikalibrasi untuk hasil optimal',
        severity: 'medium',
        estimatedTime: '1 - 3 hari Jam Kerja',
        estimatedCost: 'Rp 50.000 - 100.000'
      },

    ]
  }
];