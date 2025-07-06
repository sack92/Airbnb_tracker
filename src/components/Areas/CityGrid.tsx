import React from 'react';
import { Plus, MapPin, Building2 } from 'lucide-react';
import { Area, Property } from '../../types';
import { getCityImage } from '../../utils/cityImages';
import Button from '../UI/Button';

interface CityGridProps {
  areas: Area[];
  properties: Property[];
  selectedArea: Area | null;
  onAreaSelect: (area: Area) => void;
  onAddArea: () => void;
}

const CityGrid: React.FC<CityGridProps> = ({
  areas,
  properties,
  selectedArea,
  onAreaSelect,
  onAddArea,
}) => {
  const getPropertyCount = (areaId: string) => {
    return properties.filter(p => p.areaId === areaId).length;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-900">Your Cities</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddArea}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add City
        </Button>
      </div>

      {areas.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No cities added yet</h3>
          <p className="text-neutral-600 mb-4">
            Add your first city to start tracking Airbnb properties and analytics.
          </p>
          <Button onClick={onAddArea} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First City
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {areas.map((area) => {
            const propertyCount = getPropertyCount(area.id);
            const isSelected = selectedArea?.id === area.id;
            
            return (
              <button
                key={area.id}
                onClick={() => onAreaSelect(area)}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                  isSelected 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-neutral-200 hover:border-blue-300'
                }`}
              >
                {/* City Image */}
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={area.imageUrl || getCityImage(area.name)}
                    alt={area.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getCityImage('default');
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Property Count Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                    <Building2 className="h-3 w-3 text-neutral-600 mr-1" />
                    <span className="text-xs font-medium text-neutral-900">{propertyCount}</span>
                  </div>
                </div>

                {/* City Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-200 transition-colors">
                    {area.name}
                  </h3>
                  {area.description && (
                    <p className="text-sm text-white/80 line-clamp-2">
                      {area.description}
                    </p>
                  )}
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-3 left-3 w-3 h-3 bg-blue-500 rounded-full ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CityGrid;