import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          email: string;
          role: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          email: string;
          role?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          email?: string;
          role?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      printer_brands: {
        Row: {
          id: string;
          name: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      printer_models: {
        Row: {
          id: string;
          brand_id: string;
          name: string;
          type: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          name: string;
          type: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          name?: string;
          type?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      problem_categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      problems: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string | null;
          severity: string;
          estimated_time: string | null;
          estimated_cost: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          description?: string | null;
          severity?: string;
          estimated_time?: string | null;
          estimated_cost?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          description?: string | null;
          severity?: string;
          estimated_time?: string | null;
          estimated_cost?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      technicians: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          specialization: string[];
          experience: number;
          rating: number;
          is_available: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          specialization?: string[];
          experience?: number;
          rating?: number;
          is_available?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string | null;
          specialization?: string[];
          experience?: number;
          rating?: number;
          is_available?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      service_bookings: {
        Row: {
          id: string;
          customer_id: string;
          printer_brand_id: string | null;
          printer_model_id: string | null;
          problem_category_id: string | null;
          problem_description: string | null;
          service_type: string;
          appointment_date: string;
          appointment_time: string;
          status: string;
          technician_id: string | null;
          estimated_cost: string | null;
          actual_cost: string | null;
          notes: string | null;
          rating: number | null;
          review: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          printer_brand_id?: string | null;
          printer_model_id?: string | null;
          problem_category_id?: string | null;
          problem_description?: string | null;
          service_type: string;
          appointment_date: string;
          appointment_time: string;
          status?: string;
          technician_id?: string | null;
          estimated_cost?: string | null;
          actual_cost?: string | null;
          notes?: string | null;
          rating?: number | null;
          review?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          printer_brand_id?: string | null;
          printer_model_id?: string | null;
          problem_category_id?: string | null;
          problem_description?: string | null;
          service_type?: string;
          appointment_date?: string;
          appointment_time?: string;
          status?: string;
          technician_id?: string | null;
          estimated_cost?: string | null;
          actual_cost?: string | null;
          notes?: string | null;
          rating?: number | null;
          review?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      booking_timeline: {
        Row: {
          id: string;
          booking_id: string;
          status: string;
          title: string;
          description: string | null;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          status: string;
          title: string;
          description?: string | null;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          status?: string;
          title?: string;
          description?: string | null;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}