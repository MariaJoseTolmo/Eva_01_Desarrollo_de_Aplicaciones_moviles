/**
 * App.tsx — To-Do IPSS v2
 * Router con React Router v6 + @ionic/react-router v9.
 */
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';
import { AuthProvider } from './hooks/AuthContext';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/login"
            element={<GuestGuard><LoginPage /></GuestGuard>}
          />
          <Route
            path="/register"
            element={<GuestGuard><RegisterPage /></GuestGuard>}
          />
          <Route
            path="/home"
            element={<AuthGuard><HomePage /></AuthGuard>}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;
