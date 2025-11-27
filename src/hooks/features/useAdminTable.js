import { useState, useEffect, useCallback } from 'react';
import { useCrud } from '../useCrud';
import toast from 'react-hot-toast';

const flattenData = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    const flattened = { ...item };
    if (item.origen && item.destino) {
      flattened.recorrido_label = `${item.origen} — ${item.destino}`;
    }
    return flattened;
  });
};

const isConflictError = (error) => {
  return (
    error.response?.status === 409 &&
    typeof error.response?.data?.detail === 'object'
  );
};

const extractConflictData = (error) => {
  if (!isConflictError(error)) return null;
  return error.response.data.detail;
};

const useAdminTable = (endpoint, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getAll, create, update, remove, bulkRemove } = useCrud(endpoint);
  const pageSize = options.pageSize || 10;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAll();
      setData(flattenData(result));
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message;
      setError(errorMessage);
      toast.error(`Error al cargar datos: ${errorMessage}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [getAll]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = useCallback(
    async (newData) => {
      if (!newData || Object.keys(newData).length === 0) {
        const errorMsg = 'No se pueden crear registros vacíos';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      try {
        setLoading(true);
        const created = await create(newData);
        toast.success(`Registro creado exitosamente`);
        await fetchData();
        return { success: true, data: created };
      } catch (err) {
        const errorDetail = err.response?.data?.detail || err.message;
        toast.error(`Error al crear: ${errorDetail}`);
        return { success: false, error: errorDetail };
      } finally {
        setLoading(false);
      }
    },
    [create, fetchData],
  );

  const handleUpdate = useCallback(
    async (id, updatedData) => {
      if (!id) {
        const errorMsg = 'ID inválido para actualización';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      try {
        setLoading(true);
        const updated = await update(id, updatedData);
        toast.success(`Registro actualizado exitosamente`);
        await fetchData();
        return { success: true, data: updated };
      } catch (err) {
        const errorDetail = err.response?.data?.detail || err.message;
        toast.error(`Error al actualizar: ${errorDetail}`);
        return { success: false, error: errorDetail };
      } finally {
        setLoading(false);
      }
    },
    [update, fetchData],
  );

  const handleDelete = useCallback(
    async (id, force = false) => {
      if (!id) {
        const errorMsg = 'ID inválido para eliminación';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      try {
        setLoading(true);
        await remove(id, force);
        toast.success(`Registro eliminado exitosamente`);
        await fetchData();
        return { success: true, deleted: id };
      } catch (err) {
        if (isConflictError(err)) {
          return {
            success: false,
            conflict: true,
            conflictData: extractConflictData(err),
            id,
          };
        }

        const errorDetail = err.response?.data?.detail || err.message;
        toast.error(`Error al eliminar: ${errorDetail}`, { duration: 6000 });
        return { success: false, error: errorDetail };
      } finally {
        setLoading(false);
      }
    },
    [remove, fetchData],
  );

  const handleBulkDelete = useCallback(
    async (ids) => {
      if (!Array.isArray(ids) || ids.length === 0) {
        const errorMsg = 'Debe seleccionar al menos un registro';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      try {
        setLoading(true);
        await bulkRemove(ids);
        toast.success(`${ids.length} registro(s) eliminado(s) exitosamente`);
        await fetchData();
        return { success: true, count: ids.length };
      } catch (err) {
        const errorDetail = err.response?.data?.detail || err.message;
        toast.error(`Error al eliminar múltiples registros: ${errorDetail}`, {
          duration: 6000,
        });
        return { success: false, error: errorDetail };
      } finally {
        setLoading(false);
      }
    },
    [bulkRemove, fetchData],
  );

  const paginationConfig =
    data.length > pageSize
      ? {
          pageSize,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} registros`,
        }
      : false;

  return {
    data,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBulkDelete,
    refetch: fetchData,
    paginationConfig,
    hasData: data.length > 0,
    isEmpty: data.length === 0,
    recordCount: data.length,
  };
};

export default useAdminTable;
