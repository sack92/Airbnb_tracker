import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, IndianRupee } from 'lucide-react';
import { Property, Booking, CalendarDay } from '../../types';
import Button from '../UI/Button';
import Input from '../UI/Input';

interface CalendarProps {
  property: Property;
  bookings: Booking[];
  onDateClick: (date: string, currentStatus: string) => void;
  onClose: () => void;
  onCustomPriceUpdate: (date: string, price: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({ 
  property, 
  bookings, 
  onDateClick, 
  onClose, 
  onCustomPriceUpdate 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<string>('');

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({
        date: prevDate.toISOString().split('T')[0],
        status: 'available',
        price: 0,
        isCurrentMonth: false,
      });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const booking = bookings.find(b => b.date === dateStr);
      
      days.push({
        date: dateStr,
        status: booking?.status || 'available',
        price: booking?.price || property.avgPricePerDay,
        isCurrentMonth: true,
      });
    }

    // Add empty cells for days after the last day of the month
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate.toISOString().split('T')[0],
        status: 'available',
        price: 0,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'booked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'A';
      case 'blocked':
        return 'K';
      case 'booked':
        return 'B';
      default:
        return '';
    }
  };

  const handleDateDoubleClick = (date: string) => {
    setSelectedDate(date);
    const booking = bookings.find(b => b.date === date);
    setCustomPrice((booking?.price || property.avgPricePerDay).toString());
    setShowPriceModal(true);
  };

  const handlePriceUpdate = () => {
    const price = parseFloat(customPrice);
    if (!isNaN(price) && price > 0) {
      onCustomPriceUpdate(selectedDate, price);
      setShowPriceModal(false);
    }
  };

  const currentMonthBookings = bookings.filter(b => b.date.startsWith(currentDate.toISOString().slice(0, 7)));
  const bookedDays = currentMonthBookings.filter(b => b.status === 'booked').length;
  const blockedDays = currentMonthBookings.filter(b => b.status === 'blocked').length;
  const availableDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() - bookedDays - blockedDays;
  const monthlyEarnings = currentMonthBookings.filter(b => b.status === 'booked').reduce((sum, b) => sum + b.price, 0);
  const bookingRate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() > 0 ? 
    (bookedDays / new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-neutral-900">{property.name}</h2>
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
          <p className="text-sm text-neutral-600">Average Price: ₹{property.avgPricePerDay.toLocaleString()}/day</p>
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
              <button
                key={index}
                onClick={() => day.isCurrentMonth && onDateClick(day.date, day.status)}
                onDoubleClick={() => day.isCurrentMonth && handleDateDoubleClick(day.date)}
                className={`p-2 text-sm border-2 rounded-lg transition-all duration-200 ${
                  day.isCurrentMonth
                    ? `${getStatusColor(day.status)} hover:scale-105 cursor-pointer`
                    : 'bg-neutral-50 text-neutral-400 border-neutral-100 cursor-not-allowed'
                }`}
                disabled={!day.isCurrentMonth}
                title={day.isCurrentMonth ? `₹${day.price.toLocaleString()} - Double click to edit price` : ''}
              >
                <div className="font-medium">{new Date(day.date).getDate()}</div>
                {day.isCurrentMonth && (
                  <div className="text-xs font-bold">{getStatusLabel(day.status)}</div>
                )}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-200 rounded mr-2"></div>
              <span className="text-sm text-neutral-600">Available (A)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-200 rounded mr-2"></div>
              <span className="text-sm text-neutral-600">Blocked (K)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-200 rounded mr-2"></div>
              <span className="text-sm text-neutral-600">Booked (B)</span>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-neutral-50 rounded-lg p-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-neutral-900">{availableDays}</div>
              <div className="text-sm text-neutral-600">Available Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-neutral-900">{blockedDays}</div>
              <div className="text-sm text-neutral-600">Blocked Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-neutral-900">{bookedDays}</div>
              <div className="text-sm text-neutral-600">Booked Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{bookingRate.toFixed(1)}%</div>
              <div className="text-sm text-neutral-600">Booking Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">₹{monthlyEarnings.toLocaleString()}</div>
              <div className="text-sm text-neutral-600">Monthly Earnings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Price Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">Set Custom Price</h3>
                <button
                  onClick={() => setShowPriceModal(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-neutral-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-neutral-600 mb-4">
                Set custom price for {new Date(selectedDate).toLocaleDateString()}
              </p>
              <Input
                label="Price per day (₹)"
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder="Enter custom price"
              />
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="ghost" onClick={() => setShowPriceModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePriceUpdate} className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  Update Price
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;