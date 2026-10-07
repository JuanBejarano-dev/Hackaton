import { Icon } from '@atoms/Icon';

export interface AuthBrandPanelProps {
  brandName: string;
}

const HIGHLIGHTS = [
  'Registra tu perfil de tutor o tu solicitud en minutos',
  'Matching automático por materia, horario y experiencia',
  'Cada recomendación explica por qué es la mejor opción',
];

/** Contenido del panel lateral de marca de las páginas de autenticación. */
export function AuthBrandPanel({ brandName }: AuthBrandPanelProps) {
  return (
    <>
      <span className="flex items-center gap-2 text-xl font-bold">
        <Icon name="sparkles" />
        {brandName}
      </span>
      <div className="max-w-md space-y-6">
        <h2 className="text-4xl font-bold leading-tight">El tutor perfecto para cada estudiante.</h2>
        <ul className="space-y-3">
          {HIGHLIGHTS.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3 text-brand-100">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Icon name="check" className="h-3 w-3 text-white" />
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-brand-100">Programa de tutorías entre pares</p>
    </>
  );
}
