import { useState } from 'react';
import api from '../services/api';
import {
  Connection,
  ConnectionParams,
  DayOfWeek,
  DirectScheduleParams,
  Route,
  Schedule,
  ScheduleFilters,
  ScheduleWithRoute,
  Stop,
  UseSchedulesReturn,
} from '@/types';
import { addMinutes, calculateDuration } from '@/utils/validation';

export const useSchedules = (): UseSchedulesReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllSchedules = async (
    filters?: ScheduleFilters,
  ): Promise<Schedule[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get<Schedule[]>('/schedules', {
        params: filters,
      });

      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error al buscar horarios';
      setError(errorMessage);
      console.error('Error al obtener horarios:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getSchedulesByRoute = async (routeId: string): Promise<Schedule[]> => {
    return getAllSchedules({ routeId });
  };

  const getSchedulesByDay = async (day: DayOfWeek): Promise<Schedule[]> => {
    return getAllSchedules({ day });
  };

  const getDirectSchedules = async ({
    originStopId,
    destinationStopId,
    day,
    currentTime = '00:00',
  }: DirectScheduleParams): Promise<ScheduleWithRoute[]> => {
    try {
      setLoading(true);
      setError(null);

      // Obtener todos los schedules del día (o todos si no se especifica)
      const schedules = await getAllSchedules(day ? { day } : undefined);

      // Obtener información de rutas para filtrar
      const routesResponse = await api.get<Route[]>('/routes');
      const routes = routesResponse.data;

      // Filtrar schedules que conectan origen y destino
      const directSchedules: ScheduleWithRoute[] = [];

      for (const schedule of schedules) {
        const route = routes.find((r) => r.id === schedule.routeId);
        if (!route) continue;

        // Verificar que la ruta incluye ambas paradas en orden correcto
        const originIndex = route.stopIds.indexOf(originStopId);
        const destIndex = route.stopIds.indexOf(destinationStopId);

        if (originIndex !== -1 && destIndex !== -1 && originIndex < destIndex) {
          // Filtrar por hora si se especifica
          if (
            currentTime === '00:00' ||
            schedule.departureTime >= currentTime
          ) {
            directSchedules.push({ ...schedule, route });
          }
        }
      }

      // Ordenar por hora de salida
      return directSchedules.sort((a, b) =>
        a.departureTime.localeCompare(b.departureTime),
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error al buscar horarios directos';
      setError(errorMessage);
      console.error('Error al obtener horarios directos:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const findConnections = async ({
    originStopId,
    destinationStopId,
    day,
    currentTime = '00:00',
    maxWaitTime = 60, // 60 minutos por defecto
  }: ConnectionParams): Promise<Connection[]> => {
    try {
      setLoading(true);
      setError(null);

      // Obtener todos los schedules y rutas
      const schedules = await getAllSchedules(day ? { day } : undefined);
      const routesResponse = await api.get<Route[]>('/routes');
      const routes = routesResponse.data;
      const stopsResponse = await api.get<Stop[]>('/stops');
      const stops = stopsResponse.data;

      const connections: Connection[] = [];

      // Buscar todas las combinaciones posibles
      schedules.forEach((firstSchedule) => {
        const firstRoute = routes.find((r) => r.id === firstSchedule.routeId);
        if (!firstRoute) return;

        // Verificar que el primer tramo sale del origen
        const firstOriginIndex = firstRoute.stopIds.indexOf(originStopId);
        if (firstOriginIndex === -1) return;

        // Filtrar por hora de salida
        if (firstSchedule.departureTime < currentTime) return;

        // Buscar paradas de transferencia (paradas después del origen en la primera ruta)
        const possibleTransferStops = firstRoute.stopIds.slice(
          firstOriginIndex + 1,
        );

        possibleTransferStops.forEach((transferStopId) => {
          // Calcular tiempo de llegada a la parada de transferencia
          // (Simplificación: asumimos tiempo proporcional basado en número de paradas)
          const stopsToTransfer =
            firstRoute.stopIds.indexOf(transferStopId) - firstOriginIndex;
          const firstLegDuration = calculateDuration(
            firstSchedule.departureTime,
            firstSchedule.arrivalTime,
          );
          const timeToTransfer =
            (firstLegDuration / firstRoute.stopIds.length) * stopsToTransfer;
          const arrivalAtTransfer = addMinutes(
            firstSchedule.departureTime,
            timeToTransfer,
          );

          // Buscar segunda ruta que conecte transferencia con destino
          schedules.forEach((secondSchedule) => {
            const secondRoute = routes.find(
              (r) => r.id === secondSchedule.routeId,
            );
            if (!secondRoute) return;

            const transferIndex = secondRoute.stopIds.indexOf(transferStopId);
            const destIndex = secondRoute.stopIds.indexOf(destinationStopId);

            // Verificar que la segunda ruta conecta transferencia con destino
            if (
              transferIndex === -1 ||
              destIndex === -1 ||
              transferIndex >= destIndex
            )
              return;

            // Calcular tiempo de espera
            const waitTime = calculateDuration(
              arrivalAtTransfer,
              secondSchedule.departureTime,
            );

            // Validar tiempo de espera
            if (waitTime < 0 || waitTime > maxWaitTime) return;

            // Calcular duración total
            const secondLegDuration = calculateDuration(
              secondSchedule.departureTime,
              secondSchedule.arrivalTime,
            );
            const totalDuration = timeToTransfer + waitTime + secondLegDuration;

            const transferStop = stops.find((s) => s.id === transferStopId);
            if (!transferStop) return;

            connections.push({
              firstLeg: { ...firstSchedule, route: firstRoute },
              secondLeg: { ...secondSchedule, route: secondRoute },
              transferStop,
              waitTime,
              totalDuration,
            });
          });
        });
      });

      // Ordenar por duración total
      return connections.sort((a, b) => a.totalDuration - b.totalDuration);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error al buscar conexiones';
      setError(errorMessage);
      console.error('Error al buscar conexiones:', error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAllSchedules,
    getSchedulesByRoute,
    getSchedulesByDay,
    getDirectSchedules,
    findConnections,
  };
};
