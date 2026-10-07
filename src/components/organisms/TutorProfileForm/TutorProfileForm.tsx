import { Alert } from '@atoms/Alert';
import { Badge } from '@atoms/Badge';
import { Button } from '@atoms/Button';
import { ChipGroupField } from '@molecules/ChipGroupField';
import { TextareaField } from '@molecules/TextareaField';
import { AvailabilityGrid } from '@organisms/AvailabilityGrid';
import { useForm } from '@hooks/useForm';
import type { ExperienceLevel, Subject, TutorModality, TutorProfileInput } from '@/types/domain';
import { EXPERIENCE_LABELS, TUTOR_MODALITY_LABELS } from '@utils/labels';
import { validateTutorProfile, type TutorProfileFormValues } from '@utils/tutoringValidation';

export interface TutorProfileFormProps {
  subjects: Subject[];
  initialValues: TutorProfileFormValues;
  /** Lo asigna el coordinador; aquí solo se muestra. */
  experienceLevel: ExperienceLevel;
  onSubmit: (values: TutorProfileInput) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
}

const MODALITY_OPTIONS = (Object.keys(TUTOR_MODALITY_LABELS) as TutorModality[]).map((value) => ({
  value,
  label: TUTOR_MODALITY_LABELS[value],
}));

export function TutorProfileForm({
  subjects,
  initialValues,
  experienceLevel,
  onSubmit,
  isLoading = false,
  errorMessage,
  successMessage,
}: TutorProfileFormProps) {
  const { values, handleChange, handleBlur, setFieldValue, handleSubmit, getFieldError } =
    useForm<TutorProfileFormValues>({ initialValues, validate: validateTutorProfile, onSubmit });

  const toggleSubject = (subjectId: string) =>
    setFieldValue(
      'subjectIds',
      values.subjectIds.includes(subjectId)
        ? values.subjectIds.filter((id) => id !== subjectId)
        : [...values.subjectIds, subjectId],
    );

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6" aria-label="Perfil de tutor">
      {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        Nivel de experiencia:
        <Badge tone="brand">{EXPERIENCE_LABELS[experienceLevel]}</Badge>
        <span className="text-xs text-slate-400">(lo asigna la coordinación)</span>
      </div>

      <ChipGroupField
        label="Materias que dominas"
        hint="Selecciona todas las que puedas enseñar."
        required
        options={subjects.map((subject) => ({ value: subject.id, label: subject.name }))}
        selected={values.subjectIds}
        error={getFieldError('subjectIds')}
        disabled={isLoading}
        onToggle={toggleSubject}
      />

      <ChipGroupField
        label="Modalidad"
        options={MODALITY_OPTIONS}
        selected={[values.modality]}
        disabled={isLoading}
        onToggle={(modality) => setFieldValue('modality', modality)}
      />

      <AvailabilityGrid
        label="Tu disponibilidad semanal"
        required
        value={values.availability}
        error={getFieldError('availability')}
        disabled={isLoading}
        onChange={(availability) => setFieldValue('availability', availability)}
      />

      <TextareaField
        name="bio"
        label="Sobre ti"
        placeholder="Tu experiencia como tutor, cómo explicas, logros…"
        hint="Opcional · lo verán los estudiantes"
        value={values.bio}
        error={getFieldError('bio')}
        disabled={isLoading}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div className="flex justify-end">
        <Button type="submit" size="lg" isLoading={isLoading}>
          {isLoading ? 'Guardando…' : 'Guardar perfil'}
        </Button>
      </div>
    </form>
  );
}
