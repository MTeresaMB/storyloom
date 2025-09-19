import { Character, CharacterFormData } from "../../types/character";
import Button from "../ui/Button";
import useCharacterForm from "../../hooks/characters/usecharacterForm";
import { validateForm } from "../../utils/characters/validation";

interface CharacterFormProps {
  onCharacterCreated: (character: CharacterFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<Character>;
}

export default function CharacterForm({ onCharacterCreated, onCancel, initialData }: CharacterFormProps) {
  const { formData, errors, loading, setLoading, updateField, touchField, resetForm, isEditing, canSubmit } = useCharacterForm(initialData);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm(formData)) return;
    setLoading(true);
    try {
      await onCharacterCreated(formData);
      if (!isEditing) resetForm();
    } catch (error) {
      console.error('Error creating character:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow--sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{isEditing ? 'Edit Character' : 'New Character'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            onBlur={() => touchField('name')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => updateField('age', e.target.value)}
            onBlur={() => touchField('age')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Appearance</label>
          <textarea
            value={formData.appearance}
            onChange={(e) => updateField('appearance', e.target.value)}
            onBlur={() => touchField('appearance')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.appearance ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
          />
          {errors.appearance && <p className="text-red-500 text-sm mt-1">{errors.appearance}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Personality</label>
          <textarea
            value={formData.personality}
            onChange={(e) => updateField('personality', e.target.value)}
            onBlur={() => touchField('personality')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.personality ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
          />
          {errors.personality && <p className="text-red-500 text-sm mt-1">{errors.personality}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
          <textarea
            value={formData.background}
            onChange={(e) => updateField('background', e.target.value)}
            onBlur={() => touchField('background')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.background ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
          />
          {errors.background && <p className="text-red-500 text-sm mt-1">{errors.background}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Goals</label>
          <textarea
            value={formData.goals}
            onChange={(e) => updateField('goals', e.target.value)}
            onBlur={() => touchField('goals')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.goals ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
          />
          {errors.goals && <p className="text-red-500 text-sm mt-1">{errors.goals}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Conflicts</label>
          <textarea
            value={formData.conflicts}
            onChange={(e) => updateField('conflicts', e.target.value)}
            onBlur={() => touchField('conflicts')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.conflicts ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
          />
          {errors.conflicts && <p className="text-red-500 text-sm mt-1">{errors.conflicts}</p>}
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" variant="primary" disabled={!canSubmit} className="flex-1">
            {loading ? 'Saving...' : isEditing ? 'Update Character' : 'Create Character'}
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
