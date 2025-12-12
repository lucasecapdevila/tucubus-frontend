import { ActiveFiltersProps } from "@/types"
import { Button, Space, Tag } from "antd"

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ activeFilters, onRemoveFilter }) => {
  if(activeFilters.length === 0) return null

  return (
    <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-sm font-semibold text-gray-700 mb-2">
        Filtros activos:
      </p>
      <Space wrap size="small">
        {activeFilters.map((filter) => (
          <Tag
            key={filter.key}
            closable
            onClose={() => onRemoveFilter(filter.key)}
            color="blue"
            style={{ fontSize: '13px', padding: '4px 8px' }}
          >
            {filter.label}
          </Tag>
        ))}
        <Button 
          size="small" 
          danger 
          type="text"
          onClick={() => onRemoveFilter('all')}
        >
          Limpiar todo
        </Button>
      </Space>
    </div>
  )
}

export default ActiveFilters