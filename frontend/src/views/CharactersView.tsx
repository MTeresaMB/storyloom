import { Plus } from 'lucide-react';
import { useState } from 'react';
import CharacterForm from '../components/characters/CharacterForm';
import CharacterList from '../components/characters/CharacterList';
import PageHeader from '../components/ui/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import Button from '../components/ui/Button';
import { useCharacters } from '../hooks/characters/useCharacters';
import type { Character, CharacterFormData } from '../types/character';

export default function CharactersView() {
  const { characters, loading, error, createCharacter, updateCharacter, deleteCharacter } = useCharacters();
  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const handleCreateCharacter = async (characterData: CharacterFormData) => {
    try {
      await createCharacter(characterData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating character:', error);
    }
  };

  const handleEditCharacter = async (id: string, characterData: Partial<Character>) => {
    try {
      await updateCharacter(id, characterData);
      setEditingCharacter(null);
    } catch (error) {
      console.error('Error updating character:', error);
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este personaje?')) {
      try {
        await deleteCharacter(id);
      } catch (error) {
        console.error('Error deleting character:', error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Characters"
        subtitle="Manage your characters"
        actions={
          <Button
            variant="primary"
            iconLeft={<Plus className="h-4 w-4" />}
            onClick={() => setShowForm(true)}
          >
            New Character
          </Button>
        }
      />
      <ErrorAlert message={error ?? ''} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {showForm && (
            <CharacterForm
              onCharacterCreated={handleCreateCharacter}
              onCancel={() => setShowForm(false)}
            />
          )}
          {editingCharacter && (
            <CharacterForm
              initialData={editingCharacter}
              onCharacterCreated={(data) => handleEditCharacter(editingCharacter.id, data)}
              onCancel={() => setEditingCharacter(null)}
            />
          )}
        </div>
        <div className="lg:col-span-2">
          <CharacterList
            characters={characters}
            onEdit={setEditingCharacter}
            onDelete={handleDeleteCharacter}
          />
        </div>
      </div>
    </div>
  );
}