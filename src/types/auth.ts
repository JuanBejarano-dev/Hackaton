export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';
