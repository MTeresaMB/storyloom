import { Object, ObjectFormData } from "../../types/object";
import Button from "../ui/Button";
import useObjectForm from "../../hooks/objects/useObjectForm";
import { validateForm } from "../../utils/objects/validation";
import { useLocations } from "../../hooks/locations/useLocations";

interface ObjectFormProps {
  onObjectCreated: (object: ObjectFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<Object>;
}

export default function ObjectForm({ onObjectCreated, onCancel, initialData }: ObjectFormProps) {
  const { formData, errors, loading, setLoading, updateField, touchField, resetForm, isEditing, canSubmit } = useObjectForm(initialData);
  const { locations } = useLocations();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm(formData)) return;
    setLoading(true);
    try {
      await onObjectCreated(formData);
      if (!isEditing) resetForm();
    } catch (error) {
      console.error('Error creating object:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{isEditing ? 'Edit Object' : 'New Object'}</h3>
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
            placeholder="e.g., Weapon, Tool, Artifact, etc."
          />
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Importance</label>
          <select
            value={formData.importance}
            onChange={(e) => updateField('importance', e.target.value)}
            onBlur={() => touchField('importance')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.importance ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select importance</option>
            <option value="critical">Critical</option>
            <option value="important">Important</option>
            <option value="minor">Minor</option>
            <option value="decorative">Decorative</option>
          </select>
          {errors.importance && <p className="text-red-500 text-sm mt-1">{errors.importance}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            value={formData.location_id}
            onChange={(e) => updateField('location_id', e.target.value)}
            onBlur={() => touchField('location_id')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location_id ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">No specific location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          {errors.location_id && <p className="text-red-500 text-sm mt-1">{errors.location_id}</p>}
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" variant="primary" disabled={!canSubmit} className="flex-1">
            {loading ? 'Saving...' : isEditing ? 'Update Object' : 'Create Object'}
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
