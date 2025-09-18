import { LocationFormData } from '../types/location'

export const LOCATION_VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 100
  },
  description: {
    required: false,
    maxLength: 1000
  },
  type: {
    required: false,
    maxLength: 50
  },
  atmosphere: {
    required: false,
    maxLength: 500
  },
  important_details: {
    required: false,
    maxLength: 1000
  }
} as const

export function validateField(field: keyof LocationFormData, value: string): string | undefined {
  const rules = LOCATION_VALIDATION_RULES[field]

  if (rules.required && (!value || value.trim().length === 0)) {
    return `${field} is required`
  }

  if ('minLength' in rules && value.length < rules.minLength!) {
    return `${field} must be at least ${rules.minLength} characters`
  }

  if ('maxLength' in rules && value.length > rules.maxLength!) {
    return `${field} must be no more than ${rules.maxLength} characters`
  }

  return undefined
}

export function validateForm(formData: LocationFormData): Partial<Record<keyof LocationFormData, string>> {
  const errors: Partial<Record<keyof LocationFormData, string>> = {}

  Object.keys(formData).forEach((field) => {
    const error = validateField(field as keyof LocationFormData, formData[field as keyof LocationFormData])
    if (error) {
      errors[field as keyof LocationFormData] = error
    }
  })

  return errors
}
