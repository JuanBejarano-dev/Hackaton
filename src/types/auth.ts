export type Role = 'student' | 'tutor' | 'coordinator';

/** Roles que un usuario puede elegir al registrarse (el coordinador lo crea el sistema). */
export type SelfRegisterRole = Exclude<Role, 'coordinator'>;

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
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
  role: SelfRegisterRole;
}

export interface AuthSession {
  user: User;
  token: string;
}

export type AuthStatus = 'authenticated' | 'unauthenticated';
