import { useState, useCallback } from "react";
import api from "../services/api";
import { ApiEndpoint, UseCrudReturn } from "@/types";

export const useCrud = <T = any>(endpoint: ApiEndpoint): UseCrudReturn<T> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //  GET - Obtener registros
  const getAll = useCallback(async (): Promise<T[]> => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/${endpoint}`);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error(`Error obteniendo ${endpoint}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  //  GET - Obtener un registro por ID
  const getById = useCallback(
    async (id: number): Promise<T> => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/${endpoint}/${id}`);
        return data;
      } catch (error: any) {
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
    async (newData: Partial<T>): Promise<T> => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.post(`/${endpoint}`, newData);
        return data;
      } catch (error: any) {
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
    async (id: number, updatedData: Partial<T>): Promise<T> => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.put(`/${endpoint}/${id}`, updatedData);
        return data;
      } catch (error: any) {
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
    async (id: number, force: boolean = false): Promise<T> => {
      try {
        setLoading(true);
        setError(null);

        const url = force
          ? `/${endpoint}/${id}?force=true`
          : `/${endpoint}/${id}`;

        const { data } = await api.delete(url);
        return data;
      } catch (error: any) {
        setError(error.message);
        console.error(`Error al eliminar ${endpoint} con id ${id}:`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  const bulkRemove = useCallback(
    async (ids: number[]): Promise<{ deleted_count: number }> => {
      try {
        setLoading(true);
        setError(null);

        if (!Array.isArray(ids) || ids.length === 0) {
          throw new Error("Debe proporcionar al menos un ID para eliminar.");
        }

        if (ids.length > 500) {
          throw new Error(
            "No se pueden eliminar más de 500 registros a la vez."
          );
        }

        const { data } = await api.post(`/${endpoint}/bulk-delete`, { ids });
        return data;
      } catch (error: any) {
        setError(error.message);
        console.error(
          `Error al eliminar registros múltiples de ${endpoint}:`,
          error
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return {
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove,
    bulkRemove,
  };
};
