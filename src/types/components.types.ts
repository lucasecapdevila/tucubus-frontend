import React from "react";
import type { FilterType } from "./hooks.types";

//  Configuración de columna de tabla
export interface AdminTableColumn {
  title: string;
  dataIndex: string | string[];
  render?: (value: any, record: any) => React.ReactNode;
  sorter?: ((a: any, b: any) => number) | boolean;
  showSorterTooltip?: boolean;
  align?: 'left' | 'right' | 'center';
}

export interface AdminTableProps {
  title: string;
  endpoint: string;
  columns: AdminTableColumn[];
  formFields: FormFieldConfig[];
}

//  Configuración de campo de formulario
export interface FormField {
  name: string;
  label: string;
  type?: "text" | "select" | "multiselect" | "switch" | "time" | "number" | "email" | "textarea";
  options?: { label: string; value: any }[];
  rules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
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

export interface FormFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'select' | 'multiselect' | 'switch' | 'time' | 'number' | 'email' | 'textarea';
  options?: SelectOption[];
  rules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    [key: string]: any;
  };
  placeholder?: string;
}

export interface FormFieldProps {
  field: FormFieldConfig;
  control: any; // Control de react-hook-form
}

export interface SelectOption {
  label: string;
  value: any;
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