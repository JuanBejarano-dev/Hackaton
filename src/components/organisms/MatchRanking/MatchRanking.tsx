import type { ReactNode } from 'react';
import { Badge } from '@atoms/Badge';
import { Card } from '@atoms/Card';
import { ProgressBar } from '@atoms/ProgressBar';
import { UserIdentity } from '@molecules/UserIdentity';
import type { MatchResult } from '@/types/domain';
import { cn } from '@utils/cn';
import { EXPERIENCE_LABELS } from '@utils/labels';

export interface MatchRankingProps {
  matches: MatchResult[];
  /** Total de bloques que pidió el estudiante, para mostrar "n de m". */
  requestedBlocks: number;
  assignedTutorId?: string | null;
  /** Acción por fila (p. ej. "Asignar" para el coordinador). */
  renderAction?: (match: MatchResult) => ReactNode;
}

/** Ranking de todos los tutores evaluados para una solicitud. */
export function MatchRanking({ matches, requestedBlocks, assignedTutorId, renderAction }: MatchRankingProps) {
  return (
    <Card as="section" padding="none" aria-labelledby="ranking-title">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 id="ranking-title" className="font-semibold text-slate-900">
          Ranking de tutores evaluados
        </h2>
        <p className="text-sm text-slate-500">{matches.length} tutores dominan la materia</p>
      </div>

      <ol className="divide-y divide-slate-100">
        {matches.map((match, index) => {
          const isAssigned = match.tutor.id === assignedTutorId;
          return (
            <li
              key={match.tutor.id}
              className={cn(
                'grid items-center gap-x-4 gap-y-3 px-5 py-4 sm:grid-cols-[2rem_minmax(0,1fr)_10rem_auto]',
                isAssigned && 'bg-brand-50/60',
              )}
            >
              <span className="hidden text-lg font-bold tabular-nums text-slate-400 sm:block">#{index + 1}</span>

              <div className="min-w-0 space-y-1">
                <UserIdentity
                  size="sm"
                  name={match.tutor.name}
                  detail={
                    <span className="flex flex-wrap items-center gap-1.5">
                      {EXPERIENCE_LABELS[match.tutor.experienceLevel]} · {match.matchingBlocks.length} de{' '}
                      {requestedBlocks} bloques
                      {isAssigned && <Badge tone="brand">Asignado</Badge>}
                    </span>
                  }
                />
                <p className="text-xs text-slate-500 sm:pl-11">{match.justification}</p>
              </div>

              <div className="flex items-center gap-2">
                <ProgressBar value={match.score} label={`Score de ${match.tutor.name}`} />
                <span className="w-8 text-right text-sm font-bold tabular-nums text-slate-900">
                  {Math.round(match.score)}
                </span>
              </div>

              <div className="flex justify-end">{renderAction?.(match)}</div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
