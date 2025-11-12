import { useState } from "react";
import api from "../services/api";

export const useCrud = (endpoint) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //  GET - Obtener registros
  const getAll = async () => {
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
  };

  //  GET - Obtener un registro por ID
  const getByID = async (id) => {
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
  };

  //  POST - Crear nuevo registro
  const create = async (newData) => {
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
  };

  //  PUT - Editar un registro
  const update = async (id, updatedData) => {
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
  };

  const remove = async (id) => {
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
  };

  return { loading, error, getAll, getByID, create, update, remove };
};
