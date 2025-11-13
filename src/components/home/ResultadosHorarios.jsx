import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { List, Card, Empty, Alert, Tag } from "antd";
import { FadeLoader } from "react-spinners";
import { ClockCircleOutlined, EnvironmentOutlined, SwapOutlined } from "@ant-design/icons";
import { useHorarios } from "../../hooks/useHorarios";
import { calculateTripDuration, formatDuration } from "../../utils/validation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const ResultadosHorarios = ({ searchData }) => {
  const [resultados, setResultados] = useState([]);
  const { loading, error, getHorariosDirectos } = useHorarios();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    if (searchData) {
      buscarHorarios();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData]);

  const buscarHorarios = async () => {
    try {
      const { origin, destiny, day, option, time } = searchData;

      // Determinar hora_actual según la opción
      let hora_actual = "00:00";
      
      if (option === "salir-ahora") {
        // Usar hora actual del sistema
        const now = new Date();
        hora_actual = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      } else if (option === "salir-a-la" || option === "llegar-a-la") {
        hora_actual = time || "00:00";
      } else if (option === "ultimo-disponible") {
        hora_actual = "23:59";
      }

      // Normalizar tipo_dia para que coincida con el backend
      let tipo_dia_normalizado = '';
      if (day === 'Hábil') {
        tipo_dia_normalizado = 'habil'; // Backend espera 'habil' (minúscula sin acento)
      } else if (day === 'Sábado') {
        tipo_dia_normalizado = 'sábado'; // Backend espera 'sábado' (minúscula con acento)
      } else if (day === 'Domingo') {
        tipo_dia_normalizado = 'domingo'; // Backend espera 'domingo'
      }

      console.log('Parámetros de búsqueda:', {
        origen: origin,
        destino: destiny,
        tipo_dia: tipo_dia_normalizado,
        hora_actual: hora_actual,
      });

      const data = await getHorariosDirectos({
        origen: origin,
        destino: destiny,
        tipo_dia: tipo_dia_normalizado,
        hora_actual: hora_actual,
      });

      // Procesar y ordenar resultados
      let procesados = data.map(horario => ({
        ...horario,
        duracion: calculateTripDuration(horario.hora_salida, horario.hora_llegada),
      }));

      // Ordenar según la opción seleccionada
      if (option === "ultimo-disponible") {
        procesados = procesados.sort((a, b) => 
          b.hora_salida.localeCompare(a.hora_salida)
        );
      } else if (option === "llegar-a-la") {
        procesados = procesados.sort((a, b) => 
          a.hora_llegada.localeCompare(b.hora_llegada)
        );
      } else {
        // Por defecto ordenar por hora de salida
        procesados = procesados.sort((a, b) => 
          a.hora_salida.localeCompare(b.hora_salida)
        );
      }

      setResultados(procesados);
    } catch (err) {
      console.error("Error al buscar horarios:", err);
    }
  };

  const renderDesktopItem = (item) => (
    <List.Item>
      <Card 
        className="w-full hover:shadow-lg transition-shadow border-0"
        variant="borderless"
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <EnvironmentOutlined className="text-blue-600" />
              <span className="font-semibold text-lg">
                {searchData.origin}
              </span>
              <FontAwesomeIcon className="text-gray-600" icon={faArrowRight} />
              <span className="font-semibold text-lg">
                {searchData.destiny}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <ClockCircleOutlined />
                <span>Salida: <strong>{item.hora_salida}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <ClockCircleOutlined />
                <span>Llegada: <strong>{item.hora_llegada}</strong></span>
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
              {formatDuration(item.duracion)}
            </span>
          </div>
        </div>
      </Card>
    </List.Item>
  );

  const renderMobileItem = (item) => (
    <List.Item>
      <Card 
        className="w-full"
        bordered={true}
        size="small"
      >
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex-1 text-nowrap">
              <div className="flex items-center gap-1 text-sm">
                <EnvironmentOutlined className="text-blue-600" />
                <span className="font-semibold">{searchData.origin}</span>
              </div>
              <div className="flex items-center gap-1 text-sm mt-1">
                <FontAwesomeIcon className="text-gray-600" icon={faArrowRight} />
                <span className="font-semibold">{searchData.destiny}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Tag color="blue" className="text-xs">
                {item.linea_nombre || 'Sin línea'}
              </Tag>
              {item.directo && (
                <Tag color="green" className="text-xs">Directo</Tag>
              )}
            </div>
          </div>

          <div className="border-t pt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Salida:</span>
              <span className="font-semibold">{item.hora_salida}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Llegada:</span>
              <span className="font-semibold">{item.hora_llegada}</span>
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

  if (!searchData) return null;

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <FadeLoader color="#0c5392" loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error al buscar horarios"
        description={error}
        type="error"
        showIcon
        className="max-w-3xl mx-auto"
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
          {searchData.origin} <FontAwesomeIcon className="text-gray-400 fa-xs" icon={faArrowRight} /> {searchData.destiny} • {searchData.day}
          {searchData.time && ` • ${searchData.time}`}
        </p>
      </div>

      {resultados.length === 0 ? (
        <Empty
          description="No se encontraron horarios para esta búsqueda"
          className="py-12"
        />
      ) : (
        <List
          dataSource={resultados}
          renderItem={isMobile ? renderMobileItem : renderDesktopItem}
          className="bg-white rounded-lg shadow-sm"
          pagination={resultados.length > 10 ? {
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `Total: ${total} horarios`,
          } : false}
        />
      )}
    </div>
  );
};

export default ResultadosHorarios;