import type { SelfRegisterRole } from '@/types/auth';
import { isBlank, isStrongPassword, isValidEmail } from './validators';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  role: SelfRegisterRole;
};

export function validateLogin(values: LoginFormValues): FormErrors<LoginFormValues> {
  const errors: FormErrors<LoginFormValues> = {};

  if (isBlank(values.email)) errors.email = 'El correo es obligatorio';
  else if (!isValidEmail(values.email)) errors.email = 'Ingresa un correo válido';

  if (isBlank(values.password)) errors.password = 'La contraseña es obligatoria';

  return errors;
}

export function validateRegister(values: RegisterFormValues): FormErrors<RegisterFormValues> {
  const errors: FormErrors<RegisterFormValues> = {};

  if (isBlank(values.name)) errors.name = 'El nombre es obligatorio';
  else if (values.name.trim().length < 2) errors.name = 'El nombre es demasiado corto';

  if (isBlank(values.email)) errors.email = 'El correo es obligatorio';
  else if (!isValidEmail(values.email)) errors.email = 'Ingresa un correo válido';

  if (isBlank(values.password)) errors.password = 'La contraseña es obligatoria';
  else if (!isStrongPassword(values.password))
    errors.password = 'Mínimo 8 caracteres, con mayúscula, minúscula y número';

  if (isBlank(values.confirmPassword)) errors.confirmPassword = 'Confirma tu contraseña';
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = 'Las contraseñas no coinciden';

  if (!values.acceptTerms) errors.acceptTerms = 'Debes aceptar los términos';

  return errors;
}
