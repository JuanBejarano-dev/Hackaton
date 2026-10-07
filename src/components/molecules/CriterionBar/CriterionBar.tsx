import { ProgressBar } from '@atoms/ProgressBar';
import { formatScore } from '@utils/labels';

export interface CriterionBarProps {
  label: string;
  /** Puntos que aporta el criterio al score total. */
  aporte: number;
  /** Máximo que puede aportar (peso × 100). */
  maximo: number;
  explicacion?: string;
}

/** Una fila del desglose del score: cuántos puntos aporta el criterio sobre su máximo. */
export function CriterionBar({ label, aporte, maximo, explicacion }: CriterionBarProps) {
  const percent = maximo > 0 ? (aporte / maximo) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-semibold tabular-nums text-slate-900">
          {formatScore(aporte)}
          <span className="font-normal text-slate-400">/{formatScore(maximo)}</span>
        </span>
      </div>
      <ProgressBar value={percent} label={`${label}: ${formatScore(aporte)} de ${formatScore(maximo)} puntos`} size="sm" />
      {explicacion && <p className="text-xs text-slate-500">{explicacion}</p>}
    </div>
  );
}
