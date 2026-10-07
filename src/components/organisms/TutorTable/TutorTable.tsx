import { Badge } from '@atoms/Badge';
import { Card } from '@atoms/Card';
import { Select } from '@atoms/Select';
import { UserIdentity } from '@molecules/UserIdentity';
import type { ExperienceLevel, TutorProfile } from '@/types/domain';
import { EXPERIENCE_LABELS, TUTOR_MODALITY_LABELS } from '@utils/labels';

export interface TutorTableProps {
  tutors: TutorProfile[];
  /** Número de tutorías asignadas por id de tutor. */
  assignmentCounts?: Record<string, number>;
  /** Si se define, el nivel se puede editar desde la tabla. */
  onLevelChange?: (tutorId: string, level: ExperienceLevel) => void;
  /** Tutor cuyo nivel se está guardando. */
  updatingTutorId?: string | null;
}

const LEVELS = Object.keys(EXPERIENCE_LABELS) as ExperienceLevel[];

export function TutorTable({ tutors, assignmentCounts = {}, onLevelChange, updatingTutorId }: TutorTableProps) {
  return (
    <Card padding="none" className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-5 py-3">Tutor</th>
            <th scope="col" className="px-5 py-3">Materias</th>
            <th scope="col" className="px-5 py-3">Disponibilidad</th>
            <th scope="col" className="px-5 py-3">Modalidad</th>
            <th scope="col" className="px-5 py-3 text-center">Tutorías</th>
            <th scope="col" className="px-5 py-3">Nivel / prioridad</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tutors.map((tutor) => (
            <tr key={tutor.id} className="align-top">
              <td className="px-5 py-4">
                <UserIdentity size="sm" name={tutor.user.name} detail={tutor.user.email} />
              </td>
              <td className="px-5 py-4">
                {tutor.subjects.length > 0 ? (
                  <div className="flex max-w-xs flex-wrap gap-1">
                    {tutor.subjects.map((subject) => (
                      <Badge key={subject.id}>{subject.name}</Badge>
                    ))}
                  </div>
                ) : (
                  <Badge tone="warning">Perfil incompleto</Badge>
                )}
              </td>
              <td className="px-5 py-4 tabular-nums text-slate-700">{tutor.availability.length} bloques</td>
              <td className="px-5 py-4 text-slate-700">{TUTOR_MODALITY_LABELS[tutor.modality]}</td>
              <td className="px-5 py-4 text-center font-semibold tabular-nums text-slate-900">
                {assignmentCounts[tutor.id] ?? 0}
              </td>
              <td className="px-5 py-4">
                {onLevelChange ? (
                  <Select
                    aria-label={`Nivel de ${tutor.user.name}`}
                    value={tutor.experienceLevel}
                    disabled={updatingTutorId === tutor.id}
                    onChange={(event) => onLevelChange(tutor.id, event.target.value as ExperienceLevel)}
                    className="h-9 w-36"
                  >
                    {LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {EXPERIENCE_LABELS[level]}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Badge tone="brand">{EXPERIENCE_LABELS[tutor.experienceLevel]}</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
