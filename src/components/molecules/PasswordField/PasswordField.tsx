import { forwardRef, useState } from 'react';
import { IconButton } from '@atoms/IconButton';
import { FormField, type FormFieldProps } from '@molecules/FormField';

export type PasswordFieldProps = Omit<FormFieldProps, 'type' | 'rightElement'>;

/** FormField de contraseña con botón para mostrar/ocultar el valor. */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { icon = 'lock', disabled, ...fieldProps },
  ref,
) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormField
      ref={ref}
      type={isVisible ? 'text' : 'password'}
      icon={icon}
      disabled={disabled}
      rightElement={
        <IconButton
          icon={isVisible ? 'eyeOff' : 'eye'}
          label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={isVisible}
          disabled={disabled}
          onClick={() => setIsVisible((visible) => !visible)}
        />
      }
      {...fieldProps}
    />
  );
});
