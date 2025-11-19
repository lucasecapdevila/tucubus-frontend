import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { FadeLoader } from "react-spinners";
import { useCrud } from "../../hooks/useCrud";
import { Controller, useForm } from "react-hook-form";
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
import {
  validateHorarioTimes,
  validateRecorrido,
  validateLineaNombre,
  calculateTripDuration,
  formatDuration,
  crossesMidnight,
} from "../../utils/validation";
import toast from "react-hot-toast";
import CascadeDeleteModal from "../common/CascadeDeleteModal";

const AdminTable = ({ title, endpoint, columns, formFields }) => {
  const { getAll, create, update, remove, bulkRemove, loading } =
    useCrud(endpoint);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [validationAlert, setValidationAlert] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterMode, setFilterMode] = useState("replace");

  const { handleSubmit, control, reset, setValue, watch } = useForm();

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const PAGE_SIZE = 10;

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

  const flattenData = (arr) => {
    return arr.map((item) => {
      const flat = { ...item };

      // Asegurar label del recorrido
      if (item.origen && item.destino) {
        flat.recorrido_label = `${item.origen} — ${item.destino}`;
      }

      return flat;
    });
  };

  const fetchData = async () => {
    try {
      const result = await getAll();
      setData(flattenData(result));
    } catch (error) {
      toast.error(`Error al cargar ${title.toLowerCase()}: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setValidationAlert(null);
    setOpen(true);
  };

  // Validación en tiempo real
  useEffect(() => {
    if (!open) return;

    const subscription = watch((values) => {
      // Validación para horarios
      if (endpoint === "horarios") {
        const { hora_salida, hora_llegada } = values;

        if (hora_salida && hora_llegada) {
          const validation = validateHorarioTimes(hora_salida, hora_llegada);

          if (validation.valid) {
            const duration = calculateTripDuration(hora_salida, hora_llegada);
            const crosses = crossesMidnight(hora_salida, hora_llegada);
            const hoursMin = formatDuration(duration);

            setValidationAlert({
              type: "success",
              message: `Duración: ${hoursMin}${
                crosses ? " - Este viaje cruza medianoche" : ""
              }`,
            });
          } else {
            setValidationAlert({
              type: "error",
              message: `${validation.message}`,
            });
          }
        } else {
          setValidationAlert(null);
        }
      }

      // Validación para recorridos
      if (endpoint === "recorridos") {
        const { origen, destino } = values;

        if (origen && destino) {
          const validation = validateRecorrido(origen, destino);

          if (!validation.valid) {
            setValidationAlert({
              type: "error",
              message: `${validation.message}`,
            });
          } else {
            setValidationAlert(null);
          }
        } else {
          setValidationAlert(null);
        }
      }

      // Validación para líneas
      if (endpoint === "lineas") {
        const { nombre } = values;

        if (nombre) {
          const validation = validateLineaNombre(nombre);

          if (!validation.valid) {
            setValidationAlert({
              type: "error",
              message: `${validation.message}`,
            });
          } else {
            setValidationAlert(null);
          }
        } else {
          setValidationAlert(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, open, endpoint]);

  const onSubmit = async (values) => {
    // Prevenir envío si hay alerta de error visible
    if (validationAlert?.type === "error") {
      toast.error("Por favor corrija los errores antes de guardar");
      return;
    }

    try {
      // Validaciones específicas por endpoint antes de enviar
      if (endpoint === "horarios") {
        const timeValidation = validateHorarioTimes(
          values.hora_salida,
          values.hora_llegada
        );
        if (!timeValidation.valid) {
          toast.error(timeValidation.message);
          setValidationAlert({
            type: "error",
            message: `${timeValidation.message}`,
          });
          return;
        }
      }

      if (endpoint === "recorridos") {
        const recorridoValidation = validateRecorrido(
          values.origen,
          values.destino
        );
        if (!recorridoValidation.valid) {
          toast.error(recorridoValidation.message);
          setValidationAlert({
            type: "error",
            message: `${recorridoValidation.message}`,
          });
          return;
        }
      }

      if (endpoint === "lineas") {
        const lineaValidation = validateLineaNombre(values.nombre);
        if (!lineaValidation.valid) {
          toast.error(lineaValidation.message);
          setValidationAlert({
            type: "error",
            message: `${lineaValidation.message}`,
          });
          return;
        }
      }

      if (editing) {
        await update(editing.id, values);
        toast.success(`${title} actualizado`);
      } else {
        await create(values);
        toast.success(`${title} creado`);
      }

      fetchData();
      setOpen(false);
      reset();
      setValidationAlert(null);
    } catch (error) {
      const errorDetail = error.response?.data?.detail || error.message;
      toast.error(`Error al guardar: ${errorDetail}`);
      console.error("Error completo:", error.response?.data);
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(id, false);
      toast.success(`${title} eliminado`);
      fetchData();
      setSelectedRowKeys([]);
    } catch (error) {
      const errorData = error.response?.data?.detail;

      if (error.response?.status === 409 && typeof errorData === "object") {
        const entityType = endpoint === "lineas" ? "linea" : "recorrido";

        <CascadeDeleteModal
          conflictData={errorData}
          entityType={entityType}
          onConfirm={async () => {
            try {
              await remove(id, true);
              toast.success(`${title} y datos relacionados eliminados.`);
              fetchData();
              setSelectedRowKeys([]);
            } catch (err) {
              const detail = err.response?.data?.detail || err.message;
              toast.error(`Error al eliminar: ${detail}`);
            }
          }}
          onCancel={() => {}}
        />;
        return;
      }

      const errorDetail = error.response?.data?.detail || error.message;
      toast.error(errorDetail, { duration: 6000 });
      console.error("Error al eliminar:", error.response?.data);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      toast.error("Seleccione al menos un registro.");
      return;
    }

    Modal.confirm({
      title: `Eliminar ${selectedRowKeys.length} ${title.toLowerCase()}s?`,
      width: 500,
      content: (
        <div className="space-y-3 mt-3">
          <Alert
            type="warning"
            showIcon
            message={`Total: ${selectedRowKeys.length} registros seleccionados`}
          />
          <p className="text-red-600 font-semibold">
            Esta acción no se puede deshacer.
          </p>
        </div>
      ),
      okText: "Sí, eliminar",
      cancelText: "Cancelar",
      okButtonProps: { danger: true, size: "large" },
      onOk: async () => {
        try {
          await bulkRemove(selectedRowKeys);
          toast.success(
            `${selectedRowKeys.length} registros eliminados correctamente.`
          );
          setSelectedRowKeys([]);
          fetchData();
        } catch (error) {
          const errorDetail = error.response?.data?.detail || error.message;
          toast.error(`Error al eliminar: ${errorDetail}`, { duration: 6000 });
        }
      },
    });
  };

  const handleQuickSelect = (filterType, filterValue = null) => {
    let filtered = [];

    switch (filterType) {
      // Filtros por tipo de día
      case "habil":
        filtered = data.filter((h) => h.tipo_dia === "habil").map((h) => h.id);
        break;
      case "sabado":
        filtered = data.filter((h) => h.tipo_dia === "sábado").map((h) => h.id);
        break;
      case "domingo":
        filtered = data
          .filter((h) => h.tipo_dia === "domingo")
          .map((h) => h.id);
        break;

      case "directos":
        filtered = data.filter((h) => h.directo === true).map((h) => h.id);
        break;

      case "linea":
        filtered = data
          .filter((h) => h.linea_nombre === filterValue)
          .map((h) => h.id);
        break;

      // ✨ NUEVO: Filtro por recorrido
      case "recorrido": {
        const recorridoId = filterValue;
        filtered = data
          .filter((h) => h.recorrido_id === recorridoId)
          .map((h) => h.id);
        break;
      }

      // Acciones generales
      case "all":
        filtered = data.map((h) => h.id);
        break;
      case "clear":
        filtered = [];
        break;

      default:
        filtered = [];
    }

    if (
      filterMode === "add" &&
      filterType !== "all" &&
      filterType !== "clear"
    ) {
      const combined = [...new Set([...selectedRowKeys, ...filtered])];
      setSelectedRowKeys(combined);
      toast.success(
        `+${filtered.length} registros añadidos a la selección (Total: ${combined.length})`
      );
    } else {
      setSelectedRowKeys(filtered);
    }

    if (filtered.length > 0) {
      toast.success(
        `${filtered.length} ${
          filtered.length === 1
            ? "registro seleccionado"
            : "registros seleccionados"
        }`
      );
    } else if (filterType === "clear") {
      toast.success("Selección limpiada");
    } else {
      toast.error("No se encontraron registros con ese filtro");
    }
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
                ? "Si contiene recorridos/horarios, no se podrá eliminar"
                : endpoint === "recorridos"
                ? "Si contiene horarios, no se podrá eliminar"
                : endpoint === "users"
                ? "No se puede eliminar el último administrador"
                : "Esta acción no se puede deshacer"
            }
            onConfirm={() => handleDelete(record.id)}
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

  const tablePagination =
    data.length > PAGE_SIZE
      ? {
          pageSize: PAGE_SIZE,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} registros`,
        }
      : false;

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

  const getUniqueLineas = () => {
    const lineas = [
      ...new Set(data.map((h) => h.linea_nombre).filter(Boolean)),
    ];
    return lineas.sort();
  };

  const getUniqueRecorridos = () => {
    const recorridosMap = new Map();

    data.forEach((h) => {
      if (h.recorrido_id && h.origen && h.destino) {
        const id = h.recorrido_id;
        const label = `${h.origen} - ${h.destino}`;

        if (!recorridosMap.has(id)) {
          recorridosMap.set(id, { key: id, label });
        }
      }
    });

    return Array.from(recorridosMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  };

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
          {selectedRowKeys.length > 0 && (
            <Alert
              message={
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span>
                    <Tag color="#0c5392">{selectedRowKeys.length}</Tag>
                    {selectedRowKeys.length === 1
                      ? " registro seleccionado"
                      : " registros seleccionados"}
                  </span>
                  <Button danger size="small" onClick={handleBulkDelete}>
                    Eliminar seleccionados
                  </Button>
                </div>
              }
              type="info"
              closable
              onClose={() => setSelectedRowKeys([])}
              className="mb-3"
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
                  {getUniqueLineas().map((linea) => (
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
                  {getUniqueRecorridos().map((recorrido) => (
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
                  onConfirm={() => handleDelete(item.id)}
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
              pagination={tablePagination}
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
          setValidationAlert(null);
        }}
        onOk={handleSubmit(onSubmit)}
        destroyOnHidden
      >
        {/* ... (sin cambios en el formulario del modal) */}
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
    </>
  );
};

export default AdminTable;
