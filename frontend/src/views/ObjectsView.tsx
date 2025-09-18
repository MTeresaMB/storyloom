import { Plus } from 'lucide-react';
import { useState } from 'react';
import ObjectForm from '../components/objects/ObjectForm';
import ObjectList from '../components/objects/ObjectList';
import PageHeader from '../components/ui/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import Button from '../components/ui/Button';
import { useObjects } from '../hooks/objects/useObjects';
import type { Object, ObjectFormData } from '../types/object';

export default function ObjectsView() {
  const { objects, loading, error, createObject, updateObject, deleteObject } = useObjects();
  const [showForm, setShowForm] = useState(false);
  const [editingObject, setEditingObject] = useState<Object | null>(null);

  const handleCreateObject = async (objectData: ObjectFormData) => {
    try {
      await createObject(objectData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating object:', error);
    }
  };

  const handleEditObject = async (id: string, objectData: Partial<ObjectFormData>) => {
    try {
      await updateObject(id, objectData);
      setEditingObject(null);
    } catch (error) {
      console.error('Error updating object:', error);
    }
  };

  const handleDeleteObject = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este objeto?')) {
      try {
        await deleteObject(id);
      } catch (error) {
        console.error('Error deleting object:', error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Objects"
        subtitle="Manage your story objects"
        actions={
          <Button
            variant="primary"
            iconLeft={<Plus className="h-4 w-4" />}
            onClick={() => setShowForm(true)}
          >
            New Object
          </Button>
        }
      />
      <ErrorAlert message={error ?? ''} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {showForm && (
            <ObjectForm
              onObjectCreated={handleCreateObject}
              onCancel={() => setShowForm(false)}
            />
          )}
          {editingObject && (
            <ObjectForm
              initialData={editingObject}
              onObjectCreated={(data) => handleEditObject(editingObject.id, data)}
              onCancel={() => setEditingObject(null)}
            />
          )}
        </div>
        <div className="lg:col-span-2">
          <ObjectList
            objects={objects}
            onEdit={setEditingObject}
            onDelete={handleDeleteObject}
          />
        </div>
      </div>
    </div>
  );
}