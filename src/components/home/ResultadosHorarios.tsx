import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { List, Card, Empty, Alert, Tag, Divider, Row, Col } from 'antd';
import { FadeLoader } from 'react-spinners';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
  NodeIndexOutlined,
  LineOutlined,
} from '@ant-design/icons';
import { calculateDuration, formatDuration } from '../../utils/validation';
import toast from 'react-hot-toast';
import {
  Connection,
  ProcessedSchedule,
  ScheduleWithRoute,
  SearchData,
} from '@/types';
import { DayOfWeek, Stop } from '@/types/models';
import { useSchedules } from '@/hooks/useSchedules';
import api from '@/services/api';

interface ResultadosHorariosProps {
  searchData: SearchData;
}

const ResultadosHorarios: React.FC<ResultadosHorariosProps> = ({
  searchData,
}) => {
  const [resultados, setResultados] = useState<ProcessedSchedule[]>([]);
  const [conexiones, setConexiones] = useState<Connection[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [stops, setStops] = useState<Stop[]>([]);

  const {
    loading: loadingHook,
    error: errorHook,
    getDirectSchedules,
    findConnections,
  } = useSchedules();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const loading = loadingSearch || loadingHook;

  useEffect(() => {
    const loadStops = async () => {
      try {
        const response = await api.get<Stop[]>('/stops');
        setStops(response.data);
      } catch (error) {
        console.error('Error al cargar paradas:', error);
      }
    };
    loadStops();
  }, []);

  const getStopName = (stopId: string): string => {
    const stop = stops.find((s) => s.id === stopId);
    return stop?.name || stopId;
  };

  const procesarSchedules = (
    schedules: ScheduleWithRoute[],
    originId: string,
    destinyId: string,
  ): ProcessedSchedule[] => {
    return schedules
      .map((schedule) => ({
        ...schedule,
        duracion: calculateDuration(
          schedule.departureTime,
          schedule.arrivalTime,
        ),
        key: schedule.id,
        // Campos mapeados para compatibilidad con UI existente
        origen: getStopName(originId),
        destino: getStopName(destinyId),
        hora_salida: schedule.departureTime,
        hora_llegada: schedule.arrivalTime,
        linea_nombre:
          schedule.route?.company?.name || schedule.route?.name || 'Sin línea',
        directo: true,
      }))
      .sort((a, b) => a.hora_salida.localeCompare(b.hora_salida));
  };

  const getDayOfWeek = (day: string): DayOfWeek | DayOfWeek[] => {
    switch (day) {
      case 'Hábil':
        // Retornar TODOS los días hábiles
        return [
          DayOfWeek.MONDAY,
          DayOfWeek.TUESDAY,
          DayOfWeek.WEDNESDAY,
          DayOfWeek.THURSDAY,
          DayOfWeek.FRIDAY,
        ];
      case 'Sábado':
        return DayOfWeek.SATURDAY;
      case 'Domingo':
        return DayOfWeek.SUNDAY;
      default:
        return DayOfWeek.MONDAY;
    }
  };

  const getCurrentTime = (option: string, time?: string): string => {
    if (option === 'salir-ahora') {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    } else if ((option === 'salir-a-la' || option === 'llegar-a-la') && time) {
      return time;
    }
    return '00:00';
  };

  const buscarHorarios = async () => {
    if (!searchData) return;

    setLoadingSearch(true);
    setResultados([]);
    setConexiones([]);

    try {
      const { origin, destiny, day, option, time } = searchData;
      const dayOfWeek = getDayOfWeek(day);
      const currentTime = getCurrentTime(option, time);

      // Si es día hábil (array de días), buscar en todos
      const daysToSearch = Array.isArray(dayOfWeek) ? dayOfWeek : [dayOfWeek];

      let allDirectSchedules: ScheduleWithRoute[] = [];
      let allConnections: Connection[] = [];

      // Buscar en cada día
      for (const currentDay of daysToSearch) {
        // 1. Buscar horarios directos
        try {
          const directos = await getDirectSchedules({
            originStopId: origin,
            destinationStopId: destiny,
            day: currentDay,
            currentTime: currentTime,
          });

          allDirectSchedules = [...allDirectSchedules, ...directos];
        } catch (error) {
          console.log(`No se encontraron viajes directos para ${currentDay}`);
        }

        // 2. Buscar conexiones
        try {
          const conexionesData = await findConnections({
            originStopId: origin,
            destinationStopId: destiny,
            day: currentDay,
            currentTime: currentTime,
            maxWaitTime: 60,
          });

          allConnections = [...allConnections, ...conexionesData];
        } catch (error) {
          console.log(`No se encontraron conexiones para ${currentDay}`);
        }
      }

      // Procesar y ordenar resultados
      if (allDirectSchedules.length > 0) {
        const procesados = procesarSchedules(
          allDirectSchedules,
          origin,
          destiny,
        );
        setResultados(procesados);
        toast.success(`Se encontraron ${procesados.length} viajes directos.`);
      }

      if (allConnections.length > 0) {
        // Ordenar conexiones por duración total
        const sortedConnections = allConnections.sort(
          (a, b) => a.totalDuration - b.totalDuration,
        );
        setConexiones(sortedConnections);
        toast(
          `Se encontraron ${sortedConnections.length} opciones con conexión.`,
        );
      }

      if (allDirectSchedules.length === 0 && allConnections.length === 0) {
        toast.error('No se encontraron viajes directos ni con conexión.');
      }
    } catch (err) {
      console.error('Error general en buscarHorarios:', err);
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    if (searchData && stops.length > 0) {
      buscarHorarios();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData, stops]);

  const renderDesktopItem = (item: ProcessedSchedule) => (
    <List.Item>
      <Card
        className="w-full hover:shadow-lg transition-shadow border-0"
        variant="borderless"
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 text-xl font-bold">
              <span className="text-primary-text">{item.hora_salida}</span>
              <LineOutlined className="text-gray-400 text-sm" />
              <span className="text-secondary-text">{item.hora_llegada}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <EnvironmentOutlined className="text-blue-600" />
                <span>
                  Origen: <strong>{item.origen}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <EnvironmentOutlined className="text-red-500" />
                <span>
                  Destino: <strong>{item.destino}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Tag color="blue" className="text-sm">
              {item.linea_nombre || 'Sin línea'}
            </Tag>
            {item.directo && <Tag color="green">Directo</Tag>}
            <span className="text-sm text-gray-500">
              Duración: {formatDuration(item.duracion)}
            </span>
          </div>
        </div>
      </Card>
    </List.Item>
  );

  const renderMobileItem = (item: ProcessedSchedule) => (
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
              <Tag color="blue" className="text-xs">
                {item.linea_nombre || 'Sin línea'}
              </Tag>
              {item.directo && (
                <Tag color="green" className="text-xs">
                  Directo
                </Tag>
              )}
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
              <span className="font-semibold">
                {formatDuration(item.duracion)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </List.Item>
  );

  // --- Renderizado de Conexiones ---
  const renderConexionItem = (item: Connection) => {
    const originName = getStopName(searchData.origin);
    const destinyName = getStopName(searchData.destiny);
    const transferName = item.transferStop.name;

    return (
      <List.Item>
        <Card
          className="w-full border-dashed border-2 border-gray-300 bg-gray-50 hover:shadow-lg transition-shadow"
          size={isMobile ? 'small' : 'default'}
        >
          <Row gutter={[16, 8]} align="middle">
            {/* 1. Hora de Salida y Llegada Final */}
            <Col xs={24} sm={8} className="text-center sm:text-left">
              <p className="font-bold text-lg text-primary-text">
                <ClockCircleOutlined className="mr-1" />
                Sale: {item.firstLeg.departureTime}
              </p>
              <p className="font-bold text-lg text-green-600">
                <ClockCircleOutlined className="mr-1" />
                Llega: {item.secondLeg.arrivalTime}
              </p>
            </Col>

            {/* 2. Información del Tramo 1 */}
            <Col xs={24} sm={8}>
              <div className="border-l pl-3">
                <p className="font-semibold text-sm">
                  Tramo 1 (
                  {item.firstLeg.route?.company?.name ||
                    item.firstLeg.route?.name ||
                    '-'}
                  )
                </p>
                <p className="text-xs text-gray-600">
                  {originName} → {transferName}
                </p>
                <p className="text-xs text-gray-600">
                  Salida: {item.firstLeg.departureTime} | Llegada:{' '}
                  {item.firstLeg.arrivalTime}
                </p>
              </div>
            </Col>

            {/* 3. Información del Tramo 2 y Espera */}
            <Col xs={24} sm={8}>
              <div className="border-l pl-3">
                <p className="font-semibold text-sm">
                  Tramo 2 (
                  {item.secondLeg.route?.company?.name ||
                    item.secondLeg.route?.name ||
                    '-'}
                  )
                </p>
                <p className="text-xs font-semibold text-orange-600 mb-1">
                  <NodeIndexOutlined /> Espera en {transferName}:{' '}
                  {formatDuration(item.waitTime)}
                </p>
                <p className="text-xs text-gray-600">
                  {transferName} → {destinyName}
                </p>
                <p className="text-xs text-gray-600">
                  Salida: {item.secondLeg.departureTime} | Llegada:{' '}
                  {item.secondLeg.arrivalTime}
                </p>
              </div>
            </Col>
          </Row>
        </Card>
      </List.Item>
    );
  };

  if (!searchData) return null;

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <FadeLoader color="#0c5392" loading={loading} />
      </div>
    );
  }

  if (errorHook && resultados.length === 0 && conexiones.length === 0) {
    return (
      <Alert
        message="Error de búsqueda"
        description={errorHook}
        type="error"
        showIcon
        className="max-w-3xl mx-auto"
      />
    );
  }

  if (resultados.length === 0 && conexiones.length === 0) {
    return (
      <Empty
        description="No se encontraron horarios ni conexiones para esta búsqueda."
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
          {searchData.origin} <ArrowRightOutlined /> {searchData.destiny} •{' '}
          {searchData.day}
          {searchData.time && ` • ${searchData.time}`}
        </p>
      </div>

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

      {resultados.length > 0 && conexiones.length > 0 && <Divider />}

      {conexiones.length > 0 && (
        <>
          <h3 className="text-xl font-bold text-primary-text mb-4 mt-8 text-center sm:text-left">
            Conexiones Disponibles ({conexiones.length})
          </h3>
          <List
            dataSource={conexiones}
            renderItem={renderConexionItem}
            className="bg-white rounded-lg shadow-sm"
            pagination={
              conexiones.length > 10
                ? {
                    pageSize: 10,
                    showSizeChanger: false,
                    showTotal: (total) => `Total: ${total} conexiones`,
                  }
                : false
            }
          />
        </>
      )}
    </div>
  );
};

export default ResultadosHorarios;
