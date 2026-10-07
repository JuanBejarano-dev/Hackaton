import { ProgressBar } from '@atoms/ProgressBar';

export interface CriterionBarProps {
  label: string;
  /** 0 a 100. */
  score: number;
  /** 0 a 1. */
  weight: number;
}

/** Una fila del desglose del score: criterio, peso y puntaje. */
export function CriterionBar({ label, score, weight }: CriterionBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-slate-700">
          {label} <span className="text-xs text-slate-400">· peso {Math.round(weight * 100)}%</span>
        </span>
        <span className="font-semibold tabular-nums text-slate-900">{Math.round(score)}</span>
      </div>
      <ProgressBar value={score} label={`${label}: ${Math.round(score)} de 100`} size="sm" />
    </div>
  );
}
