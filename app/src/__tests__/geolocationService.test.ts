/**
 * geolocationService.test.ts
 * ═══════════════════════════════════════════════════════════════════
 * Pruebas automatizadas para el servicio de geolocalización GPS.
 *
 * Requisito evaluativo (punto 3 y 6):
 *  - Pruebas automatizadas para verificar la obtención de ubicación,
 *    asegurando la fiabilidad y precisión de los datos obtenidos.
 *  - Probar la integración asegurando fiabilidad y seguridad de la
 *    comunicación y el manejo de datos externos.
 * ═══════════════════════════════════════════════════════════════════
 */
import { Geolocation } from '@capacitor/geolocation';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PermissionError, formatLocation, getCurrentLocation } from '../services/geolocationService';

describe('geolocationService', () => {
  // clearAllMocks resetea llamadas/instancias SIN eliminar los mocks del setup
  afterEach(() => {
    vi.clearAllMocks();
  });

  // ── Flujo exitoso ───────────────────────────────────────────────────────

  describe('getCurrentLocation — flujo exitoso', () => {
    it('debe retornar latitud y longitud válidas', async () => {
      const result = await getCurrentLocation();

      expect(result).not.toBeNull();
      expect(result?.latitude).toBeCloseTo(-33.4569);
      expect(result?.longitude).toBeCloseTo(-70.6483);
    });

    it('debe incluir el campo accuracy', async () => {
      const result = await getCurrentLocation();

      expect(result?.accuracy).toBe(10);
    });

    it('debe llamar a Geolocation.checkPermissions antes de pedir posición', async () => {
      await getCurrentLocation();

      expect(Geolocation.checkPermissions).toHaveBeenCalledOnce();
    });

    it('debe solicitar alta precisión (enableHighAccuracy: true)', async () => {
      await getCurrentLocation();

      expect(Geolocation.getCurrentPosition).toHaveBeenCalledWith(
        expect.objectContaining({ enableHighAccuracy: true }),
      );
    });

    it('debe incluir un timeout en la solicitud de posición', async () => {
      await getCurrentLocation();

      expect(Geolocation.getCurrentPosition).toHaveBeenCalledWith(
        expect.objectContaining({ timeout: expect.any(Number) }),
      );
    });

    it('la latitud debe estar en el rango [-90, 90]', async () => {
      const result = await getCurrentLocation();

      expect(result!.latitude).toBeGreaterThanOrEqual(-90);
      expect(result!.latitude).toBeLessThanOrEqual(90);
    });

    it('la longitud debe estar en el rango [-180, 180]', async () => {
      const result = await getCurrentLocation();

      expect(result!.longitude).toBeGreaterThanOrEqual(-180);
      expect(result!.longitude).toBeLessThanOrEqual(180);
    });
  });

  // ── Solicitud de permisos ───────────────────────────────────────────────

  describe('getCurrentLocation — solicitud de permisos', () => {
    it('debe solicitar permisos cuando el estado es "prompt"', async () => {
      vi.mocked(Geolocation.checkPermissions).mockResolvedValueOnce({
        location: 'prompt',
        coarseLocation: 'prompt',
      });

      const result = await getCurrentLocation();

      expect(Geolocation.requestPermissions).toHaveBeenCalledOnce();
      expect(result).not.toBeNull();
    });
  });

  // ── Permiso denegado ────────────────────────────────────────────────────

  describe('getCurrentLocation — permiso denegado', () => {
    it('debe lanzar PermissionError cuando el permiso está denegado', async () => {
      vi.mocked(Geolocation.checkPermissions).mockResolvedValueOnce({
        location: 'denied',
        coarseLocation: 'denied',
      });

      await expect(getCurrentLocation()).rejects.toBeInstanceOf(PermissionError);
    });

    it('el mensaje de error debe ser descriptivo cuando el permiso está denegado', async () => {
      vi.mocked(Geolocation.checkPermissions).mockResolvedValueOnce({
        location: 'denied',
        coarseLocation: 'denied',
      });

      await expect(getCurrentLocation()).rejects.toThrow(/denegado/i);
    });

    it('debe lanzar PermissionError cuando requestPermissions devuelve "denied"', async () => {
      vi.mocked(Geolocation.checkPermissions).mockResolvedValueOnce({
        location: 'prompt',
        coarseLocation: 'prompt',
      });
      vi.mocked(Geolocation.requestPermissions).mockResolvedValueOnce({
        location: 'denied',
        coarseLocation: 'denied',
      });

      await expect(getCurrentLocation()).rejects.toBeInstanceOf(PermissionError);
    });
  });

  // ── Fallos de hardware / señal ──────────────────────────────────────────

  describe('getCurrentLocation — sin señal GPS', () => {
    it('debe retornar null (no lanzar) cuando el GPS falla por timeout', async () => {
      vi.mocked(Geolocation.getCurrentPosition).mockRejectedValueOnce(
        new Error('Timeout expired'),
      );

      const result = await getCurrentLocation();

      expect(result).toBeNull();
    });

    it('debe retornar null cuando no hay señal GPS disponible', async () => {
      vi.mocked(Geolocation.getCurrentPosition).mockRejectedValueOnce(
        new Error('Position unavailable'),
      );

      const result = await getCurrentLocation();

      expect(result).toBeNull();
    });
  });

  // ── formatLocation ──────────────────────────────────────────────────────

  describe('formatLocation', () => {
    it('debe formatear las coordenadas con 5 decimales', () => {
      const result = formatLocation({ latitude: -33.45678, longitude: -70.64831 });

      expect(result).toBe('-33.45678, -70.64831');
    });

    it('debe funcionar con coordenadas positivas', () => {
      const result = formatLocation({ latitude: 40.71280, longitude: -74.00599 });

      expect(result).toBe('40.71280, -74.00599');
    });

    it('debe producir una cadena con formato "lat, lng"', () => {
      const result = formatLocation({ latitude: 0, longitude: 0 });

      expect(result).toMatch(/^-?\d+\.\d+,\s-?\d+\.\d+$/);
    });
  });
});
