import React, { useState } from 'react';
import { Plus, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { Area } from '../../types';
import Button from '../UI/Button';

interface AreaSelectorProps {
  areas: Area[];
  selectedArea: Area | null;
  onAreaSelect: (area: Area) => void;
  onAddArea: () => void;
  onEditArea: (area: Area) => void;
  onDeleteArea: (area: Area) => void;
}

const AreaSelector: React.FC<AreaSelectorProps> = ({
  areas,
  selectedArea,
  onAreaSelect,
  onAddArea,
  onEditArea,
  onDeleteArea,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Select City</h2>
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

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <span className="text-left">
            {selectedArea ? (
              <div>
                <div className="font-medium text-neutral-900">{selectedArea.name}</div>
                {selectedArea.description && (
                  <div className="text-sm text-neutral-500">{selectedArea.description}</div>
                )}
              </div>
            ) : (
              <span className="text-neutral-500">Select a city...</span>
            )}
          </span>
          <ChevronDown className={`h-5 w-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {areas.length === 0 ? (
              <div className="px-4 py-3 text-neutral-500 text-center">
                No cities added yet. Click "Add City" to get started.
              </div>
            ) : (
              areas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0"
                >
                  <button
                    onClick={() => {
                      onAreaSelect(area);
                      setIsOpen(false);
                    }}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium text-neutral-900">{area.name}</div>
                    {area.description && (
                      <div className="text-sm text-neutral-500">{area.description}</div>
                    )}
                  </button>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditArea(area);
                        setIsOpen(false);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit city"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteArea(area);
                        setIsOpen(false);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete city"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaSelector;