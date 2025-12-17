import React from "react";
import type { FilterType } from "./hooks.types";
import type { ApiEndpoint, ConflictData } from "./api.types";

//  Configuración de columna de tabla
export interface TableColumn {
  title: string;
  dataIndex?: string;
  key?: string;
  width?: number;
  align?: "left" | "right" | "center";
  render?: (value: any, record: any) => React.ReactNode;
  sorter?: (a: any, b: any) => number;
  showSorterTooltip?: boolean;
}

//  Configuración de campo de formulario
export interface FormField {
  name: string;
  label: string;
  type?: "text" | "select" | "switch" | "time";
  options?: { label: string; value: any }[];
  rules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
}

//  Props para AdminTable
export interface AdminTableProps {
  title: string;
  endpoint: ApiEndpoint;
  columns: TableColumn[];
  formFields: FormField[];
}

//  Props para AdminTable Header
export interface AdminTableHeaderProps {
  title: string;
  onNew: () => void;
}

//  Props de BulkActionBar 
export interface BulkActionBarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

//  Props de FilterModeSelector
export interface FilterModeSelectorProps {
  mode: "replace" | "add"
  onModeChange: (mode: "replace" | "add") => void;
}

//  Props de QuickFilters
export interface QuickFiltersProps {
  uniqueLines: string[];
  uniqueRoutes: { key: number; label: string }[];
  onQuickSelect: (type: FilterType | string, value?: any, mode?: string) => any;
}

//  Props de FilterButton
export interface FilterButtonProps {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  size?: "small" | "middle" | "large";
}

export interface ActiveFilter {
  key: string;
  type: string;
  value: string | number;
  label: string;
}

export interface ActiveFiltersProps {
  activeFilters: Array<{
    key: string;
    type: string;
    value: string | number;
    label: string;
  }>;
  onRemoveFilter: (key: string) => void;
}

//  Props de FormField
export interface FormFieldProps {
  field: FormField;
  control: any;
}

//  Props de CascadeDeleteModal
export interface CascadeDeleteModalProps {
  data: {
    entityType: "linea" | "recorrido";
    id?: number;
    recorridos_count?: number;
    horarios_count?: number;
    recorridos?: any[];
    horarios_preview?: number[];
  };
  onConfirm: () => void;
  onCancel: () => void;
}

//  Props de ModalManager
export interface ModalManagerProps {
  title?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}