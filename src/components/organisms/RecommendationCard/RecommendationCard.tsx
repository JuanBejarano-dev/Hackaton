import type { ReactNode } from 'react';
import { Badge } from '@atoms/Badge';
import { Card } from '@atoms/Card';
import { Icon } from '@atoms/Icon';
import { CriterionBar } from '@molecules/CriterionBar';
import { UserIdentity } from '@molecules/UserIdentity';
import type { MatchResult } from '@/types/domain';
import { formatScore } from '@utils/labels';
import { formatHorario } from '@utils/schedule';

export interface RecommendationCardProps {
  match: MatchResult;
  title?: string;
  /** Datos extra del tutor (p. ej. nivel y modalidad) bajo su nombre. */
  tutorDetail?: ReactNode;
  actions?: ReactNode;
}

/** Tutor recomendado: score total, justificación, horarios en común y desglose por criterio. */
export function RecommendationCard({ match, title = 'Tutor recomendado', tutorDetail, actions }: RecommendationCardProps) {
  const { nombreTutor, score, desglose, justificacion, horariosCoincidentes } = match;

  return (
    <Card as="section" padding="none" aria-label={title} className="overflow-hidden">
      <div className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-3 text-sm font-semibold text-white">
        <Icon name="star" className="h-4 w-4" />
        {title}
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto]">
        <div className="min-w-0 space-y-4">
          <UserIdentity size="lg" name={nombreTutor} detail={tutorDetail} />

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">¿Por qué este tutor?</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{justificacion}</p>
          </div>

          {horariosCoincidentes.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Horarios en común
              </p>
              <div className="flex flex-wrap gap-1.5">
                {horariosCoincidentes.map((horario) => (
                  <Badge key={horario} tone="success">
                    <Icon name="clock" className="h-3 w-3" />
                    {formatHorario(horario)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 lg:w-72">
          <div className="text-center lg:text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Score de afinidad</p>
            <p className="text-5xl font-extrabold tabular-nums text-brand-600">
              {formatScore(score)}
              <span className="text-xl font-semibold text-slate-400">/100</span>
            </p>
          </div>
          <div className="space-y-3">
            {desglose.map((criterio) => (
              <CriterionBar
                key={criterio.nombreCriterio}
                label={criterio.nombreCriterio}
                aporte={criterio.aporte}
                maximo={criterio.peso * 100}
                explicacion={criterio.explicacion}
              />
            ))}
          </div>
          {actions && <div className="flex justify-end gap-2">{actions}</div>}
        </div>
      </div>
    </Card>
  );
}
