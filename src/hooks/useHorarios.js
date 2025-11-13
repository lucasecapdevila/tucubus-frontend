import { useState } from "react";
import api from "../services/api";

export const useHorarios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getHorariosDirectos = async ({
    origen,
    destino,
    tipo_dia,
    hora_actual,
  }) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get("/horarios-directos/", {
        params: {
          origen,
          destino,
          tipo_dia: tipo_dia.toLowerCase(),
          hora_actual: hora_actual || "00:00",
        },
      });

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Error al buscar horarios";
      setError(errorMessage);
      console.error("Error al obtener horarios directos:", error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getConexiones = async ({ tipo_dia, direccion, hora_actual }) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get("/conexiones/", {
        params: {
          tipo_dia: tipo_dia.toLowerCase(),
          direccion: direccion || "ida",
          hora_actual: hora_actual || "00:00",
        },
      });

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Error al buscar conexiones";
      setError(errorMessage);
      console.error("Error al obtener conexiones:", error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, getHorariosDirectos, getConexiones };
};
