/**
 * RegisterPage.tsx
 * Pantalla de registro de nuevos usuarios.
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
import { arrowBackOutline, personAddOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/AuthContext';

const RegisterPage: React.FC = () => {
  const { register } = useAuthContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password) {
      setErrorMsg('Completa todos los campos obligatorios.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/home', { replace: true });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent
        fullscreen
        style={{ '--background': 'var(--ion-color-light)' } as React.CSSProperties}
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
          <IonCard style={{ width: '100%' }}>
            <IonCardHeader>
              <IonCardTitle>Crear Cuenta</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleRegister} noValidate>
                <IonList lines="none">
                  <IonItem>
                    <IonInput
                      label="Nombre de usuario *"
                      labelPlacement="stacked"
                      placeholder="Tu nombre"
                      value={username}
                      onIonInput={(e) => setUsername(String(e.detail.value ?? ''))}
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      type="email"
                      label="Correo electrónico *"
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
                      label="Contraseña * (mín. 6 caracteres)"
                      labelPlacement="stacked"
                      placeholder="••••••••"
                      value={password}
                      onIonInput={(e) => setPassword(String(e.detail.value ?? ''))}
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      type="password"
                      label="Confirmar contraseña *"
                      labelPlacement="stacked"
                      placeholder="••••••••"
                      value={confirm}
                      onIonInput={(e) => setConfirm(String(e.detail.value ?? ''))}
                    />
                  </IonItem>
                </IonList>

                <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <IonButton type="submit" expand="block" color="primary" disabled={loading}>
                    {loading ? (
                      <IonSpinner name="crescent" />
                    ) : (
                      <>
                        <IonIcon slot="start" icon={personAddOutline} />
                        Registrarme
                      </>
                    )}
                  </IonButton>

                  <IonButton
                    expand="block"
                    fill="outline"
                    color="medium"
                    onClick={() => navigate(-1)}
                  >
                    <IonIcon slot="start" icon={arrowBackOutline} />
                    Volver al login
                  </IonButton>
                </div>
              </form>
            </IonCardContent>
          </IonCard>

          <IonText color="medium" style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.75rem' }}>
            Evaluación Unidad 2 · Desarrollo de Aplicaciones Móviles
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

export default RegisterPage;
