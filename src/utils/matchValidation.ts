import type { Horario, Modalidad, Nivel } from '@/types/domain';
import type { FormErrors } from './authValidation';
import { isBlank } from './validators';

export type MatchFormValues = {
  nombreEstudiante: string;
  materia: string;
  modalidad: Modalidad;
  horarios: Horario[];
};

export type TutorFormValues = {
  nombre: string;
  materias: string[];
  horarios: Horario[];
  /** Como texto para los chips; se convierte a número al enviar. */
  nivel: `${Nivel}`;
  calificacion: string;
  modalidad: Modalidad;
};

export function validateMatch(values: MatchFormValues): FormErrors<MatchFormValues> {
  const errors: FormErrors<MatchFormValues> = {};

  if (isBlank(values.nombreEstudiante)) errors.nombreEstudiante = 'Escribe el nombre del estudiante';
  else if (values.nombreEstudiante.trim().length < 2) errors.nombreEstudiante = 'El nombre es demasiado corto';
  if (!values.materia) errors.materia = 'Elige la materia';
  if (values.horarios.length === 0) errors.horarios = 'Marca al menos un horario';

  return errors;
}

export function validateTutor(values: TutorFormValues): FormErrors<TutorFormValues> {
  const errors: FormErrors<TutorFormValues> = {};
  const calificacion = Number(values.calificacion);

  if (isBlank(values.nombre)) errors.nombre = 'El nombre es obligatorio';
  else if (values.nombre.trim().length < 2) errors.nombre = 'El nombre es demasiado corto';
  if (values.materias.length === 0) errors.materias = 'Elige al menos una materia';
  if (values.horarios.length === 0) errors.horarios = 'Marca al menos un horario';
  if (isBlank(values.calificacion)) errors.calificacion = 'La calificación es obligatoria';
  else if (Number.isNaN(calificacion) || calificacion < 0 || calificacion > 5)
    errors.calificacion = 'Debe ser un número entre 0 y 5';

  return errors;
}
