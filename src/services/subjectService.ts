import { USE_MOCK_API } from '@/config';
import type { Subject } from '@/types/domain';
import { http } from './http';
import { simulateLatency, SUBJECTS } from './mock/db';

export async function listSubjects(): Promise<Subject[]> {
  if (!USE_MOCK_API) return http<Subject[]>('/subjects');

  await simulateLatency();
  return SUBJECTS;
}
