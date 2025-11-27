import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { List, Card, Empty, Alert, Tag, Divider, Row, Col } from "antd";
import { FadeLoader } from "react-spinners"; 
import { 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  ArrowRightOutlined, 
  NodeIndexOutlined, // Icono para Conexión
  LineOutlined // Icono para tramo directo
} from "@ant-design/icons";
import { useHorarios } from "../../hooks/useHorarios";
import { calculateTripDuration, formatDuration } from "../../utils/validation";
import toast from "react-hot-toast";

const ResultadosHorarios = ({ searchData }) => {
  const [resultados, setResultados] = useState([]); // Horarios directos
  const [conexiones, setConexiones] = useState([]); // Horarios con conexión
  const [loadingSearch, setLoadingSearch] = useState(false); // Loader local para el componente
  
  // Importamos getConexiones (ahora optimizado)
  const { loading: loadingHook, error: errorHook, getHorariosDirectos, getConexiones } = useHorarios(); 
  
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const loading = loadingSearch || loadingHook; // Usamos un loading combinado

  // Función para estandarizar y ordenar horarios
  const procesarHorarios = (data) => {
    let procesados = data.map(horario => ({
      ...horario,
      duracion: calculateTripDuration(horario.hora_salida, horario.hora_llegada),
      key: horario.id // Clave única para renderizado
    }));

    // Ordenar por hora de salida (por defecto, o para 'Salir ahora', 'Salir a la(s)')
    procesados = procesados.sort((a, b) => a.hora_salida.localeCompare(b.hora_salida));

    // Si tu lógica de 'ultimo-disponible' necesita orden inverso, iría aquí.

    return procesados;
  };
  
  const buscarHorarios = async () => {
    setLoadingSearch(true);
    setResultados([]);
    setConexiones([]);
    
    try {
      const { origin, destiny, day, option, time } = searchData;

      // ⬅️ CORRECCIÓN para el error 422: Estandarización a literales del Backend
      const diasMap = { 'Hábil': 'habil', 'Sábado': 'sábado', 'Domingo': 'domingo' };
      const tipo_dia_normalizado = diasMap[day] || '';

      
      // Lógica para determinar hora_actual
      let hora_actual = "00:00";
      if (option === "salir-ahora") {
        const now = new Date();
        hora_actual = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      } else if (option === "salir-a-la" || option === "llegar-a-la") {
        hora_actual = time || "00:00";
      } else if (option === "ultimo-disponible") {
        // Podríamos usar 23:59 o un valor específico para que el backend lo maneje
        hora_actual = "00:00"; // Permitimos buscar todo el día y el backend puede ordenar/filtrar
      }

      // --- 1. INTENTAR BÚSQUEDA DIRECTA ---
      try {
        const directos = await getHorariosDirectos({
          origen: origin,
          destino: destiny,
          tipo_dia: tipo_dia_normalizado,
          hora_actual: hora_actual,
        });
        setResultados(procesarHorarios(directos, option));
        if (directos.length > 0) {
          toast.success(`Se encontraron ${directos.length} viajes directos.`);
        }

      } catch{
        // Asumimos que si falla, es porque no hay directos o ya pasaron todos (Error 404).
        
        // --- 2. BUSCAR CONEXIONES ---
        try {
            const conexionesData = await getConexiones({
                origen: origin,
                destino: destiny,
                tipo_dia: tipo_dia_normalizado,
                hora_actual: hora_actual,
            });
            setConexiones(conexionesData.map((c, index) => ({...c, key: index})));

            if (conexionesData.length > 0) {
              toast(`Se encontraron ${conexionesData.length} opciones con conexión.`);
            } else {
              // Si no hay directos ni conexiones
              toast.error("No se encontraron viajes directos ni con conexión.");
            }

        } catch{
             // Si las conexiones también fallan, el error se maneja por el hook
             if (!errorHook) { // Solo si el hook no está mostrando un error global
                toast.error("No se encontraron viajes directos ni con conexión.");
            }
          
        }
      }
    } catch (err) {
      // El hook ya maneja errores de red, si llegamos aquí es un error inesperado.
      console.error("Error general en buscarHorarios:", err);
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    if (searchData) {
      buscarHorarios();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData]);


  // --- Renderizado de Horarios Directos ---
  const renderDesktopItem = (item) => (
    <List.Item>
      <Card 
        className="w-full hover:shadow-lg transition-shadow border-0"
        variant="borderless"
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 text-xl font-bold">
              <span className="text-primary-text">
                {item.hora_salida}
              </span>
              <LineOutlined className="text-gray-400 text-sm" />
              <span className="text-secondary-text">
                {item.hora_llegada}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <EnvironmentOutlined className="text-blue-600" />
                <span>Origen: <strong>{item.origen}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <EnvironmentOutlined className="text-red-500" />
                <span>Destino: <strong>{item.destino}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Tag color="blue" className="text-sm">
              {item.linea_nombre || 'Sin línea'}
            </Tag>
            {item.directo && (
              <Tag color="green">Directo</Tag>
            )}
            <span className="text-sm text-gray-500">
              Duración: {formatDuration(item.duracion)}
            </span>
          </div>
        </div>
      </Card>
    </List.Item>
  );

  const renderMobileItem = (item) => (
    <List.Item>
      <Card className="w-full" bordered={true} size="small">
        <div className="space-y-2">
          <div className="flex justify-between items-start border-b pb-2">
            <div className="flex items-center gap-2 text-xl font-bold">
              <span className="text-primary-text">{item.hora_salida}</span>
              <ArrowRightOutlined className="text-gray-400 text-sm" />
              <span className="text-secondary-text">{item.hora_llegada}</span>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <Tag color="blue" className="text-xs">{item.linea_nombre || 'Sin línea'}</Tag>
              {item.directo && (<Tag color="green" className="text-xs">Directo</Tag>)}
            </div>
          </div>

          <div className="pt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Origen:</span>
              <span className="font-semibold">{item.origen}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Destino:</span>
              <span className="font-semibold">{item.destino}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duración:</span>
              <span className="font-semibold">{formatDuration(item.duracion)}</span>
            </div>
          </div>
        </div>
      </Card>
    </List.Item>
  );

  // --- Renderizado de Conexiones ---
  const renderConexionItem = (item) => (
    <List.Item>
        <Card 
            className="w-full border-dashed border-2 border-gray-300 bg-gray-50 hover:shadow-lg transition-shadow"
            size={isMobile ? "small" : "default"}
        >
            <Row gutter={[16, 8]} align="middle">
                {/* 1. Hora de Salida y Llegada Final */}
                <Col xs={24} sm={8} className="text-center sm:text-left">
                    <p className="font-bold text-lg text-primary-text">
                        <ClockCircleOutlined className="mr-1" />
                        Sale: {item.tramo_a_salida}
                    </p>
                    <p className="font-bold text-lg text-green-600">
                        <ClockCircleOutlined className="mr-1" />
                        Llega: {item.tramo_b_llegada}
                    </p>
                </Col>

                {/* 2. Información del Tramo 1 */}
                <Col xs={24} sm={8}>
                    <div className="border-l pl-3">
                        <p className="font-semibold text-sm">Tramo 1 ({item.linea_a_nombre || '-'})</p>
                        <p className="text-xs text-gray-600">
                            {searchData.origin} → {item.ciudad_conexion}
                        </p>
                        <p className="text-xs text-gray-600">
                            Salida: {item.tramo_a_salida} | Llegada: {item.tramo_a_llegada}
                        </p>
                    </div>
                </Col>

                {/* 3. Información del Tramo 2 y Espera */}
                <Col xs={24} sm={8}>
                    <div className="border-l pl-3">
                        <p className="font-semibold text-sm">Tramo 2 ({item.linea_b_nombre || '-'})</p>
                        <p className="text-xs font-semibold text-orange-600 mb-1">
                            <NodeIndexOutlined /> Espera en {item.ciudad_conexion}: {formatDuration(item.tiempo_espera_min)}
                        </p>
                        <p className="text-xs text-gray-600">
                            {item.ciudad_conexion} → {searchData.destiny}
                        </p>
                        <p className="text-xs text-gray-600">
                            Salida: {item.tramo_b_salida} | Llegada: {item.tramo_b_llegada}
                        </p>
                    </div>
                </Col>
            </Row>
        </Card>
    </List.Item>
  );

  if (!searchData) return null;

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <FadeLoader color="#0c5392" loading={loading} />
      </div>
    );
  }

  // Si hay error global del hook (ej. error de red)
  if (errorHook && resultados.length === 0 && conexiones.length === 0) {
    return (
      <Alert
        message="Error de combinación"
        description={errorHook}
        type="error"
        showIcon
        className="max-w-3xl mx-auto"
      />
    );
  }
  
  // Si no hay resultados de ningún tipo
  if (resultados.length === 0 && conexiones.length === 0) {
    return (
      <Empty
        description="No se encontraron horarios ni conexiones para esta búsqueda"
        className="py-12"
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-primary-text text-center mb-2">
          Resultados de búsqueda
        </h2>
        <p className="text-center text-secondary-text">
          {searchData.origin} <ArrowRightOutlined /> {searchData.destiny} • {searchData.day}
          {searchData.time && ` • ${searchData.time}`}
        </p>
      </div>

      {/* --- RESULTADOS DIRECTOS --- */}
      {resultados.length > 0 && (
          <>
              <h3 className="text-xl font-bold text-primary-text mb-4 mt-8 text-center sm:text-left">
                  Viajes Directos ({resultados.length})
              </h3>
              <List
                  dataSource={resultados}
                  renderItem={isMobile ? renderMobileItem : renderDesktopItem}
                  className="bg-white rounded-lg shadow-sm"
                  pagination={false}
              />
          </>
      )}

      {(resultados.length > 0 && conexiones.length > 0) && <Divider />}

      {/* --- CONEXIONES --- */}
      {conexiones.length > 0 && (
          <>
              <h3 className="text-xl font-bold text-primary-text mb-4 mt-8 text-center sm:text-left">
                Conexiones Disponibles ({conexiones.length})
              </h3>
              <List
                  dataSource={conexiones}
                  renderItem={renderConexionItem}
                  className="bg-white rounded-lg shadow-sm"
                  pagination={conexiones.length > 10 ? {
                    pageSize: 10,
                    showSizeChanger: false,
                    showTotal: (total) => `Total: ${total} conexiones`,
                  } : false}
              />
          </>
      )}
    </div>
  );
};

export default ResultadosHorarios;