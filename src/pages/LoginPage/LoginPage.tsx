import { useCallback, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { TextLink } from '@atoms/TextLink';
import { AuthBrandPanel } from '@organisms/AuthBrandPanel';
import { LoginForm } from '@organisms/LoginForm';
import { AuthLayout } from '@templates/AuthLayout';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useAuth } from '@hooks/useAuth';
import { APP_NAME } from '@/config';
import { PATHS } from '@/routes/paths';
import type { LoginFormValues } from '@utils/authValidation';

export function LoginPage() {
  const { login } = useAuth();

  // La redirección tras el login la hace GuestRoute cuando cambia la sesión.
  const submitLogin = useCallback((values: LoginFormValues) => login(values), [login]);
  const { run, isLoading, error } = useAsyncAction(submitLogin);

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para continuar"
      aside={<AuthBrandPanel brandName={APP_NAME} />}
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <TextLink as={Link} to={PATHS.register}>
            Regístrate
          </TextLink>
        </>
      }
    >
      <LoginForm
        onSubmit={run}
        isLoading={isLoading}
        errorMessage={error}
        forgotPasswordSlot={
          <TextLink href="#" onClick={(event: MouseEvent<HTMLAnchorElement>) => event.preventDefault()}>
            ¿Olvidaste tu contraseña?
          </TextLink>
        }
      />
    </AuthLayout>
  );
}
