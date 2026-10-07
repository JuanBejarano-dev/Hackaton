import { Badge } from '@atoms/Badge';
import { Card } from '@atoms/Card';
import { ProgressBar } from '@atoms/ProgressBar';
import { UserIdentity } from '@molecules/UserIdentity';
import type { MatchResult } from '@/types/domain';
import { cn } from '@utils/cn';
import { formatScore } from '@utils/labels';

export interface MatchRankingProps {
  matches: MatchResult[];
  /** Total de horarios que pidió el estudiante, para mostrar "n de m". */
  requestedHorarios: number;
}

/** Ranking de todos los tutores evaluados, en el orden que devuelve la API. */
export function MatchRanking({ matches, requestedHorarios }: MatchRankingProps) {
  return (
    <Card as="section" padding="none" aria-labelledby="ranking-title">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 id="ranking-title" className="font-semibold text-slate-900">
          Ranking de tutores evaluados
        </h2>
        <p className="text-sm text-slate-500">
          {matches.length} {matches.length === 1 ? 'tutor domina' : 'tutores dominan'} la materia
        </p>
      </div>

      <ol className="divide-y divide-slate-100">
        {matches.map((match, index) => (
          <li
            key={match.tutorId}
            className={cn(
              'grid items-center gap-x-4 gap-y-3 px-5 py-4 sm:grid-cols-[2rem_minmax(0,1fr)_10rem]',
              match.recomendado && 'bg-brand-50/60',
              !match.disponible && 'opacity-70',
            )}
          >
            <span className="hidden text-lg font-bold tabular-nums text-slate-400 sm:block">#{index + 1}</span>

            <div className="min-w-0 space-y-1">
              <UserIdentity
                size="sm"
                name={match.nombreTutor}
                detail={
                  <span className="flex flex-wrap items-center gap-1.5">
                    {match.horariosCoincidentes.length} de {requestedHorarios} horarios
                    {match.recomendado && <Badge tone="brand">Recomendado</Badge>}
                    {!match.disponible && <Badge tone="warning">Sin horario en común</Badge>}
                  </span>
                }
              />
              <p className="text-xs text-slate-500 sm:pl-11">{match.justificacion}</p>
            </div>

            <div className="flex items-center gap-2">
              <ProgressBar value={match.score} label={`Score de ${match.nombreTutor}`} />
              <span className="w-10 text-right text-sm font-bold tabular-nums text-slate-900">
                {formatScore(match.score)}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
