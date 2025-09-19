import { useState, useCallback } from 'react'
import { ObjectFormData } from '../../types/object'
import { getInitialObjectFormData, mapObjectToFormData } from '../../utils/objects/form'
import { validateField, validateForm } from '../../utils/objects/validation'

export default function useObjectForm(initialData?: Partial<ObjectFormData>) {
  const [formData, setFormData] = useState<ObjectFormData>(() =>
    initialData ? mapObjectToFormData(initialData) : getInitialObjectFormData()
  )
  const [errors, setErrors] = useState<Partial<Record<keyof ObjectFormData, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof ObjectFormData, boolean>>>({})
  const [loading, setLoading] = useState(false)

  const isEditing = !!initialData

  const updateField = useCallback((field: keyof ObjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const touchField = useCallback((field: keyof ObjectFormData) => {
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
    setFormData(getInitialObjectFormData())
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
