import { Alert } from '@atoms/Alert';
import { Button } from '@atoms/Button';
import { ChipGroupField } from '@molecules/ChipGroupField';
import { FormField } from '@molecules/FormField';
import { AvailabilityGrid } from '@organisms/AvailabilityGrid';
import { useForm } from '@hooks/useForm';
import type { Nivel, TutorInput } from '@/types/domain';
import { MATERIAS, MODALIDADES, NIVELES } from '@utils/catalog';
import { validateTutor, type TutorFormValues } from '@utils/matchValidation';

export interface TutorFormProps {
  onSubmit: (values: TutorInput) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

const INITIAL_VALUES: TutorFormValues = {
  nombre: '',
  materias: [],
  horarios: [],
  nivel: '2',
  calificacion: '',
  modalidad: 'AMBAS',
};

const MATERIA_OPTIONS = MATERIAS.map((materia) => ({ value: materia, label: materia }));
const NIVEL_OPTIONS = NIVELES.map(({ value, label }) => ({ value: String(value) as `${Nivel}`, label }));

/** Formulario de registro de tutor (POST /tutores). */
export function TutorForm({ onSubmit, isLoading = false, errorMessage }: TutorFormProps) {
  const { values, handleChange, handleBlur, setFieldValue, handleSubmit, getFieldError } =
    useForm<TutorFormValues>({
      initialValues: INITIAL_VALUES,
      validate: validateTutor,
      onSubmit: ({ nombre, materias, horarios, nivel, calificacion, modalidad }) =>
        onSubmit({
          nombre: nombre.trim(),
          materias,
          horarios,
          nivel: Number(nivel) as Nivel,
          calificacion: Number(calificacion),
          modalidad,
        }),
    });

  const toggleMateria = (materia: string) =>
    setFieldValue(
      'materias',
      values.materias.includes(materia) ? values.materias.filter((item) => item !== materia) : [...values.materias, materia],
    );

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6" aria-label="Registrar tutor">
      {errorMessage && <Alert variant="error">{errorMessage}</Alert>}

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          name="nombre"
          label="Nombre del tutor"
          icon="user"
          placeholder="Ana Martínez"
          required
          value={values.nombre}
          error={getFieldError('nombre')}
          disabled={isLoading}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FormField
          name="calificacion"
          type="number"
          inputMode="decimal"
          min={0}
          max={5}
          step={0.1}
          label="Calificación (0 a 5)"
          icon="star"
          placeholder="4.8"
          required
          value={values.calificacion}
          error={getFieldError('calificacion')}
          disabled={isLoading}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <ChipGroupField
        label="Materias que domina"
        required
        options={MATERIA_OPTIONS}
        selected={values.materias}
        error={getFieldError('materias')}
        disabled={isLoading}
        onToggle={toggleMateria}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <ChipGroupField
          label="Nivel de experiencia"
          hint="Los tutores con más experiencia tienen mayor peso en el score."
          options={NIVEL_OPTIONS}
          selected={[values.nivel]}
          disabled={isLoading}
          onToggle={(nivel) => setFieldValue('nivel', nivel)}
        />
        <ChipGroupField
          label="Modalidad"
          options={MODALIDADES}
          selected={[values.modalidad]}
          disabled={isLoading}
          onToggle={(modalidad) => setFieldValue('modalidad', modalidad)}
        />
      </div>

      <AvailabilityGrid
        label="Horarios disponibles"
        required
        value={values.horarios}
        error={getFieldError('horarios')}
        disabled={isLoading}
        onChange={(horarios) => setFieldValue('horarios', horarios)}
      />

      <div className="flex justify-end">
        <Button type="submit" size="lg" isLoading={isLoading}>
          {isLoading ? 'Registrando…' : 'Registrar tutor'}
        </Button>
      </div>
    </form>
  );
}
