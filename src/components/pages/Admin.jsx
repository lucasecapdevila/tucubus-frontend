import React, { useState, useEffect } from "react";
import { AdminTable } from "../common";
import { Tabs } from "antd";
import { useCrud } from "../../hooks/useCrud";
import { rolesOptions, tipoDiaOptions } from "../../utils/adminPanelOptions";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const Admin = () => {
  const [lineasOptions, setLineasOptions] = useState([]);
  const [recorridosOptions, setRecorridosOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lineas");

  const { getAll: getAllLineas } = useCrud('lineas');
  const { getAll: getAllRecorridos } = useCrud('recorridos');

  // Cargar opciones de líneas
  const loadLineasOptions = async () => {
    try {
      const lineas = await getAllLineas();
      const lineasOpts = lineas.map(linea => ({
        label: linea.nombre,
        value: linea.id,
      }));
      setLineasOptions(lineasOpts);
    } catch (error) {
      console.error("Error al cargar líneas:", error);
    }
  };

  // Cargar opciones de recorridos
  const loadRecorridosOptions = async () => {
    try {
      const recorridos = await getAllRecorridos();
      const recorridosOpts = recorridos.map(recorrido => ({
        label: `${recorrido.origen} - ${recorrido.destino}`,
        value: recorrido.id,
      }));
      setRecorridosOptions(recorridosOpts);
    } catch (error) {
      console.error("Error al cargar recorridos:", error);
    }
  };

  // Carga inicial
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      await Promise.all([loadLineasOptions(), loadRecorridosOptions()]);
      setIsLoading(false);
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar opciones cuando cambia de tab
  const handleTabChange = async (key) => {
    setActiveTab(key);
    
    // Si va a "Recorridos", recargar líneas por si se creó una nueva
    if (key === "recorridos") {
      await loadLineasOptions();
    }
    
    // Si va a "Horarios", recargar recorridos por si se creó uno nuevo
    if (key === "horarios") {
      await loadRecorridosOptions();
    }
  };

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
            { title: "Linea", dataIndex: "linea_nombre", render: (val) => val || '-' },
          ]}
          formFields={[
            { name: "origen", label: "Origen", rules: { required: true } },
            { name: "destino", label: "Destino", rules: { required: true } },
            { name: "linea_id", label: "Linea", type: "select", options: lineasOptions, rules: { required: true } },
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
            { title: "Origen", dataIndex: "origen", render: (val) => val || '-' },
            { title: "Destino", dataIndex: "destino", render: (val) => val || '-' },
            { title: "Línea", dataIndex: "linea_nombre", render: (val) => val || '-' },
            { title: "Directo", dataIndex: "directo", render: (val) => val ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} /> },
          ]}
          formFields={[
            { name: "tipo_dia", label: "Tipo de día", type: "select", options: tipoDiaOptions, rules: { required: true } },
            { name: "hora_salida", label: "Hora salida", type: "time", rules: { required: true } },
            { name: "hora_llegada", label: "Hora llegada", type: "time", rules: { required: true } },
            { name: "recorrido_id", label: "Recorrido", type: "select", options: recorridosOptions, rules: { required: true } },
            { name: "directo", label: "Directo", type: "switch" },
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
            { name: "role", label: "Rol", type: "select", options: rolesOptions, rules: { required: true } },
          ]}
          pagination={false}
        />
      )
    },
  ];

  return (
    <main className="w-full max-w-5xl mx-auto px-2 sm:px-6 py-8 pt-12 flex flex-col gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text text-center mt-2 mb-4">Panel de Administración</h1>
      {isLoading ? (
        <div className="text-center py-8">Cargando opciones...</div>
      ) : (
        <div className="w-full">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={items}
            type="card"
            tabBarGutter={16}
            className="bg-white rounded-lg shadow-md px-1 w-full"
            style={{overflowX:'auto', minWidth: '350px', width: '100%'}}
          />
        </div>
      )}
    </main>
  );
};

export default Admin;