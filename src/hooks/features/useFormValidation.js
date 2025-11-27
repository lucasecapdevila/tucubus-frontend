import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { VALIDATION_SCHEMAS } from "../../utils/validation/schemas";

const useFormValidation = (entityType, options = {}) => {
  const [validationAlert, setValidationAlert] = useState(null);

  const { control, handleSubmit, reset, setValue, watch, formState } = useForm({
    defaultValues: options.defaultValues || {},
    mode: "onChange",
  });

  const values = watch();
  const schema = VALIDATION_SCHEMAS[entityType];

  useEffect(() => {
    if (!schema) return;

    let validationResult = null;

    if (schema.crossField) {
      for (const rule of schema.crossField) {
        const hasAllFields = rule.fields.every((field) => values[field]);

        if (hasAllFields) {
          const result = rule.validator(values);

          if (!result.valid) {
            validationResult = { type: "error", message: result.message };
            break;
          } else if (result.message) {
            validationResult = { type: "success", message: result.message };
          }
        }
      }
    }

    if (schema.single && !validationResult) {
      for (const [field, validator] of Object.entries(schema.single)) {
        if (values[field]) {
          const result = validator(values[field]);

          if (!result.valid) {
            validationResult = { type: "error", message: result.message };
            break;
          }
        }
      }
    }

    setValidationAlert(validationResult);
  }, [values, schema]);

  const validateBeforeSubmit = () => {
    if (!schema) return { valid: true };

    if (schema.crossField) {
      for (const rule of schema.crossField) {
        const result = rule.validator(values);
        if (!result.valid) {
          setValidationAlert({ type: "error", message: result.message });
          return { valid: false, message: result.message };
        }
      }
    }

    if (schema.single) {
      for (const [field, validator] of Object.entries(schema.single)) {
        const result = validator(values[field]);
        if (!result.valid) {
          setValidationAlert({ type: "error", message: result.message });
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
    isValid: !validationAlert || validationAlert.type !== "error",
    validationAlert,
    validateBeforeSubmit,
    clearValidation: () => setValidationAlert(null),
  };
};

export default useFormValidation;
