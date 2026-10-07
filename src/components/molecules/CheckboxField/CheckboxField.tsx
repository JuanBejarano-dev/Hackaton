import { forwardRef, useId } from 'react';
import { Checkbox, type CheckboxProps } from '@atoms/Checkbox';
import { ErrorMessage } from '@atoms/ErrorMessage';

export interface CheckboxFieldProps extends Omit<CheckboxProps, 'hasError'> {
  error?: string;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(function CheckboxField(
  { id, error, ...checkboxProps },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1">
      <Checkbox
        ref={ref}
        id={inputId}
        hasError={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...checkboxProps}
      />
      <ErrorMessage id={errorId} message={error} />
    </div>
  );
});
