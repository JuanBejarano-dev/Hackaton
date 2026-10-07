import { USE_MOCK_API } from '@/config';
import type { ExperienceLevel, TutorProfile, TutorProfileInput } from '@/types/domain';
import { ApiError, http } from './http';
import { readDb, requireCurrentUser, simulateLatency, toTutorProfile, writeDb, type MockDb } from './mock/db';

interface TutorApi {
  /** Perfil del tutor que tiene la sesión iniciada. */
  getMyProfile(): Promise<TutorProfile>;
  updateMyProfile(input: TutorProfileInput): Promise<TutorProfile>;
  /** Todos los tutores (coordinador). */
  listTutors(): Promise<TutorProfile[]>;
  /** El coordinador ajusta el nivel/prioridad de un tutor. */
  updateExperienceLevel(tutorId: string, experienceLevel: ExperienceLevel): Promise<TutorProfile>;
}

const httpTutorApi: TutorApi = {
  getMyProfile: () => http<TutorProfile>('/tutors/me'),
  updateMyProfile: (input) => http<TutorProfile>('/tutors/me', { method: 'PUT', body: input }),
  listTutors: () => http<TutorProfile[]>('/tutors'),
  updateExperienceLevel: (tutorId, experienceLevel) =>
    http<TutorProfile>(`/tutors/${tutorId}`, { method: 'PATCH', body: { experienceLevel } }),
};

function findMyTutor(db: MockDb) {
  const user = requireCurrentUser(db);
  const tutor = db.tutors.find((candidate) => candidate.userId === user.id);
  if (!tutor) throw new ApiError('No tienes un perfil de tutor', 404);
  return tutor;
}

const mockTutorApi: TutorApi = {
  async getMyProfile() {
    await simulateLatency();
    const db = readDb();
    return toTutorProfile(db, findMyTutor(db));
  },

  async updateMyProfile(input) {
    await simulateLatency();
    const db = readDb();
    const tutor = findMyTutor(db);
    Object.assign(tutor, input);
    writeDb(db);
    return toTutorProfile(db, tutor);
  },

  async listTutors() {
    await simulateLatency();
    const db = readDb();
    return db.tutors.map((tutor) => toTutorProfile(db, tutor));
  },

  async updateExperienceLevel(tutorId, experienceLevel) {
    await simulateLatency();
    const db = readDb();
    const tutor = db.tutors.find((candidate) => candidate.id === tutorId);
    if (!tutor) throw new ApiError('Tutor no encontrado', 404);
    tutor.experienceLevel = experienceLevel;
    writeDb(db);
    return toTutorProfile(db, tutor);
  },
};

export const tutorService: TutorApi = USE_MOCK_API ? mockTutorApi : httpTutorApi;
