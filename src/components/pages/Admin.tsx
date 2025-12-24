import { useState, useEffect } from "react";
import { FadeLoader } from "react-spinners";
import { Tabs, TabsProps } from "antd";
import { useCrud } from "../../hooks/useCrud";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import toast from "react-hot-toast";
import { AdminTable } from "../admin";
import { Company, Route, Stop, DayOfWeek } from "@/types";
import { rolesOptions, daysOfWeekOptions } from "@/utils/adminPanelOptions";

interface SelectOption {
  label: string;
  value: any;
}

const Admin: React.FC = () => {
  const [companiesOptions, setCompaniesOptions] = useState<SelectOption[]>([]);
  const [routesOptions, setRoutesOptions] = useState<SelectOption[]>([]);
  const [stopsOptions, setStopsOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("companies");

  const { getAll: getAllCompanies } = useCrud<Company>('companies');
  const { getAll: getAllRoutes } = useCrud<Route>('routes');
  const { getAll: getAllStops } = useCrud<Stop>('stops');

  // Cargar opciones de empresas/compañías
  const loadCompaniesOptions = async () => {
    try {
      const companies = await getAllCompanies();
      const companiesOpts = companies.map(company => ({
        label: company.name,
        value: company.id,
      }));
      setCompaniesOptions(companiesOpts);
    } catch (error) {
      console.error("Error al cargar empresas:", error);
      toast.error('Error al cargar las opciones de empresas');
    }
  };

  // Cargar opciones de rutas
  const loadRoutesOptions = async () => {
    try {
      const routes = await getAllRoutes();
      const routesOpts = routes.map(route => ({
        label: `${route.name} (${route.company?.name || 'Sin empresa'})`,
        value: route.id,
      }));
      setRoutesOptions(routesOpts);
    } catch (error) {
      console.error("Error al cargar rutas:", error);
      toast.error('Error al cargar las opciones de rutas');
    }
  };

  // Cargar opciones de paradas
  const loadStopsOptions = async () => {
    try {
      const stops = await getAllStops();
      const stopsOpts = stops
        .filter(stop => stop.isActive)
        .map(stop => ({
          label: stop.name,
          value: stop.id,
        }));
      setStopsOptions(stopsOpts);
    } catch (error) {
      console.error("Error al cargar paradas:", error);
      toast.error('Error al cargar las opciones de paradas');
    }
  };

  // Carga inicial
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      await Promise.all([
        loadCompaniesOptions(),
        loadRoutesOptions(),
        loadStopsOptions(),
      ]);
      setIsLoading(false);
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar opciones cuando cambia de tab
  const handleTabChange = async (key: string) => {
    setActiveTab(key);
    
    // Recargar dependencias según tab
    if (key === "routes") {
      await loadCompaniesOptions();
      await loadStopsOptions();
    }
    
    if (key === "schedules") {
      await loadRoutesOptions();
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "companies",
      label: "Empresas",
      children: (
        <AdminTable 
          title='Empresas'
          endpoint='companies'
          columns={[
            { title: "ID", dataIndex: "id" },
            { 
              title: "Nombre", 
              dataIndex: "name", 
              sorter: (a: Company, b: Company) => a.name.localeCompare(b.name), 
              showSorterTooltip: false 
            },
            { 
              title: "Email", 
              dataIndex: "email", 
              render: (val: string) => val || '-' 
            },
            { 
              title: "Teléfono", 
              dataIndex: "phone", 
              render: (val: string) => val || '-' 
            },
            { 
              title: "Activo", 
              dataIndex: "isActive", 
              render: (val: boolean) => val ? 
                <CheckOutlined style={{ color: 'green' }} /> : 
                <CloseOutlined style={{ color: 'red' }} /> 
            },
          ]}
          formFields={[
            { name: "name", label: "Nombre", rules: { required: true } },
            { name: "description", label: "Descripción" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Teléfono" },
            { name: "address", label: "Dirección" },
            { name: "isActive", label: "Activo", type: "switch" },
          ]}
        />
      )
    },
    {
      key: "stops",
      label: "Paradas",
      children: (
        <AdminTable 
          title='Paradas'
          endpoint='stops'
          columns={[
            { title: "ID", dataIndex: "id" },
            { 
              title: "Nombre", 
              dataIndex: "name", 
              sorter: (a: Stop, b: Stop) => a.name.localeCompare(b.name), 
              showSorterTooltip: false 
            },
            { 
              title: "Dirección", 
              dataIndex: "address", 
              render: (val: string) => val || '-' 
            },
            { 
              title: "Activo", 
              dataIndex: "isActive", 
              render: (val: boolean) => val ? 
                <CheckOutlined style={{ color: 'green' }} /> : 
                <CloseOutlined style={{ color: 'red' }} /> 
            },
          ]}
          formFields={[
            { name: "name", label: "Nombre", rules: { required: true } },
            { name: "latitude", label: "Latitud", type: "number", rules: { required: true } },
            { name: "longitude", label: "Longitud", type: "number", rules: { required: true } },
            { name: "address", label: "Dirección" },
            { name: "isActive", label: "Activo", type: "switch" },
          ]}
        />
      )
    },
    {
      key: "routes",
      label: "Rutas",
      children: (
        <AdminTable 
          title='Rutas'
          endpoint='routes'
          columns={[
            { title: "ID", dataIndex: "id" },
            { 
              title: "Nombre", 
              dataIndex: "name", 
              sorter: (a: Route, b: Route) => a.name.localeCompare(b.name), 
              showSorterTooltip: false 
            },
            { 
              title: "Empresa", 
              dataIndex: ["company", "name"], 
              render: (val: string) => val || '-',
              sorter: (a: Route, b: Route) => 
                (a.company?.name || '').localeCompare(b.company?.name || ''), 
              showSorterTooltip: false 
            },
            { 
              title: "Paradas", 
              dataIndex: "stopIds", 
              render: (val: string[]) => val?.length || 0 
            },
            { 
              title: "Activo", 
              dataIndex: "isActive", 
              render: (val: boolean) => val ? 
                <CheckOutlined style={{ color: 'green' }} /> : 
                <CloseOutlined style={{ color: 'red' }} /> 
            },
          ]}
          formFields={[
            { name: "name", label: "Nombre de la ruta", rules: { required: true } },
            { name: "companyId", label: "Empresa", type: "select", options: companiesOptions, rules: { required: true } },
            { name: "stopIds", label: "Paradas", type: "multiselect", options: stopsOptions, rules: { required: true } },
            { name: "description", label: "Descripción" },
            { name: "isActive", label: "Activo", type: "switch" },
          ]}
        />
      )
    },
    {
      key: "schedules",
      label: "Horarios",
      children: (
        <AdminTable 
          title='Horarios'
          endpoint='schedules'
          columns={[
            { title: "ID", dataIndex: "id" },
            { 
              title: "Ruta", 
              dataIndex: ["route", "name"], 
              render: (val: string) => val || '-',
              sorter: (a: any, b: any) => 
                (a.route?.name || '').localeCompare(b.route?.name || ''), 
              showSorterTooltip: false 
            },
            { 
              title: "Salida", 
              dataIndex: "departureTime", 
              sorter: (a: any, b: any) => a.departureTime.localeCompare(b.departureTime), 
              showSorterTooltip: false 
            },
            { 
              title: "Llegada", 
              dataIndex: "arrivalTime", 
              sorter: (a: any, b: any) => a.arrivalTime.localeCompare(b.arrivalTime), 
              showSorterTooltip: false 
            },
            { 
              title: "Días", 
              dataIndex: "daysOfWeek", 
              render: (days: DayOfWeek[]) => days?.length || 0 
            },
            { 
              title: "Activo", 
              dataIndex: "isActive", 
              render: (val: boolean) => val ? 
                <CheckOutlined style={{ color: 'green' }} /> : 
                <CloseOutlined style={{ color: 'red' }} /> 
            },
          ]}
          formFields={[
            { name: "routeId", label: "Ruta", type: "select", options: routesOptions, rules: { required: true } },
            { name: "departureTime", label: "Hora de salida", type: "time", rules: { required: true } },
            { name: "arrivalTime", label: "Hora de llegada", type: "time", rules: { required: true } },
            { name: "daysOfWeek", label: "Días de la semana", type: "multiselect", options: daysOfWeekOptions, rules: { required: true } },
            { name: "isActive", label: "Activo", type: "switch" },
          ]}
        />
      )
    },
    {
      key: "users",
      label: "Usuarios",
      children: (
        <AdminTable 
          title='Usuarios'
          endpoint='users'
          columns={[
            { title: "ID", dataIndex: "id" },
            { 
              title: "Nombre", 
              dataIndex: "name", 
              sorter: (a: any, b: any) => a.name.localeCompare(b.name), 
              showSorterTooltip: false 
            },
            { 
              title: "Email", 
              dataIndex: "email", 
              sorter: (a: any, b: any) => a.email.localeCompare(b.email), 
              showSorterTooltip: false 
            },
            { 
              title: "Rol", 
              dataIndex: "role", 
              sorter: (a: any, b: any) => a.role.localeCompare(b.role), 
              showSorterTooltip: false 
            },
          ]}
          formFields={[
            { name: "name", label: "Nombre completo", rules: { required: true } },
            { name: "email", label: "Email", type: "email", rules: { required: true } },
            { name: "phone", label: "Teléfono" },
            { name: "role", label: "Rol", type: "select", options: rolesOptions, rules: { required: true } },
          ]}
        />
      )
    },
  ];

  return (
    <main className="w-full max-w-5xl mx-auto px-2 sm:px-6 py-8 pt-12 flex flex-col gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary-text text-center mt-2 mb-4">
        Panel de Administración
      </h1>
      {isLoading ? (
        <div className="w-full flex justify-center items-center py-12">
          <FadeLoader color="#0c5392" loading={isLoading} />
        </div>
      ) : (
        <div className="w-full">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={items}
            type="card"
            tabBarGutter={16}
            className="bg-background rounded-lg shadow-md px-1 w-full"
            style={{overflowX:'auto', minWidth: '350px', width: '100%'}}
          />
        </div>
      )}
    </main>
  );
};

export default Admin;