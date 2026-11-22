/**
 * LoginPage.tsx
 * Pantalla de inicio de sesión con validación de formulario.
 *
 * Requisito evaluativo:
 *  - Autenticación de usuarios para proteger las tareas y permitir múltiples usuarios.
 */
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonToast,
} from '@ionic/react';
import { lockClosedOutline, logInOutline, personAddOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/home', { replace: true });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent
        fullscreen
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        } as React.CSSProperties}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '32px 16px',
            maxWidth: '480px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <IonIcon
            icon={lockClosedOutline}
            style={{ fontSize: '64px', color: 'var(--ion-color-primary)', marginBottom: '16px' }}
          />
          <h1 style={{ margin: '0 0 8px', fontSize: '1.6rem', fontWeight: 700 }}>To-Do IPSS</h1>
          <p style={{ color: 'var(--ion-color-medium)', marginBottom: '24px', textAlign: 'center' }}>
            Inicia sesión para acceder a tus tareas
          </p>

          <IonCard style={{ width: '100%' }}>
            <IonCardHeader>
              <IonCardTitle>Iniciar Sesión</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleLogin} noValidate>
                <IonList lines="none">
                  <IonItem>
                    <IonInput
                      type="email"
                      label="Correo electrónico"
                      labelPlacement="stacked"
                      placeholder="usuario@correo.com"
                      value={email}
                      onIonInput={(e) => setEmail(String(e.detail.value ?? ''))}
                      autocomplete="email"
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      type="password"
                      label="Contraseña"
                      labelPlacement="stacked"
                      placeholder="••••••••"
                      value={password}
                      onIonInput={(e) => setPassword(String(e.detail.value ?? ''))}
                      autocomplete="current-password"
                    />
                  </IonItem>
                </IonList>

                <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <IonButton type="submit" expand="block" color="primary" disabled={loading}>
                    {loading ? (
                      <IonSpinner name="crescent" />
                    ) : (
                      <>
                        <IonIcon slot="start" icon={logInOutline} />
                        Ingresar
                      </>
                    )}
                  </IonButton>

                  <IonButton
                    expand="block"
                    fill="outline"
                    color="secondary"
                    onClick={() => navigate('/register')}
                  >
                    <IonIcon slot="start" icon={personAddOutline} />
                    Crear cuenta nueva
                  </IonButton>
                </div>
              </form>
            </IonCardContent>
          </IonCard>

          <IonText color="medium" style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.75rem' }}>
            Evaluación Unidad 2 · Desarrollo de Aplicaciones Móviles · Ionic + React
          </IonText>
        </div>

        <IonToast
          isOpen={Boolean(errorMsg)}
          message={errorMsg}
          duration={3000}
          color="danger"
          position="bottom"
          onDidDismiss={() => setErrorMsg('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
