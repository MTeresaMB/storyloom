// Form Data Types
export interface CharacterFormData {
  name: string
  age?: number
  description?: string
  role?: string
  background?: string
  personality?: string
  appearance?: string
  relationships?: string
  goals?: string
  conflicts?: string
  development?: string
  notes?: string
}

export interface LocationFormData {
  name: string
  type?: string
  description?: string
  climate?: string
  population?: string
  culture?: string
  history?: string
  landmarks?: string
  atmosphere?: string
  significance?: string
  notes?: string
}

export interface ObjectFormData {
  name: string
  type?: string
  description?: string
  material?: string
  size?: string
  color?: string
  condition?: string
  origin?: string
  purpose?: string
  significance?: string
  location?: string
  owner?: string
  history?: string
  notes?: string
}

// Validation Error Types
export type CharacterValidationErrors = Partial<Record<keyof CharacterFormData, string>>
export type LocationValidationErrors = Partial<Record<keyof LocationFormData, string>>
export type ObjectValidationErrors = Partial<Record<keyof ObjectFormData, string>>
