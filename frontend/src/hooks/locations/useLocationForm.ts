import { useState, useCallback } from 'react'
import { LocationFormData } from '../../types/location'
import { getInitialLocationFormData, mapLocationToFormData } from '../../utils/locations/form'
import { validateField, validateForm } from '../../utils/locations/validation'

export default function useLocationForm(initialData?: Partial<LocationFormData>) {
  const [formData, setFormData] = useState<LocationFormData>(() =>
    initialData ? mapLocationToFormData(initialData) : getInitialLocationFormData()
  )
  const [errors, setErrors] = useState<Partial<Record<keyof LocationFormData, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof LocationFormData, boolean>>>({})
  const [loading, setLoading] = useState(false)

  const isEditing = !!initialData

  const updateField = useCallback((field: keyof LocationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const touchField = useCallback((field: keyof LocationFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }))

    // Validate field when touched
    const error = validateField(field, formData[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [formData])

  const validateFormData = useCallback(() => {
    const newErrors = validateForm(formData)
    setErrors(newErrors)
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    return Object.keys(newErrors).length === 0
  }, [formData])

  const resetForm = useCallback(() => {
    setFormData(getInitialLocationFormData())
    setErrors({})
    setTouched({})
  }, [])

  const canSubmit = !loading && Object.values(errors).every(error => !error) && formData.name.trim() !== ''

  return {
    formData,
    errors,
    touched,
    loading,
    setLoading,
    updateField,
    touchField,
    validateForm: validateFormData,
    resetForm,
    isEditing,
    canSubmit
  }
}
