import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Save } from 'lucide-react';
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import Button from '../UI/Button';
import Input from '../UI/Input';

interface BookingCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dates: Array<{ date: string; status: 'available' | 'blocked' | 'booked'; price: number }>) => void;
  initialDates: Array<{ date: string; status: 'available' | 'blocked' | 'booked'; price: number }>;
  defaultPrice: number;
}

const BookingCalendarModal: React.FC<BookingCalendarModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDates,
  defaultPrice,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Map<string, { status: 'available' | 'blocked' | 'booked'; price: number }>>(
    new Map(initialDates.map(d => [d.date, { status: d.status, price: d.price }]))
  );
  const [currentStatus, setCurrentStatus] = useState<'available' | 'booked'>('available');
  const [currentPrice, setCurrentPrice] = useState(defaultPrice.toString());

  if (!isOpen) return null;

  const getDaysInCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = startOfMonth(date);
    const daysInMonth = getDaysInMonth(date);
    const startingDayOfWeek = getDay(firstDay);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push(dateStr);
    }

    return days;
  };

  const days = getDaysInCalendar(currentDate);
  const monthYear = format(currentDate, 'MMMM yyyy');

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleDateClick = (dateStr: string) => {
    const price = Number(currentPrice) || defaultPrice;
    setSelectedDates(prev => {
      const newMap = new Map(prev);
      if (newMap.has(dateStr)) {
        newMap.delete(dateStr);
      } else {
        newMap.set(dateStr, { status: currentStatus, price });
      }
      return newMap;
    });
  };

  const getDateStyle = (dateStr: string) => {
    const dateData = selectedDates.get(dateStr);
    if (!dateData) return 'bg-white border-neutral-200 hover:bg-neutral-50';
    
    switch (dateData.status) {
      case 'available':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'booked':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-white border-neutral-200 hover:bg-neutral-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'A';
      case 'booked': return 'B';
      default: return '';
    }
  };

  const handleSave = () => {
    const dates = Array.from(selectedDates.entries()).map(([date, data]) => ({
      date,
      status: data.status,
      price: data.price,
    }));
    onSave(dates);
  };

  const clearAll = () => {
    setSelectedDates(new Map());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900">Set Booking Dates</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-neutral-500" />
            </button>
          </div>
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Status
              </label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as 'available' | 'booked')}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
              </select>
            </div>
            
            <div>
              <Input
                label="Price (₹)"
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="Price per day"
              />
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="w-full"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-neutral-900">{monthYear}</h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-neutral-600">
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <div key={index} className="aspect-square">
                {day ? (
                  <button
                    onClick={() => handleDateClick(day)}
                    className={`w-full h-full border-2 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer text-sm ${getDateStyle(day)}`}
                  >
                    <div className="font-medium">{new Date(day).getDate()}</div>
                    {selectedDates.has(day) && (
                      <div className="text-xs font-bold">
                        {getStatusLabel(selectedDates.get(day)!.status)}
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="w-full h-full"></div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2"></div>
              <span className="text-sm text-neutral-600">Available (A)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded mr-2"></div>
              <span className="text-sm text-neutral-600">Booked (B)</span>
            </div>
          </div>

          {/* Summary */}
          {selectedDates.size > 0 && (
            <div className="bg-neutral-50 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-neutral-900 mb-2">
                Selected Dates Summary ({selectedDates.size} dates)
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-green-600">
                  Available: {Array.from(selectedDates.values()).filter(d => d.status === 'available').length}
                </div>
                <div className="text-blue-600">
                  Booked: {Array.from(selectedDates.values()).filter(d => d.status === 'booked').length}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center">
              <Save className="h-4 w-4 mr-2" />
              Save Dates
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendarModal;