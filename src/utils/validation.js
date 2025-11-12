//  Validación para formularios del Admin Panel

export const timeToMinutes = (time) => {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Calcula duración del viaje considerando paso de medianoche
export const calculateTripDuration = (horaSalida, horaLlegada) => {
  let salidaMin = timeToMinutes(horaSalida);
  let llegadaMin = timeToMinutes(horaLlegada);

  // Si llegada es menor que salida, el viaje cruza medianoche
  if (llegadaMin < salidaMin) {
    llegadaMin += 24 * 60; // Añadir 24 horas
  }

  return llegadaMin - salidaMin; // Duración en minutos
};

// Valida que la hora de llegada sea posterior a la salida (considerando medianoche)
export const validateHorarioTimes = (horaSalida, horaLlegada) => {
  if (!horaSalida || !horaLlegada) {
    return { valid: false, message: "Ambas horas son requeridas" };
  }

  const duracion = calculateTripDuration(horaSalida, horaLlegada);

  // Validar duración mínima (5 minutos)
  if (duracion < 5) {
    return {
      valid: false,
      message: "El viaje debe durar al menos 5 minutos",
    };
  }

  // Validar duración máxima (10 horas = 600 minutos)
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
