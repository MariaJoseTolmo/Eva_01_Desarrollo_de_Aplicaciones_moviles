/**
 * GuestGuard.tsx
 * Evita que un usuario ya autenticado vea login/register.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/AuthContext';

const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) return null;
  if (user) return <Navigate to="/home" replace />;

  return <>{children}</>;
};

export default GuestGuard;
