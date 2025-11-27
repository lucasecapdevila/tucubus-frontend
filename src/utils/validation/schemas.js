import {
  horariosValidator,
  lineasValidator,
  recorridosValidator,
} from "./validators";

export const VALIDATION_SCHEMAS = {
  horarios: {
    crossField: [
      {
        fields: ["horaSalida", "horaLlegada"],
        validator: (values) =>
          horariosValidator.validateTimes(
            values.horaSalida,
            values.horaLlegada
          ),
      },
    ],
  },

  recorridos: {
    crossField: [
      {
        fields: ["origen", "destino"],
        validator: (values) =>
          recorridosValidator.validateRecorrido(values.origen, values.destino),
      },
    ],
  },

  lineas: {
    single: {
      nombre: (value) => lineasValidator.validateName(value),
    },
  },
};
