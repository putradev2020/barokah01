export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  createdAt: Date;
}

export interface PrinterBrand {
  id: string;
  name: string;
  models: PrinterModel[];
}

export interface PrinterModel {
  id: string;
  name: string;
  type: 'inkjet' | 'laser' | 'multifunction';
}

export interface ProblemCategory {
  id: string;
  name: string;
  problems: Problem[];
  icon: string;
}

export interface Problem {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  estimatedTime: string;
  estimatedCost: string;
}

export interface ServiceBooking {
  id: string;
  customerId: string;
  printerBrand: string;
  printerModel: string;
  problemCategory: string;
  problemDetails: string;
  serviceType: 'bring-to-shop' | 'home-service';
  appointmentDate: Date;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialization: string[];
  experience: number;
  rating: number;
  isAvailable: boolean;
}

export interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  printerBrand: string;
  problemSolved: string;
  date: Date;
  beforeImage?: string;
  afterImage?: string;
}