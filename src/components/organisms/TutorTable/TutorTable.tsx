import { Badge } from '@atoms/Badge';
import { Card } from '@atoms/Card';
import { Icon } from '@atoms/Icon';
import { UserIdentity } from '@molecules/UserIdentity';
import type { TutorView } from '@/types/domain';
import { modalidadLabel, nivelLabel } from '@utils/labels';
import { formatHorario } from '@utils/schedule';

export interface TutorTableProps {
  tutores: TutorView[];
}

export function TutorTable({ tutores }: TutorTableProps) {
  return (
    <Card padding="none" className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-5 py-3">Tutor</th>
            <th scope="col" className="px-5 py-3">Materias</th>
            <th scope="col" className="px-5 py-3">Horarios</th>
            <th scope="col" className="px-5 py-3">Modalidad</th>
            <th scope="col" className="px-5 py-3">Nivel</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tutores.map((tutor) => (
            <tr key={tutor.id} className="align-top">
              <td className="px-5 py-4">
                <UserIdentity
                  size="sm"
                  name={tutor.nombre}
                  detail={
                    <span className="inline-flex items-center gap-1">
                      <Icon name="star" className="h-3.5 w-3.5 text-amber-500" />
                      {tutor.calificacion.toFixed(1)}/5
                    </span>
                  }
                />
              </td>
              <td className="px-5 py-4">
                <div className="flex max-w-xs flex-wrap gap-1">
                  {tutor.materias.map((materia) => (
                    <Badge key={materia}>{materia}</Badge>
                  ))}
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex max-w-xs flex-wrap gap-1">
                  {tutor.horarios.map((horario) => (
                    <Badge key={horario} tone="success">
                      {formatHorario(horario)}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="px-5 py-4 text-slate-700">{modalidadLabel(tutor.modalidad)}</td>
              <td className="px-5 py-4">
                <Badge tone="brand">{nivelLabel(tutor.nivel)}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
