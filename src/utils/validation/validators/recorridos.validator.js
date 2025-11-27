export const recorridosValidator = {
  validateRecorrido: (origen, destino) => {
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
