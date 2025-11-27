import {
  horariosValidator,
  recorridosValidator,
  lineasValidator,
} from "./validators";

export const VALIDATION_SCHEMAS = {
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
