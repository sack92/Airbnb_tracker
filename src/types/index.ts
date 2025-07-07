export interface Area {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface Property {
  id: string;
  areaId: string;
  name: string;
  airbnbLink: string;
  avgPricePerDay: number;
  description: string;
  bedrooms: number;
  propertyType: 'luxury' | 'normal';
  isSuperhost: boolean;
  createdAt: Date;
}

export interface Booking {
  id: string;
  propertyId: string;
  date: string; // YYYY-MM-DD format
  status: 'available' | 'booked';
  price: number;
  notes?: string;
}

export interface CalendarDay {
  date: string;
  status: 'available' | 'booked';
  price: number;
  isCurrentMonth: boolean;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalProperties: number;
  averageOccupancyRate: number;
  averageDailyRate: number;
  revPAR: number;
  totalBookedNights: number;
  monthOverMonthGrowth: number;
  averageLengthOfStay: number;
  propertiesWithBookings: number;
}

export interface CityMetrics {
  cityId: string;
  cityName: string;
  revenue: number;
  properties: number;
  occupancyRate: number;
  averageDailyRate: number;
  bookedNights: number;
}