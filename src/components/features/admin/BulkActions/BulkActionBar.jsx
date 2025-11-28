import { Alert, Button, Tag } from 'antd';

const BulkActionBar = ({ selectedCount, onBulkDelete, onClearSelection }) => {
  if (selectedCount === 0) return null;

  return (
    <Alert
      message={
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span>
            <Tag color="#0c5392">{selectedCount}</Tag>
            {selectedCount === 1
              ? ' registro seleccionado'
              : ' registros seleccionados'}
          </span>
          <Button danger size="small" onClick={onBulkDelete}>
            Eliminar seleccionados
          </Button>
        </div>
      }
      type="info"
      closable
      onClose={onClearSelection}
      className="mb-3"
    />
  );
};

export default BulkActionBar;