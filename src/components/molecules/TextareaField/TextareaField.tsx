import { forwardRef, useId } from 'react';
import { ErrorMessage } from '@atoms/ErrorMessage';
import { Label } from '@atoms/Label';
import { Textarea, type TextareaProps } from '@atoms/Textarea';

export interface TextareaFieldProps extends Omit<TextareaProps, 'hasError'> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { id, label, error, hint, required, ...textareaProps },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;
  const hintId = `${textareaId}-hint`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={textareaId} required={required}>
        {label}
      </Label>
      <Textarea
        ref={ref}
        id={textareaId}
        required={required}
        hasError={Boolean(error)}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...textareaProps}
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
