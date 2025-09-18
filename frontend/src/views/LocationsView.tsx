import { Plus } from 'lucide-react';
import { useState } from 'react';
import LocationForm from '../components/locations/LocationForm';
import LocationList from '../components/locations/LocationList';
import PageHeader from '../components/ui/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import Button from '../components/ui/Button';
import { useLocations } from '../hooks/locations/useLocations';
import type { Location, LocationFormData } from '../types/location';

export default function LocationsView() {
  const { locations, loading, error, createLocation, updateLocation, deleteLocation } = useLocations();
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const handleCreateLocation = async (locationData: LocationFormData) => {
    try {
      await createLocation(locationData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  const handleEditLocation = async (id: string, locationData: Partial<LocationFormData>) => {
    try {
      await updateLocation(id, locationData);
      setEditingLocation(null);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este lugar?')) {
      try {
        await deleteLocation(id);
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Locations"
        subtitle="Manage your story locations"
        actions={
          <Button
            variant="primary"
            iconLeft={<Plus className="h-4 w-4" />}
            onClick={() => setShowForm(true)}
          >
            New Location
          </Button>
        }
      />
      <ErrorAlert message={error ?? ''} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {showForm && (
            <LocationForm
              onLocationCreated={handleCreateLocation}
              onCancel={() => setShowForm(false)}
            />
          )}
          {editingLocation && (
            <LocationForm
              initialData={editingLocation}
              onLocationCreated={(data) => handleEditLocation(editingLocation.id, data)}
              onCancel={() => setEditingLocation(null)}
            />
          )}
        </div>
        <div className="lg:col-span-2">
          <LocationList
            locations={locations}
            onEdit={setEditingLocation}
            onDelete={handleDeleteLocation}
          />
        </div>
      </div>
    </div>
  );
}
