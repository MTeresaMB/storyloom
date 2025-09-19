import { Character, CharacterFormData } from "../../types/character";

export const getInitialFormData = (): CharacterFormData => ({
  name: '',
  description: '',
  age: 0,
  appearance: '',
  personality: '',
  background: '',
  goals: '',
  conflicts: '',
});

export const mapCharacterToFormData = (character: Partial<Character>): CharacterFormData => ({
  name: character.name || '',
  description: character.description || '',
  age: character.age || 0,
  appearance: character.appearance || '',
  personality: character.personality || '',
  background: character.background || '',
  goals: character.goals || '',
  conflicts: character.conflicts || '',
});