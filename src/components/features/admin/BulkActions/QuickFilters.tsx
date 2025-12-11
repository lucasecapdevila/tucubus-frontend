import { useState } from 'react';
import { Button, Space, Divider } from 'antd';
import FilterButton from './FilterButton';
import ActiveFilters from './ActiveFilters';
import { ActiveFilter, QuickFiltersProps } from '@/types';

const QuickFilters: React.FC<QuickFiltersProps> = ({ uniqueLines, uniqueRoutes, onQuickSelect }) => {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])

  const handleFilterClick = (type: string, value: string | number) => {
    let newFilters: ActiveFilter[]
    const filterKey = `${type}-${value}`
    const existingFilter = activeFilters.find(f => f.key === filterKey)

    if(existingFilter){
      newFilters = activeFilters.filter(f => f.key !== filterKey)
      onQuickSelect(type, value, 'remove')
    } else{
      let label
      if(type === 'habil') label = 'Días hábiles'
      else if(type === 'sabado') label = 'Sábados'
      else if(type === 'domingo') label = 'Domingos'
      else if(type === 'linea') label = `Linea: ${value}`
      else if(type === 'recorrido'){
        const route = uniqueRoutes.find(r => r.key === value)
        label = route ? `Ruta: ${route.label}` : String(value)
      } else {
        label = String(value)
      }

      newFilters = [...activeFilters, { key: filterKey, type, value, label }]
      onQuickSelect(type, value, 'add')
    }

    setActiveFilters(newFilters)
  }

  const handleRemoveFilter = (filterKey: string) => {
    if(filterKey === 'all'){
      setActiveFilters([])
      onQuickSelect('clearAll')
    } else{
      const filter = activeFilters.find(f => f.key === filterKey)
      if(filter){
        setActiveFilters(activeFilters.filter(f => f.key !== filterKey))
        onQuickSelect(filter.type, filter.value, 'remove')
      }
    }
  }

  const isFilterActive = (type: string, value: string | number): boolean => {
    const filterKey = `${type}-${value}`
    return activeFilters.some(f => f.key === filterKey)
  }

  return (
    <>
    <ActiveFilters
      activeFilters={activeFilters}
      onRemoveFilter={handleRemoveFilter}
    />
    <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="space-y-3">
        {/* Filtros por tipo de día */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Por tipo de día:
          </p>
          <Space wrap size="small">
            <FilterButton
              label="Días hábiles"
              onClick={() => handleFilterClick('habil', 'habil')}
              isActive={isFilterActive('habil', 'habil')}
            />
            <FilterButton
              label="Sábados"
              onClick={() => handleFilterClick('sabado', 'sabado')}
              isActive={isFilterActive('sabado', 'sabado')}
            />
            <FilterButton
              label="Domingos"
              onClick={() => handleFilterClick('domingo', 'domingo')}
              isActive={isFilterActive('domingo', 'domingo')}
            />
          </Space>
        </div>

        <Divider className="my-2" />

        {/* Filtros por línea */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Por línea:
          </p>
          <Space wrap size="small">
            {uniqueLines.map((linea) => (
              <FilterButton
                key={linea}
                label={linea}
                onClick={() => handleFilterClick('linea', linea)}
                isActive={isFilterActive('linea', linea)}
              />
            ))}
          </Space>
        </div>

        <Divider className="my-2" />

        {/* Filtros por recorrido */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Por recorrido:
          </p>
          <Space wrap size="small">
            {uniqueRoutes.map((recorrido) => (
              <FilterButton
                key={recorrido.key}
                label={recorrido.label}
                onClick={() => handleFilterClick('recorrido', recorrido.key)}
                isActive={isFilterActive('recorrido', recorrido.key)}
              />
            ))}
          </Space>
        </div>
      </div>

      <Divider className="my-2" />

      {/* Acciones generales */}
      <p className="text-sm font-semibold text-gray-700 mb-2">Acciones:</p>
      <Space wrap size="small">
        <Button
          size="small"
          style={{ backgroundColor: '#0c5392', color: '#fff' }}
          onClick={() => onQuickSelect('all')}
        >
          Seleccionar todos
        </Button>
        <Button size="small" onClick={() => onQuickSelect('clear')}>
          Limpiar selección
        </Button>
      </Space>
    </div>
    </>
  );
};

export default QuickFilters;