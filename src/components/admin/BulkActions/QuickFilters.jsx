import { Button, Space, Divider } from 'antd';
import FilterButton from './FilterButton';

const QuickFilters = ({ uniqueLines, uniqueRoutes, onQuickSelect }) => {
  return (
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
              onClick={() => onQuickSelect('habil')}
            />
            <FilterButton
              label="Sábados"
              onClick={() => onQuickSelect('sabado')}
            />
            <FilterButton
              label="Domingos"
              onClick={() => onQuickSelect('domingo')}
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
                onClick={() => onQuickSelect('linea', linea)}
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
                onClick={() => onQuickSelect('recorrido', recorrido.key)}
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
  );
};

export default QuickFilters;