import { forwardRef, type ReactNode } from 'react';
import { Icon, type IconName } from '@atoms/Icon';
import { Input, type InputProps } from '@atoms/Input';
import { cn } from '@utils/cn';

export interface InputWithIconProps extends InputProps {
  /** Ícono decorativo a la izquierda. */
  icon?: IconName;
  /** Elemento interactivo a la derecha (p. ej. un IconButton). */
  rightElement?: ReactNode;
}

export const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>(function InputWithIcon(
  { icon, rightElement, className, ...inputProps },
  ref,
) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Icon name={icon} className="h-4 w-4" />
        </span>
      )}
      <Input ref={ref} className={cn(icon && 'pl-9', Boolean(rightElement) && 'pr-11', className)} {...inputProps} />
      {rightElement && <span className="absolute inset-y-0 right-0 flex items-center pr-1">{rightElement}</span>}
    </div>
  );
});
