/**
 * cameraService.test.ts
 * ═══════════════════════════════════════════════════════════════════
 * Pruebas automatizadas para el servicio de cámara.
 *
 * Requisito evaluativo (punto 3 y 6):
 *  - Incluir pruebas automatizadas para verificar la funcionalidad de
 *    captura de imágenes, asegurando la fiabilidad de estos componentes.
 *  - Probar la integración asegurando fiabilidad y seguridad.
 * ═══════════════════════════════════════════════════════════════════
 */
import { Camera } from '@capacitor/camera';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { capturePhoto } from '../services/cameraService';

describe('cameraService', () => {
  // clearAllMocks resetea llamadas SIN eliminar los mocks globales del setup
  afterEach(() => {
    vi.clearAllMocks();
  });

  // ── Flujo exitoso ───────────────────────────────────────────────────────

  describe('capturePhoto — flujo exitoso', () => {
    it('debe retornar un objeto CapturedPhoto con dataUrl y format cuando el permiso está concedido', async () => {
      const result = await capturePhoto();

      expect(result).not.toBeNull();
      expect(result?.dataUrl).toBe('data:image/jpeg;base64,/9j/MOCK_BASE64_IMAGE');
      expect(result?.format).toBe('jpeg');
    });

    it('debe llamar a Camera.checkPermissions antes de getPhoto', async () => {
      await capturePhoto();

      expect(Camera.checkPermissions).toHaveBeenCalledOnce();
    });

    it('debe llamar a Camera.getPhoto con resultType DataUrl', async () => {
      await capturePhoto();

      expect(Camera.getPhoto).toHaveBeenCalledWith(
        expect.objectContaining({ resultType: 'dataUrl' }),
      );
    });

    it('debe solicitar calidad de imagen 80 o inferior para optimizar rendimiento', async () => {
      await capturePhoto();

      const callArgs = vi.mocked(Camera.getPhoto).mock.calls[0][0];
      expect(callArgs.quality).toBeLessThanOrEqual(80);
    });
  });

  // ── Solicitud de permisos ───────────────────────────────────────────────

  describe('capturePhoto — solicitud de permisos', () => {
    it('debe solicitar permisos cuando el estado es "prompt"', async () => {
      vi.mocked(Camera.checkPermissions).mockResolvedValueOnce({
        camera: 'prompt',
        photos: 'prompt',
      });

      await capturePhoto();

      expect(Camera.requestPermissions).toHaveBeenCalledWith(
        expect.objectContaining({ permissions: expect.arrayContaining(['camera']) }),
      );
    });

    it('debe completar la captura con éxito después de conceder el permiso', async () => {
      vi.mocked(Camera.checkPermissions).mockResolvedValueOnce({
        camera: 'prompt',
        photos: 'prompt',
      });

      const result = await capturePhoto();
      expect(result).not.toBeNull();
      expect(result?.dataUrl).toContain('data:image/jpeg');
    });
  });

  // ── Permiso denegado ────────────────────────────────────────────────────

  describe('capturePhoto — permiso denegado', () => {
    it('debe lanzar un error descriptivo cuando el permiso de cámara está denegado', async () => {
      vi.mocked(Camera.checkPermissions).mockResolvedValueOnce({
        camera: 'denied',
        photos: 'denied',
      });

      await expect(capturePhoto()).rejects.toThrow(/permiso de cámara denegado/i);
    });

    it('debe lanzar error cuando requestPermissions devuelve "denied"', async () => {
      vi.mocked(Camera.checkPermissions).mockResolvedValueOnce({
        camera: 'prompt',
        photos: 'prompt',
      });
      vi.mocked(Camera.requestPermissions).mockResolvedValueOnce({
        camera: 'denied',
        photos: 'denied',
      });

      await expect(capturePhoto()).rejects.toThrow(/no se otorgó permiso/i);
    });
  });

  // ── Cancelación por el usuario ──────────────────────────────────────────

  describe('capturePhoto — cancelación del usuario', () => {
    it('debe retornar null cuando el usuario cancela la cámara sin lanzar error', async () => {
      vi.mocked(Camera.getPhoto).mockRejectedValueOnce(new Error('User cancelled photos app'));

      const result = await capturePhoto();

      expect(result).toBeNull();
    });

    it('debe retornar null cuando getPhoto devuelve dataUrl vacío', async () => {
      vi.mocked(Camera.getPhoto).mockResolvedValueOnce({
        dataUrl: undefined,
        format: 'jpeg',
        saved: false,
      });

      const result = await capturePhoto();

      expect(result).toBeNull();
    });
  });

  // ── Errores inesperados ─────────────────────────────────────────────────

  describe('capturePhoto — errores inesperados', () => {
    it('debe re-lanzar errores que no son cancelaciones del usuario', async () => {
      vi.mocked(Camera.getPhoto).mockRejectedValueOnce(new Error('Hardware failure'));

      await expect(capturePhoto()).rejects.toThrow('Hardware failure');
    });
  });
});
