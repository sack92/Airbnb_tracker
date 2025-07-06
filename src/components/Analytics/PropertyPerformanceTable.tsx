import React, { useState } from 'react';
import { format, getDaysInMonth } from 'date-fns';
import { Property, Booking } from '../../types';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';

interface PropertyPerformanceTableProps {
  properties: Property[];
  bookings: Booking[];
  selectedAreaId: string | null;
  selectedMonth: Date;
}

const PropertyPerformanceTable: React.FC<PropertyPerformanceTableProps> = ({
  properties,
  bookings,
  selectedAreaId,
  selectedMonth,
}) => {
  const [sortBy, setSortBy] = useState<'revenue' | 'occupancy' | 'rate'>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const monthStr = format(selectedMonth, 'yyyy-MM');
  const daysInMonth = getDaysInMonth(selectedMonth);

  const filteredProperties = selectedAreaId 
    ? properties.filter(p => p.areaId === selectedAreaId)
    : properties;

  const propertyData = filteredProperties.map(property => {
    const propertyBookings = bookings.filter(b => 
      b.propertyId === property.id && b.date.startsWith(monthStr)
    );
    
    const revenue = propertyBookings
      .filter(b => b.status === 'booked')
      .reduce((sum, b) => sum + b.price, 0);
    
    const bookedNights = propertyBookings.filter(b => b.status === 'booked').length;
    const occupancyRate = (bookedNights / daysInMonth) * 100;
    const averageRate = bookedNights > 0 ? revenue / bookedNights : 0;

    return {
      ...property,
      revenue,
      bookedNights,
      occupancyRate,
      averageRate,
    };
  });

  const sortedData = [...propertyData].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'revenue':
        aValue = a.revenue;
        bValue = b.revenue;
        break;
      case 'occupancy':
        aValue = a.occupancyRate;
        bValue = b.occupancyRate;
        break;
      case 'rate':
        aValue = a.averageRate;
        bValue = b.averageRate;
        break;
      default:
        aValue = a.revenue;
        bValue = b.revenue;
    }
    
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const handleSort = (column: 'revenue' | 'occupancy' | 'rate') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ column }: { column: 'revenue' | 'occupancy' | 'rate' }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'desc' ? 
      <TrendingDown className="h-4 w-4" /> : 
      <TrendingUp className="h-4 w-4" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Property Performance</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-3 px-4 font-medium text-neutral-700">Property</th>
              <th 
                className="text-left py-3 px-4 font-medium text-neutral-700 cursor-pointer hover:text-neutral-900 flex items-center"
                onClick={() => handleSort('revenue')}
              >
                Revenue <SortIcon column="revenue" />
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-neutral-700 cursor-pointer hover:text-neutral-900"
                onClick={() => handleSort('occupancy')}
              >
                Occupancy <SortIcon column="occupancy" />
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-neutral-700 cursor-pointer hover:text-neutral-900"
                onClick={() => handleSort('rate')}
              >
                Avg Rate <SortIcon column="rate" />
              </th>
              <th className="text-left py-3 px-4 font-medium text-neutral-700">Booked Nights</th>
              <th className="text-left py-3 px-4 font-medium text-neutral-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((property) => (
              <tr key={property.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-neutral-900">{property.name}</div>
                    <div className="text-sm text-neutral-500">
                      {property.bedrooms} BR • {property.propertyType}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-neutral-900">
                    ₹{property.revenue.toLocaleString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="font-medium text-neutral-900">
                      {property.occupancyRate.toFixed(1)}%
                    </div>
                    <div className="ml-2 flex-1 bg-neutral-200 rounded-full h-2 max-w-20">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(property.occupancyRate, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-neutral-900">
                    ₹{property.averageRate.toLocaleString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-neutral-900">
                    {property.bookedNights}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {property.airbnbLink && (
                    <a
                      href={property.airbnbLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyPerformanceTable;