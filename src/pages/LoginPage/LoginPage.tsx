import { useCallback, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '@atoms/Alert';
import { TextLink } from '@atoms/TextLink';
import { AuthBrandPanel } from '@organisms/AuthBrandPanel';
import { LoginForm } from '@organisms/LoginForm';
import { AuthLayout } from '@templates/AuthLayout';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useAuth } from '@hooks/useAuth';
import { APP_NAME, USE_MOCK_API } from '@/config';
import { PATHS } from '@/routes/paths';
import type { LoginFormValues } from '@utils/authValidation';

const DEMO_ACCOUNTS = [
  { role: 'Estudiante', email: 'estudiante@hackaton.dev' },
  { role: 'Tutor', email: 'tutor@hackaton.dev' },
  { role: 'Coordinador', email: 'coordinador@hackaton.dev' },
];

export function LoginPage() {
  const { login } = useAuth();

  // La redirección al inicio de cada rol la hace GuestRoute cuando cambia la sesión.
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
      {USE_MOCK_API && (
        <Alert variant="info" className="mb-5">
          <p className="font-semibold">Cuentas demo · contraseña Demo1234</p>
          <ul className="mt-1 space-y-0.5">
            {DEMO_ACCOUNTS.map((account) => (
              <li key={account.email}>
                {account.role}: <strong>{account.email}</strong>
              </li>
            ))}
          </ul>
        </Alert>
      )}
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
