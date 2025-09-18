export interface Location {
  id: string
  user_id: string
  name: string
  description?: string
  type?: string
  atmosphere?: string
  important_details?: string
  created_at: string
  updated_at: string
}

export interface LocationFormData {
  name: string
  description: string
  type: string
  atmosphere: string
  important_details: string
}
