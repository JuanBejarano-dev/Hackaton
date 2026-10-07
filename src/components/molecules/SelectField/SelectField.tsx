import { forwardRef, useId } from 'react';
import { ErrorMessage } from '@atoms/ErrorMessage';
import { Label } from '@atoms/Label';
import { Select, type SelectProps } from '@atoms/Select';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends Omit<SelectProps, 'hasError' | 'children'> {
  label: string;
  options: SelectOption[];
  /** Texto de la opción vacía inicial (p. ej. "Selecciona una materia"). */
  placeholder?: string;
  error?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { id, label, options, placeholder, error, required, ...selectProps },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={selectId} required={required}>
        {label}
      </Label>
      <Select
        ref={ref}
        id={selectId}
        required={required}
        hasError={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...selectProps}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <ErrorMessage id={errorId} message={error} />
    </div>
  );
});
