import type { Tutor, TutorInput, TutorView } from '@/types/domain';
import { toTutorPayload, toTutorView } from '@utils/tutores';
import { http } from './http';

export async function listTutores(): Promise<TutorView[]> {
  const tutores = await http<Tutor[]>('/tutores');
  return tutores.map(toTutorView);
}

export async function getTutor(id: number): Promise<TutorView> {
  return toTutorView(await http<Tutor>(`/tutores/${id}`));
}

export async function createTutor(input: TutorInput): Promise<TutorView> {
  const tutor = await http<Tutor>('/tutores', { method: 'POST', body: toTutorPayload(input) });
  return toTutorView(tutor);
}
