export const lineasValidator = {
  validateName: (nombre) => {
    if (!nombre || nombre.trim().length < 2) {
      return {
        valid: false,
        message: "El nombre de la línea debe tener al menos 2 carácteres.",
      };
    }

    if (nombre.length > 50) {
      return {
        valid: false,
        message: "El nombre de la línea no puede exceder los 50 carácteres.",
      };
    }

    return { valid: true };
  },
};
