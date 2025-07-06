import React, { useState } from 'react';
import { Property } from '../../types';
import Input from '../UI/Input';
import Button from '../UI/Button';

interface AddPropertyFormProps {
  areaId: string;
  onSubmit: (property: Omit<Property, 'id' | 'createdAt'>) => void;
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Property name is required';
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
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Property Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="e.g., Villa XYZ, Apartment ABC"
        error={errors.name}
      />
      
      <Input
        label="Airbnb Link (Optional)"
        value={formData.airbnbLink}
        onChange={(e) => setFormData({ ...formData, airbnbLink: e.target.value })}
        placeholder="https://airbnb.com/rooms/123456"
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

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Add Property
        </Button>
      </div>
    </form>
  );
};

export default AddPropertyForm;