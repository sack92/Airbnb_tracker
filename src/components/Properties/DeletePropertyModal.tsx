import React from 'react';
import { AlertTriangle, Home, Calendar } from 'lucide-react';
import { Property, Booking } from '../../types';
import Button from '../UI/Button';

interface DeletePropertyModalProps {
  property: Property;
  bookings: Booking[];
  onConfirm: () => void;
  onCancel: () => void;
}

const DeletePropertyModal: React.FC<DeletePropertyModalProps> = ({
  property,
  bookings,
  onConfirm,
  onCancel,
}) => {
  const totalBookings = bookings.length;
  const bookedDays = bookings.filter(b => b.status === 'booked').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'booked')
    .reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="space-y-6">
      {/* Warning Header */}
      <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-red-800">Delete Property Warning</h3>
          <p className="text-sm text-red-700">
            You are about to delete "{property.name}". This action cannot be undone.
          </p>
        </div>
      </div>

      {/* Property Information */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Home className="h-5 w-5 text-neutral-600" />
          <h4 className="text-sm font-semibold text-neutral-900">Property Details</h4>
        </div>
        
        <div className="space-y-2 text-sm text-neutral-700">
          <div className="flex justify-between">
            <span>Property Name:</span>
            <span className="font-medium">{property.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Bedrooms:</span>
            <span className="font-medium">{property.bedrooms}</span>
          </div>
          <div className="flex justify-between">
            <span>Property Type:</span>
            <span className="font-medium capitalize">{property.propertyType}</span>
          </div>
          <div className="flex justify-between">
            <span>Average Price:</span>
            <span className="font-medium">₹{property.avgPricePerDay.toLocaleString()}/day</span>
          </div>
        </div>
      </div>

      {/* Booking Data Impact */}
      {totalBookings > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Calendar className="h-5 w-5 text-amber-600" />
            <h4 className="text-sm font-semibold text-amber-800">Booking Data Impact</h4>
          </div>
          
          <div className="space-y-2 text-sm text-amber-700">
            <div className="flex justify-between">
              <span>Total Booking Records:</span>
              <span className="font-medium">{totalBookings}</span>
            </div>
            <div className="flex justify-between">
              <span>Booked Days:</span>
              <span className="font-medium">{bookedDays}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Revenue:</span>
              <span className="font-medium">₹{totalRevenue.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-amber-100 rounded-md">
            <p className="text-xs text-amber-800">
              <strong>Warning:</strong> All booking data and calendar information for this property will be permanently deleted. 
              This includes historical booking records, revenue data, and availability information.
            </p>
          </div>
        </div>
      )}

      {/* Confirmation */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-neutral-900 mb-2">
          Are you sure you want to delete this property?
        </h4>
        <p className="text-sm text-neutral-600">
          This action will permanently remove the property and all associated data from your account. 
          You will not be able to recover this information.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        >
          Delete Property
        </Button>
      </div>
    </div>
  );
};

export default DeletePropertyModal;