import { Alert, Divider, Modal } from "antd"
import { ArrowRightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Paragraph from "antd/es/skeleton/Paragraph";

const CascadeDeleteModal = ({ conflictData, onConfirm, onCancel, entityType = 'linea' }) => {
  const isLinea = entityType === 'linea'

  Modal.confirm({
    title: (
      <div className="flex items-cener gap-2">
        <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 22 }} />
        <span>Eliminación masiva</span>
      </div>
    ),
    width: 600,
    icon: null,
    maskClosable: false,
    content: (
      <div className="space-y-4 mt-4">
        <Alert 
          type="warning"
          showIcon
          message="Esta acción eliminará de forma permanente los registros seleccionados y todos los datos relacionados. Esta operación no se puede deshacer. ¿Desea continuar?"
          description={
            <div className="mt-2 space-y-1">
              {isLinea && (
                <>
                  <Text strong className='block'>{conflictData.recorridos_count} recorridos</Text>
                  <Text strong className='block'>{conflictData.horarios_count} horarios</Text>
                </>
              )}
              {!isLinea && (
                <Text strong className='block'>{conflictData.horarios_count} horarios</Text>
              )}
            </div>
          }
        />

        {/* Recorridos afectados por lineas */}
        {isLinea && conflictData.recorridos && conflictData.recorridos.length > 0 && (
          <>
            <Divider className="my-3" />
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded p-3 bg-gray-50">
              <Paragraph strong className="mb-2 text-gray-700">Recorridos que serán eliminados:</Paragraph>
              {conflictData.recorridos.map((recorrido) => (
                <Paragraph key={recorrido.id} className="text-sm text-gray-600 mb-1">
                  <Text code>ID {recorrido.id}</Text> - {recorrido.origen} <ArrowRightOutlined /> {recorrido.destino}
                </Paragraph>
              ))}
            </div>
          </>
        )}
        
        {/* Preview de horarios para recorridos */}
        {!isLinea && conflictData.horarios_preview && conflictData.horarios_preview.length > 0 && (
          <>
            <Divider className="my-3" />
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded p-3 bg-gray-50">
              <Paragraph strong className="mb-2 text-gray-700">Primeros 10 horarios que serán eliminados:</Paragraph>
              <div className="flex flex-wrap gap-1">
                {conflictData.horarios_preview.map((id) => (
                  <Text key={id} code className='text-xs'>ID {id}</Text>
                ))}
              </div>
              {conflictData.horarios_count > conflictData.horarios_preview.length && (
                <Paragraph className="text-xs text-gray-500 mt-2 mb-0">... y {conflictData.horarios_count - conflictData.horarios_preview.length} horarios más</Paragraph>
              )}
            </div>
          </>
        )}

        <Alert 
          message="Esta acción no se puede deshacer."
          type="error"
          showIcon
          className="mt-3"
        />
      </div>
    ),
    okText:"Confirmar eliminación",
    cancelText:"Cancelar",
    okButtonProps:{ danger: true, size: 'large' },
    cancelButtonProps:{ size: 'large' },
    onOk: onConfirm,
    onCancel: onCancel,
  });

  return (
    <div>CascadeDeleteModal</div>
  )
}

export default CascadeDeleteModal