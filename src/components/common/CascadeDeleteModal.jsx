import { Alert, Button, Divider, Modal, Typography } from "antd";
import { ArrowRightOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const CascadeDeleteModal = ({ data, onConfirm, onCancel }) => {
  const entityType = data?.entityType || "linea";
  const isLinea = entityType === 'linea';

  return (
    <Modal
      open={true}
      onCancel={onCancel}
      footer={null}
      width={600}
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined style={{ color: "#faad14", fontSize: 22 }} />
          <span>Eliminación masiva</span>
        </div>
      }
      maskClosable={false}
    >
      <div className="space-y-4 mt-2">
        <Alert
          type="warning"
          showIcon
          message="Esta acción eliminará de forma permanente los datos relacionados."
          description={
            <div className="mt-2 space-y-1">
              {isLinea && (
                <>
                  <Text strong className="block">
                    {data?.recorridos_count ?? 0} recorridos
                  </Text>
                  <Text strong className="block">
                    {data?.horarios_count ?? 0} horarios
                  </Text>
                </>
              )}
              {!isLinea && (
                <Text strong className="block">
                  {data?.horarios_count ?? 0} horarios
                </Text>
              )}
            </div>
          }
        />

        {/* Recorridos afectados */}
        {isLinea && data?.recorridos?.length > 0 && (
          <>
            <Divider />

            <div className="max-h-60 overflow-y-auto border rounded p-3 bg-gray-50">
              <Paragraph strong className="mb-2">
                Recorridos que serán eliminados:
              </Paragraph>

              {data?.recorridos?.map((rec) => (
                <Paragraph key={rec.id} className="text-sm mb-1">
                  <Text code>ID {rec.id}</Text> – {rec.origen}{" "}
                  <ArrowRightOutlined /> {rec.destino}
                </Paragraph>
              ))}
            </div>
          </>
        )}

        {/* Preview horarios */}
        {!isLinea && data?.horarios_preview?.length > 0 && (
          <>
            <Divider />

            <div className="max-h-60 overflow-y-auto border rounded p-3 bg-gray-50">
              <Paragraph strong className="mb-2">
                Primeros 10 horarios que serán eliminados:
              </Paragraph>

              <div className="flex flex-wrap gap-1">
                {data?.horarios_preview?.map((id) => (
                  <Text key={id} code className="text-xs">
                    ID {id}
                  </Text>
                ))}
              </div>

              {(data?.horarios_count ?? 0) >
                (data?.horarios_preview?.length ?? 0) && (
                <Paragraph className="text-xs text-gray-500 mt-2 mb-0">
                  ... y {(data?.horarios_count ?? 0) - (data?.horarios_preview?.length ?? 0)} más
                </Paragraph>
              )}
            </div>
          </>
        )}

        <Alert
          type="error"
          showIcon
          message="Esta acción no se puede deshacer."
          className="mt-3"
        />

        <div className="flex justify-end gap-2 mt-5">
          <Button className="ant-btn" onClick={onCancel}>
            Cancelar
          </Button>

          <Button danger type="primary" onClick={onConfirm}>
            Confirmar eliminación
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CascadeDeleteModal;
