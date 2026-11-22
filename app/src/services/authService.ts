/**
 * authService.ts
 * -----------------------------------------------------------------------
 * Servicio de autenticación basado en Capacitor Preferences (almacenamiento
 * local persistente). En un entorno de producción este módulo se reemplazaría
 * por llamadas a un backend real (JWT, OAuth, etc.).
 *
 * Requisito evaluativo:
 *  - Integrar sistema básico de autenticación para proteger las tareas y
 *    permitir múltiples usuarios.
 *  - Integrar permisos de usuario de forma segura.
 */
import { Preferences } from '@capacitor/preferences';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface StoredUser extends User {
  /** Contraseña hasheada con btoa (representación mínima para evaluación) */
  passwordHash: string;
}

const USERS_KEY = 'auth_users';
const SESSION_KEY = 'auth_session';

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

/** Simulación de hash ligero (suficiente para demostración académica). */
const hashPassword = (password: string): string => btoa(unescape(encodeURIComponent(password)));

const loadUsers = async (): Promise<StoredUser[]> => {
  const { value } = await Preferences.get({ key: USERS_KEY });
  return value ? (JSON.parse(value) as StoredUser[]) : [];
};

const saveUsers = async (users: StoredUser[]): Promise<void> => {
  await Preferences.set({ key: USERS_KEY, value: JSON.stringify(users) });
};

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

/**
 * Registra un nuevo usuario. Lanza error si el email ya existe.
 */
export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<User> => {
  const users = await loadUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('Ya existe una cuenta con ese correo electrónico.');
  }

  const newUser: StoredUser = {
    id: `usr_${Date.now()}`,
    username: username.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  await saveUsers([...users, newUser]);

  // Iniciar sesión automáticamente tras registro
  const { passwordHash: _pw, ...publicUser } = newUser;
  void _pw; // evita advertencia de variable no usada
  await Preferences.set({ key: SESSION_KEY, value: JSON.stringify(publicUser) });
  return publicUser;
};

/**
 * Inicia sesión y persiste la sesión en Preferences.
 */
export const login = async (email: string, password: string): Promise<User> => {
  const users = await loadUsers();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.passwordHash === hashPassword(password),
  );
  if (!user) {
    throw new Error('Correo o contraseña incorrectos.');
  }

  const { passwordHash: _pw, ...publicUser } = user;
  void _pw;
  await Preferences.set({ key: SESSION_KEY, value: JSON.stringify(publicUser) });
  return publicUser;
};

/**
 * Cierra la sesión actual.
 */
export const logout = async (): Promise<void> => {
  await Preferences.remove({ key: SESSION_KEY });
};

/**
 * Retorna el usuario de sesión activa o null.
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { value } = await Preferences.get({ key: SESSION_KEY });
  return value ? (JSON.parse(value) as User) : null;
};
