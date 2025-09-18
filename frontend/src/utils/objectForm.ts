import { ObjectFormData } from '../types/object'

export function getInitialObjectFormData(): ObjectFormData {
  return {
    name: '',
    description: '',
    type: '',
    importance: '',
    location_id: ''
  }
}

export function mapObjectToFormData(object: Partial<ObjectFormData>): ObjectFormData {
  return {
    name: object.name || '',
    description: object.description || '',
    type: object.type || '',
    importance: object.importance || '',
    location_id: object.location_id || ''
  }
}
