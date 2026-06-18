import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para cargar datos desde archivos JSON mediante fetch().
 * @param {string} url - Ruta al archivo JSON en /public
 * @returns {{ data, loading, error, refetch }}
 */
export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const respuesta = await fetch(url);
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: No se pudo cargar ${url}`);
      }
      const datos = await respuesta.json();
      setData(datos);
    } catch (err) {
      console.error('useFetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
