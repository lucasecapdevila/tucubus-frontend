import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { FadeLoader } from 'react-spinners';
import {
  useFormValidation,
  useBulkSelection,
  useAdminTable,
} from '../../hooks/features';
import {
  Button,
  Modal,
  Popconfirm,
  Table,
  Alert,
  TableProps,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';

import { AdminTableHeader } from '../features/admin/AdminTable';
import {
  BulkActionBar,
  QuickFilters,
} from '../features/admin/BulkActions';
import { FormField } from '../common/FormField';

import toast from 'react-hot-toast';
import CascadeDeleteModal from '../common/CascadeDeleteModal';
import { AdminTableProps, CascadeModalData } from '@/types';

const AdminTable: React.FC<AdminTableProps> = ({ title, endpoint, columns, formFields }) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [cascadeModal, setCascadeModal] = useState<CascadeModalData | null>(null);

  const {
    data,
    loading,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBulkDelete,
    paginationConfig,
  } = useAdminTable(endpoint);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    validationAlert,
    isValid,
    validateBeforeSubmit,
    clearValidation,
  } = useFormValidation(endpoint);

  const {
    selectedRowKeys,
    setSelectedRowKeys,
    handleQuickSelect,
    getUniqueLines,
    getUniqueRoutes,
    clearSelection,
    selectedCount,
  } = useBulkSelection(data, endpoint);

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handleOpen = async (record: any = null) => {
    if (record) {
      setEditing(record);
      formFields.forEach((field) => {
        setValue(field.name, record[field.name]);
      });
    } else {
      setEditing(null);
      reset();
    }
    clearValidation();
    setOpen(true);
  };

  const onSubmit = async (values: any) => {
    // Validar antes de enviar
    const validation = validateBeforeSubmit();

    if (!validation.valid) {
      toast.error(validation.message || 'Error de validación');
      return;
    }

    const result = editing
      ? await handleUpdate(editing.id, values)
      : await handleCreate(values);

    if (result.success) {
      setOpen(false);
      reset();
      clearValidation();
    }
  };

  const handleDeleteClick = async (id: number) => {
    const result = await handleDelete(id, false);

    if (result.conflict) {
      const entityType = endpoint === 'lineas' ? 'linea' : 'recorrido';
      setCascadeModal({
        id,
        entityType,
        ...result.conflictData,
      });
    } else if (result.success) {
      clearSelection();
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedCount === 0) {
      toast.error('Seleccione al menos un registro.');
      return;
    }
    setBulkModalOpen(true);
  };

  const tableColumns = [
    ...columns,
    {
      title: 'Acciones',
      align: 'center',
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => handleOpen(record)}>
            <EditOutlined style={{ color: '#0c5392', fontSize: '16px' }} />
          </Button>
          <Popconfirm
            title={`¿Eliminar este ${title.toLowerCase()}?`}
            description={
              endpoint === 'lineas'
                ? 'Si contiene recorridos/horarios, estos se perderán.'
                : endpoint === 'recorridos'
                  ? 'Si contiene horarios, estos se perderán.'
                  : endpoint === 'users'
                    ? 'No se puede eliminar el último administrador'
                    : 'Esta acción no se puede deshacer'
            }
            onConfirm={() => handleDeleteClick(record.id)}
            okText="Sí, eliminar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger>
              <DeleteOutlined style={{ fontSize: '16px' }} />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const rowSelection: TableProps<any>['rowSelection'] =
    endpoint === 'horarios'
      ? {
          selectedRowKeys,
          onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys as number[]);
          },
          selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ],
        }
      : undefined;

  const customSpinner = (
    <div className="w-full flex justify-center items-center py-2">
      <FadeLoader color="#0c5392" loading={loading} />
    </div>
  );

  return (
    <>
      <AdminTableHeader title={title} onNew={() => handleOpen()} />
      {endpoint === 'horarios' && (
        <>
          <BulkActionBar
            selectedCount={selectedCount}
            onBulkDelete={handleBulkDeleteClick}
            onClearSelection={clearSelection}
          />

          <QuickFilters
            uniqueLines={getUniqueLines()}
            uniqueRoutes={getUniqueRoutes()}
            onQuickSelect={handleQuickSelect}
          />
        </>
      )}
      {isMobile && endpoint === 'horarios' ? (
        <div className="space-y-2">
          {data.map((item) => (
            <div
              key={item.id}
              className="border border-gray-300 rounded-lg p-3 shadow-sm bg-white transition"
            >
              {/* Header: título y ID */}
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-gray-800">
                  {item.origen} → {item.destino}
                </p>
                <p className="text-sm text-gray-500">#{item.id}</p>
              </div>

              {/* Detalle principal */}
              <p className="text-gray-600">
                {item.hora_salida} — {item.hora_llegada}
              </p>
              <p className="text-gray-500 text-sm">{item.tipo_dia}</p>
              <p className="text-xs text-gray-400 mt-1">
                Línea: {item.linea_nombre || '-'}
              </p>

              {/* 🔸 Acciones */}
              <div className="flex justify-end gap-2 mt-3">
                <Button
                  size="small"
                  onClick={() => handleOpen(item)} // editar
                  style={{ backgroundColor: '#0c5392', color: '#fff' }}
                >
                  Editar
                </Button>

                <Popconfirm
                  title="¿Eliminar este registro?"
                  description="Esta acción no se puede deshacer."
                  okText="Sí, eliminar"
                  cancelText="Cancelar"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => handleDeleteClick(item.id)}
                >
                  <Button size="small" danger>
                    Eliminar
                  </Button>
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 🔹 Vista normal (desktop)
        <div className="overflow-x-auto rounded-lg bg-white shadow border border-gray-200 p-0 sm:p-2 w-full max-w-full">
          <div className="min-w-[350px] w-full max-w-full">
            <Table
              rowSelection={rowSelection}
              columns={tableColumns}
              dataSource={data}
              rowKey="id"
              loading={{ spinning: loading, indicator: customSpinner }}
              pagination={paginationConfig}
              size="large"
              className="w-full max-w-full"
            />
          </div>
        </div>
      )}
      <Modal
        title={editing ? `Editar ${title}` : `Nuevo ${title}`}
        open={open}
        onCancel={() => {
          setOpen(false);
          clearValidation();
        }}
        cancelText="Cancelar"
        onOk={handleSubmit(onSubmit)}
        okText={editing ? 'Guardar cambios' : 'Crear'}
        okButtonProps={{
          style: { backgroundColor: '#0c5392', color: '#fff' },
          disabled: !isValid,
        }}
        destroyOnHidden
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {validationAlert && (
            <Alert
              message={validationAlert.message}
              type={validationAlert.type}
              showIcon
              className="mb-4"
            />
          )}

          {formFields.map((field) => (
            <FormField key={field.name} field={field} control={control} />
          ))}
        </form>
      </Modal>

      <Modal
        open={bulkModalOpen}
        onCancel={() => setBulkModalOpen(false)}
        footer={null}
        width={500}
        title={`Eliminar ${selectedRowKeys.length} ${title.toLowerCase()}?`}
      >
        <div className="space-y-4 mt-3">
          <Alert
            type="warning"
            showIcon
            message={`Total: ${selectedCount} registros seleccionados`}
          />

          <p className="text-red-600 font-semibold">
            Esta acción no se puede deshacer.
          </p>

          <div className="flex justify-end gap-2 mt-5">
            <Button onClick={() => setBulkModalOpen(false)}>Cancelar</Button>

            <Button
              danger
              type="primary"
              size="middle"
              onClick={async () => {
                const result = await handleBulkDelete(selectedRowKeys);

                if (result.success) {
                  clearSelection();
                  setBulkModalOpen(false);
                }
              }}
            >
              Sí, eliminar
            </Button>
          </div>
        </div>
      </Modal>
      {cascadeModal && (
        <CascadeDeleteModal
          data={cascadeModal}
          onConfirm={async () => {
            const result = await handleDelete(cascadeModal.id, true);

            if (result.success) {
              clearSelection();
            }
            setCascadeModal(null);
          }}
          onCancel={() => setCascadeModal(null)}
        />
      )}
    </>
  );
};

export default AdminTable;
