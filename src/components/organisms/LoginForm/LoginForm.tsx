import type { ReactNode } from 'react';
import { Alert } from '@atoms/Alert';
import { Button } from '@atoms/Button';
import { CheckboxField } from '@molecules/CheckboxField';
import { FormField } from '@molecules/FormField';
import { PasswordField } from '@molecules/PasswordField';
import { useForm } from '@hooks/useForm';
import { validateLogin, type LoginFormValues } from '@utils/authValidation';

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isLoading?: boolean;
  /** Error devuelto por el servidor (credenciales inválidas, red, etc.). */
  errorMessage?: string | null;
  /** Slot para el enlace "¿Olvidaste tu contraseña?". */
  forgotPasswordSlot?: ReactNode;
  initialValues?: Partial<LoginFormValues>;
}

const DEFAULT_VALUES: LoginFormValues = { email: '', password: '', rememberMe: false };

export function LoginForm({
  onSubmit,
  isLoading = false,
  errorMessage,
  forgotPasswordSlot,
  initialValues,
}: LoginFormProps) {
  const { values, handleChange, handleBlur, handleSubmit, getFieldError } = useForm<LoginFormValues>({
    initialValues: { ...DEFAULT_VALUES, ...initialValues },
    validate: validateLogin,
    onSubmit,
  });

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5" aria-label="Iniciar sesión">
      {errorMessage && <Alert variant="error">{errorMessage}</Alert>}

      <FormField
        name="email"
        type="email"
        label="Correo electrónico"
        icon="mail"
        placeholder="tu@correo.com"
        autoComplete="email"
        required
        value={values.email}
        error={getFieldError('email')}
        disabled={isLoading}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <PasswordField
        name="password"
        label="Contraseña"
        placeholder="••••••••"
        autoComplete="current-password"
        required
        value={values.password}
        error={getFieldError('password')}
        disabled={isLoading}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div className="flex items-center justify-between gap-4">
        <CheckboxField
          name="rememberMe"
          label="Recordarme"
          checked={values.rememberMe}
          disabled={isLoading}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {forgotPasswordSlot && <div className="text-sm">{forgotPasswordSlot}</div>}
      </div>

      <Button type="submit" size="lg" fullWidth isLoading={isLoading}>
        {isLoading ? 'Ingresando…' : 'Iniciar sesión'}
      </Button>
    </form>
  );
}
