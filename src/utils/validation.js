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

// Valida username
export const validateUsername = (username) => {
  if (!username || username.length < 3) {
    return {
      valid: false,
      message: "El nombre de usuario debe tener al menos 3 caracteres",
    };
  }

  if (username.length > 25) {
    return {
      valid: false,
      message: "El nombre de usuario no puede exceder 25 caracteres",
    };
  }

  // Solo letras, números y guiones bajos
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      valid: false,
      message: "Solo se permiten letras, números y guiones bajos",
    };
  }

  return { valid: true };
};

// Valida formato de hora HH:mm
export const validateTimeFormat = (time) => {
  if (!time) return { valid: false, message: "La hora es requerida" };

  const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

  if (!timeRegex.test(time)) {
    return {
      valid: false,
      message: "Formato inválido. Use HH:mm (ej: 14:30)",
    };
  }

  return { valid: true };
};

// Formatea duración en minutos a formato legible
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

// Detecta si un viaje cruza medianoche
export const crossesMidnight = (horaSalida, horaLlegada) => {
  return timeToMinutes(horaLlegada) < timeToMinutes(horaSalida);
};
