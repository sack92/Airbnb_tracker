import React, { useState, useEffect } from 'react';
import { Area, Property, Booking } from './types';
import { useSupabaseData } from './hooks/useSupabaseData';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import CityGrid from './components/Areas/CityGrid';
import AddAreaForm from './components/Areas/AddAreaForm';
import EditAreaForm from './components/Areas/EditAreaForm';
import DeleteAreaModal from './components/Areas/DeleteAreaModal';
import AddPropertyForm from './components/Properties/AddPropertyForm';
import EditPropertyForm from './components/Properties/EditPropertyForm';
import DeletePropertyModal from './components/Properties/DeletePropertyModal';
import Calendar from './components/Calendar/Calendar';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import Modal from './components/UI/Modal';
import AuthForm from './components/Auth/AuthForm';
import { getCityImage } from './utils/cityImages';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  
  // Modal states
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [showEditAreaModal, setShowEditAreaModal] = useState(false);
  const [showDeleteAreaModal, setShowDeleteAreaModal] = useState(false);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showEditPropertyModal, setShowEditPropertyModal] = useState(false);
  const [showDeletePropertyModal, setShowDeletePropertyModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [areaToEdit, setAreaToEdit] = useState<Area | null>(null);
  const [areaToDelete, setAreaToDelete] = useState<Area | null>(null);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  const {
    areas,
    properties,
    bookings,
    loading,
    error,
    addArea,
    updateArea,
    deleteArea,
    addProperty,
    updateProperty,
    deleteProperty,
    upsertBooking,
  } = useSupabaseData();

  // Check authentication status from localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem('airbnb_tracker_auth');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  // Set area with maximum properties as default when areas load
  useEffect(() => {
    if (areas.length > 0 && !selectedArea) {
      const areaWithMaxProperties = areas.reduce((maxArea, area) => {
        const areaPropertyCount = properties.filter(p => p.areaId === area.id).length;
        const maxAreaPropertyCount = properties.filter(p => p.areaId === maxArea.id).length;
        return areaPropertyCount > maxAreaPropertyCount ? area : maxArea;
      }, areas[0]);
      
      setSelectedArea(areaWithMaxProperties);
    }
  }, [areas, properties, selectedArea]);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    localStorage.setItem('airbnb_tracker_auth', 'true');
  };

  const handleAddArea = async (areaData: Omit<Area, 'id' | 'createdAt'>) => {
    try {
      const newAreaData = {
        ...areaData,
        imageUrl: areaData.imageUrl || getCityImage(areaData.name),
      };
      const newArea = await addArea(newAreaData);
      setSelectedArea(newArea);
      setShowAddAreaModal(false);
    } catch (err) {
      console.error('Failed to add area:', err);
    }
  };

  const handleEditArea = (area: Area) => {
    setAreaToEdit(area);
    setShowEditAreaModal(true);
  };

  const handleUpdateArea = async (areaData: Omit<Area, 'id' | 'createdAt'>) => {
    if (!areaToEdit) return;
    
    try {
      const updatedAreaData = {
        ...areaData,
        imageUrl: areaData.imageUrl || getCityImage(areaData.name),
      };
      const updatedArea = await updateArea(areaToEdit.id, updatedAreaData);
      
      // Update selected area if it's the one being edited
      if (selectedArea?.id === areaToEdit.id) {
        setSelectedArea(updatedArea);
      }
      
      setShowEditAreaModal(false);
      setAreaToEdit(null);
    } catch (err) {
      console.error('Failed to update area:', err);
    }
  };

  const handleDeleteArea = (area: Area) => {
    setAreaToDelete(area);
    setShowDeleteAreaModal(true);
  };

  const handleConfirmDeleteArea = async (moveToAreaId?: string) => {
    if (!areaToDelete) return;

    try {
      if (moveToAreaId) {
        // Move properties to another area
        const areaProperties = properties.filter(p => p.areaId === areaToDelete.id);
        for (const property of areaProperties) {
          await updateProperty(property.id, { areaId: moveToAreaId });
        }
      }

      await deleteArea(areaToDelete.id);

      // Update selected area if it's the one being deleted
      if (selectedArea?.id === areaToDelete.id) {
        const remainingAreas = areas.filter(area => area.id !== areaToDelete.id);
        setSelectedArea(remainingAreas.length > 0 ? remainingAreas[0] : null);
      }

      setShowDeleteAreaModal(false);
      setAreaToDelete(null);
    } catch (err) {
      console.error('Failed to delete area:', err);
    }
  };

  const handleAddProperty = async (propertyData: Omit<Property, 'id' | 'createdAt'>, bookingDates?: Array<{ date: string; status: 'available' | 'booked'; price: number }>) => {
    try {
      const newProperty = await addProperty(propertyData);
      
      // Add booking dates if provided
      if (bookingDates && bookingDates.length > 0) {
        for (const booking of bookingDates) {
          await upsertBooking({
            propertyId: newProperty.id,
            date: booking.date,
            status: booking.status,
            price: booking.price,
          });
        }
      }
      
      setShowAddPropertyModal(false);
    } catch (err) {
      console.error('Failed to add property:', err);
    }
  };

  const handleEditProperty = (property: Property) => {
    setPropertyToEdit(property);
    setShowEditPropertyModal(true);
  };

  const handleUpdateProperty = async (propertyData: Omit<Property, 'id' | 'createdAt'>) => {
    if (!propertyToEdit) return;
    
    try {
      await updateProperty(propertyToEdit.id, propertyData);
      setShowEditPropertyModal(false);
      setPropertyToEdit(null);
    } catch (err) {
      console.error('Failed to update property:', err);
    }
  };

  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property);
    setShowDeletePropertyModal(true);
  };

  const handleConfirmDeleteProperty = async () => {
    if (!propertyToDelete) return;

    try {
      await deleteProperty(propertyToDelete.id);
      setShowDeletePropertyModal(false);
      setPropertyToDelete(null);
    } catch (err) {
      console.error('Failed to delete property:', err);
    }
  };

  const handleViewCalendar = (property: Property) => {
    setSelectedProperty(property);
    setShowCalendarModal(true);
  };

  const handleDateClick = async (date: string, currentStatus: string) => {
    if (!selectedProperty) return;

    const statusCycle = ['booked', 'available'];
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length] as 'available' | 'booked';

    try {
      await upsertBooking({
        propertyId: selectedProperty.id,
        date,
        status: nextStatus,
        price: nextStatus === 'booked' ? selectedProperty.avgPricePerDay : 0,
      });
    } catch (err) {
      console.error('Failed to update booking:', err);
    }
  };

  const handleCustomPriceUpdate = async (date: string, price: number) => {
    if (!selectedProperty) return;

    try {
      await upsertBooking({
        propertyId: selectedProperty.id,
        date,
        status: 'available',
        price,
      });
    } catch (err) {
      console.error('Failed to update price:', err);
    }
  };

  // Show authentication form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Airbnb City Tracker</h1>
            <p className="text-blue-100 text-sm">
              Track property traction across cities
            </p>
          </div>
          <div className="p-8">
            <AuthForm onAuthenticate={handleAuthenticate} />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <>
            {!selectedArea && (
              <CityGrid
                areas={areas}
                properties={properties}
                selectedArea={selectedArea}
                onAreaSelect={setSelectedArea}
                onAddArea={() => setShowAddAreaModal(true)}
              />
            )}
            <Dashboard
              areas={areas}
              properties={properties}
              bookings={bookings}
              selectedArea={selectedArea}
              onAddProperty={() => setShowAddPropertyModal(true)}
              onViewCalendar={handleViewCalendar}
              onEditProperty={handleEditProperty}
              onDeleteProperty={handleDeleteProperty}
              onEditArea={handleEditArea}
              onDeleteArea={handleDeleteArea}
              onAreaSelect={setSelectedArea}
              onAddArea={() => setShowAddAreaModal(true)}
            />
          </>
        )}
        
        {currentView === 'analytics' && (
          <AnalyticsDashboard
            areas={areas}
            properties={properties}
            bookings={bookings}
            selectedArea={selectedArea}
            onAreaSelect={setSelectedArea}
          />
        )}
        
        {currentView === 'settings' && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Settings</h2>
            <p className="text-neutral-600">
              Settings panel coming soon! Customize your preferences and manage your account.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={showAddAreaModal}
        onClose={() => setShowAddAreaModal(false)}
        title="Add New City"
      >
        <AddAreaForm
          onSubmit={handleAddArea}
          onCancel={() => setShowAddAreaModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEditAreaModal}
        onClose={() => {
          setShowEditAreaModal(false);
          setAreaToEdit(null);
        }}
        title="Edit City"
      >
        {areaToEdit && (
          <EditAreaForm
            area={areaToEdit}
            onSubmit={handleUpdateArea}
            onCancel={() => {
              setShowEditAreaModal(false);
              setAreaToEdit(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={showDeleteAreaModal}
        onClose={() => {
          setShowDeleteAreaModal(false);
          setAreaToDelete(null);
        }}
        title="Delete City"
      >
        {areaToDelete && (
          <DeleteAreaModal
            area={areaToDelete}
            properties={properties}
            otherAreas={areas.filter(a => a.id !== areaToDelete.id)}
            onConfirm={handleConfirmDeleteArea}
            onCancel={() => {
              setShowDeleteAreaModal(false);
              setAreaToDelete(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={showAddPropertyModal}
        onClose={() => setShowAddPropertyModal(false)}
        title="Add New Property"
      >
        {selectedArea && (
          <AddPropertyForm
            areaId={selectedArea.id}
            onSubmit={handleAddProperty}
            onCancel={() => setShowAddPropertyModal(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={showEditPropertyModal}
        onClose={() => {
          setShowEditPropertyModal(false);
          setPropertyToEdit(null);
        }}
        title="Edit Property"
      >
        {propertyToEdit && (
          <EditPropertyForm
            property={propertyToEdit}
            areas={areas}
            onSubmit={handleUpdateProperty}
            onCancel={() => {
              setShowEditPropertyModal(false);
              setPropertyToEdit(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={showDeletePropertyModal}
        onClose={() => {
          setShowDeletePropertyModal(false);
          setPropertyToDelete(null);
        }}
        title="Delete Property"
      >
        {propertyToDelete && (
          <DeletePropertyModal
            property={propertyToDelete}
            bookings={bookings.filter(b => b.propertyId === propertyToDelete.id)}
            onConfirm={handleConfirmDeleteProperty}
            onCancel={() => {
              setShowDeletePropertyModal(false);
              setPropertyToDelete(null);
            }}
          />
        )}
      </Modal>

      {showCalendarModal && selectedProperty && (
        <Calendar
          property={selectedProperty}
          bookings={bookings.filter(b => b.propertyId === selectedProperty.id)}
          onDateClick={handleDateClick}
          onCustomPriceUpdate={handleCustomPriceUpdate}
          onClose={() => setShowCalendarModal(false)}
        />
      )}
    </div>
  );
}

export default App;