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
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
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

const AdminTable = ({
  title,
  endpoint,
  columns,
  formFields,
}) => {
  const { getAll, create, update, remove, loading } = useCrud(endpoint);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [validationAlert, setValidationAlert] = useState(null);
  const { handleSubmit, control, reset, setValue, watch } = useForm();

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const PAGE_SIZE = 10;

  const flattenData = (arr) => {
    return arr.map((item) => {
      const flat = { ...item };
      if (item.linea && item.linea.nombre)
        flat.linea_nombre = item.linea.nombre;
      if (item.recorrido && item.recorrido.origen && item.recorrido.destino)
        flat.recorrido_label = `${item.recorrido.origen} — ${item.recorrido.destino}`;
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
      await remove(id);
      toast.success(`${title} eliminado`);
      fetchData();
    } catch (error) {
      const errorDetail = error.response?.data?.detail || error.message;
      toast.error(errorDetail, { duration: 6000 });
      console.error("Error al eliminar:", error.response?.data);
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
            <EditOutlined style={{  color: '#0c5392', fontSize: '16px' }} />
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
              <DeleteOutlined style={{ fontSize: '16px' }} />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const tablePagination = data.length > PAGE_SIZE ? {
    pageSize: PAGE_SIZE,
    showSizeChanger: false,
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
  } : false;

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
          Línea: {item.linea_nombre || '-'}
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
