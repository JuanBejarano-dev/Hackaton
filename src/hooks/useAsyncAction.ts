import { useCallback, useEffect, useRef, useState } from 'react';

/** Envuelve una acción asíncrona y expone su estado de carga y su mensaje de error. */
export function useAsyncAction<TArgs extends unknown[]>(action: (...args: TArgs) => Promise<void>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const run = useCallback(
    async (...args: TArgs) => {
      setIsLoading(true);
      setError(null);
      setSlow(false);
      timer.current = window.setTimeout(() => setSlow(true), 5000);
      try {
        await action(...args);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
      } finally {
        window.clearTimeout(timer.current);
        setIsLoading(false);
      }
    },
    [action],
  );

  const clearError = useCallback(() => setError(null), []);

  return { run, isLoading, error, clearError, slow };
}
