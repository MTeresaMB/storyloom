export interface Character {
  id: string
  user_id: string
  name: string
  description?: string
  age?: number
  appearance?: string
  personality?: string
  background?: string
  goals?: string
  conflicts?: string
  created_at: string
  updated_at: string
}

export interface CharacterFormData {
  name: string;
  description: string;
  age: number;
  appearance: string;
  personality: string;
  background: string;
  goals: string;
  conflicts: string;
}