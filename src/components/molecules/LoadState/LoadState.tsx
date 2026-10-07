import { Alert } from '@atoms/Alert';
import { Button } from '@atoms/Button';
import { Spinner } from '@atoms/Spinner';

export interface LoadStateProps {
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  loadingText?: string;
}

/** Estado de carga o de error de una vista mientras llegan los datos. */
export function LoadState({ isLoading, error, onRetry, loadingText = 'Cargando…' }: LoadStateProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
        <Spinner className="text-brand-600" />
        <span className="text-sm">{loadingText}</span>
      </div>
    );
  }

  return (
    <Alert variant="error" className="flex flex-wrap items-center justify-between gap-3">
      <span>{error ?? 'No se encontró la información solicitada.'}</span>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </Alert>
  );
}
