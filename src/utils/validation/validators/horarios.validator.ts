import { ValidationResult } from "@/types";

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const horariosValidator = {
  validateTimes: (horaSalida: string, horaLlegada: string): ValidationResult => {
    if (!horaSalida || !horaLlegada) {
      return { valid: false, message: "Ambas horas son requeridas." };
    }

    let salidaMin = timeToMinutes(horaSalida);
    let llegadaMin = timeToMinutes(horaLlegada);

    if (llegadaMin < salidaMin) {
      llegadaMin += 24 * 60;
    }

    const duracion = llegadaMin - salidaMin;

    if (duracion < 5) {
      return {
        valid: false,
        message: "El viaje debe durar al menos 5 minutos.",
      };
    }

    if (duracion > 600) {
      return {
        valid: false,
        message: "El viaje no puede durar más de 10 horas.",
      };
    }

    const horas = Math.floor(duracion / 60);
    const minutos = duracion % 60;
    const cruza = llegadaMin >= 24 * 60;

    return {
      valid: true,
      message: `Duración: ${horas}h ${minutos}m${
        cruza ? " (Cruza medianoche)" : ""
      }`,
    };
  },
};
