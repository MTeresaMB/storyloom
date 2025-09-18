import { ObjectFormData } from '../types/object'

export const OBJECT_VALIDATION_RULES = {
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
  importance: {
    required: false,
    maxLength: 50
  },
  location_id: {
    required: false
  }
} as const

export function validateField(field: keyof ObjectFormData, value: string): string | undefined {
  const rules = OBJECT_VALIDATION_RULES[field]

  if (rules.required && (!value || value.trim().length === 0)) {
    return `${field} is required`
  }

  if ('minLength' in rules && value.length < (rules as { minLength: number }).minLength) {
    return `${field} must be at least ${(rules as { minLength: number }).minLength} characters`
  }

  if ('maxLength' in rules && value.length > (rules as { maxLength: number }).maxLength) {
    return `${field} must be no more than ${rules.maxLength} characters`
  }

  return undefined
}

export function validateForm(formData: ObjectFormData): Partial<Record<keyof ObjectFormData, string>> {
  const errors: Partial<Record<keyof ObjectFormData, string>> = {}

  Object.keys(formData).forEach((field) => {
    const error = validateField(field as keyof ObjectFormData, formData[field as keyof ObjectFormData])
    if (error) {
      errors[field as keyof ObjectFormData] = error
    }
  })

  return errors
}
