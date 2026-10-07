import { useId } from 'react';
import { ErrorMessage } from '@atoms/ErrorMessage';
import { Icon } from '@atoms/Icon';
import { Label } from '@atoms/Label';
import { ToggleChip } from '@atoms/ToggleChip';
import type { TimeBlock } from '@/types/domain';
import { cn } from '@utils/cn';
import { DAYS, hasBlock, TIME_SLOTS, toggleBlock } from '@utils/schedule';

export interface AvailabilityGridProps {
  label?: string;
  value: TimeBlock[];
  /** Si se omite, la cuadrícula es de solo lectura. */
  onChange?: (next: TimeBlock[]) => void;
  /** Bloques a resaltar (p. ej. los que coinciden con el tutor). Solo en modo lectura. */
  highlight?: TimeBlock[];
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
}

/** Cuadrícula días × franjas horarias para elegir o mostrar disponibilidad por bloques. */
export function AvailabilityGrid({
  label = 'Disponibilidad',
  value,
  onChange,
  highlight = [],
  error,
  hint,
  required,
  disabled,
}: AvailabilityGridProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const isEditable = Boolean(onChange);

  return (
    <fieldset className="min-w-0 space-y-2" aria-describedby={error ? errorId : hint ? hintId : undefined}>
      <Label as="legend" required={required}>
        {label}
      </Label>

      <div className="relative overflow-x-auto rounded-xl ring-1 ring-slate-200">
        <table className="w-full min-w-[540px] border-collapse bg-white text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th scope="col" className="w-28 px-2 py-2 text-left text-xs font-medium text-slate-500">
                Hora
              </th>
              {DAYS.map((day) => (
                <th key={day.id} scope="col" className="px-1 py-2 text-xs font-semibold text-slate-700">
                  <abbr title={day.label} className="no-underline">
                    {day.short}
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot.id} className="border-t border-slate-100">
                <th scope="row" className="whitespace-nowrap px-2 py-1 text-left text-xs font-medium text-slate-500">
                  {slot.label}
                </th>
                {DAYS.map((day) => {
                  const block: TimeBlock = { day: day.id, slot: slot.id };
                  const isSelected = hasBlock(value, block);
                  const isHighlighted = hasBlock(highlight, block);
                  const cellLabel = `${day.label} ${slot.label}`;

                  return (
                    <td key={day.id} className="p-1">
                      {isEditable ? (
                        <ToggleChip
                          shape="cell"
                          selected={isSelected}
                          disabled={disabled}
                          aria-label={cellLabel}
                          onClick={() => onChange?.(toggleBlock(value, block))}
                        >
                          {isSelected && <Icon name="check" className="h-4 w-4" />}
                        </ToggleChip>
                      ) : (
                        <div
                          title={cellLabel}
                          className={cn(
                            'flex h-9 items-center justify-center rounded-md',
                            isHighlighted
                              ? 'bg-emerald-500 text-white'
                              : isSelected
                                ? 'bg-brand-100 text-brand-700'
                                : 'bg-slate-50',
                          )}
                        >
                          {(isSelected || isHighlighted) && <Icon name="check" className="h-4 w-4" />}
                          <span className="sr-only">
                            {cellLabel}: {isHighlighted ? 'coincide' : isSelected ? 'disponible' : 'no disponible'}
                          </span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>
          {value.length} {value.length === 1 ? 'bloque seleccionado' : 'bloques seleccionados'}
        </span>
        {!isEditable && highlight.length > 0 && (
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-emerald-500" aria-hidden="true" /> Coincide con el tutor
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-brand-100" aria-hidden="true" /> Solo tu horario
            </span>
          </span>
        )}
      </div>

      {error ? (
        <ErrorMessage id={errorId} message={error} />
      ) : (
        hint && (
          <p id={hintId} className="text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </fieldset>
  );
}
