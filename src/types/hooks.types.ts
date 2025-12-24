import { DeleteResult, OperationResult, Paginationconfig } from "./api.types";
import { DayOfWeek, Route, Schedule, Stop, ScheduleFilters } from "./models.types";

// Tipos de filtros disponibles
export type FilterType = 'habil' | 'sabado' | 'domingo' | 'directos' | 'linea' | 'recorrido' | 'all' | 'clear' | 'clearAll';
export type SelectionMode = 'add' | 'remove';

// Re-export ScheduleFilters desde models.types para consistencia
export type { ScheduleFilters };

export interface DirectScheduleParams {
  originStopId: string;
  destinationStopId: string;
  day?: DayOfWeek;
  currentTime?: string; // formato "HH:mm"
}

export interface ConnectionParams {
  originStopId: string;
  destinationStopId: string;
  day?: DayOfWeek;
  currentTime?: string;
  maxWaitTime?: number; // minutos máximos de espera entre conexiones
}

export interface ScheduleWithRoute extends Schedule {
  route?: Route;
}

export interface Connection {
  firstLeg: ScheduleWithRoute;
  secondLeg: ScheduleWithRoute;
  transferStop: Stop;
  waitTime: number; // en minutos
  totalDuration: number; // en minutos
}

export interface UseSchedulesReturn {
  loading: boolean;
  error: string | null;
  getAllSchedules: (filters?: ScheduleFilters) => Promise<Schedule[]>;
  getSchedulesByRoute: (routeId: string) => Promise<Schedule[]>;
  getSchedulesByDay: (day: DayOfWeek) => Promise<Schedule[]>;
  getDirectSchedules: (params: DirectScheduleParams) => Promise<ScheduleWithRoute[]>;
  findConnections: (params: ConnectionParams) => Promise<Connection[]>;
}

//  Retorno del hook useAdminTable
export interface AdminTableReturn {
  data: any[];
  loading: boolean;
  error: string | null;
  handleCreate: (newData: any) => Promise<OperationResult>
  handleUpdate: (id: number, updatedData: any) => Promise<OperationResult>
  handleDelete: (id: number, force?: boolean) => Promise<DeleteResult>
  handleBulkDelete: (ids: number[]) => Promise<OperationResult<{ count: number }>>
  refetch: () => Promise<void>
  paginationConfig: Paginationconfig | false
  hasData: boolean
  isEmpty: boolean
  recordCount: number
}

// Opciones para useAdminTable
export interface AdminTableOptions {
  pageSize?: number
}

// Retorno del hook useBulkSelection
export interface UseBulkSelectionReturn {
  selectedRowKeys: number[]
  setSelectedRowKeys: (keys: number[]) => void
  handleQuickSelect: (filterType: FilterType, filterValue?: string | number, mode?: SelectionMode) => QuickSelectResult
  getUniqueLines: () => string[]
  getUniqueRoutes: () => { key: number; label: string }[]
  clearSelection: () => void
  hasSelection: boolean
  selectedCount: number
}

//  Resultado de selección rápida
export interface QuickSelectResult {
  success: boolean
  count?: number
  total?: number
  mode?: "remove" | "add"
  message?: string
}

//  Alerta de validación
export interface ValidationAlert {
  type: "success" | "error" | "warning" | "info"
  message: string
}

//  Resultado de validación
export interface ValidationResult {
  valid: boolean
  message?: string
}

//  Respuesta del hook useFormValidation
export interface UseFormValidationReturn {
  control: any
  handleSubmit: any
  reset: () => void
  setValue: (name: string, value: any) => void
  watch: any
  values: any
  errors: any
  isValid: boolean
  validationAlert: ValidationAlert | null
  validateBeforeSubmit: () => ValidationResult
  clearValidation: () => void
}

//  Retorno del hook useModal
export interface UseModalReturn {
  currentModal: string | null
  modalData: any
  openModal: (modalName: string, data?: any) => void
  closeModal: () => void
}

//  Retorno del hook useCrud
export interface UseCrudReturn<T> {
  loading: boolean;
  error: string | null;
  getAll: () => Promise<T[]>;
  getById: (id: string | number) => Promise<T>;
  create: (newData: Partial<T>) => Promise<T>;
  update: (id: string | number, updatedData: Partial<T>) => Promise<T>;
  remove: (id: string | number, force?: boolean) => Promise<T>;
  bulkRemove: (ids: (string | number)[]) => Promise<{ deleted_count: number }>;
}