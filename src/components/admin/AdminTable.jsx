import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { FadeLoader } from "react-spinners";
import { Controller } from "react-hook-form";
import { useFormValidation, useBulkSelection, useAdminTable } from "../../hooks/features";
import {
  Button,
  Input,
  Modal,
  Popconfirm,
  Table,
  Select,
  Switch,
  TimePicker,
  Alert,
  Space,
  Tag,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import CascadeDeleteModal from "../common/CascadeDeleteModal";

const AdminTable = ({ title, endpoint, columns, formFields }) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [cascadeModal, setCascadeModal] = useState(null);

  const { 
    data,
    loading,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBulkDelete,
    paginationConfig 
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
  filterMode,
  setFilterMode,
  handleQuickSelect,
  getUniqueLines,
  getUniqueRoutes,
  clearSelection,
  selectedCount,
} = useBulkSelection(data, endpoint);


  const isMobile = useMediaQuery({ maxWidth: 767 });

  const activeBtn = {
    backgroundColor: "#0c5392",
    color: "#fff",
    borderColor: "#0c5392",
  };

  const inactiveBtn = {
    backgroundColor: "#fff",
    color: "#0c5392",
    borderColor: "#0c5392",
  };

  const handleOpen = async (record = null) => {
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

  const onSubmit = async (values) => {
    // Validar antes de enviar
    const validation = validateBeforeSubmit();

    if (!validation.valid) {
      toast.error(validation.message);
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

  const handleDeleteClick = async (id) => {
    const result = await handleDelete(id, false);

    if (result.conflict) {
      const entityType = endpoint === "lineas" ? "linea" : "recorrido";
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
      toast.error("Seleccione al menos un registro.");
      return;
    }
    setBulkModalOpen(true);
  };

  const tableColumns = [
    ...columns,
    {
      title: "Acciones",
      align: "center",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleOpen(record)}>
            <EditOutlined style={{ color: "#0c5392", fontSize: "16px" }} />
          </Button>
          <Popconfirm
            title={`¿Eliminar este ${title.toLowerCase()}?`}
            description={
              endpoint === "lineas"
                ? "Si contiene recorridos/horarios, estos se perderán."
                : endpoint === "recorridos"
                ? "Si contiene horarios, estos se perderán."
                : endpoint === "users"
                ? "No se puede eliminar el último administrador"
                : "Esta acción no se puede deshacer"
            }
            onConfirm={() => handleDeleteClick(record.id)}
            okText="Sí, eliminar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger>
              <DeleteOutlined style={{ fontSize: "16px" }} />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const rowSelection =
    endpoint === "horarios"
      ? {
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
          selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ],
        }
      : undefined;

  const renderFormField = (field, inputField) => {
    switch (field.type) {
      case "select":
        return (
          <Select
            className="w-full"
            value={inputField.value !== undefined ? inputField.value : null}
            onChange={inputField.onChange}
            options={field.options || []}
            placeholder={`Seleccione ${field.label.toLowerCase()}`}
          />
        );
      case "switch":
        return (
          <Switch
            checked={!!inputField.value}
            onChange={(val) => inputField.onChange(val)}
          />
        );
      case "time":
        return (
          <TimePicker
            format="HH:mm"
            className="w-full"
            value={inputField.value ? dayjs(inputField.value, "HH:mm") : null}
            onChange={(time) => {
              if (time) {
                const formatted = time.format("HH:mm");
                inputField.onChange(formatted);
              } else {
                inputField.onChange(null);
              }
            }}
            placeholder="Seleccione hora (HH:mm)"
            showNow={false}
          />
        );
      default:
        return <Input {...inputField} className="w-full" />;
    }
  };

  // CAMBIO: Definir el spinner personalizado para la tabla
  const customSpinner = (
    <div className="w-full flex justify-center items-center py-2">
      <FadeLoader color="#0c5392" loading={loading} />
    </div>
  );

  return (
    <>
      <div className="w-full flex justify-between items-center gap-2 mb-4 px-2">
        <h2 className="text-lg sm:text-xl font-bold text-primary-text">
          {title}
        </h2>
        <Button
          onClick={() => handleOpen()}
          style={{ backgroundColor: "#0c5392", color: "#fff" }}
          className="self-start sm:self-center w-fit"
        >
          Nuevo {title}
        </Button>
      </div>
      {endpoint === "horarios" && (
        <>
          {selectedCount > 0 && (
            <Alert
              message={
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span>
                    <Tag color="#0c5392">{selectedCount}</Tag>
                    {selectedCount === 1
                      ? " registro seleccionado"
                      : " registros seleccionados"}
                  </span>
                  <Button danger size="small" onClick={handleBulkDeleteClick}>
                    Eliminar seleccionados
                  </Button>
                </div>
              }
              type="info"
              closable
              onClose={clearSelection}
              style={{ margin: "12px 0" }}
            />
          )}

          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-300">
            <p className="text-sm font-semibold text-gray-700">
              Selección rápida
            </p>
            <Space size="small">
              <span className="text-xs text-gray-600">Modo:</span>
              <Button
                size="small"
                style={filterMode === "replace" ? activeBtn : inactiveBtn}
                onClick={() => setFilterMode("replace")}
              >
                Reemplazar
              </Button>
              <Button
                size="small"
                style={filterMode === "add" ? activeBtn : inactiveBtn}
                onClick={() => setFilterMode("add")}
              >
                Agregar
              </Button>
            </Space>
          </div>

          <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Por tipo de día:
                </p>
                <Space wrap size="small">
                  <Button
                    size="small"
                    onClick={() => handleQuickSelect("habil")}
                  >
                    Días hábiles
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleQuickSelect("sabado")}
                  >
                    Sábados
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleQuickSelect("domingo")}
                  >
                    Domingos
                  </Button>
                </Space>
              </div>

              <Divider className="my-2" />

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Por línea:
                </p>
                <Space wrap size="small">
                  {getUniqueLines().map((linea) => (
                    <Button
                      key={linea}
                      size="small"
                      onClick={() => handleQuickSelect("linea", linea)}
                    >
                      {linea}
                    </Button>
                  ))}
                </Space>
              </div>

              <Divider className="my-2" />

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Por recorrido:
                </p>
                <Space wrap size="small">
                  {getUniqueRoutes().map((recorrido) => (
                    <Button
                      key={recorrido.key}
                      size="small"
                      className="text-xs"
                      onClick={() =>
                        handleQuickSelect("recorrido", recorrido.key)
                      }
                    >
                      {recorrido.label}
                    </Button>
                  ))}
                </Space>
              </div>
            </div>

            <Divider className="my-2" />

            <p className="text-sm font-semibold text-gray-700 mb-2">
              Acciones:
            </p>
            <Space wrap size="small">
              <Button
                size="small"
                style={{ backgroundColor: "#0c5392", color: "#fff" }}
                onClick={() => handleQuickSelect("all")}
              >
                Seleccionar todos
              </Button>
              <Button size="small" onClick={() => handleQuickSelect("clear")}>
                Limpiar selección
              </Button>
            </Space>
          </div>
        </>
      )}
      {isMobile && endpoint === "horarios" ? (
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
                Línea: {item.linea_nombre || "-"}
              </p>

              {/* 🔸 Acciones */}
              <div className="flex justify-end gap-2 mt-3">
                <Button
                  size="small"
                  onClick={() => handleOpen(item)} // editar
                  style={{ backgroundColor: "#0c5392", color: "#fff" }}
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
        okText={editing ? "Guardar cambios" : "Crear"}
        okButtonProps={{
          style: { backgroundColor: "#0c5392", color: "#fff" },
          disabled: !isValid
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
            <div key={field.name} className="mb-2">
              <label className="block mb-1 font-semibold text-primary-text">
                {field.label}
                {field.rules?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <Controller
                name={field.name}
                control={control}
                rules={field.rules}
                render={({ field: inputField }) =>
                  renderFormField(field, inputField)
                }
              />
            </div>
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
