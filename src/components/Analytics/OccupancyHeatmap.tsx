import React from 'react';
import { format } from 'date-fns';

interface OccupancyHeatmapProps {
  data: Array<{
    day: number;
    date: string;
    occupancyRate: number;
    bookedProperties: number;
    totalProperties: number;
  }>;
  month: Date;
}

const OccupancyHeatmap: React.FC<OccupancyHeatmapProps> = ({ data, month }) => {
  const getColorIntensity = (rate: number) => {
    if (rate === 0) return 'bg-neutral-100';
    if (rate <= 25) return 'bg-green-200';
    if (rate <= 50) return 'bg-green-300';
    if (rate <= 75) return 'bg-green-400';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        Occupancy Calendar - {format(month, 'MMMM yyyy')}
      </h3>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-neutral-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {data.map((day) => (
          <div
            key={day.day}
            className={`aspect-square rounded-lg border border-neutral-200 flex flex-col items-center justify-center text-xs ${getColorIntensity(day.occupancyRate)} transition-colors cursor-pointer hover:scale-105`}
            title={`${day.occupancyRate.toFixed(1)}% occupancy (${day.bookedProperties}/${day.totalProperties} properties)`}
          >
            <div className="font-medium text-neutral-900">{day.day}</div>
            <div className="text-neutral-700">{day.occupancyRate.toFixed(0)}%</div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4 text-xs text-neutral-600">
        <span>Low</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-neutral-100 rounded"></div>
          <div className="w-3 h-3 bg-green-200 rounded"></div>
          <div className="w-3 h-3 bg-green-300 rounded"></div>
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <div className="w-3 h-3 bg-green-500 rounded"></div>
        </div>
        <span>High</span>
      </div>
    </div>
  );
};

export default OccupancyHeatmap;