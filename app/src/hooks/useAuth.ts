/**
 * useAuth.ts
 * Hook de React que expone el estado de autenticación y las acciones
 * de login, register y logout.
 */
import { useEffect, useState } from 'react';
import type { User } from '../services/authService';
import {
  getCurrentUser,
  login as authLogin,
  logout as authLogout,
  register as authRegister,
} from '../services/authService';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const u = await authLogin(email, password);
    setUser(u);
  };

  const register = async (username: string, email: string, password: string) => {
    const u = await authRegister(username, email, password);
    setUser(u);
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  return { user, loading, login, register, logout };
};
