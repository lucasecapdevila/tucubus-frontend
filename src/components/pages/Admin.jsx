import React from "react";
import { AdminTable } from "../common";
import { Tabs } from "antd";

const Admin = () => {
  const items = [
    {
      key: "lineas",
      label: "Lineas",
      children: (
        <AdminTable 
          title='Lineas'
          endpoint='lineas'
          columns={[
            { title: "ID", dataIndex: "id" },
            { title: "Nombre", dataIndex: "nombre" },
          ]}
          formFields={[
            { name: "nombre", label: "Nombre", rules: { required: true } },
          ]}
          pagination={false}
        />
      )
    },
    {
      key: "recorridos",
      label: "Recorridos",
      children: (
        <AdminTable 
          title='Recorridos'
          endpoint='recorridos'
          columns={[
            { title: "ID", dataIndex: "id" },
            { title: "Origen", dataIndex: "origen" },
            { title: "Destino", dataIndex: "destino" },
            { title: "Linea", dataIndex: "linea_id" },
          ]}
          formFields={[
            { name: "origen", label: "Origen", rules: { required: true } },
            { name: "destino", label: "Destino", rules: { required: true } },
            { name: "linea_id", label: "Linea", rules: { required: true } },
          ]}
          pagination={false}
        />
      )
    },
    {
      key: "horarios",
      label: "Horarios",
      children: (
        <AdminTable 
          title='Horarios'
          endpoint='horarios'
          columns={[
            { title: "ID", dataIndex: "id" },
            { title: "Tipo de día", dataIndex: "tipo_dia" },
            { title: "Hora de salida", dataIndex: "hora_salida" },
            { title: "Hora de llegada", dataIndex: "hora_llegada" },
            { title: "Recorrido", dataIndex: "recorrido_id" },
            { title: "Directo", dataIndex: "directo" },
          ]}
          formFields={[
            { name: "tipo_dia", label: "Tipo de día", rules: { required: true } },
            { name: "hora_salida", label: "Hora salida", rules: { required: true } },
            { name: "hora_llegada", label: "Hora llegada", rules: { required: true } },
            { name: "recorrido_id", label: "Recorrido", rules: { required: true } },
            { name: "directo", label: "Directo", rules: { required: true } },
          ]}
          pagination={false}
        />
      )
    },
    {
      key: "usuarios",
      label: "Usuarios",
      children: (
        <AdminTable 
          title='Usuarios'
          endpoint='users'
          columns={[
            { title: "ID", dataIndex: "id" },
            { title: "Nombre de usuario", dataIndex: "username" },
            { title: "Rol", dataIndex: "role" },
          ]}
          formFields={[
            { name: "username", label: "Nombre de usuario", rules: { required: true } },
            { name: "role", label: "Rol", rules: { required: true } },
          ]}
          pagination={false}
        />
      )
    },
  ];

  return (
    <main className="w-full max-w-5xl mx-auto px-2 sm:px-6 py-8 pt-12 flex flex-col gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text text-center mt-2 mb-4">Panel de Administración</h1>
      <div className="w-full">
        <Tabs
          defaultActiveKey="lineas"
          items={items}
          type="card"
          tabBarGutter={16}
          className="bg-white rounded-lg shadow-md px-1 w-full"
          style={{overflowX:'auto', minWidth: '350px', width: '100%'}}
        />
      </div>
    </main>
  );
};

export default Admin;
