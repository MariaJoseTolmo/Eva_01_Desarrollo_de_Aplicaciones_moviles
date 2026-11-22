/**
 * AuthContext.tsx
 * ═══════════════════════════════════════════════════════════════════
 * Context de React para compartir el estado de autenticación en todo
 * el árbol de componentes sin prop-drilling.
 *
 * Uso:
 *  1. Envolver <App> con <AuthProvider>
 *  2. En cualquier componente: const { user, login, logout } = useAuthContext()
 * ═══════════════════════════════════════════════════════════════════
 */
import React, { createContext, useContext } from 'react';
import { useAuth } from './useAuth';
import type { User } from '../services/authService';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext debe usarse dentro de <AuthProvider>');
  }
  return ctx;
};
