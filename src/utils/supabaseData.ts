import { supabase } from './supabase';

// Fetch printer brands and models
export const fetchPrinterBrands = async () => {
  try {
    const { data: brands, error } = await supabase
      .from('printer_brands')
      .select(`
        id,
        name,
        models:printer_models(id, name, type)
      `)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      models: brand.models.filter((model: any) => model.id).map((model: any) => ({
        id: model.id,
        name: model.name,
        type: model.type
      }))
    }));
  } catch (error) {
    console.error('Error fetching printer brands:', error);
    return [];
  }
};

// Fetch problem categories and problems
export const fetchProblemCategories = async () => {
  try {
    const { data: categories, error } = await supabase
      .from('problem_categories')
      .select(`
        id,
        name,
        icon,
        problems:problems(id, name, description, severity, estimated_time, estimated_cost)
      `)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      problems: category.problems.filter((problem: any) => problem.id).map((problem: any) => ({
        id: problem.id,
        name: problem.name,
        description: problem.description,
        severity: problem.severity,
        estimatedTime: problem.estimated_time,
        estimatedCost: problem.estimated_cost
      }))
    }));
  } catch (error) {
    console.error('Error fetching problem categories:', error);
    return [];
  }
};

// Add new printer brand
export const addPrinterBrand = async (name: string) => {
  try {
    const { error } = await supabase
      .from('printer_brands')
      .insert({ name });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding printer brand:', error);
    throw error;
  }
};

// Add new printer model
export const addPrinterModel = async (brandId: string, name: string, type: string) => {
  try {
    const { error } = await supabase
      .from('printer_models')
      .insert({ brand_id: brandId, name, type });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding printer model:', error);
    throw error;
  }
};

// Update printer model
export const updatePrinterModel = async (id: string, name: string, type: string) => {
  try {
    const { error } = await supabase
      .from('printer_models')
      .update({ name, type })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating printer model:', error);
    throw error;
  }
};

// Delete printer model
export const deletePrinterModel = async (id: string) => {
  try {
    const { error } = await supabase
      .from('printer_models')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting printer model:', error);
    throw error;
  }
};

// Add new problem category
export const addProblemCategory = async (name: string, icon: string) => {
  try {
    const { error } = await supabase
      .from('problem_categories')
      .insert({ name, icon });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding problem category:', error);
    throw error;
  }
};

// Add new problem
export const addProblem = async (categoryId: string, name: string, description: string, severity: string, estimatedTime: string, estimatedCost: string) => {
  try {
    const { error } = await supabase
      .from('problems')
      .insert({ 
        category_id: categoryId, 
        name, 
        description, 
        severity, 
        estimated_time: estimatedTime, 
        estimated_cost: estimatedCost 
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding problem:', error);
    throw error;
  }
};

// Update problem
export const updateProblem = async (id: string, name: string, description: string, severity: string, estimatedTime: string, estimatedCost: string) => {
  try {
    const { error } = await supabase
      .from('problems')
      .update({ 
        name, 
        description, 
        severity, 
        estimated_time: estimatedTime, 
        estimated_cost: estimatedCost 
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating problem:', error);
    throw error;
  }
};

// Delete problem
export const deleteProblem = async (id: string) => {
  try {
    const { error } = await supabase
      .from('problems')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting problem:', error);
    throw error;
  }
};

// Update printer brand
export const updatePrinterBrand = async (id: string, name: string) => {
  try {
    const { error } = await supabase
      .from('printer_brands')
      .update({ name })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating printer brand:', error);
    throw error;
  }
};

// Update problem category
export const updateProblemCategory = async (id: string, name: string, icon: string) => {
  try {
    const { error } = await supabase
      .from('problem_categories')
      .update({ name, icon })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating problem category:', error);
    throw error;
  }
};

// Delete printer brand
export const deletePrinterBrand = async (id: string) => {
  try {
    const { error } = await supabase
      .from('printer_brands')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting printer brand:', error);
    throw error;
  }
};

// Delete problem category
export const deleteProblemCategory = async (id: string) => {
  try {
    const { error } = await supabase
      .from('problem_categories')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting problem category:', error);
    throw error;
  }
};

// Gallery management functions
export const fetchGalleryImages = async () => {
  try {
    const { data: images, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return images || [];
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
};

export const addGalleryImage = async (data: {
  title: string;
  alt_text: string;
  image_url: string;
  category: string;
  sort_order?: number;
}) => {
  try {
    const { error } = await supabase
      .from('gallery_images')
      .insert(data);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding gallery image:', error);
    throw error;
  }
};

export const updateGalleryImage = async (id: string, data: {
  title?: string;
  alt_text?: string;
  image_url?: string;
  category?: string;
  sort_order?: number;
}) => {
  try {
    const { error } = await supabase
      .from('gallery_images')
      .update(data)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating gallery image:', error);
    throw error;
  }
};

export const deleteGalleryImage = async (id: string) => {
  try {
    const { error } = await supabase
      .from('gallery_images')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
};

// Add new technician
export const addTechnician = async (data: {
  name: string;
  phone: string;
  email?: string;
  specialization: string[];
  experience: number;
  rating: number;
}) => {
  try {
    const { error } = await supabase
      .from('technicians')
      .insert(data);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding technician:', error);
    throw error;
  }
};

// Update technician
export const updateTechnician = async (id: string, data: any) => {
  try {
    const { error } = await supabase
      .from('technicians')
      .update(data)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating technician:', error);
    throw error;
  }
};

// Delete technician (soft delete)
export const deleteTechnician = async (id: string) => {
  try {
    const { error } = await supabase
      .from('technicians')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting technician:', error);
    throw error;
  }
};
// Fetch technicians
export const fetchTechnicians = async () => {
  try {
    const { data: technicians, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return technicians;
  } catch (error) {
    console.error('Error fetching technicians:', error);
    return [];
  }
};

// Admin functions
export const updateBookingStatus = async (bookingId: string, status: string) => {
  try {
    const { error } = await supabase
      .from('service_bookings')
      .update({ status })
      .eq('id', bookingId);

    if (error) throw error;

    // Update timeline
    await supabase
      .from('booking_timeline')
      .update({ 
        completed: true, 
        completed_at: new Date().toISOString() 
      })
      .eq('booking_id', bookingId)
      .eq('status', status);

    return true;
  } catch (error) {
    console.error('Error updating booking status:', error);
    return false;
  }
};

export const assignTechnician = async (bookingId: string, technicianId: string) => {
  try {
    const { error } = await supabase
      .from('service_bookings')
      .update({ technician_id: technicianId })
      .eq('id', bookingId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error assigning technician:', error);
    return false;
  }
};

export const updateActualCost = async (bookingId: string, actualCost: string) => {
  try {
    const { error } = await supabase
      .from('service_bookings')
      .update({ actual_cost: actualCost })
      .eq('id', bookingId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating actual cost:', error);
    return false;
  }
};