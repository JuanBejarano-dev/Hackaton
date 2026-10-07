import { useCallback, useMemo, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';

type FormValues = Record<string, unknown>;
type FormErrors<T> = Partial<Record<keyof T, string>>;
type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface UseFormOptions<T extends FormValues> {
  initialValues: T;
  validate: (values: T) => FormErrors<T>;
  onSubmit: (values: T) => void;
}

/**
 * Estado de formulario controlado con validación.
 * Los errores solo se muestran en campos ya tocados o después de intentar enviar.
 */
export function useForm<T extends FormValues>({ initialValues, validate, onSubmit }: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const errors = useMemo(() => validate(values), [validate, values]);

  const handleChange = useCallback((event: ChangeEvent<FieldElement>) => {
    const { target } = event;
    const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
    setValues((prev) => ({ ...prev, [target.name]: value }));
  }, []);

  const handleBlur = useCallback((event: FocusEvent<FieldElement>) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  /** Para campos que no son inputs nativos (chips, cuadrícula de horarios…). */
  const setFieldValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const allTouched = Object.fromEntries(Object.keys(values).map((key) => [key, true]));
      setTouched(allTouched as Record<keyof T, boolean>);

      if (Object.keys(errors).length === 0) {
        onSubmit(values);
      }
    },
    [errors, onSubmit, values],
  );

  const getFieldError = useCallback(
    (name: keyof T): string | undefined => (touched[name] ? errors[name] : undefined),
    [errors, touched],
  );

  return { values, handleChange, handleBlur, setFieldValue, handleSubmit, getFieldError };
}
