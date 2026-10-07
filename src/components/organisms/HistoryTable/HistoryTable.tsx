import { Badge } from '@atoms/Badge';
import { Card } from '@atoms/Card';
import type { SolicitudRegistrada } from '@/types/domain';
import { cn } from '@utils/cn';
import { formatDate, formatScore, modalidadLabel } from '@utils/labels';
import { formatHorario } from '@utils/schedule';

export interface HistoryTableProps {
  solicitudes: SolicitudRegistrada[];
}

/** Historial de asignaciones: una fila por cada búsqueda registrada en el backend. */
export function HistoryTable({ solicitudes }: HistoryTableProps) {
  return (
    <Card padding="none" className="overflow-x-auto">
      <table className="w-full min-w-[1080px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3">Fecha</th>
            <th scope="col" className="px-4 py-3">Estudiante</th>
            <th scope="col" className="px-4 py-3">Materia</th>
            <th scope="col" className="px-4 py-3">Horarios</th>
            <th scope="col" className="px-4 py-3">Modalidad</th>
            <th scope="col" className="px-4 py-3">Tutor asignado</th>
            <th scope="col" className="px-4 py-3 text-right">Score</th>
            <th scope="col" className="px-4 py-3">Justificación</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.id} className={cn('align-top', !solicitud.asignada && 'bg-amber-50/50')}>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                <time dateTime={solicitud.fecha}>{formatDate(solicitud.fecha)}</time>
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">{solicitud.nombreEstudiante}</td>
              <td className="px-4 py-3 text-slate-700">{solicitud.materia}</td>
              <td className="px-4 py-3">
                <div className="flex max-w-[11rem] flex-wrap gap-1">
                  {solicitud.horarios.map((horario) => (
                    <Badge key={horario}>{formatHorario(horario)}</Badge>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-slate-700">{modalidadLabel(solicitud.modalidad)}</td>
              <td className="px-4 py-3">
                {solicitud.asignada && solicitud.nombreTutorAsignado ? (
                  <span className="font-medium text-slate-900">{solicitud.nombreTutorAsignado}</span>
                ) : (
                  <Badge tone="warning">Sin asignar</Badge>
                )}
              </td>
              <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-900">
                {solicitud.score === null ? '—' : formatScore(solicitud.score)}
              </td>
              <td className="max-w-xs px-4 py-3 text-xs leading-relaxed text-slate-600">
                {solicitud.justificacion}
                <span className="mt-1 block text-slate-400">{solicitud.candidatosEvaluados} candidatos evaluados</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
