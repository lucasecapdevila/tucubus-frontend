import { User, DayOfWeek } from "./models.types";

// Type Definitions
export type ApiEndpoint = 'users' | 'companies' | 'routes' | 'schedules' | 'stops' | 'locations' | string;

// Enums
export enum TipoDia {
  HABIL = 'habil',
  SABADO = 'sabado',
  DOMINGO = 'domingo',
}

//  Credenciales de login
export interface LoginCredentials {
  username: string
  userpassword: string
}

//  Respuesta de autenticación
export interface AuthServiceResponse {
  success: boolean;
  data?: User;
  error?: string;
}

//  Parámetros para buscar horarios directos
export interface HorariosDirectosParams {
  origen: string
  destino: string
  tipo_dia: TipoDia
  hora_actual: string
}

//  Parámetros para buscar conexiones
export interface ConexionesParams extends HorariosDirectosParams {}

//  Resultado genérico de una operación
export interface OperationResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

//  Resultado de operación con conflictos
export interface DeleteResult {
  success: boolean
  deleted?: number
  conflict?: boolean
  conflict_data?: {
    recorridos_count?: number
    horarios_count?: number
    recorridos?: Recorrido[]
    horarios_preview?: number[]
  }
  id: number
  error?: string
}

//  Parámetros para paginación
export interface Paginationconfig {
  pageSize: number
  showSizeChanger: boolean
  showTotal: (total: number, range: [number, number]) => string
}

//  Datos de conflicto para eliminación en cascada
export interface ConflictData {
  recorridos_count?: number;
  horarios_count?: number;
  recorridos?: any[];
  horarios_preview?: number[];
}