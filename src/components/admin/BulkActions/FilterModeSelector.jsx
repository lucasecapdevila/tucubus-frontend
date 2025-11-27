import { Button, Space } from 'antd';

const FilterModeSelector = ({ mode, onModeChange }) => {
  const activeStyle = {
    backgroundColor: '#0c5392',
    color: '#fff',
    borderColor: '#0c5392',
  };

  const inactiveStyle = {
    backgroundColor: '#fff',
    color: '#0c5392',
    borderColor: '#0c5392',
  };

  return (
    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-300">
      <p className="text-sm font-semibold text-gray-700">Selección rápida</p>
      <Space size="small">
        <span className="text-xs text-gray-600">Modo:</span>
        <Button
          size="small"
          style={mode === 'replace' ? activeStyle : inactiveStyle}
          onClick={() => onModeChange('replace')}
        >
          Reemplazar
        </Button>
        <Button
          size="small"
          style={mode === 'add' ? activeStyle : inactiveStyle}
          onClick={() => onModeChange('add')}
        >
          Agregar
        </Button>
      </Space>
    </div>
  );
};

export default FilterModeSelector;