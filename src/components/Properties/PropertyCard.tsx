import React, { useState } from 'react';
import { ExternalLink, Calendar, TrendingUp, MoreVertical, IndianRupee, Bed, Crown, Edit2, Trash2, Star } from 'lucide-react';
import { Property, Booking } from '../../types';

interface PropertyCardProps {
  property: Property;
  bookings: Booking[];
  onViewCalendar: (property: Property) => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  bookings,
  onViewCalendar,
  onEditProperty,
  onDeleteProperty,
}) => {
  const [showActions, setShowActions] = useState(false);
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthBookings = bookings.filter(b => b.date.startsWith(currentMonth));
  
  const bookedDays = currentMonthBookings.filter(b => b.status === 'booked').length;
  const totalDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const availableDays = totalDays - bookedDays;
  const bookingRate = totalDays > 0 ? (bookedDays / totalDays) * 100 : 0;
  
  const monthlyEarnings = currentMonthBookings
    .filter(b => b.status === 'booked')
    .reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-neutral-900">
              {property.name}
            </h3>
            {property.propertyType === 'luxury' && (
              <Crown className="h-3 w-3 text-yellow-500" title="Luxury Property" />
            )}
            {property.isSuperhost && (
              <Star className="h-3 w-3 text-orange-500" title="Superhost" />
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-neutral-500 mb-1">
            <div className="flex items-center">
              <Bed className="h-3 w-3 mr-1" />
              {property.bedrooms} BR
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              ₹{property.avgPricePerDay.toLocaleString()}/day
            </div>
          </div>
          
          {property.description && (
            <p className="text-xs text-neutral-600 mb-1 line-clamp-2">{property.description}</p>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <MoreVertical className="h-3 w-3" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  onEditProperty(property);
                  setShowActions(false);
                }}
                className="w-full flex items-center px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <Edit2 className="h-3 w-3 mr-2" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDeleteProperty(property);
                  setShowActions(false);
                }}
                className="w-full flex items-center px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 mb-2">
        <div className="bg-green-50 rounded-md p-1.5 text-center">
          <div className="text-xs text-green-600 mb-0.5">Available</div>
          <div className="text-xs font-semibold text-green-700">
            {availableDays}
          </div>
        </div>
        <div className="bg-blue-50 rounded-md p-1.5 text-center">
          <div className="text-xs text-blue-600 mb-0.5">Booked</div>
          <div className="text-xs font-semibold text-blue-700">
            {bookedDays}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 mb-2">
        <div className="bg-neutral-50 rounded-md p-1.5">
          <div className="text-xs text-neutral-600 mb-0.5">Booking Rate</div>
          <div className="flex items-center">
            <div className="text-xs font-semibold text-neutral-900">
              {bookingRate.toFixed(1)}%
            </div>
            <div className="ml-1 flex-1 bg-neutral-200 rounded-full h-1">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(bookingRate, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-md p-1.5">
          <div className="text-xs text-green-600 mb-0.5">Monthly Earnings</div>
          <div className="text-xs font-semibold text-green-700 flex items-center">
            <IndianRupee className="h-2.5 w-2.5 mr-0.5" />
            ₹{monthlyEarnings.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {property.airbnbLink ? (
          <a
            href={property.airbnbLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ExternalLink className="h-2.5 w-2.5 mr-1" />
            View on Airbnb
          </a>
        ) : (
          <div className="text-xs text-neutral-400">No Airbnb link</div>
        )}
        <button
          onClick={() => onViewCalendar(property)}
          className="flex items-center px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
        >
          <Calendar className="h-2.5 w-2.5 mr-1" />
          Calendar
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;