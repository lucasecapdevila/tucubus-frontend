import React from "react";
import { ApiEndpoint, ConflictData } from "../models";

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
  }[];
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
  onQuickSelect: (type: string, value?: any) => void;
}

//  Props de FilterButton
export interface FilterButtonProps {
  label: string;
  onClick: () => void;
  size?: "small" | "medium" | "large";
}

//  Props de FormField
export interface FormFieldProps {
  field: FormField;
  control: any;
}

//  Props de CascadeDeleteModal
export interface CascadeDeleteModalProps {
  data: {
    conflictData: ConflictData;
    entityType: "linea" | "recorrido";
  }
  onConfirm: () => void;
  onCancel: () => void;
}

//  Props de ModalManager
export interface ModalData {
  conflictData?: ConflictData;
  entityType?: "linea" | "recorrido";
  count?: number;
  title?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
}