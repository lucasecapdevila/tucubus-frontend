import { useState, useCallback } from "react";
import api from "../services/api";

export const useCrud = (endpoint) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //  GET - Obtener registros
  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/${endpoint}`);
      return data;
    } catch (err) {
      setError(err.message);
      console.error(`Error obteniendo ${endpoint}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  //  GET - Obtener un registro por ID
  const getByID = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/${endpoint}/${id}`);
        return data;
      } catch (error) {
        setError(error.message);
        console.error(`Error obteniendo ${endpoint} con id ${id}:`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  //  POST - Crear nuevo registro
  const create = useCallback(
    async (newData) => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.post(`/${endpoint}`, newData);
        return data;
      } catch (error) {
        setError(error.message);
        console.error(`Error al crear ${endpoint}`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  //  PUT - Editar un registro
  const update = useCallback(
    async (id, updatedData) => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.put(`/${endpoint}/${id}`, updatedData);
        return data;
      } catch (error) {
        setError(error.message);
        console.error(`Error al actualizar ${endpoint} con id ${id}:`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  const remove = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.delete(`/${endpoint}/${id}`);
        return data;
      } catch (error) {
        setError(error.message);
        console.error(`Error al eliminar ${endpoint} con id ${id}:`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return { loading, error, getAll, getByID, create, update, remove };
};
