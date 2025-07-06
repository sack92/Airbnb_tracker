import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Area, Property, Booking } from '../types';

export function useSupabaseData() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch areas
      const { data: areasData, error: areasError } = await supabase
        .from('areas')
        .select('*')
        .order('created_at', { ascending: true });

      if (areasError) throw areasError;

      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: true });

      if (propertiesError) throw propertiesError;

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true });

      if (bookingsError) throw bookingsError;

      // Transform data to match local types
      setAreas((areasData || []).map(area => ({
        id: area.id,
        name: area.name,
        description: area.description || '',
        imageUrl: area.image_url || '',
        createdAt: new Date(area.created_at),
      })));

      setProperties((propertiesData || []).map(property => ({
        id: property.id,
        areaId: property.area_id,
        name: property.name,
        airbnbLink: property.airbnb_link || '',
        avgPricePerDay: Number(property.avg_price_per_day) || 0,
        description: property.description || '',
        bedrooms: property.bedrooms || 1,
        propertyType: property.property_type || 'normal',
        createdAt: new Date(property.created_at),
      })));

      setBookings((bookingsData || []).map(booking => ({
        id: booking.id,
        propertyId: booking.property_id,
        date: booking.date,
        status: booking.status || 'available',
        price: Number(booking.price) || 0,
        notes: booking.notes || '',
      })));

    } catch (err) {
      console.error('Database error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  // Area operations
  const addArea = async (areaData: Omit<Area, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('areas')
        .insert({
          name: areaData.name,
          description: areaData.description || '',
          image_url: areaData.imageUrl || '',
        })
        .select()
        .single();

      if (error) throw error;

      const newArea: Area = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        imageUrl: data.image_url || '',
        createdAt: new Date(data.created_at),
      };

      setAreas(prev => [...prev, newArea]);
      return newArea;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add area');
    }
  };

  const updateArea = async (id: string, areaData: Partial<Omit<Area, 'id' | 'createdAt'>>) => {
    try {
      const { data, error } = await supabase
        .from('areas')
        .update({
          name: areaData.name,
          description: areaData.description || '',
          image_url: areaData.imageUrl || '',
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedArea: Area = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        imageUrl: data.image_url || '',
        createdAt: new Date(data.created_at),
      };

      setAreas(prev => prev.map(area => area.id === id ? updatedArea : area));
      return updatedArea;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update area');
    }
  };

  const deleteArea = async (id: string) => {
    try {
      const { error } = await supabase
        .from('areas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAreas(prev => prev.filter(area => area.id !== id));
      setProperties(prev => prev.filter(property => property.areaId !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete area');
    }
  };

  // Property operations
  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          area_id: propertyData.areaId,
          name: propertyData.name,
          airbnb_link: propertyData.airbnbLink || '',
          avg_price_per_day: propertyData.avgPricePerDay,
          description: propertyData.description || '',
          bedrooms: propertyData.bedrooms,
          property_type: propertyData.propertyType,
        })
        .select()
        .single();

      if (error) throw error;

      const newProperty: Property = {
        id: data.id,
        areaId: data.area_id,
        name: data.name,
        airbnbLink: data.airbnb_link || '',
        avgPricePerDay: Number(data.avg_price_per_day) || 0,
        description: data.description || '',
        bedrooms: data.bedrooms || 1,
        propertyType: data.property_type || 'normal',
        createdAt: new Date(data.created_at),
      };

      setProperties(prev => [...prev, newProperty]);
      return newProperty;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add property');
    }
  };

  const updateProperty = async (id: string, propertyData: Partial<Omit<Property, 'id' | 'createdAt'>>) => {
    try {
      const updateData: any = {};
      
      if (propertyData.areaId !== undefined) updateData.area_id = propertyData.areaId;
      if (propertyData.name !== undefined) updateData.name = propertyData.name;
      if (propertyData.airbnbLink !== undefined) updateData.airbnb_link = propertyData.airbnbLink;
      if (propertyData.avgPricePerDay !== undefined) updateData.avg_price_per_day = propertyData.avgPricePerDay;
      if (propertyData.description !== undefined) updateData.description = propertyData.description;
      if (propertyData.bedrooms !== undefined) updateData.bedrooms = propertyData.bedrooms;
      if (propertyData.propertyType !== undefined) updateData.property_type = propertyData.propertyType;

      const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedProperty: Property = {
        id: data.id,
        areaId: data.area_id,
        name: data.name,
        airbnbLink: data.airbnb_link || '',
        avgPricePerDay: Number(data.avg_price_per_day) || 0,
        description: data.description || '',
        bedrooms: data.bedrooms || 1,
        propertyType: data.property_type || 'normal',
        createdAt: new Date(data.created_at),
      };

      setProperties(prev => prev.map(property => property.id === id ? updatedProperty : property));
      return updatedProperty;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update property');
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProperties(prev => prev.filter(property => property.id !== id));
      setBookings(prev => prev.filter(booking => booking.propertyId !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete property');
    }
  };

  // Booking operations
  const upsertBooking = async (bookingData: Omit<Booking, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .upsert({
          property_id: bookingData.propertyId,
          date: bookingData.date,
          status: bookingData.status,
          price: bookingData.price,
          notes: bookingData.notes || '',
        }, {
          onConflict: 'property_id,date'
        })
        .select()
        .single();

      if (error) throw error;

      const newBooking: Booking = {
        id: data.id,
        propertyId: data.property_id,
        date: data.date,
        status: data.status || 'available',
        price: Number(data.price) || 0,
        notes: data.notes || '',
      };

      setBookings(prev => {
        const existing = prev.findIndex(b => b.propertyId === newBooking.propertyId && b.date === newBooking.date);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = newBooking;
          return updated;
        }
        return [...prev, newBooking];
      });

      return newBooking;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update booking');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    areas,
    properties,
    bookings,
    loading,
    error,
    addArea,
    updateArea,
    deleteArea,
    addProperty,
    updateProperty,
    deleteProperty,
    upsertBooking,
    refetch: fetchData,
  };
}