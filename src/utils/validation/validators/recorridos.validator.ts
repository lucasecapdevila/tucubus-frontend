import { ValidationResult } from "@/types";

export const recorridosValidator = {
  validateRoute: (origen: string, destino: string): ValidationResult => {
    if (!origen || !destino) {
      return { valid: false, message: "Origen y destino son requeridos." };
    }

    if (origen.trim() === destino.trim()) {
      return {
        valid: false,
        message: "El origen y destino no pueden ser iguales.",
      };
    }

    return { valid: true };
  },
};
