import { DeleteResult, OperationResult, Paginationconfig } from "../api";

// Tipos de filtros disponibles
export type FilterType = 'habil' | 'sabado' | 'domingo' | 'directos' | 'linea' | 'recorrido' | 'all' | 'clear';
export type SelectionMode = 'add' | 'remove';

// Estructura de un registro de horario
export interface HorarioRecord {
  id: number;
  tipo_dia: 'habil' | 'sábado' | 'domingo';
  directo: boolean;
  linea_nombre: string;
  recorrido_id: number;
  origen: string;
  destino: string;
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
  ClearSelection: () => void
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
export interface UseCrudReturn {
  loading: boolean
  error: string | null
  getAll: () => Promise<any[]>
  getById: (id: number) => Promise<any>
  create: (newData: any) => Promise<any>
  update: (id: number, updatedData: any) => Promise<any>
  remove: (id: number, force?: boolean) => Promise<any>
  bulkRemove: (ids: number[]) => Promise<any>
}

//  Retorno del hook useHorarios
export interface UseHorariosReturn {
  currentModal: string | null
  modalData: any
  openModal: (modalName: string, data?: any) => void
  closeModal: () => void
}