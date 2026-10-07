import { useCallback, useEffect, useState, type DependencyList } from 'react';

interface AsyncDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Carga datos al montar (y cuando cambian `deps`), ignorando respuestas de cargas anteriores.
 * `setData` permite actualizar el resultado localmente tras una mutación.
 */
export function useAsyncData<T>(fetcher: () => Promise<T>, deps: DependencyList = []) {
  const [state, setState] = useState<AsyncDataState<T>>({ data: null, isLoading: true, error: null });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetcher()
      .then((data) => {
        if (isCurrent) setState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (isCurrent) {
          const message = err instanceof Error ? err.message : 'No se pudieron cargar los datos';
          setState({ data: null, isLoading: false, error: message });
        }
      });

    return () => {
      isCurrent = false;
    };
    // `fetcher` se omite a propósito: se recarga solo cuando cambian `deps`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadCount]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);
  const setData = useCallback((data: T) => setState({ data, isLoading: false, error: null }), []);

  return { ...state, reload, setData };
}
