export interface Object {
  id: string
  user_id: string
  name: string
  description?: string
  type?: string
  importance?: string
  location_id?: string
  created_at: string
  updated_at: string
  locations?: {
    id: string
    name: string
  }
}

export interface ObjectFormData {
  name: string
  description: string
  type: string
  importance: string
  location_id: string
}
