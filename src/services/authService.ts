import type { AuthSession, LoginCredentials, RegisterData, User } from '@/types/auth';

/**
 * Servicio de autenticación SIMULADO (mock) sobre localStorage.
 * Las contraseñas se guardan en texto plano solo porque es una demo:
 * reemplaza el cuerpo de cada función por llamadas a tu API real
 * (p. ej. fetch('/api/auth/login')) manteniendo las mismas firmas.
 */

const USERS_KEY = 'hackaton.auth.users';
const SESSION_KEY = 'hackaton.auth.session';
const NETWORK_DELAY_MS = 700;

interface StoredUser extends User {
  password: string;
}

const DEMO_USER: StoredUser = {
  id: 'demo-user',
  name: 'Usuario Demo',
  email: 'demo@hackaton.dev',
  password: 'Demo1234',
};

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [DEMO_USER];
  } catch {
    return [DEMO_USER];
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublicUser({ id, name, email }: StoredUser): User {
  return { id, name, email };
}

function createSession(user: StoredUser): AuthSession {
  return { user: toPublicUser(user), token: crypto.randomUUID() };
}

function persistSession(session: AuthSession, rememberMe: boolean): void {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export async function login({ email, password, rememberMe }: LoginCredentials): Promise<AuthSession> {
  await wait(NETWORK_DELAY_MS);

  const normalizedEmail = email.trim().toLowerCase();
  const user = readUsers().find((candidate) => candidate.email === normalizedEmail);

  if (!user || user.password !== password) {
    throw new AuthError('Correo o contraseña incorrectos');
  }

  const session = createSession(user);
  persistSession(session, rememberMe);
  return session;
}

export async function register({ name, email, password }: RegisterData): Promise<AuthSession> {
  await wait(NETWORK_DELAY_MS);

  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((candidate) => candidate.email === normalizedEmail)) {
    throw new AuthError('Ya existe una cuenta con ese correo');
  }

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    password,
  };
  writeUsers([...users, newUser]);

  const session = createSession(newUser);
  persistSession(session, true);
  return session;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}
