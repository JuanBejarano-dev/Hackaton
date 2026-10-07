import { Alert } from '@atoms/Alert';
import { Button } from '@atoms/Button';
import { Icon } from '@atoms/Icon';
import { ChipGroupField } from '@molecules/ChipGroupField';
import { FormField } from '@molecules/FormField';
import { SelectField } from '@molecules/SelectField';
import { AvailabilityGrid } from '@organisms/AvailabilityGrid';
import { useForm } from '@hooks/useForm';
import type { SolicitudMatch } from '@/types/domain';
import { MATERIAS, MODALIDADES } from '@utils/catalog';
import { validateMatch, type MatchFormValues } from '@utils/matchValidation';

export interface RequestFormProps {
  onSubmit: (values: SolicitudMatch) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

const INITIAL_VALUES: MatchFormValues = { nombreEstudiante: '', materia: '', modalidad: 'AMBAS', horarios: [] };

const MATERIA_OPTIONS = MATERIAS.map((materia) => ({ value: materia, label: materia }));

/** Formulario de búsqueda del tutor ideal (POST /match). */
export function RequestForm({ onSubmit, isLoading = false, errorMessage }: RequestFormProps) {
  const { values, handleChange, handleBlur, setFieldValue, handleSubmit, getFieldError } =
    useForm<MatchFormValues>({
      initialValues: INITIAL_VALUES,
      validate: validateMatch,
      onSubmit: (formValues) => onSubmit({ ...formValues, nombreEstudiante: formValues.nombreEstudiante.trim() }),
    });

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6" aria-label="Buscar tutor">
      {errorMessage && <Alert variant="error">{errorMessage}</Alert>}

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          name="nombreEstudiante"
          label="Nombre del estudiante"
          icon="user"
          placeholder="Pedro Pérez"
          required
          value={values.nombreEstudiante}
          error={getFieldError('nombreEstudiante')}
          disabled={isLoading}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <SelectField
          name="materia"
          label="Materia"
          placeholder="Selecciona una materia"
          required
          options={MATERIA_OPTIONS}
          value={values.materia}
          error={getFieldError('materia')}
          disabled={isLoading}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <ChipGroupField
        label="Modalidad preferida"
        options={MODALIDADES}
        selected={[values.modalidad]}
        disabled={isLoading}
        onToggle={(modalidad) => setFieldValue('modalidad', modalidad)}
      />

      <AvailabilityGrid
        label="¿Cuándo puede recibir la tutoría?"
        hint="Marca todos los horarios posibles: más horarios = más tutores disponibles."
        required
        value={values.horarios}
        error={getFieldError('horarios')}
        disabled={isLoading}
        onChange={(horarios) => setFieldValue('horarios', horarios)}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          leftIcon={<Icon name="sparkles" className="h-4 w-4" />}
        >
          {isLoading ? 'Buscando tutor…' : 'Buscar tutor ideal'}
        </Button>
      </div>
    </form>
  );
}
