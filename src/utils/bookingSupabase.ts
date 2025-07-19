import { supabase } from './supabase';

export interface BookingFormData {
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
}

export interface BookingData {
  id: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  printer: {
    brand: string;
    model: string;
  };
  problem: {
    category: string;
    description: string;
  };
  service: {
    type: string;
    date: string;
    time: string;
  };
  status: string;
  technician: string;
  estimatedCost: string;
  actualCost: string;
  notes: string;
  timeline: Array<{
    status: string;
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }>;
  createdAt: string;
}

export const saveBookingToSupabase = async (formData: BookingFormData): Promise<string> => {
  try {
    console.log('Starting booking save process...', formData);
    
    // First, create or get customer
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', formData.phone)
      .maybeSingle();

    let customerId: string;

    if (existingCustomer) {
      customerId = existingCustomer.id;
      console.log('Found existing customer:', customerId);
      // Update customer info
      await supabase
        .from('customers')
        .update({
          name: formData.customerName,
          email: formData.email,
          address: formData.address
        })
        .eq('id', customerId);
    } else {
      console.log('Creating new customer...');
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: formData.customerName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address
        })
        .select('id')
        .single();

      if (customerError) throw customerError;
      customerId = newCustomer.id;
      console.log('Created new customer:', customerId);
    }

    // Get printer brand and model IDs
    console.log('Looking up printer brand:', formData.printerBrand);
    const { data: brand } = await supabase
      .from('printer_brands')
      .select('id')
      .eq('name', formData.printerBrand)
      .single();

    console.log('Looking up printer model:', formData.printerModel);
    const { data: model } = await supabase
      .from('printer_models')
      .select('id')
      .eq('name', formData.printerModel)
      .single();

    console.log('Looking up problem category:', formData.problemCategory);
    const { data: category } = await supabase
      .from('problem_categories')
      .select('id')
      .eq('name', formData.problemCategory)
      .single();

    // Get available technician
    console.log('Looking up available technician...');
    const { data: technician } = await supabase
      .from('technicians')
      .select('id')
      .eq('is_available', true)
      .eq('is_active', true)
      .limit(1)
      .single();

    console.log('Found technician:', technician?.id);

    // Create booking
    const bookingData = {
      customer_id: customerId,
      printer_brand_id: brand?.id,
      printer_model_id: model?.id,
      problem_category_id: category?.id,
      problem_description: formData.problemDescription,
      service_type: 'Antar ke Toko',
      appointment_date: formData.appointmentDate,
      appointment_time: formData.appointmentTime,
      technician_id: technician?.id,
      notes: formData.notes,
      estimated_cost: calculateEstimatedCost(formData.problemCategory)
    };
    
    console.log('Creating booking with data:', bookingData);
    
    const { data: booking, error: bookingError } = await supabase
      .from('service_bookings')
      .insert(bookingData)
      .select('id')
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      throw bookingError;
    }

    console.log('Booking created successfully:', booking.id);
    return booking.id;
  } catch (error) {
    console.error('Error saving booking to Supabase:', error);
    throw error;
  }
};

export const getBookingById = async (bookingId: string): Promise<BookingData | null> => {
  try {
    const { data: booking, error } = await supabase
      .from('service_bookings')
      .select(`
        *,
        customer:customers(*),
        printer_brand:printer_brands(name),
        printer_model:printer_models(name),
        problem_category:problem_categories(name),
        technician:technicians(name),
        timeline:booking_timeline(*)
      `)
      .eq('id', bookingId.toUpperCase())
      .single();

    if (error || !booking) return null;

    return {
      id: booking.id,
      customer: {
        name: booking.customer.name,
        phone: booking.customer.phone,
        email: booking.customer.email || '',
        address: booking.customer.address || ''
      },
      printer: {
        brand: booking.printer_brand?.name || '',
        model: booking.printer_model?.name || ''
      },
      problem: {
        category: booking.problem_category?.name || '',
        description: booking.problem_description || ''
      },
      service: {
        type: booking.service_type,
        date: booking.appointment_date,
        time: booking.appointment_time
      },
      status: booking.status,
      technician: booking.technician?.name || 'Belum ditugaskan',
      estimatedCost: booking.estimated_cost || '',
      actualCost: booking.actual_cost || '',
      notes: booking.notes || '',
      timeline: booking.timeline.map((t: any) => ({
        status: t.status,
        title: t.title,
        description: t.description,
        timestamp: t.completed_at || t.created_at,
        completed: t.completed
      })),
      createdAt: booking.created_at
    };
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
};

export const getAllBookings = async (): Promise<BookingData[]> => {
  try {
    const { data: bookings, error } = await supabase
      .from('service_bookings')
      .select(`
        *,
        customer:customers(*),
        printer_brand:printer_brands(name),
        printer_model:printer_models(name),
        problem_category:problem_categories(name),
        technician:technicians(name),
        timeline:booking_timeline(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return bookings.map((booking: any) => ({
      id: booking.id,
      customer: {
        name: booking.customer.name,
        phone: booking.customer.phone,
        email: booking.customer.email || '',
        address: booking.customer.address || ''
      },
      printer: {
        brand: booking.printer_brand?.name || '',
        model: booking.printer_model?.name || ''
      },
      problem: {
        category: booking.problem_category?.name || '',
        description: booking.problem_description || ''
      },
      service: {
        type: booking.service_type,
        date: booking.appointment_date,
        time: booking.appointment_time
      },
      status: booking.status,
      technician: booking.technician?.name || 'Belum ditugaskan',
      estimatedCost: booking.estimated_cost || '',
      actualCost: booking.actual_cost || '',
      notes: booking.notes || '',
      timeline: booking.timeline.map((t: any) => ({
        status: t.status,
        title: t.title,
        description: t.description,
        timestamp: t.completed_at || t.created_at,
        completed: t.completed
      })),
      createdAt: booking.created_at
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

const calculateEstimatedCost = (problemCategory: string): string => {
  const costRanges: { [key: string]: string } = {
    'Masalah Pencetakan': 'Rp 50.000 - 150.000',
    'Masalah Cartridge / Head': 'Rp 75.000 - 200.000',
    'Masalah Kertas': 'Rp 30.000 - 120.000',
    'Masalah Internal': 'Rp 100.000 - 500.000',
    'Masalah Jaringan / Wireless': 'Rp 50.000 - 120.000',
    'Masalah Software / Reset': 'Rp 75.000 - 200.000',
    'Masalah Fisik / Casing': 'Rp 50.000 - 350.000',
    'Masalah Scanner': 'Rp 70.000 - 250.000',
    'Masalah Fax': 'Rp 50.000 - 120.000',
    'Masalah Maintenance': 'Rp 40.000 - 300.000'
  };
  
  return costRanges[problemCategory] || 'Rp 50.000 - 150.000';
};