import type { AuthSession, LoginCredentials, RegisterData, User } from '@/types/auth';
import { apiRequest, clearToken, getToken, saveToken } from './apiClient';

export interface AuthResponse { user: User; token: string }
interface CurrentUserResponse { user: User }

export class AuthError extends Error {
  constructor(message: string) { super(message); this.name = 'AuthError'; }
}

export function getStoredSession(): AuthSession | null {
  const token = getToken();
  return token ? { token, user: { id: '', name: '', email: '' } } : null;
}

export async function login({ email, password, rememberMe }: LoginCredentials): Promise<AuthSession> {
  const result = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password, rememberMe }),
  });
  saveToken(result.token, rememberMe);
  return result;
}

export async function register({ name, email, password }: RegisterData): Promise<AuthSession> {
  const result = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST', body: JSON.stringify({ name, email, password }),
  });
  saveToken(result.token, true);
  return result;
}

export async function getCurrentUser(): Promise<User | null> {
  if (!getToken()) return null;
  try {
    const result = await apiRequest<CurrentUserResponse>('/auth/me', { protected: true });
    return result.user;
  } catch (error) {
    clearToken();
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    if (getToken()) await apiRequest<void>('/auth/logout', { method: 'POST', protected: true });
  } finally { clearToken(); }
}
