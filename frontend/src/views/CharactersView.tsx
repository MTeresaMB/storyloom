import { Plus } from 'lucide-react';
import CharacterForm from '../components/characters/CharacterForm';
import CharacterList from '../components/characters/CharacterList';
import PageHeader from '../components/ui/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import Button from '../components/ui/Button';
import { useCharacters } from '../hooks/useCharacters';
import type { Character } from '../types/character';

export default function CharactersView() {
  const { characters, loading, error, addCharacter } = useCharacters();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Characters"
        subtitle="Manage your characters"
        actions={
          <Button variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
            New Character
          </Button>
        }
      />
      <ErrorAlert message={error ?? ''} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CharacterForm onCharacterCreated={(c: Character) => addCharacter(c)} />
        </div>
        <div className="lg:col-span-2">
          <CharacterList characters={characters} />
        </div>
      </div>
    </div>
  );
}