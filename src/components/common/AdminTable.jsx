import React, { useEffect, useState } from 'react'
import { useCrud } from '../../hooks/useCrud'
import { Controller, useForm } from 'react-hook-form'
import { Button, Input, message, Modal, Popconfirm, Table } from 'antd'

const AdminTable = ({ title, endpoint, columns, formFields }) => {
  const { getAll, create, update, remove, loading } = useCrud(endpoint)
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const {
    handleSubmit,
    control,
    reset,
    setValue
  } = useForm()

  const fetchData = async() => {
    try {
      const result = await getAll()
      setData(result)
    } catch (error) {
      message.error(`Error al cargar ${title.toLowerCase()}: `, error)
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
    setOpen(true)
  }

  const onSubmit = async(values) => {
    try {
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
    } catch (error) {
      message.error('Error al guardar:', error)
    }
  }

  const handleDelete = async(id) => {
    try {
      await remove(id)
      message.success(`${title} eliminado`)
      fetchData()
    } catch (error) {
      message.error('Error al eliminar:', error)
    }
  }

  const tableColumns = [
    ...columns,
    {
      title: "Acciones",
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

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button type="primary" onClick={() => handleOpen()}>
          Nuevo {title}
        </Button>
      </div>

      <Table
        columns={tableColumns}
        dataSource={data}
        rowKey='id'
        loading={loading}
      />

      <Modal
        title={editing ? `Editar ${title}` : `Nuevo ${title}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit(onSubmit)}
        destroyOnHidden
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {formFields.map((field) => (
            <div key={field.name} className='mb-3'>
              <label className='block mb-1'>{field.label}</label>
              <Controller 
                name={field.name}
                control={control}
                rules={field.rules}
                render={({ field: inputField }) => (
                  <Input {...inputField} />
                )}
              />
            </div>
          ))}
        </form>
      </Modal>
    </>
  )
}

export default AdminTable