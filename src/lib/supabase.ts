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
      areas: {
        Row: {
          id: string;
          name: string;
          description: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          image_url?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image_url?: string;
          created_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          area_id: string;
          name: string;
          airbnb_link: string;
          avg_price_per_day: number;
          description: string;
          bedrooms: number;
          property_type: 'normal' | 'luxury';
          created_at: string;
        };
        Insert: {
          id?: string;
          area_id: string;
          name: string;
          airbnb_link?: string;
          avg_price_per_day: number;
          description?: string;
          bedrooms?: number;
          property_type?: 'normal' | 'luxury';
          created_at?: string;
        };
        Update: {
          id?: string;
          area_id?: string;
          name?: string;
          airbnb_link?: string;
          avg_price_per_day?: number;
          description?: string;
          bedrooms?: number;
          property_type?: 'normal' | 'luxury';
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          property_id: string;
          date: string;
          status: 'available' | 'blocked' | 'booked';
          price: number;
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          date: string;
          status?: 'available' | 'blocked' | 'booked';
          price?: number;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          date?: string;
          status?: 'available' | 'blocked' | 'booked';
          price?: number;
          notes?: string;
          created_at?: string;
        };
      };
    };
  };
}