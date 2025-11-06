import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import logo from "../../assets/img/logo.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  // Mapeo de rutas a keys del menú
  const getSelectedKey = () => {
    switch (location.pathname) {
      case '/':
        return '1';
      case '/ayuda':
        return '2';
      case '/contacto':
        return '3';
      case '/login':
        return '4';
      default:
        return '1';
    }
  };

  const [selectedKey, setSelectedKey] = useState(getSelectedKey());

  // Actualizar selectedKey cuando cambie la ruta
  useEffect(() => {
    setSelectedKey(getSelectedKey(location.pathname));
  }, [location.pathname]);

  // Menu items sin "Ingresar"
  const mainItems = [
    { key: '1', label: <NavLink to="/">Inicio</NavLink> },
    { key: '2', label: <NavLink to="/ayuda">Ayuda</NavLink> },
    { key: '3', label: <NavLink to="/contacto">Contacto</NavLink> },
    { type: 'divider' },
  ];
  // "Ingresar" va siempre abajo
  const ingresarItem = [{ key: '4', label: <NavLink to="/login">Ingresar</NavLink> }];

  return (
    <>
      {/* Botón burger hamburguesa solo en mobile */}
      {!open && (
        <button
          className="fixed top-4 left-4 z-50 bg-white/90 border border-gray-200 rounded-md shadow-md p-2 lg:hidden"
          aria-label="Abrir menú"
          onClick={() => setOpen(true)}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
      )}

      {/* Overlay + Drawer sidebar mobile */}
      <div className={`fixed inset-0 z-40 flex lg:hidden pointer-events-none${open ? "" : "invisible"}`}>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ease-in-out pointer-events-auto${open ? " opacity-100" : " opacity-0"}`}
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
        {/* Panel deslizante */}
        <div
          className={`relative h-full w-64 bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out pointer-events-auto ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Header con logo y botón cerrar (Xmark oculto en desktop) */}
          <div className="flex items-center justify-between px-4 py-6">
            <NavLink to='/'>
              <img src={logo} alt="Logo" className="w-32 h-auto" />
            </NavLink>
            <button
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Menu
              onClick={({key}) => setSelectedKey(key)}
              selectedKeys={[selectedKey]}
              mode="inline"
              items={[...mainItems]}
              className="border-0"
            />
          </div>
          <div className="pb-2 px-4">
            <Menu
              onClick={({key}) => setSelectedKey(key)}
              selectedKeys={[selectedKey]}
              mode="inline"
              items={ingresarItem}
              className="border-0"
            />
          </div>
        </div>
      </div>

      {/* Sidebar fija desktop */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:h-screen bg-white border-r border-gray-200 shadow-sm z-30">
        <div className="flex justify-center py-6">
          <NavLink to='/'>
            <img src={logo} alt="Logo" className="w-40 h-auto" />
          </NavLink>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Menu
            onClick={({key}) => setSelectedKey(key)}
            selectedKeys={[selectedKey]}
            mode="inline"
            items={[...mainItems]}
            className="border-0"
          />
        </div>
        <div className="pb-2 px-4">
          <Menu
            onClick={({key}) => setSelectedKey(key)}
            selectedKeys={[selectedKey]}
            mode="inline"
            items={ingresarItem}
            className="border-0"
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;