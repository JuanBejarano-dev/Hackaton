import { forwardRef, useId } from 'react';
import { ErrorMessage } from '@atoms/ErrorMessage';
import { Label } from '@atoms/Label';
import { InputWithIcon, type InputWithIconProps } from '@molecules/InputWithIcon';

export interface FormFieldProps extends Omit<InputWithIconProps, 'hasError'> {
  label: string;
  error?: string;
  hint?: string;
}

/** Label + input (con ícono opcional) + mensaje de error/ayuda, accesible por defecto. */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { id, label, error, hint, required, ...inputProps },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId} required={required}>
        {label}
      </Label>
      <InputWithIcon
        ref={ref}
        id={inputId}
        required={required}
        hasError={Boolean(error)}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {error ? (
        <ErrorMessage id={errorId} message={error} />
      ) : (
        hint && (
          <p id={hintId} className="text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
});
