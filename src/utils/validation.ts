//  Validación para formularios del Admin Panel

export const calculateDuration = (startTime: string, endTime: string): number => {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);
  return (endHour * 60 + endMin) - (startHour * 60 + startMin);
}

export const addMinutes = (time: string, minutes: number): string => {
  const [hour, min] = time.split(":").map(Number);
  const totalMinutes = hour * 60 + min + minutes;
  const newHour = Math.floor(totalMinutes / 60) % 24;
  const newMin = totalMinutes % 60;
  return `${String(newHour).padStart(2, "0")}:${String(newMin).padStart(2, "0")}`;
}

interface ValidationResult {
  valid: boolean;
  message?: string;
}

export const validateHorarioTimes = (horaSalida: string, horaLlegada: string): ValidationResult => {
  if (!horaSalida || !horaLlegada) {
    return { valid: false, message: "Ambas horas son requeridas" };
  }

  const duracion = calculateDuration(horaSalida, horaLlegada);

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

export const validateRecorrido = (origen: string, destino: string): ValidationResult => {
  if (!origen || !destino) {
    return { valid: false, message: "Origen y destino son requeridos" };
  }

  if (origen.trim() === destino.trim()) {
    return { valid: false, message: "Origen y destino no pueden ser iguales" };
  }

  return { valid: true };
};

export const validateLineaNombre = (nombre: string): ValidationResult => {
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
export const validateUsername = (username: string): ValidationResult => {
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
export const validateTimeFormat = (time: string): ValidationResult => {
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
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

// Detecta si un viaje cruza medianoche
export const crossesMidnight = (horaSalida: string, horaLlegada: string): boolean => {
  return addMinutes(horaLlegada) < addMinutes(horaSalida);
};
