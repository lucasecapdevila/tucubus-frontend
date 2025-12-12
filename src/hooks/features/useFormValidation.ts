import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { VALIDATION_SCHEMAS } from '../../utils/validation/schemas';
import type { UseFormValidationReturn, ValidationAlert, ValidationResult } from '@/types';

interface UseFormValidationOptions {
  defaultValues?: Record<string, any>;
}

const useFormValidation = (
  entityType: string,
  options: UseFormValidationOptions = {},
): UseFormValidationReturn => {
  const [validationAlert, setValidationAlert] = useState<ValidationAlert | null>(null);

  const { control, handleSubmit, reset, setValue, watch, formState } = useForm({
    defaultValues: options.defaultValues || {},
    mode: 'onChange',
  });

  const values = useWatch({ control });
  const schema = VALIDATION_SCHEMAS[entityType];

  // Validación en tiempo real
  useEffect(() => {
    if (!schema) return;

    let validationResult = null;

    if (schema.crossField) {
      for (const rule of schema.crossField) {
        const hasAllFields = rule.fields.every((field) => values[field]);

        if (hasAllFields) {
          const result = rule.validator(values);

          if (!result.valid) {
            validationResult = { type: 'error' as const, message: result.message || 'Error de validación' };
            break;
          } else if (result.message) {
            validationResult = { type: 'success' as const, message: result.message };
          }
        }
      }
    }

    if (schema.single && !validationResult) {
      for (const [field, validator] of Object.entries(schema.single)) {
        if (values[field]) {
          const result = validator(values[field]);

          if (!result.valid) {
            validationResult = { type: 'error' as const, message: result.message || 'Error de validación' };
            break;
          }
        }
      }
    }

    setValidationAlert(validationResult);
  }, [values, schema]);

  const validateBeforeSubmit = (): ValidationResult => {
    if (!schema) return { valid: true };

    if (schema.crossField) {
      for (const rule of schema.crossField) {
        const result = rule.validator(values);
        if (!result.valid) {
          setValidationAlert({ type: 'error' as const, message: result.message || 'Error de validación' });
          return { valid: false, message: result.message };
        }
      }
    }

    if (schema.single) {
      for (const [field, validator] of Object.entries(schema.single)) {
        const result = validator(values[field]);
        if (!result.valid) {
          setValidationAlert({ type: 'error' as const, message: result.message || 'Error de validación' });
          return { valid: false, message: result.message };
        }
      }
    }

    return { valid: true };
  };

  return {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    values,
    errors: formState.errors,
    isValid: !validationAlert || validationAlert.type !== 'error',
    validationAlert,
    validateBeforeSubmit,
    clearValidation: () => setValidationAlert(null),
  };
};

export default useFormValidation;
