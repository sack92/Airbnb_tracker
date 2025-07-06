import { Area, Property, Booking, AnalyticsData, CityMetrics } from '../types';
import { format, startOfMonth, endOfMonth, subMonths, getDaysInMonth } from 'date-fns';

export const calculateCityAnalytics = (
  areas: Area[],
  properties: Property[],
  bookings: Booking[],
  selectedAreaId: string | null,
  selectedMonth: Date
): AnalyticsData => {
  const monthStr = format(selectedMonth, 'yyyy-MM');
  const daysInMonth = getDaysInMonth(selectedMonth);
  
  // Filter properties by selected area
  const filteredProperties = selectedAreaId 
    ? properties.filter(p => p.areaId === selectedAreaId)
    : properties;
  
  // Filter bookings for selected month and properties
  const monthBookings = bookings.filter(b => 
    b.date.startsWith(monthStr) && 
    filteredProperties.some(p => p.id === b.propertyId)
  );
  
  // Calculate metrics
  const totalRevenue = monthBookings
    .filter(b => b.status === 'booked')
    .reduce((sum, b) => sum + b.price, 0);
  
  const totalProperties = filteredProperties.length;
  
  const bookedNights = monthBookings.filter(b => b.status === 'booked').length;
  const totalAvailableNights = totalProperties * daysInMonth;
  const averageOccupancyRate = totalAvailableNights > 0 ? (bookedNights / totalAvailableNights) * 100 : 0;
  
  const averageDailyRate = bookedNights > 0 ? totalRevenue / bookedNights : 0;
  
  // Calculate previous month for growth
  const prevMonth = subMonths(selectedMonth, 1);
  const prevMonthStr = format(prevMonth, 'yyyy-MM');
  const prevMonthBookings = bookings.filter(b => 
    b.date.startsWith(prevMonthStr) && 
    filteredProperties.some(p => p.id === b.propertyId)
  );
  const prevMonthRevenue = prevMonthBookings
    .filter(b => b.status === 'booked')
    .reduce((sum, b) => sum + b.price, 0);
  
  const monthOverMonthGrowth = prevMonthRevenue > 0 
    ? ((totalRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 
    : 0;
  
  // Calculate average length of stay (simplified - assuming each booking is 1 night)
  const averageLengthOfStay = 1; // This would need more complex logic for multi-night bookings
  
  const propertiesWithBookings = new Set(
    monthBookings.filter(b => b.status === 'booked').map(b => b.propertyId)
  ).size;
  
  return {
    totalRevenue,
    totalProperties,
    averageOccupancyRate,
    averageDailyRate,
    revPAR: 0, // Removed RevPAR as requested
    totalBookedNights: bookedNights,
    monthOverMonthGrowth,
    averageLengthOfStay,
    propertiesWithBookings,
  };
};

export const calculateCityComparison = (
  areas: Area[],
  properties: Property[],
  bookings: Booking[],
  selectedMonth: Date
): CityMetrics[] => {
  const monthStr = format(selectedMonth, 'yyyy-MM');
  const daysInMonth = getDaysInMonth(selectedMonth);
  
  return areas.map(area => {
    const areaProperties = properties.filter(p => p.areaId === area.id);
    const areaBookings = bookings.filter(b => 
      b.date.startsWith(monthStr) && 
      areaProperties.some(p => p.id === b.propertyId)
    );
    
    const revenue = areaBookings
      .filter(b => b.status === 'booked')
      .reduce((sum, b) => sum + b.price, 0);
    
    const bookedNights = areaBookings.filter(b => b.status === 'booked').length;
    const totalAvailableNights = areaProperties.length * daysInMonth;
    const occupancyRate = totalAvailableNights > 0 ? (bookedNights / totalAvailableNights) * 100 : 0;
    const averageDailyRate = bookedNights > 0 ? revenue / bookedNights : 0;
    
    return {
      cityId: area.id,
      cityName: area.name,
      revenue,
      properties: areaProperties.length,
      occupancyRate,
      averageDailyRate,
      bookedNights,
    };
  });
};

export const getRevenueChartData = (
  areas: Area[],
  properties: Property[],
  bookings: Booking[],
  selectedAreaId: string | null,
  selectedMonth: Date
) => {
  const data = [];
  
  for (let i = 11; i >= 0; i--) {
    const month = subMonths(selectedMonth, i);
    const monthStr = format(month, 'yyyy-MM');
    
    const filteredProperties = selectedAreaId 
      ? properties.filter(p => p.areaId === selectedAreaId)
      : properties;
    
    const monthBookings = bookings.filter(b => 
      b.date.startsWith(monthStr) && 
      filteredProperties.some(p => p.id === b.propertyId)
    );
    
    const revenue = monthBookings
      .filter(b => b.status === 'booked')
      .reduce((sum, b) => sum + b.price, 0);
    
    data.push({
      month: format(month, 'MMM yyyy'),
      revenue,
    });
  }
  
  return data;
};

export const getOccupancyHeatmapData = (
  properties: Property[],
  bookings: Booking[],
  selectedAreaId: string | null,
  selectedMonth: Date
) => {
  const monthStr = format(selectedMonth, 'yyyy-MM');
  const daysInMonth = getDaysInMonth(selectedMonth);
  
  const filteredProperties = selectedAreaId 
    ? properties.filter(p => p.areaId === selectedAreaId)
    : properties;
  
  const data = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;
    const dayBookings = bookings.filter(b => 
      b.date === dateStr && 
      filteredProperties.some(p => p.id === b.propertyId)
    );
    
    const bookedCount = dayBookings.filter(b => b.status === 'booked').length;
    const occupancyRate = filteredProperties.length > 0 ? (bookedCount / filteredProperties.length) * 100 : 0;
    
    data.push({
      day,
      date: dateStr,
      occupancyRate,
      bookedProperties: bookedCount,
      totalProperties: filteredProperties.length,
    });
  }
  
  return data;
};