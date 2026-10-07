import { useId } from 'react';
import { ErrorMessage } from '@atoms/ErrorMessage';
import { Label } from '@atoms/Label';
import { ToggleChip } from '@atoms/ToggleChip';

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

export interface ChipGroupFieldProps<T extends string> {
  label: string;
  options: ReadonlyArray<ChipOption<T>>;
  selected: T[];
  /** El organismo decide si es selección única (reemplaza) o múltiple (alterna). */
  onToggle: (value: T) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
}

export function ChipGroupField<T extends string>({
  label,
  options,
  selected,
  onToggle,
  error,
  hint,
  required,
  disabled,
}: ChipGroupFieldProps<T>) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <fieldset className="min-w-0 space-y-2" aria-describedby={error ? errorId : hint ? hintId : undefined}>
      <Label as="legend" required={required}>
        {label}
      </Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <ToggleChip
            key={option.value}
            selected={selected.includes(option.value)}
            disabled={disabled}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
          </ToggleChip>
        ))}
      </div>
      {error ? (
        <ErrorMessage id={errorId} message={error} />
      ) : (
        hint && (
          <p id={hintId} className="text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </fieldset>
  );
}
