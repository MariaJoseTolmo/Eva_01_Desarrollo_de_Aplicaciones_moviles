/**
 * setupTests.ts
 * Configuración global del entorno de pruebas Vitest + jsdom.
 */
/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';

// ── Mock global de Capacitor ────────────────────────────────────────────────
// jsdom no tiene APIs nativas del dispositivo. Mockeamos los plugins de
// Capacitor para que los tests puedan ejercitar la lógica de los servicios
// sin necesitar un dispositivo físico o emulador.

// @capacitor/camera
vi.mock('@capacitor/camera', () => ({
  Camera: {
    checkPermissions: vi.fn().mockResolvedValue({ camera: 'granted', photos: 'granted' }),
    requestPermissions: vi.fn().mockResolvedValue({ camera: 'granted', photos: 'granted' }),
    getPhoto: vi.fn().mockResolvedValue({
      dataUrl: 'data:image/jpeg;base64,/9j/MOCK_BASE64_IMAGE',
      format: 'jpeg',
      saved: false,
    }),
  },
  CameraResultType: { DataUrl: 'dataUrl' },
  CameraSource: { Prompt: 'PROMPT', Camera: 'CAMERA', Photos: 'PHOTOS' },
}));

// @capacitor/geolocation
vi.mock('@capacitor/geolocation', () => ({
  Geolocation: {
    checkPermissions: vi.fn().mockResolvedValue({ location: 'granted', coarseLocation: 'granted' }),
    requestPermissions: vi.fn().mockResolvedValue({ location: 'granted', coarseLocation: 'granted' }),
    getCurrentPosition: vi.fn().mockResolvedValue({
      coords: {
        latitude: -33.4569,
        longitude: -70.6483,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    }),
  },
}));

// @capacitor/preferences
const preferencesStore: Record<string, string> = {};
vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(({ key }: { key: string }) =>
      Promise.resolve({ value: preferencesStore[key] ?? null }),
    ),
    set: vi.fn(({ key, value }: { key: string; value: string }) => {
      preferencesStore[key] = value;
      return Promise.resolve();
    }),
    remove: vi.fn(({ key }: { key: string }) => {
      delete preferencesStore[key];
      return Promise.resolve();
    }),
    clear: vi.fn(() => {
      Object.keys(preferencesStore).forEach((k) => delete preferencesStore[k]);
      return Promise.resolve();
    }),
  },
}));
