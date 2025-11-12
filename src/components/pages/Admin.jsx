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
      key: "horarios",
      label: "Horarios",
      children: (
        <AdminTable 
          title='Horarios'
          endpoint='horarios-por-recorrido/1?tipo_dia=habil'
          columns={[
            { title: "ID", dataIndex: "id" },
            { title: "Linea", dataIndex: "linea" },
            { title: "Hora salida", dataIndex: "hora_salida" },
            { title: "Hora llegada", dataIndex: "hora_llegada" },
          ]}
          formFields={[
            { name: "linea", label: "Linea", rules: { required: true } },
            { name: "hora_salida", label: "Hora salida", rules: { required: true } },
            { name: "hora_llegada", label: "Hora llegada", rules: { required: true } },
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
