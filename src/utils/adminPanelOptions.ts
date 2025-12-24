import { DayOfWeek, UserRole } from "@/types";

export const rolesOptions = [
  { label: "Administrador", value: UserRole.ADMIN },
  { label: "Operador", value: UserRole.OPERATOR },
  { label: "Conductor", value: UserRole.DRIVER },
  { label: "Usuario", value: UserRole.USER },
];

export const daysOfWeekOptions = [
  { label: "Lunes", value: DayOfWeek.MONDAY },
  { label: "Martes", value: DayOfWeek.TUESDAY },
  { label: "Miércoles", value: DayOfWeek.WEDNESDAY },
  { label: "Jueves", value: DayOfWeek.THURSDAY },
  { label: "Viernes", value: DayOfWeek.FRIDAY },
  { label: "Sábado", value: DayOfWeek.SATURDAY },
  { label: "Domingo", value: DayOfWeek.SUNDAY },
];

export const weekdaysOptions = daysOfWeekOptions.slice(0, 5); // Lunes a Viernes