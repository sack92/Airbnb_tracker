import React, { useState } from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react';
import { Area, Property, Booking } from '../../types';
import { calculateCityAnalytics, calculateCityComparison, getRevenueChartData, getOccupancyHeatmapData } from '../../utils/analytics';
import MetricCard from './MetricCard';
import RevenueChart from './RevenueChart';
import CityComparisonChart from './CityComparisonChart';
import OccupancyHeatmap from './OccupancyHeatmap';
import PropertyPerformanceTable from './PropertyPerformanceTable';
import RevenueDistributionChart from './RevenueDistributionChart';
import FillRateComparisonChart from './FillRateComparisonChart';
import Button from '../UI/Button';

interface AnalyticsDashboardProps {
  areas: Area[];
  properties: Property[];
  bookings: Booking[];
  selectedArea: Area | null;
  onAreaSelect: (area: Area | null) => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  areas,
  properties,
  bookings,
  selectedArea,
  onAreaSelect,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const analytics = calculateCityAnalytics(
    areas,
    properties,
    bookings,
    selectedArea?.id || null,
    selectedMonth
  );

  const cityComparison = calculateCityComparison(areas, properties, bookings, selectedMonth);
  const revenueData = getRevenueChartData(areas, properties, bookings, selectedArea?.id || null, selectedMonth);
  const heatmapData = getOccupancyHeatmapData(properties, bookings, selectedArea?.id || null, selectedMonth);

  const handlePrevMonth = () => {
    setSelectedMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => addMonths(prev, 1));
  };

  const exportData = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Revenue', `₹${analytics.totalRevenue.toLocaleString()}`],
      ['Total Properties', analytics.totalProperties.toString()],
      ['Average Occupancy Rate', `${analytics.averageOccupancyRate.toFixed(1)}%`],
      ['Average Daily Rate', `₹${analytics.averageDailyRate.toLocaleString()}`],
      ['Total Booked Nights', analytics.totalBookedNights.toString()],
      ['Month-over-Month Growth', `${analytics.monthOverMonthGrowth.toFixed(1)}%`],
      ['Properties with Bookings', analytics.propertiesWithBookings.toString()],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${format(selectedMonth, 'yyyy-MM')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-neutral-900">Analytics Dashboard</h1>
          <Button onClick={exportData} variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* City Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-neutral-700">City:</label>
            <select
              value={selectedArea?.id || 'all'}
              onChange={(e) => {
                const areaId = e.target.value === 'all' ? null : e.target.value;
                const area = areas.find(a => a.id === areaId) || null;
                onAreaSelect(area);
              }}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Cities</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </div>

          {/* Month/Year Picker */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2 px-4 py-2 bg-neutral-50 rounded-lg">
              <Calendar className="h-4 w-4 text-neutral-600" />
              <span className="text-sm font-medium text-neutral-900">
                {format(selectedMonth, 'MMMM yyyy')}
              </span>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString()}`}
          change={analytics.monthOverMonthGrowth}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
        />
        <MetricCard
          title="Total Properties"
          value={analytics.totalProperties.toString()}
          icon={<TrendingUp className="h-6 w-6" />}
          color="blue"
        />
        <MetricCard
          title="Average Occupancy Rate"
          value={`${analytics.averageOccupancyRate.toFixed(1)}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="purple"
        />
        <MetricCard
          title="Average Daily Rate"
          value={`₹${analytics.averageDailyRate.toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="orange"
        />
        <MetricCard
          title="Total Booked Nights"
          value={analytics.totalBookedNights.toString()}
          icon={<TrendingUp className="h-6 w-6" />}
          color="indigo"
        />
        <MetricCard
          title="Properties with Bookings"
          value={analytics.propertiesWithBookings.toString()}
          icon={<TrendingUp className="h-6 w-6" />}
          color="teal"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <RevenueChart data={revenueData} />
        <CityComparisonChart data={cityComparison} onCityClick={onAreaSelect} areas={areas} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <FillRateComparisonChart data={cityComparison} onCityClick={onAreaSelect} areas={areas} />
        <RevenueDistributionChart data={cityComparison} />
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        <OccupancyHeatmap data={heatmapData} month={selectedMonth} />
      </div>

      {/* Property Performance Table */}
      <PropertyPerformanceTable
        properties={properties}
        bookings={bookings}
        selectedAreaId={selectedArea?.id || null}
        selectedMonth={selectedMonth}
      />
    </div>
  );
};

export default AnalyticsDashboard;