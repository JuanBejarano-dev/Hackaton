import { cn } from '@utils/cn';

export interface ErrorMessageProps {
  id?: string;
  message?: string;
  className?: string;
}

/** Mensaje de error de un campo. No renderiza nada si no hay mensaje. */
export function ErrorMessage({ id, message, className }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className={cn('text-xs font-medium text-red-600', className)}>
      {message}
    </p>
  );
}
