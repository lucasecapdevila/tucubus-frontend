import { useState } from 'react';

const FILTER_CONFIG = {
  byDayType: [
    {
      key: 'habil',
      label: 'Días hábiles',
      filter: (r) => r.tipo_dia === 'habil',
    },
    { key: 'sabado', label: 'Sábados', filter: (r) => r.tipo_dia === 'sábado' },
    {
      key: 'domingo',
      label: 'Domingos',
      filter: (r) => r.tipo_dia === 'domingo',
    },
  ],
  byAttribute: [
    { key: 'directos', label: 'Directos', filter: (r) => r.directo === true },
  ],
  dynamic: {
    byLine: (lineaNombre) => ({
      key: `linea-${lineaNombre}`,
      label: lineaNombre,
      filter: (r) => r.linea_nombre === lineaNombre,
    }),
    byRoute: (recorridoId, label) => ({
      key: `recorrido-${recorridoId}`,
      label,
      filter: (r) => r.recorrido_id === recorridoId,
    }),
  },
};

const useBulkSelection = (data = [], endpoint) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleQuickSelect = (filterType, filterValue = null, mode = 'add') => {
    if (!data || data.length === 0) {
      return { success: false, message: 'No hay datos para filtrar.' };
    }

    let filtered = [];

    switch (filterType) {
      case 'habil':
      case 'sabado':
      case 'domingo': {
        const config = FILTER_CONFIG.byDayType.find(
          (f) => f.key === filterType,
        );
        if (config) filtered = data.filter(config.filter).map((r) => r.id);
        break;
      }

      case 'directos': {
        const config = FILTER_CONFIG.byAttribute.find(
          (f) => f.key === 'directos',
        );
        if (config) filtered = data.filter(config.filter).map((r) => r.id);
        break;
      }

      case 'linea': {
        if (!filterValue)
          return { success: false, message: 'Debe especificar una línea.' };
        const config = FILTER_CONFIG.dynamic.byLine(filterValue);
        filtered = data.filter(config.filter).map((r) => r.id);
        break;
      }

      case 'recorrido': {
        if (!filterValue)
          return { success: false, message: 'Debe especificar un recorrido.' };
        const record = data.find((r) => r.recorrido_id === filterValue);
        const label = record
          ? `${record.origen} - ${record.destino}`
          : 'Recorrido';
        const config = FILTER_CONFIG.dynamic.byRoute(filterValue, label);
        filtered = data.filter(config.filter).map((r) => r.id);
        break;
      }

      case 'all':
        setSelectedRowKeys(data.map((r) => r.id));
        return { success: true, count: data.length, mode: 'replace' };

      case 'clear':
        setSelectedRowKeys([]);
        return { success: true, count: 0, mode: 'replace' };

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

  const getUniqueLines = () => {
    if (!data || data.length === 0) return [];
    const lines = [...new Set(data.map((r) => r.linea_nombre).filter(Boolean))];
    return lines.sort();
  };

  const getUniqueRoutes = () => {
    if (!data || data.length === 0) return [];
    const routesMap = new Map();
    data.forEach((r) => {
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
