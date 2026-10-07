import type { ReactNode } from 'react';
import { Avatar, type AvatarSize } from '@atoms/Avatar';

export interface UserIdentityProps {
  name: string;
  /** Texto secundario bajo el nombre (correo, rol, etc.). */
  detail?: ReactNode;
  size?: AvatarSize;
}

export function UserIdentity({ name, detail, size = 'md' }: UserIdentityProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={name} size={size} />
      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-900">{name}</p>
        {detail && <div className="truncate text-sm text-slate-500">{detail}</div>}
      </div>
    </div>
  );
}
