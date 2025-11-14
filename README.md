# TucuBus Frontend

Aplicación web para consultar horarios de colectivos interurbanos de Tucumán con interfaz intuitiva y responsive.

## Tecnologías

- **React 18** + **Vite**: Framework y bundler
- **React Router DOM**: Navegación entre páginas
- **Ant Design**: Librería de componentes UI
- **React Hook Form**: Manejo de formularios
- **Axios**: Cliente HTTP para API
- **Tailwind CSS**: Estilos y diseño responsive
- **Day.js**: Manipulación de fechas/horas
- **React Hot Toast**: Notificaciones

## Estructura del Proyecto

```
src/
├── components/
│   ├── common/           # Componentes reutilizables
│   │   ├── AdminTable.jsx    # Tabla CRUD genérica
│   │   ├── Sidebar.jsx       # Menú lateral
│   │   └── Footer.jsx
│   ├── pages/            # Páginas principales
│   │   ├── Home.jsx          # Búsqueda de horarios
│   │   ├── Admin.jsx         # Panel administrativo
│   │   ├── Login.jsx         # Autenticación
│   │   ├── Help.jsx          # Ayuda
│   │   └── Contact.jsx       # Contacto
│   ├── home/
│   │   └── ResultadosHorarios.jsx  # Muestra resultados
│   └── routes/           # Rutas protegidas
├── hooks/
│   ├── useCrud.js        # Hook genérico CRUD
│   └── useHorarios.js    # Hook búsqueda de horarios
├── services/
│   ├── api.js            # Configuración Axios
│   └── auth.js           # Servicios de autenticación
└── utils/
    ├── validation.js     # Validaciones de formularios
    └── adminPanelOptions.js
```

## Funcionalidades Principales

### Usuario Final
- **Búsqueda de horarios**: Por origen, destino, día y hora
- **Viajes directos**: Lista de colectivos sin transbordo
- **Conexiones**: Rutas con transbordo optimizadas
- **Responsive**: Optimizado para móvil y escritorio
- **Validaciones en tiempo real**: Feedback inmediato en formularios

### Administrador
- **Panel CRUD completo**: Gestión de líneas, recorridos, horarios y usuarios
- **Validaciones avanzadas**: 
  - Horarios (duración 5min-10h, detección de paso de medianoche)
  - Recorridos (origen ≠ destino, sin duplicados)
  - Líneas (nombre válido)
- **Vista adaptativa**: Tablas responsivas con cards en móvil
- **Feedback visual**: Alertas en tiempo real durante edición

## Instalación y Configuración

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (.env)
VITE_API_BASE_URL=http://localhost:8000  # URL del backend

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## Autenticación

Sistema JWT con dos roles:
- **Usuario**: Acceso a búsqueda de horarios (registro público)
- **Administrador**: Acceso completo al panel CRUD

Token almacenado en `sessionStorage` con interceptor Axios que lo incluye automáticamente en requests.

## Componentes Destacados

### AdminTable
Tabla CRUD genérica y reutilizable que acepta:
- Configuración de columnas
- Campos de formulario dinámicos
- Validaciones personalizadas
- Vista adaptativa móvil/escritorio

### ResultadosHorarios
Muestra resultados de búsqueda con:
- Horarios directos ordenados
- Conexiones con detalle de transbordos
- Cálculo automático de duraciones
- Indicadores visuales (tags, iconos)

## Responsive Design

- **Mobile-first**: Cards y formularios optimizados para pantallas pequeñas
- **Breakpoints**: Adaptación automática a tablets y desktop
- **React Responsive**: Hook `useMediaQuery` para lógica condicional
- **Tailwind**: Clases utilitarias para diseño fluido

## Validaciones Frontend

Sistema de validación dual:
1. **React Hook Form**: Validación de campos requeridos
2. **Validaciones custom** (`validation.js`):
   - Formato de hora (HH:mm)
   - Duración de viajes
   - Origen ≠ Destino
   - Longitud de strings

## Integración con Backend

- **Axios interceptor**: Inyección automática de JWT
- **Manejo de errores**: Captura y display de mensajes del backend
- **Toast notifications**: Feedback visual de operaciones
- **Loading states**: Spinners durante requests

## Paleta de Colores (Tailwind)

```javascript
colors: {
  'brand': '#0c5392',         // Azul principal
  'primary-text': '#2c3e50',  // Texto oscuro
  'secondary-text': '#7f8c8d', // Texto secundario
  'background': '#ecf0f1'     // Fondo claro
}
```

## Estados de la Aplicación

- **Loading**: Spinners personalizados (FadeLoader)
- **Error**: Alertas con mensajes descriptivos
- **Success**: Toast notifications
- **Empty**: Estados vacíos con ilustraciones

## Rutas

- `/` - Búsqueda de horarios (público)
- `/ayuda` - Guía de uso (público)
- `/contacto` - Formulario de contacto (público)
- `/login` - Autenticación (público)
- `/admin` - Panel administrativo (protegido)

## Build y Deploy

```bash
# Build optimizado
npm run build

# Preview del build
npm run preview
```

Deploy configurado para **Vercel** con variables de entorno en el dashboard.

## Hooks Personalizados

- **useCrud**: CRUD genérico para cualquier endpoint
- **useHorarios**: Búsqueda de horarios directos y conexiones

## ⚠️ Consideraciones

- Sesión en `sessionStorage` (se pierde al cerrar pestaña)
- Sin refresh token (por simplicidad)
- Validaciones duplicadas (frontend + backend) para UX y seguridad