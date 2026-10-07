import type { ReactNode } from 'react';
import { Alert } from '@atoms/Alert';
import { Button } from '@atoms/Button';
import { CheckboxField } from '@molecules/CheckboxField';
import { FormField } from '@molecules/FormField';
import { PasswordField } from '@molecules/PasswordField';
import { useForm } from '@hooks/useForm';
import { validateRegister, type RegisterFormValues } from '@utils/authValidation';

export interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  /** Contenido del label de términos (p. ej. con enlaces a las políticas). */
  termsLabel?: ReactNode;
}

const INITIAL_VALUES: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

export function RegisterForm({
  onSubmit,
  isLoading = false,
  errorMessage,
  termsLabel = 'Acepto los términos y condiciones',
}: RegisterFormProps) {
  const { values, handleChange, handleBlur, handleSubmit, getFieldError } = useForm<RegisterFormValues>({
    initialValues: INITIAL_VALUES,
    validate: validateRegister,
    onSubmit,
  });

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5" aria-label="Crear cuenta">
      {errorMessage && <Alert variant="error">{errorMessage}</Alert>}

      <FormField
        name="name"
        label="Nombre completo"
        icon="user"
        placeholder="Ada Lovelace"
        autoComplete="name"
        required
        value={values.name}
        error={getFieldError('name')}
        disabled={isLoading}
        onChange={handleChange}
        onBlur={handleBlur}
      />

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
        autoComplete="new-password"
        hint="Mínimo 8 caracteres, con mayúscula, minúscula y número"
        required
        value={values.password}
        error={getFieldError('password')}
        disabled={isLoading}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <PasswordField
        name="confirmPassword"
        label="Confirmar contraseña"
        placeholder="••••••••"
        autoComplete="new-password"
        required
        value={values.confirmPassword}
        error={getFieldError('confirmPassword')}
        disabled={isLoading}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <CheckboxField
        name="acceptTerms"
        label={termsLabel}
        checked={values.acceptTerms}
        error={getFieldError('acceptTerms')}
        disabled={isLoading}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Button type="submit" size="lg" fullWidth isLoading={isLoading}>
        {isLoading ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>
    </form>
  );
}
