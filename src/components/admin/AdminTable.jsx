import React, { useEffect, useState } from 'react'
import { useCrud } from '../../hooks/useCrud'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input, message, Modal, Popconfirm, Table, Select, Switch, TimePicker, Alert } from 'antd'
import dayjs from 'dayjs'
import { 
  validateHorarioTimes, 
  validateRecorrido, 
  validateLineaNombre,
  calculateTripDuration,
  formatDuration,
  crossesMidnight
} from '../../utils/validation'

const AdminTable = ({ title, endpoint, columns, formFields, pagination = false }) => {
  const { getAll, create, update, remove, loading } = useCrud(endpoint)
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [validationAlert, setValidationAlert] = useState(null)
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch
  } = useForm()

  const flattenData = (arr) => {
    return arr.map(item => {
      const flat = { ...item }
      if(item.linea && item.linea.nombre) flat.linea_nombre = item.linea.nombre
      if(item.recorrido && item.recorrido.origen && item.recorrido.destino)
        flat.recorrido_label = `${item.recorrido.origen} — ${item.recorrido.destino}`
      return flat
    })
  }

  const fetchData = async() => {
    try {
      const result = await getAll()
      setData(flattenData(result))
    } catch (error) {
      message.error(`Error al cargar ${title.toLowerCase()}: ${error.message}`)
    }
  }

  useEffect(() => {
    fetchData()
  },[])

  const handleOpen = (record = null) => {
    if(record){
      setEditing(record)
      formFields.forEach((field) => {
        setValue(field.name, record[field.name])
      })
    } else{
      setEditing(null)
      reset()
    }
    setValidationAlert(null)
    setOpen(true)
  }

  // Validación en tiempo real
  useEffect(() => {
    if (!open) return;

    const subscription = watch((values) => {
      // Validación para horarios
      if (endpoint === 'horarios') {
        const { hora_salida, hora_llegada } = values;
        
        if (hora_salida && hora_llegada) {
          const validation = validateHorarioTimes(hora_salida, hora_llegada);
          
          if (validation.valid) {
            const duration = calculateTripDuration(hora_salida, hora_llegada);
            const crosses = crossesMidnight(hora_salida, hora_llegada);
            const hoursMin = formatDuration(duration);
            
            setValidationAlert({
              type: 'success',
              message: `Duración: ${hoursMin}${crosses ? 'Este viaje cruza medianoche' : ''}`
            });
          } else {
            setValidationAlert({
              type: 'error',
              message: `${validation.message}`
            });
          }
        } else {
          setValidationAlert(null);
        }
      }
      
      // Validación para recorridos
      if (endpoint === 'recorridos') {
        const { origen, destino } = values;
        
        if (origen && destino) {
          const validation = validateRecorrido(origen, destino);
          
          if (!validation.valid) {
            setValidationAlert({
              type: 'error',
              message: `${validation.message}`
            });
          } else {
            setValidationAlert(null);
          }
        } else {
          setValidationAlert(null);
        }
      }
      
      // Validación para líneas
      if (endpoint === 'lineas') {
        const { nombre } = values;
        
        if (nombre) {
          const validation = validateLineaNombre(nombre);
          
          if (!validation.valid) {
            setValidationAlert({
              type: 'error',
              message: `${validation.message}`
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

  const onSubmit = async(values) => {
    try {
      // Validaciones específicas por endpoint
      if (endpoint === 'horarios') {
        const timeValidation = validateHorarioTimes(values.hora_salida, values.hora_llegada);
        if (!timeValidation.valid) {
          message.error(timeValidation.message);
          return;
        }
      }
      
      if (endpoint === 'recorridos') {
        const recorridoValidation = validateRecorrido(values.origen, values.destino);
        if (!recorridoValidation.valid) {
          message.error(recorridoValidation.message);
          return;
        }
      }
      
      if (endpoint === 'lineas') {
        const lineaValidation = validateLineaNombre(values.nombre);
        if (!lineaValidation.valid) {
          message.error(lineaValidation.message);
          return;
        }
      }

      console.log('Valores a enviar:', values) // Debug
      if(editing){
        await update(editing.id, values)
        message.success(`${title} actualizado`)
      } else{
        await create(values)
        message.success(`${title} creado`)
      }
      fetchData()
      setOpen(false)
      reset()
      setValidationAlert(null)
    } catch (error) {
      message.error(`Error al guardar: ${error.response?.data?.detail || error.message}`)
      console.error('Error completo:', error.response?.data)
    }
  }

  const handleDelete = async(id) => {
    try {
      await remove(id)
      message.success(`${title} eliminado`)
      fetchData()
    } catch (error) {
      message.error(`Error al eliminar: ${error.message}`)
    }
  }

  const tableColumns = [
    ...columns,
    {
      title: "Acciones",
      align: "center",
      render: (_, record) => (
        <>
          <Button type='link' onClick={() => handleOpen(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar este registro?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type='link' danger>
              Eliminar
            </Button>
          </Popconfirm>
        </>
      )
    }
  ]

  const renderFormField = (field, inputField) => {
    switch(field.type){
      case 'select':
        return (
          <Select
            className="w-full"
            value={inputField.value !== undefined ? inputField.value : null}
            onChange={inputField.onChange}
            options={field.options || []}
            placeholder={`Seleccione ${field.label.toLowerCase()}`}
          />
        )
      case 'switch':
        return (
          <Switch
            checked={!!inputField.value}
            onChange={val => inputField.onChange(val)}
          />
        )
      case 'time':
        return (
          <TimePicker
            format="HH:mm"
            className="w-full"
            value={inputField.value ? dayjs(inputField.value, "HH:mm") : null}
            onChange={(time) => {
              // Asegurarse de enviar el formato correcto HH:mm
              if (time) {
                const formatted = time.format("HH:mm")
                console.log('Hora formateada:', formatted) // Debug
                inputField.onChange(formatted)
              } else {
                inputField.onChange(null)
              }
            }}
            placeholder="Seleccione hora (HH:mm)"
            showNow={false}
          />
        )
      default:
        return <Input {...inputField} className="w-full" />
    }
  }

  return (
    <>
      <div className="w-full flex justify-between items-center gap-2 mb-4 px-2">
        <h2 className="text-lg sm:text-xl font-bold text-primary-text">{title}</h2>
        <Button type="primary" onClick={() => handleOpen()} className="self-start sm:self-center w-fit">
          Nuevo {title}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow border border-gray-200 p-0 sm:p-2 w-full max-w-full">
        <div className="min-w-[350px] w-full max-w-full">
          <Table
            columns={tableColumns}
            dataSource={data}
            rowKey='id'
            loading={loading}
            pagination={pagination}
            size="large"
            className="w-full max-w-full"
          />
        </div>
      </div>

      <Modal
        title={editing ? `Editar ${title}` : `Nuevo ${title}`}
        open={open}
        onCancel={() => {
          setOpen(false)
          setValidationAlert(null)
        }}
        onOk={handleSubmit(onSubmit)}
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
            <div key={field.name} className='mb-2'>
              <label className='block mb-1 font-semibold text-primary-text'>
                {field.label}
                {field.rules?.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <Controller 
                name={field.name}
                control={control}
                rules={field.rules}
                render={({ field: inputField }) => renderFormField(field, inputField)}
              />
            </div>
          ))}
        </form>
      </Modal>
    </>
  )
}

export default AdminTable