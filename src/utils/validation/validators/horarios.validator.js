const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const horariosValidator = {
  validateTimes: (horaSalida, horaLlegada) => {
    if (!horaSalida || !horaLlegada) {
      return { valid: false, message: "Ambas horas son requeridas." };
    }

    let salidaMin = timeToMinutes(horaSalida);
    let llegadaMin = timeToMinutes(horaLlegada);

    if (llegadaMin < salidaMin) {
      llegadaMin += 24 * 60; // Ajuste para llegada al día siguiente
    }

    const duracion = llegadaMin - salidaMin;

    if (duracion < 5) {
      return {
        valid: false,
        message: "La duración mínima del viaje es de 5 minutos.",
      };
    }

    if (duracion > 600) {
      return {
        valid: false,
        message: "La duración máxima del viaje es de 10 horas.",
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
