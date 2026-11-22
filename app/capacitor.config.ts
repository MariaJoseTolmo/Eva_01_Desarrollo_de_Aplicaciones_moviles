import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cl.ipss.todoapp',
  appName: 'To-Do IPSS',
  webDir: 'dist',
  plugins: {
    Camera: {
      // Android: permisos declarados en AndroidManifest.xml
    },
    Geolocation: {
      // iOS: descripción en Info.plist
    },
  },
};

export default config;
