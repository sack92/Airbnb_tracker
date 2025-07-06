import React, { useState } from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Area, Property } from '../../types';
import Button from '../UI/Button';

interface DeleteAreaModalProps {
  area: Area;
  properties: Property[];
  otherAreas: Area[];
  onConfirm: (moveToAreaId?: string) => void;
  onCancel: () => void;
}

const DeleteAreaModal: React.FC<DeleteAreaModalProps> = ({
  area,
  properties,
  otherAreas,
  onConfirm,
  onCancel,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
  const [deleteOption, setDeleteOption] = useState<'delete' | 'move'>('delete');

  const areaProperties = properties.filter(p => p.areaId === area.id);
  const hasProperties = areaProperties.length > 0;

  const handleConfirm = () => {
    if (deleteOption === 'move' && selectedAreaId) {
      onConfirm(selectedAreaId);
    } else {
      onConfirm();
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning Header */}
      <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-red-800">Delete City Warning</h3>
          <p className="text-sm text-red-700">
            You are about to delete "{area.name}". This action cannot be undone.
          </p>
        </div>
      </div>

      {/* Properties Information */}
      {hasProperties && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-neutral-900 mb-2">
            Properties in this city ({areaProperties.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {areaProperties.map((property) => (
              <div key={property.id} className="text-sm text-neutral-700 bg-white p-2 rounded border">
                {property.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Options */}
      {hasProperties ? (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-neutral-900">
            What would you like to do with the properties?
          </h4>
          
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="deleteOption"
                value="delete"
                checked={deleteOption === 'delete'}
                onChange={(e) => setDeleteOption(e.target.value as 'delete' | 'move')}
                className="mt-1"
              />
              <div>
                <div className="text-sm font-medium text-neutral-900">
                  Delete all properties
                </div>
                <div className="text-xs text-neutral-600">
                  All properties and their booking data will be permanently deleted
                </div>
              </div>
            </label>

            {otherAreas.length > 0 && (
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="deleteOption"
                  value="move"
                  checked={deleteOption === 'move'}
                  onChange={(e) => setDeleteOption(e.target.value as 'delete' | 'move')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900">
                    Move properties to another city
                  </div>
                  <div className="text-xs text-neutral-600 mb-2">
                    Properties will be transferred to the selected city
                  </div>
                  
                  {deleteOption === 'move' && (
                    <select
                      value={selectedAreaId}
                      onChange={(e) => setSelectedAreaId(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select destination city...</option>
                      {otherAreas.map((otherArea) => (
                        <option key={otherArea.id} value={otherArea.id}>
                          {otherArea.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </label>
            )}
          </div>
        </div>
      ) : (
        <div className="text-sm text-neutral-600">
          This city has no properties. It can be safely deleted.
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={hasProperties && deleteOption === 'move' && !selectedAreaId}
          className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        >
          {hasProperties && deleteOption === 'move' ? (
            <>
              <ArrowRight className="h-4 w-4 mr-2" />
              Move & Delete City
            </>
          ) : (
            'Delete City'
          )}
        </Button>
      </div>
    </div>
  );
};

export default DeleteAreaModal;