import { useCallback, useEffect, useState } from "react";
import { Character, CharacterFormData } from "../../types/character";
import { getInitialFormData, mapCharacterToFormData } from "../../utils/characters/form";
import { CharacterValidationErrors, validateField, validateForm } from "../../utils/characters/validation";


const useCharacterForm = (initialData?: Partial<Character>) => {
  const [formData, setFormData] = useState<CharacterFormData>(getInitialFormData);
  const [errors, setErrors] = useState<CharacterValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Set<keyof CharacterFormData>>(new Set());

  useEffect(() => {
    if (initialData) {
      setFormData(mapCharacterToFormData(initialData));
    }
  }, [initialData]);

  const updateField = useCallback((field: keyof CharacterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: field === 'age' ? Number(value) : value }));
    if (touched.has(field)) {
      setErrors(prev => ({ ...prev, [field]: validateField(field, value, prev) }));
    }
  }, [touched]);

  const touchField = useCallback((field: keyof CharacterFormData) => {
    setTouched(prev => new Set(prev).add(field));
    setErrors(prev => ({ ...prev, [field]: validateField(field, formData[field], prev) }));
  }, [formData]);

  const runValidateForm = useCallback(() => {
    const error = validateForm(formData);
    setErrors(error);
    return Object.keys(error).length === 0;
  }, [formData]);
  
  const resetForm = useCallback(() => {
    setFormData(getInitialFormData);
    setErrors({});
    setTouched(new Set());
    setLoading(false);
  }, []);

  const isValid = Object.values(errors).every(error => !error) && !!formData.name.trim();
  const hasChanges = (() => {
    if (!initialData) return !!formData.name.trim();
    const initial = mapCharacterToFormData(initialData);
    return (Object.keys(formData) as Array<keyof CharacterFormData>).some(field => formData[field] !== initial[field]);
  })();

  return {
    formData,
    errors, 
    loading,
    setLoading,
    touched,
    updateField,
    touchField,
    runValidateForm,
    resetForm,
    isValid,
    hasChanges,
    isEditing: !!initialData,
    canSubmit: isValid && !loading && hasChanges,
  }
}

export default useCharacterForm;