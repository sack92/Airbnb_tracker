import React, { useState } from 'react';
import { Property } from '../../types';
import Input from '../UI/Input';
import Button from '../UI/Button';
import BookingCalendarModal from './BookingCalendarModal';
import { Calendar } from 'lucide-react';

interface AddPropertyFormProps {
  areaId: string;
  onSubmit: (property: Omit<Property, 'id' | 'createdAt'>, bookingDates?: Array<{ date: string; status: 'available' | 'booked'; price: number }>) => void;
  onCancel: () => void;
}

const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ areaId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    airbnbLink: '',
    avgPricePerDay: '',
    description: '',
    bedrooms: '1',
    propertyType: 'normal' as 'luxury' | 'normal',
    isSuperhost: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookingDates, setBookingDates] = useState<Array<{ date: string; status: 'available' | 'booked'; price: number }>>([]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Property name is required';
    }
    
    if (!formData.airbnbLink.trim()) {
      newErrors.airbnbLink = 'Airbnb link is required';
    }
    
    if (!formData.avgPricePerDay.trim()) {
      newErrors.avgPricePerDay = 'Average price per day is required';
    } else if (isNaN(Number(formData.avgPricePerDay)) || Number(formData.avgPricePerDay) <= 0) {
      newErrors.avgPricePerDay = 'Please enter a valid price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        areaId,
        name: formData.name.trim(),
        airbnbLink: formData.airbnbLink.trim(),
        avgPricePerDay: Number(formData.avgPricePerDay),
        description: formData.description.trim(),
        bedrooms: Number(formData.bedrooms),
        propertyType: formData.propertyType,
        isSuperhost: formData.isSuperhost,
      }, bookingDates);
    }
  };

  const handleCalendarSave = (dates: Array<{ date: string; status: 'available' | 'blocked' | 'booked'; price: number }>) => {
    // Filter out blocked status since we removed it
    const filteredDates = dates
      .filter(d => d.status !== 'blocked')
      .map(d => ({
        date: d.date,
        status: d.status as 'available' | 'booked',
        price: d.price
      }));
    
    setBookingDates(filteredDates);
    setShowCalendar(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Property Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Villa XYZ, Apartment ABC"
          error={errors.name}
        />
        
        <Input
          label="Airbnb Link"
          value={formData.airbnbLink}
          onChange={(e) => setFormData({ ...formData, airbnbLink: e.target.value })}
          placeholder="https://airbnb.com/rooms/123456"
          error={errors.airbnbLink}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Bedrooms
            </label>
            <select
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-neutral-400"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} Bedroom{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Property Type
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as 'luxury' | 'normal' })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-neutral-400"
            >
              <option value="normal">Normal</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Average Price per Day (₹)"
            type="number"
            value={formData.avgPricePerDay}
            onChange={(e) => setFormData({ ...formData, avgPricePerDay: e.target.value })}
            placeholder="3000"
            error={errors.avgPricePerDay}
          />
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Superhost Status
            </label>
            <select
              value={formData.isSuperhost ? 'yes' : 'no'}
              onChange={(e) => setFormData({ ...formData, isSuperhost: e.target.value === 'yes' })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-neutral-400"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the property..."
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-neutral-400"
          />
        </div>

        {/* Calendar Section */}
        <div className="border-t border-neutral-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-neutral-700">
              Booking Calendar (Optional)
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCalendar(true)}
              className="flex items-center"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Set Booking Dates
            </Button>
          </div>
          
          {bookingDates.length > 0 && (
            <div className="bg-neutral-50 rounded-lg p-3">
              <p className="text-sm text-neutral-600 mb-2">
                {bookingDates.length} booking dates configured
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="text-green-600">
                  Available: {bookingDates.filter(d => d.status === 'available').length}
                </div>
                <div className="text-blue-600">
                  Booked: {bookingDates.filter(d => d.status === 'booked').length}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Property
          </Button>
        </div>
      </form>

      <BookingCalendarModal
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        onSave={handleCalendarSave}
        initialDates={bookingDates.map(d => ({ ...d, status: d.status as 'available' | 'blocked' | 'booked' }))}
        defaultPrice={Number(formData.avgPricePerDay) || 3000}
      />
    </>
  );
};

export default AddPropertyForm;