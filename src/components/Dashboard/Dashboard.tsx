import React, { useState } from 'react';
import { Plus, Home, Calendar, TrendingUp, BarChart3, IndianRupee, Edit2, Trash2, ChevronDown, MapPin } from 'lucide-react';
import { Area, Property, Booking } from '../../types';
import PropertyCard from '../Properties/PropertyCard';
import Button from '../UI/Button';
import { getCityImage } from '../../utils/cityImages';

interface DashboardProps {
  areas: Area[];
  properties: Property[];
  bookings: Booking[];
  selectedArea: Area | null;
  onAddProperty: () => void;
  onViewCalendar: (property: Property) => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (property: Property) => void;
  onEditArea: (area: Area) => void;
  onDeleteArea: (area: Area) => void;
  onAreaSelect: (area: Area) => void;
  onAddArea: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  areas,
  properties,
  bookings,
  selectedArea,
  onAddProperty,
  onViewCalendar,
  onEditProperty,
  onDeleteProperty,
  onEditArea,
  onDeleteArea,
  onAreaSelect,
  onAddArea,
}) => {
  const [showCitySelector, setShowCitySelector] = useState(false);
  
  const areaProperties = selectedArea ? properties.filter(p => p.areaId === selectedArea.id) : [];
  
  // Calculate summary stats
  const totalProperties = properties.length;
  const totalCities = areas.length;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const totalBookings = bookings.filter(b => b.date.startsWith(currentMonth) && b.status === 'booked').length;
  
  // Calculate city earnings
  const cityEarnings = bookings
    .filter(b => areaProperties.some(p => p.id === b.propertyId) && b.status === 'booked' && b.date.startsWith(currentMonth))
    .reduce((sum, b) => sum + b.price, 0);

  const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} mr-4`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-neutral-900">{value}</div>
          <div className="text-sm text-neutral-600">{label}</div>
        </div>
      </div>
    </div>
  );

  if (!selectedArea) {
    return (
      <div className="text-center py-12">
        <Home className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Welcome to Airbnb Tracker</h2>
        <p className="text-neutral-600 mb-6">
          Track Airbnb property traction across different cities. Select a city above to view its properties and analytics.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Home className="h-6 w-6 text-blue-600" />}
            label="Total Properties"
            value={totalProperties}
            color="bg-blue-100"
          />
          <StatCard
            icon={<MapPin className="h-6 w-6 text-green-600" />}
            label="Cities Tracked"
            value={totalCities}
            color="bg-green-100"
          />
          <StatCard
            icon={<BarChart3 className="h-6 w-6 text-purple-600" />}
            label="Monthly Bookings"
            value={totalBookings}
            color="bg-purple-100"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* City Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* City Image */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden">
              <img
                src={selectedArea.imageUrl || getCityImage(selectedArea.name)}
                alt={selectedArea.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getCityImage('default');
                }}
              />
            </div>
            
            {/* City Info */}
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-1">
                {selectedArea.name}
              </h1>
              {selectedArea.description && (
                <p className="text-neutral-600 mb-2">{selectedArea.description}</p>
              )}
              <div className="flex items-center text-sm text-neutral-500">
                <Home className="h-4 w-4 mr-1" />
                {areaProperties.length} Properties
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* City Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCitySelector(!showCitySelector)}
                className="flex items-center px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <MapPin className="h-4 w-4 mr-2 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-900">Switch City</span>
                <ChevronDown className={`h-4 w-4 ml-2 text-neutral-400 transition-transform ${showCitySelector ? 'rotate-180' : ''}`} />
              </button>
              
              {showCitySelector && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {/* Add City Option */}
                  <button
                    onClick={() => {
                      onAddArea();
                      setShowCitySelector(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-neutral-100 text-blue-600"
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Add New City</div>
                      <div className="text-xs text-blue-500">Create a new city to track</div>
                    </div>
                  </button>
                  
                  {areas.map((area) => {
                    const propertyCount = properties.filter(p => p.areaId === area.id).length;
                    return (
                      <button
                        key={area.id}
                        onClick={() => {
                          onAreaSelect(area);
                          setShowCitySelector(false);
                        }}
                        className={`w-full flex items-center px-4 py-3 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0 ${
                          selectedArea.id === area.id ? 'bg-blue-50 text-blue-700' : 'text-neutral-900'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                          <img
                            src={area.imageUrl || getCityImage(area.name)}
                            alt={area.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getCityImage('default');
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{area.name}</div>
                          <div className="text-xs text-neutral-500">{propertyCount} properties</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <button
              onClick={() => onEditArea(selectedArea)}
              className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit city"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDeleteArea(selectedArea)}
              className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete city"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Home className="h-6 w-6 text-blue-600" />}
          label="Properties in City"
          value={areaProperties.length}
          color="bg-blue-100"
        />
        <StatCard
          icon={<Calendar className="h-6 w-6 text-green-600" />}
          label="Total Bookings"
          value={bookings.filter(b => areaProperties.some(p => p.id === b.propertyId) && b.status === 'booked').length}
          color="bg-green-100"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          label="Avg Booking Rate"
          value={`${areaProperties.length > 0 ? 
            (areaProperties.reduce((sum, prop) => {
              const propBookings = bookings.filter(b => b.propertyId === prop.id && b.date.startsWith(currentMonth));
              const bookedDays = propBookings.filter(b => b.status === 'booked').length;
              const totalDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
              return sum + (totalDays > 0 ? (bookedDays / totalDays) * 100 : 0);
            }, 0) / areaProperties.length).toFixed(1) : '0'
          }%`}
          color="bg-purple-100"
        />
        <StatCard
          icon={<IndianRupee className="h-6 w-6 text-green-600" />}
          label="City Earnings"
          value={`₹${cityEarnings.toLocaleString()}`}
          color="bg-green-100"
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-900">Properties</h2>
        <Button onClick={onAddProperty} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {areaProperties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-neutral-200">
          <Home className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No properties yet</h3>
          <p className="text-neutral-600 mb-4">
            Add your first property to start tracking Airbnb traction in this city.
          </p>
          <Button onClick={onAddProperty} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {areaProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              bookings={bookings.filter(b => b.propertyId === property.id)}
              onViewCalendar={onViewCalendar}
              onEditProperty={onEditProperty}
              onDeleteProperty={onDeleteProperty}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;