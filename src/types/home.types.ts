import { ScheduleWithRoute } from "./hooks";

export interface SearchFormData {
  origin: string;
  destiny: string;
  option: string;
  time?: string;
}

export interface SearchData extends SearchFormData {
  day: string;
}

export interface ProcessedSchedule extends ScheduleWithRoute {
  duracion: number;
  key: string;
  // Campos calculados para compatibilidad con UI
  origen: string;
  destino: string;
  hora_salida: string;
  hora_llegada: string;
  linea_nombre: string;
  directo: boolean;
}