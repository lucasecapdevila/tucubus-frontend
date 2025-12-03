import { ValidationResult } from "@/types";
import {
  horariosValidator,
  recorridosValidator,
  lineasValidator,
} from "./validators";

interface CrossFieldRule {
  fields: string[];
  validator: (values: Record<string, any>) => ValidationResult;
}

interface ValidationSchema {
  crossField?: CrossFieldRule[];
  single?: Record<string, (value: any) => ValidationResult>;
}

export const VALIDATION_SCHEMAS: Record<string, ValidationSchema> = {
  horarios: {
    crossField: [
      {
        fields: ["hora_salida", "hora_llegada"],
        validator: (values) =>
          horariosValidator.validateTimes(
            values.hora_salida,
            values.hora_llegada
          ),
      },
    ],
  },

  recorridos: {
    crossField: [
      {
        fields: ["origen", "destino"],
        validator: (values) =>
          recorridosValidator.validateRoute(values.origen, values.destino),
      },
    ],
  },

  lineas: {
    single: {
      nombre: (value) => lineasValidator.validateName(value),
    },
  },
};
