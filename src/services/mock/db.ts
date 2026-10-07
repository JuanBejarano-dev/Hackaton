import type { User } from '@/types/auth';
import type {
  ExperienceLevel,
  Subject,
  TimeBlock,
  TutoringRequest,
  TutoringRequestInput,
  TutorModality,
  TutorProfile,
} from '@/types/domain';
import { ApiError } from '../http';
import { getStoredSession } from '../session';
import { rankTutors } from './matching';

/*
 * Base de datos SIMULADA en localStorage, solo para el modo mock.
 * Las contraseñas están en texto plano porque es una demo: el backend real debe cifrarlas.
 */

const DB_KEY = 'tutormatch.mockdb.v1';
const NETWORK_DELAY_MS = 500;

export interface StoredUser extends User {
  password: string;
}

export interface StoredTutor {
  id: string;
  userId: string;
  subjectIds: string[];
  availability: TimeBlock[];
  experienceLevel: ExperienceLevel;
  modality: TutorModality;
  bio: string;
}

export interface MockDb {
  users: StoredUser[];
  tutors: StoredTutor[];
  requests: TutoringRequest[];
}

export const SUBJECTS: Subject[] = [
  { id: 'calc-1', name: 'Cálculo I' },
  { id: 'calc-2', name: 'Cálculo II' },
  { id: 'linear-algebra', name: 'Álgebra Lineal' },
  { id: 'physics-1', name: 'Física I' },
  { id: 'chemistry', name: 'Química General' },
  { id: 'statistics', name: 'Estadística' },
  { id: 'programming-1', name: 'Programación I' },
  { id: 'data-structures', name: 'Estructuras de Datos' },
  { id: 'databases', name: 'Bases de Datos' },
  { id: 'english', name: 'Inglés' },
];

export const DEMO_PASSWORD = 'Demo1234';

const block = (day: TimeBlock['day'], slot: TimeBlock['slot']): TimeBlock => ({ day, slot });

function createSeed(): MockDb {
  const tutorUsers: Array<[string, string, string]> = [
    ['u-tutor-1', 'Laura Gómez', 'tutor@hackaton.dev'],
    ['u-tutor-2', 'Andrés Pérez', 'andres@hackaton.dev'],
    ['u-tutor-3', 'Camila Rojas', 'camila@hackaton.dev'],
    ['u-tutor-4', 'Santiago Díaz', 'santiago@hackaton.dev'],
    ['u-tutor-5', 'Valentina Torres', 'valentina@hackaton.dev'],
    ['u-tutor-6', 'Mateo Herrera', 'mateo@hackaton.dev'],
  ];

  const users: StoredUser[] = [
    { id: 'u-coord', name: 'Coordinación Tutorías', email: 'coordinador@hackaton.dev', role: 'coordinator', password: DEMO_PASSWORD },
    { id: 'u-student', name: 'Sofía Martínez', email: 'estudiante@hackaton.dev', role: 'student', password: DEMO_PASSWORD },
    ...tutorUsers.map(([id, name, email]) => ({ id, name, email, role: 'tutor' as const, password: DEMO_PASSWORD })),
  ];

  const tutors: StoredTutor[] = [
    {
      id: 't-1', userId: 'u-tutor-1', experienceLevel: 'senior', modality: 'both',
      subjectIds: ['calc-1', 'calc-2', 'linear-algebra'],
      availability: [block('monday', '07-09'), block('monday', '09-11'), block('wednesday', '07-09'), block('wednesday', '09-11'), block('friday', '14-16')],
      bio: 'Monitora de matemáticas hace 3 semestres.',
    },
    {
      id: 't-2', userId: 'u-tutor-2', experienceLevel: 'intermediate', modality: 'virtual',
      subjectIds: ['programming-1', 'data-structures', 'databases'],
      availability: [block('tuesday', '14-16'), block('tuesday', '16-18'), block('thursday', '14-16'), block('thursday', '16-18'), block('saturday', '09-11')],
      bio: 'Desarrollador backend, me gusta explicar con ejercicios prácticos.',
    },
    {
      id: 't-3', userId: 'u-tutor-3', experienceLevel: 'junior', modality: 'in_person',
      subjectIds: ['calc-1', 'physics-1'],
      availability: [block('monday', '14-16'), block('wednesday', '14-16'), block('friday', '09-11')],
      bio: 'Primer semestre como tutora.',
    },
    {
      id: 't-4', userId: 'u-tutor-4', experienceLevel: 'senior', modality: 'both',
      subjectIds: ['physics-1', 'chemistry', 'statistics'],
      availability: [block('tuesday', '07-09'), block('thursday', '07-09'), block('friday', '07-09'), block('saturday', '09-11')],
      bio: 'Estudiante de ingeniería química, 4 semestres como tutor.',
    },
    {
      id: 't-5', userId: 'u-tutor-5', experienceLevel: 'intermediate', modality: 'virtual',
      subjectIds: ['programming-1', 'statistics', 'english'],
      availability: [block('monday', '18-20'), block('tuesday', '18-20'), block('wednesday', '18-20'), block('thursday', '18-20')],
      bio: 'Disponible en las noches por videollamada.',
    },
    {
      id: 't-6', userId: 'u-tutor-6', experienceLevel: 'junior', modality: 'in_person',
      subjectIds: ['calc-2', 'linear-algebra', 'statistics'],
      availability: [block('monday', '09-11'), block('tuesday', '09-11'), block('wednesday', '09-11')],
      bio: '',
    },
  ];

  const db: MockDb = { users, tutors, requests: [] };
  db.requests.push(
    buildRequest(db, 'u-student', {
      subjectId: 'calc-1',
      modality: 'any',
      availability: [block('monday', '07-09'), block('monday', '09-11'), block('wednesday', '14-16')],
      notes: 'Tengo parcial de límites y derivadas en dos semanas.',
    }),
  );
  return db;
}

