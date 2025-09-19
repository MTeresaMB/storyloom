import { LocationFormData } from "../../types/location"

export function getInitialLocationFormData(): LocationFormData {
  return {
    name: '',
    description: '',
    type: '',
    atmosphere: '',
    important_details: ''
  }
}

export function mapLocationToFormData(location: Partial<LocationFormData>): LocationFormData {
  return {
    name: location.name || '',
    description: location.description || '',
    type: location.type || '',
    atmosphere: location.atmosphere || '',
    important_details: location.important_details || ''
  }
}
