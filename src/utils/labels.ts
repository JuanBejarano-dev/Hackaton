import type { Role } from '@/types/auth';
import type { ExperienceLevel, ModalityPreference, RequestStatus, TutorModality } from '@/types/domain';

export const ROLE_LABELS: Record<Role, string> = {
  student: 'Estudiante',
  tutor: 'Tutor',
  coordinator: 'Coordinador',
};

export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  junior: 'Junior',
  intermediate: 'Intermedio',
  senior: 'Senior',
};

export const TUTOR_MODALITY_LABELS: Record<TutorModality, string> = {
  virtual: 'Virtual',
  in_person: 'Presencial',
  both: 'Virtual y presencial',
};

export const MODALITY_PREFERENCE_LABELS: Record<ModalityPreference, string> = {
  virtual: 'Virtual',
  in_person: 'Presencial',
  any: 'Me da igual',
};

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'Pendiente',
  assigned: 'Asignada',
  no_match: 'Sin tutor disponible',
};

const dateFormatter = new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' });

export const formatDate = (iso: string): string => dateFormatter.format(new Date(iso));
