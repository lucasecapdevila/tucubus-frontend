//  Tipo de endpoint API
export type ApiEndpoint = 'recorridos' | 'lineas' | 'horarios' | 'users';

//  Usuario del sistema
export interface User {
  id: number;
  username: string;
  role: 'Administrador' | 'Usuario';
  token?: string;
}

export interface JWTPayload {
  sub: string;
  role: string;
  exp?: number;
  iat?: number;
}

//  Línea de transporte
export interface Linea {
  id: number;
  nombre: string;
}

//  Recorrido entre dos ciudades
export interface Recorrido {
  id: number;
  origen: string;
  destino: string;
  linea_id: number;
  linea_nombre?: string;
  recorrido_label?: string;
}

//  Tipo de día para horarios
export type TipoDia = 'habil' | 'sábado' | 'domingo';

//  Horario de viaje
export interface Horario {
  id: number;
  tipo_dia: TipoDia;
  hora_salida: string;
  hora_llegada: string;
  recorrido_id: number;
  directo: boolean;
  // Campos relacionales (joins)
  origen?: string;
  destino?: string;
  linea_nombre?: string;
  recorrido_label?: string;
}

//  Resultado de búsqueda de horarios directos
export interface HorarioDirecto extends Horario {
  duracion?: number;
}

//  Conexión entre dos horarios
export interface Conexion {
  // Tramo A (origen → ciudad intermedia)
  tramo_a_salida: string;
  tramo_a_llegada: string;
  linea_a_nombre: string;
  
  // Tramo B (ciudad intermedia → destino)
  tramo_b_salida: string;
  tramo_b_llegada: string;
  linea_b_nombre: string;
  
  // Información de conexión
  ciudad_conexion: string;
  tiempo_espera_min: number;
}

//  Datos de conflicto al eliminar (cascada)
export interface ConflictData {
  recorridos_count?: number;
  horarios_count: number;
  recorridos?: Recorrido[];
  horarios_preview?: number[];
}