/**
 * AuthGuard.tsx
 * Protege rutas privadas. Si no hay sesión redirige a /login.
 *
 * Requisito evaluativo:
 *  - Autenticación de usuarios para proteger las tareas.
 */
import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/AuthContext';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
            <IonSpinner name="crescent" />
            <p style={{ color: 'var(--ion-color-medium)' }}>Verificando sesión…</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default AuthGuard;
