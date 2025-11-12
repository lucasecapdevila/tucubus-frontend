//  Validación para formularios del Admin Panel

export const timeToMinutes = (time) => {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const calculateTripDuration = (horaSalida, horaLlegada) => {
  let salidaMin = timeToMinutes(horaSalida);
  let llegadaMin = timeToMinutes(horaLlegada);

  if (llegadaMin < salidaMin) {
    llegadaMin += 24 * 60;
  }

  return llegadaMin - salidaMin;
};

export const validateHorarioTimes = (horaSalida, horaLlegada) => {
  if (!horaSalida || !horaLlegada) {
    return { valid: false, message: "Ambas horas son requeridas" };
  }

  const duracion = calculateTripDuration(horaSalida, horaLlegada);

  if (duracion < 5) {
    return {
      valid: false,
      message: "El viaje debe durar al menos 5 minutos",
    };
  }

  if (duracion > 600) {
    return {
      valid: false,
      message: "El viaje no puede durar más de 10 horas",
    };
  }

  return {
    valid: true,
    message: `Duración: ${Math.floor(duracion / 60)}h ${duracion % 60}m${
      duracion >= 1440 - 60 ? " (cruza medianoche)" : ""
    }`,
  };
};

export const validateRecorrido = (origen, destino) => {
  if (!origen || !destino) {
    return { valid: false, message: "Origen y destino son requeridos" };
  }

  if (origen.trim() === destino.trim()) {
    return { valid: false, message: "Origen y destino no pueden ser iguales" };
  }

  return { valid: true };
};

export const validateLineaNombre = (nombre) => {
  if (!nombre || nombre.trim().length < 2) {
    return {
      valid: false,
      message: "El nombre debe tener al menos 2 caracteres",
    };
  }

  if (nombre.length > 50) {
    return {
      valid: false,
      message: "El nombre no puede exceder 50 caracteres",
    };
  }

  return { valid: true };
};
