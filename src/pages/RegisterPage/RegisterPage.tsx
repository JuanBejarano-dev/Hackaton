import { useCallback, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { TextLink } from '@atoms/TextLink';
import { AuthBrandPanel } from '@organisms/AuthBrandPanel';
import { RegisterForm } from '@organisms/RegisterForm';
import { AuthLayout } from '@templates/AuthLayout';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useAuth } from '@hooks/useAuth';
import { APP_NAME } from '@/config';
import { PATHS } from '@/routes/paths';
import type { RegisterFormValues } from '@utils/authValidation';

export function RegisterPage() {
  const { register } = useAuth();

  const submitRegister = useCallback(
    ({ name, email, password, role }: RegisterFormValues) => register({ name, email, password, role }),
    [register],
  );
  const { run, isLoading, error } = useAsyncAction(submitRegister);

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Como estudiante para pedir tutorías, o como tutor para darlas"
      aside={<AuthBrandPanel brandName={APP_NAME} />}
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <TextLink as={Link} to={PATHS.login}>
            Inicia sesión
          </TextLink>
        </>
      }
    >
      <RegisterForm
        onSubmit={run}
        isLoading={isLoading}
        errorMessage={error}
        termsLabel={
          <>
            Acepto los{' '}
            <TextLink href="#" onClick={(event: MouseEvent<HTMLAnchorElement>) => event.preventDefault()}>
              términos y condiciones
            </TextLink>
          </>
        }
      />
    </AuthLayout>
  );
}
