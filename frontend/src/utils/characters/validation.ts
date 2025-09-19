import { CharacterFormData } from "../../types/character";

export type CharacterValidationErrors = Partial<Record<keyof CharacterFormData, string>>;

export const CHARACTER_VALIDATION_RULES = {
  descriptionMaxLength: 500,
  genericMaxLength: 100,
  minNameLength: 2,
  maxAge: 150,
};

export function validateField(field: keyof CharacterFormData, value: any, errors: CharacterValidationErrors): string | undefined {
  switch(field) {
    case 'name':
      if(!value.trim()) return errors.name = 'Name is required';
      if(value.length < CHARACTER_VALIDATION_RULES.minNameLength) return errors.name = `Name must be at least ${CHARACTER_VALIDATION_RULES.minNameLength} characters`;
      return;
    case 'description':
      if (value && value.length > CHARACTER_VALIDATION_RULES.descriptionMaxLength) return `Máx. ${CHARACTER_VALIDATION_RULES.descriptionMaxLength} caracteres`;
      return;
    case 'age':
      if (value < 0) return errors.age = 'Age must be greater than 0';
      if (value > CHARACTER_VALIDATION_RULES.maxAge) return errors.age = `Age must be less than ${CHARACTER_VALIDATION_RULES.maxAge}`;
      return;
    default:
      if (value && value.length > CHARACTER_VALIDATION_RULES.genericMaxLength) return `Máx. ${CHARACTER_VALIDATION_RULES.genericMaxLength} caracteres`;
      return;
  }
}

export function validateForm(formData: CharacterFormData): CharacterValidationErrors {
  const errors: CharacterValidationErrors = {};
  (Object.keys(formData) as Array<keyof CharacterFormData>).forEach(field => {
    const error = validateField(field, formData[field], errors);
    if (error) errors[field] = error;
  })
  return errors;
}
