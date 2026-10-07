import { useCallback, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '@atoms/Alert';
import { TextLink } from '@atoms/TextLink';
import { AuthBrandPanel } from '@organisms/AuthBrandPanel';
import { LoginForm } from '@organisms/LoginForm';
import { AuthLayout } from '@templates/AuthLayout';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useAuth } from '@hooks/useAuth';
import type { LoginFormValues } from '@utils/authValidation';

export function LoginPage() {
  const { login } = useAuth();

  // La redirección tras el éxito la resuelve GuestRoute al cambiar el estado de auth.
  const submitLogin = useCallback((values: LoginFormValues) => login(values), [login]);
  const { run, isLoading, error } = useAsyncAction(submitLogin);

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para continuar"
      aside={<AuthBrandPanel />}
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <TextLink as={Link} to="/register">
            Regístrate
          </TextLink>
        </>
      }
    >
      <Alert variant="info" className="mb-5">
        Demo: <strong>demo@hackaton.dev</strong> / <strong>Demo1234</strong>
      </Alert>
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
