import React, { useState, useRef, useEffect } from 'react';
import { Area } from '../../types';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { filterCities } from '../../data/indianCities';

interface EditAreaFormProps {
  area: Area;
  onSubmit: (areaData: Omit<Area, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const EditAreaForm: React.FC<EditAreaFormProps> = ({ area, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: area.name,
    description: area.description,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'City name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, name: value });
    
    if (value.length >= 2) {
      const filteredCities = filterCities(value);
      setSuggestions(filteredCities);
      setShowSuggestions(filteredCities.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectCity(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectCity = (city: string) => {
    setFormData({ ...formData, name: city });
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          ref={inputRef}
          label="City Name"
          value={formData.name}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          placeholder="Start typing city name (e.g., Bangalore, Mumbai, Delhi)"
          error={errors.name}
          autoComplete="off"
        />
        
        {/* City Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((city, index) => (
              <button
                key={city}
                type="button"
                onClick={() => selectCity(city)}
                className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-neutral-100 last:border-b-0 ${
                  index === selectedIndex ? 'bg-blue-50 text-blue-700' : 'text-neutral-900'
                }`}
              >
                <div className="font-medium">{city}</div>
                <div className="text-xs text-neutral-500">Indian City</div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the city or area..."
          rows={3}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-neutral-400"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Update City
        </Button>
      </div>
    </form>
  );
};

export default EditAreaForm;