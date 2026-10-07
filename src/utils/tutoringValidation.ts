import type { ModalityPreference, TimeBlock, TutorModality } from '@/types/domain';
import type { FormErrors } from './authValidation';

export type RequestFormValues = {
  subjectId: string;
  modality: ModalityPreference;
  availability: TimeBlock[];
  notes: string;
};

export type TutorProfileFormValues = {
  subjectIds: string[];
  modality: TutorModality;
  availability: TimeBlock[];
  bio: string;
};

const NOTES_MAX_LENGTH = 500;

export function validateRequest(values: RequestFormValues): FormErrors<RequestFormValues> {
  const errors: FormErrors<RequestFormValues> = {};

  if (!values.subjectId) errors.subjectId = 'Elige la materia en la que necesitas ayuda';
  if (values.availability.length === 0) errors.availability = 'Marca al menos un bloque de tu horario';
  if (values.notes.length > NOTES_MAX_LENGTH) errors.notes = `Máximo ${NOTES_MAX_LENGTH} caracteres`;

  return errors;
}

export function validateTutorProfile(values: TutorProfileFormValues): FormErrors<TutorProfileFormValues> {
  const errors: FormErrors<TutorProfileFormValues> = {};

  if (values.subjectIds.length === 0) errors.subjectIds = 'Elige al menos una materia que domines';
  if (values.availability.length === 0) errors.availability = 'Marca al menos un bloque disponible';
  if (values.bio.length > NOTES_MAX_LENGTH) errors.bio = `Máximo ${NOTES_MAX_LENGTH} caracteres`;

  return errors;
}