export function readDb(): MockDb {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as MockDb;
  } catch {
    // Datos corruptos: se regenera la semilla.
  }
  const seed = createSeed();
  writeDb(seed);
  return seed;
}

export function writeDb(db: MockDb): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export const simulateLatency = () => new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));

export function requireCurrentUser(db: MockDb): User {
  const sessionUser = getStoredSession()?.user;
  const user = sessionUser && db.users.find((candidate) => candidate.id === sessionUser.id);
  if (!user) throw new ApiError('Sesión expirada', 401);
  return toPublicUser(user);
}

export function toPublicUser({ id, name, email, role }: StoredUser): User {
  return { id, name, email, role };
}

export function toTutorProfile(db: MockDb, tutor: StoredTutor): TutorProfile {
  const user = db.users.find((candidate) => candidate.id === tutor.userId);
  return {
    id: tutor.id,
    user: { id: tutor.userId, name: user?.name ?? 'Tutor', email: user?.email ?? '' },
    subjects: SUBJECTS.filter((subject) => tutor.subjectIds.includes(subject.id)),
    availability: tutor.availability,
    experienceLevel: tutor.experienceLevel,
    modality: tutor.modality,
    bio: tutor.bio,
  };
}

export function buildRequest(db: MockDb, studentId: string, input: TutoringRequestInput): TutoringRequest {
  const student = db.users.find((candidate) => candidate.id === studentId);
  const subject = SUBJECTS.find((candidate) => candidate.id === input.subjectId);
  if (!student || !subject) throw new ApiError('Datos de la solicitud inválidos', 400);

  const matches = rankTutors(
    input,
    db.tutors.map((tutor) => toTutorProfile(db, tutor)),
  );
  const best = matches.find((match) => match.matchingBlocks.length > 0);

  return {
    id: crypto.randomUUID(),
    student: { id: student.id, name: student.name, email: student.email },
    subject,
    availability: input.availability,
    modality: input.modality,
    notes: input.notes,
    status: best ? 'assigned' : 'no_match',
    createdAt: new Date().toISOString(),
    assignedTutorId: best?.tutor.id ?? null,
    matches,
  };
}
