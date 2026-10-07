import { Alert } from '@atoms/Alert';
import { Button } from '@atoms/Button';
import { Icon } from '@atoms/Icon';
import { ChipGroupField } from '@molecules/ChipGroupField';
import { SelectField } from '@molecules/SelectField';
import { TextareaField } from '@molecules/TextareaField';
import { AvailabilityGrid } from '@organisms/AvailabilityGrid';
import { useForm } from '@hooks/useForm';
import type { ModalityPreference, Subject, TutoringRequestInput } from '@/types/domain';
import { MODALITY_PREFERENCE_LABELS } from '@utils/labels';
import { validateRequest, type RequestFormValues } from '@utils/tutoringValidation';

export interface RequestFormProps {
  subjects: Subject[];
  onSubmit: (values: TutoringRequestInput) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

const INITIAL_VALUES: RequestFormValues = { subjectId: '', modality: 'any', availability: [], notes: '' };

const MODALITY_OPTIONS = (Object.keys(MODALITY_PREFERENCE_LABELS) as ModalityPreference[]).map((value) => ({
  value,
  label: MODALITY_PREFERENCE_LABELS[value],
}));

export function RequestForm({ subjects, onSubmit, isLoading = false, errorMessage }: RequestFormProps) {
  const { values, handleChange, handleBlur, setFieldValue, handleSubmit, getFieldError } =
    useForm<RequestFormValues>({ initialValues: INITIAL_VALUES, validate: validateRequest, onSubmit });

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6" aria-label="Nueva solicitud de tutoría">
      {errorMessage && <Alert variant="error">{errorMessage}</Alert>}

      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          name="subjectId"
          label="Materia"
          placeholder="Selecciona una materia"
          required
          options={subjects.map((subject) => ({ value: subject.id, label: subject.name }))}
          value={values.subjectId}
          error={getFieldError('subjectId')}
          disabled={isLoading}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <ChipGroupField
          label="Modalidad preferida"
          options={MODALITY_OPTIONS}
          selected={[values.modality]}
          disabled={isLoading}
          onToggle={(modality) => setFieldValue('modality', modality)}
        />
      </div>

      <AvailabilityGrid
        label="¿Cuándo puedes recibir la tutoría?"
        hint="Marca todos los bloques en los que tienes tiempo: más bloques = más tutores posibles."
        required
        value={values.availability}
        error={getFieldError('availability')}
        disabled={isLoading}
        onChange={(availability) => setFieldValue('availability', availability)}
      />

      <TextareaField
        name="notes"
        label="Detalles adicionales"
        placeholder="Temas puntuales, fecha de examen, cómo prefieres estudiar…"
        hint="Opcional"
        value={values.notes}
        error={getFieldError('notes')}
        disabled={isLoading}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          leftIcon={<Icon name="sparkles" className="h-4 w-4" />}
        >
          {isLoading ? 'Buscando tutor…' : 'Buscar mi tutor ideal'}
        </Button>
      </div>
    </form>
  );
}
