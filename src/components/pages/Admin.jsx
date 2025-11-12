import React from "react";
import { AdminTable } from "../common";

const Admin = () => {
  return (
    <main>
      <h1>Admin Panel</h1>
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
      />
    </main>
  );
};

export default Admin;
