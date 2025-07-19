// Utility functions for managing booking data in localStorage

export interface BookingData {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  printerBrand: string;
  printerModel: string;
  problemCategory: string;
  problemDescription: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  status: string;
  technician: string;
  estimatedCost: string;
  actualCost: string;
  createdAt: string;
  timeline: Array<{
    status: string;
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }>;
}

const STORAGE_KEY = 'barokah_bookings';

export const saveBooking = (bookingData: Partial<BookingData>): string => {
  const bookings = getBookings();
  const bookingId = generateBookingId();
  
  const newBooking: BookingData = {
    id: bookingId,
    customerName: bookingData.customerName || '',
    phone: bookingData.phone || '',
    email: bookingData.email || '',
    address: bookingData.address || '',
    printerBrand: bookingData.printerBrand || '',
    printerModel: bookingData.printerModel || '',
    problemCategory: bookingData.problemCategory || '',
    problemDescription: bookingData.problemDescription || '',
    serviceType: bookingData.serviceType || '',
    appointmentDate: bookingData.appointmentDate || '',
    appointmentTime: bookingData.appointmentTime || '',
    notes: bookingData.notes || '',
    status: 'pending',
    technician: assignTechnician(),
    estimatedCost: calculateEstimatedCost(bookingData.problemCategory || ''),
    actualCost: '',
    createdAt: new Date().toISOString(),
    timeline: [
      {
        status: 'pending',
        title: 'Booking Diterima',
        description: 'Booking Anda telah diterima dan sedang diproses',
        timestamp: new Date().toISOString(),
        completed: true
      },
      {
        status: 'confirmed',
        title: 'Booking Dikonfirmasi',
        description: 'Teknisi telah ditugaskan dan akan datang sesuai jadwal',
        timestamp: '',
        completed: false
      },
      {
        status: 'in-progress',
        title: 'Teknisi Dalam Perjalanan',
        description: 'Teknisi sedang dalam perjalanan ke lokasi Anda',
        timestamp: '',
        completed: false
      },
      {
        status: 'servicing',
        title: 'Sedang Diperbaiki',
        description: 'Printer sedang dalam proses perbaikan',
        timestamp: '',
        completed: false
      },
      {
        status: 'completed',
        title: 'Service Selesai',
        description: 'Printer telah berhasil diperbaiki dan berfungsi normal',
        timestamp: '',
        completed: false
      }
    ]
  };

  bookings.push(newBooking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  
  return bookingId;
};

export const getBookings = (): BookingData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading bookings:', error);
    return [];
  }
};

export const getBookingById = (id: string): BookingData | null => {
  const bookings = getBookings();
  return bookings.find(booking => booking.id.toLowerCase() === id.toLowerCase()) || null;
};

export const updateBookingStatus = (id: string, status: string): boolean => {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex(booking => booking.id === id);
  
  if (bookingIndex === -1) return false;
  
  bookings[bookingIndex].status = status;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  
  return true;
};

const generateBookingId = (): string => {
  const prefix = 'BRK';
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}${timestamp}`;
};

const assignTechnician = (): string => {
  const technicians = [
    'Budi Santoso',
    'Andi Pratama', 
    'Sari Wulandari',
    'Dedi Kurniawan',
    'Rina Marlina'
  ];
  return technicians[Math.floor(Math.random() * technicians.length)];
};

const calculateEstimatedCost = (problemCategory: string): string => {
  const costRanges: { [key: string]: string } = {
    'printing-issues': 'Rp 50.000 - 150.000',
    'cartridge-head-issues': 'Rp 75.000 - 200.000',
    'paper-issues': 'Rp 30.000 - 120.000',
    'internal-issues': 'Rp 100.000 - 500.000',
    'network-issues': 'Rp 50.000 - 120.000',
    'software-issues': 'Rp 75.000 - 200.000',
    'physical-issues': 'Rp 50.000 - 350.000',
    'scanner-issues': 'Rp 70.000 - 250.000',
    'fax-issues': 'Rp 50.000 - 120.000',
    'maintenance-issues': 'Rp 40.000 - 300.000'
  };
  
  return costRanges[problemCategory] || 'Rp 50.000 - 150.000';
};