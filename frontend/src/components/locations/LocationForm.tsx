import { Location, LocationFormData } from "../../types/location";
import Button from "../ui/Button";
import useLocationForm from "../../hooks/locations/useLocationForm";
import { validateForm } from "../../utils/locationValidation";

interface LocationFormProps {
  onLocationCreated: (location: LocationFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<Location>;
}

export default function LocationForm({ onLocationCreated, onCancel, initialData }: LocationFormProps) {
  const { formData, errors, loading, setLoading, updateField, touchField, resetForm, isEditing, canSubmit } = useLocationForm(initialData);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm(formData)) return;
    setLoading(true);
    try {
      await onLocationCreated(formData);
      if (!isEditing) resetForm();
    } catch (error) {
      console.error('Error creating location:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{isEditing ? 'Edit Location' : 'New Location'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            onBlur={() => touchField('name')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            onBlur={() => touchField('description')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) => updateField('type', e.target.value)}
            onBlur={() => touchField('type')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="e.g., City, Forest, Castle, etc."
          />
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Atmosphere</label>
          <textarea
            value={formData.atmosphere}
            onChange={(e) => updateField('atmosphere', e.target.value)}
            onBlur={() => touchField('atmosphere')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.atmosphere ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
            placeholder="Describe the mood and atmosphere..."
          />
          {errors.atmosphere && <p className="text-red-500 text-sm mt-1">{errors.atmosphere}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Important Details</label>
          <textarea
            value={formData.important_details}
            onChange={(e) => updateField('important_details', e.target.value)}
            onBlur={() => touchField('important_details')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.important_details ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
            placeholder="Key details that affect the story..."
          />
          {errors.important_details && <p className="text-red-500 text-sm mt-1">{errors.important_details}</p>}
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" variant="primary" disabled={!canSubmit} className="flex-1">
            {loading ? 'Saving...' : isEditing ? 'Update Location' : 'Create Location'}
          </Button>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
