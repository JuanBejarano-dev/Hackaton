import { useCallback, useState } from 'react';

/** Envuelve una acción asíncrona y expone su estado de carga y su mensaje de error. */
export function useAsyncAction<TArgs extends unknown[]>(action: (...args: TArgs) => Promise<void>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: TArgs) => {
      setIsLoading(true);
      setError(null);
      try {
        await action(...args);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
      } finally {
        setIsLoading(false);
      }
    },
    [action],
  );

  const clearError = useCallback(() => setError(null), []);

  return { run, isLoading, error, clearError };
}
