import { useState } from 'react';
import type { QuickSelectResult, UseBulkSelectionReturn, HorarioRecord, FilterType, SelectionMode } from '@/types';

interface FilterConfig {
  key: string;
  label: string;
  filter: (record: HorarioRecord) => boolean;
}

const FILTER_CONFIG = {
  byDayType: [
    {
      key: 'habil',
      label: 'Días hábiles',
      filter: (r: HorarioRecord) => r.tipo_dia === 'habil',
    },
    { key: 'sabado', label: 'Sábados', filter: (r: HorarioRecord) => r.tipo_dia === 'sábado' },
    {
      key: 'domingo',
      label: 'Domingos',
      filter: (r: HorarioRecord) => r.tipo_dia === 'domingo',
    },
  ] as FilterConfig[],
  byAttribute: [
    { key: 'directos', label: 'Directos', filter: (r: HorarioRecord) => r.directo === true },
  ] as FilterConfig[],
  dynamic: {
    byLine: (lineaNombre: string): FilterConfig => ({
      key: `linea-${lineaNombre}`,
      label: lineaNombre,
      filter: (r: HorarioRecord) => r.linea_nombre === lineaNombre,
    }),
    byRoute: (recorridoId: number, label: string): FilterConfig => ({
      key: `recorrido-${recorridoId}`,
      label,
      filter: (r: HorarioRecord) => r.recorrido_id === recorridoId,
    }),
  },
};

const useBulkSelection = (data: HorarioRecord[] = []): UseBulkSelectionReturn => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const handleQuickSelect = (filterType: FilterType, filterValue?: string | number, mode: SelectionMode = 'add'): QuickSelectResult => {
    if (!data || data.length === 0) {
      return { success: false, message: 'No hay datos para filtrar.' };
    }

    let filtered: number[] = [];

    switch (filterType) {
      case 'habil':
      case 'sabado':
      case 'domingo': {
        const config = FILTER_CONFIG.byDayType.find(
          (f) => f.key === filterType,
        );
        if (config) filtered = data.filter(config.filter).map((r: HorarioRecord) => r.id);
        break;
      }

      case 'directos': {
        const config = FILTER_CONFIG.byAttribute.find(
          (f) => f.key === 'directos',
        );
        if (config) filtered = data.filter(config.filter).map((r: HorarioRecord) => r.id);
        break;
      }

      case 'linea': {
        if (!filterValue)
          return { success: false, message: 'Debe especificar una línea.' };
        const config = FILTER_CONFIG.dynamic.byLine(String(filterValue));
        filtered = data.filter(config.filter).map((r: HorarioRecord) => r.id);
        break;
      }

      case 'recorrido': {
        if (!filterValue)
          return { success: false, message: 'Debe especificar un recorrido.' };
        const recorridoId = Number(filterValue);
        const record = data.find((r: HorarioRecord) => r.recorrido_id === recorridoId);
        const label = record
          ? `${record.origen} - ${record.destino}`
          : 'Recorrido';
        const config = FILTER_CONFIG.dynamic.byRoute(recorridoId, label);
        filtered = data.filter(config.filter).map((r: HorarioRecord) => r.id);
        break;
      }

      case 'all':
        setSelectedRowKeys(data.map((r: HorarioRecord) => r.id));
        return { success: true, count: data.length, mode: 'add' };

      case 'clear':
        setSelectedRowKeys([]);
        return { success: true, count: 0, mode: 'remove' };

      default:
        return {
          success: false,
          message: `Filtro "${filterType}" no reconocido.`,
        };
    }

    // Aplicar el modo (add o remove)
    if (mode === 'remove') {
      // Quitar los IDs filtrados de la selección actual
      setSelectedRowKeys((prev) =>
        prev.filter((key) => !filtered.includes(key)),
      );
      return {
        success: true,
        count: filtered.length,
        mode: 'remove',
      };
    } else {
      // Agregar los IDs filtrados a la selección actual (sin duplicados)
      const combined = [...new Set([...selectedRowKeys, ...filtered])];
      setSelectedRowKeys(combined);
      return {
        success: true,
        count: filtered.length,
        total: combined.length,
        mode: 'add',
      };
    }
  };

  const getUniqueLines = (): string[] => {
    if (!data || data.length === 0) return [];
    const lines = [...new Set(data.map((r: HorarioRecord) => r.linea_nombre).filter(Boolean))];
    return lines.sort();
  };

  const getUniqueRoutes = (): { key: number; label: string }[] => {
    if (!data || data.length === 0) return [];
    const routesMap = new Map<number, { key: number; label: string }>();

    data.forEach((r: HorarioRecord) => {
      if (r.recorrido_id && r.origen && r.destino) {
        routesMap.set(r.recorrido_id, {
          key: r.recorrido_id,
          label: `${r.origen} - ${r.destino}`,
        });
      }
    });
    return Array.from(routesMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  };

  return {
    selectedRowKeys,
    setSelectedRowKeys,
    handleQuickSelect,
    getUniqueLines,
    getUniqueRoutes,
    clearSelection: () => setSelectedRowKeys([]),
    hasSelection: selectedRowKeys.length > 0,
    selectedCount: selectedRowKeys.length,
  };
};

export default useBulkSelection;
