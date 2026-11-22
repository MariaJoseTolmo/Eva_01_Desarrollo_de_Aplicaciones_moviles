/**
 * authService.test.ts
 * ═══════════════════════════════════════════════════════════════════
 * Pruebas automatizadas para el servicio de autenticación.
 *
 * Requisito evaluativo:
 *  - Validar que la autenticación de usuarios protege las tareas y
 *    permite múltiples usuarios de forma correcta.
 * ═══════════════════════════════════════════════════════════════════
 */
import { Preferences } from '@capacitor/preferences';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getCurrentUser,
  login,
  logout,
  register,
} from '../services/authService';

describe('authService', () => {
  beforeEach(() => {
    // Limpiar el store simulado de Preferences antes de cada test
    vi.mocked(Preferences.clear)();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  // ── register ────────────────────────────────────────────────────────────

  describe('register', () => {
    it('debe crear un usuario y retornar sus datos públicos (sin contraseña)', async () => {
      const user = await register('María Tolmo', 'maria@test.cl', 'password123');

      expect(user).toMatchObject({
        username: 'María Tolmo',
        email: 'maria@test.cl',
      });
      expect(user).not.toHaveProperty('passwordHash');
    });

    it('debe asignar un id único al usuario', async () => {
      const user = await register('Gastón Rojas', 'gaston@test.cl', 'pass1234');

      expect(user.id).toBeTruthy();
      expect(typeof user.id).toBe('string');
    });

    it('debe persistir la sesión automáticamente tras el registro', async () => {
      await register('Vania Muñoz', 'vania@test.cl', 'secreta99');
      const session = await getCurrentUser();

      expect(session?.email).toBe('vania@test.cl');
    });

    it('debe lanzar error si el email ya está registrado', async () => {
      await register('Usuario 1', 'duplicado@test.cl', 'pass1234');

      await expect(register('Usuario 2', 'duplicado@test.cl', 'otrapass')).rejects.toThrow(
        /ya existe una cuenta/i,
      );
    });

    it('debe normalizar el email a minúsculas', async () => {
      const user = await register('Test', 'TEST@CORREO.CL', 'pass1234');

      expect(user.email).toBe('test@correo.cl');
    });
  });

  // ── login ───────────────────────────────────────────────────────────────

  describe('login', () => {
    beforeEach(async () => {
      await register('Gastón Rojas', 'gaston@test.cl', 'mipassword');
      // Limpiar sesión para testear login de forma aislada
      await logout();
    });

    it('debe iniciar sesión con credenciales correctas', async () => {
      const user = await login('gaston@test.cl', 'mipassword');

      expect(user.email).toBe('gaston@test.cl');
    });

    it('debe persistir la sesión tras el login', async () => {
      await login('gaston@test.cl', 'mipassword');
      const session = await getCurrentUser();

      expect(session?.email).toBe('gaston@test.cl');
    });

    it('debe lanzar error con contraseña incorrecta', async () => {
      await expect(login('gaston@test.cl', 'contraseñamalá')).rejects.toThrow(
        /correo o contraseña incorrectos/i,
      );
    });

    it('debe lanzar error con email inexistente', async () => {
      await expect(login('noexiste@test.cl', 'cualquiera')).rejects.toThrow(
        /correo o contraseña incorrectos/i,
      );
    });

    it('debe ser insensible a mayúsculas en el email', async () => {
      const user = await login('GASTON@TEST.CL', 'mipassword');

      expect(user.email).toBe('gaston@test.cl');
    });
  });

  // ── logout / getCurrentUser ─────────────────────────────────────────────

  describe('logout y getCurrentUser', () => {
    it('debe retornar null cuando no hay sesión activa', async () => {
      const user = await getCurrentUser();

      expect(user).toBeNull();
    });

    it('debe limpiar la sesión al hacer logout', async () => {
      await register('Test', 'test@test.cl', 'pass1234');
      await logout();
      const session = await getCurrentUser();

      expect(session).toBeNull();
    });

    it('no debe devolver la contraseña en el objeto de sesión', async () => {
      await register('Test', 'secure@test.cl', 'pass1234');
      const session = await getCurrentUser();

      expect(session).not.toHaveProperty('passwordHash');
      expect(session).not.toHaveProperty('password');
    });
  });

  // ── aislamiento multi-usuario ───────────────────────────────────────────

  describe('aislamiento entre usuarios', () => {
    it('dos usuarios distintos pueden registrarse con emails diferentes', async () => {
      const u1 = await register('Usuario 1', 'u1@test.cl', 'pass1');
      // Pequeña pausa para que Date.now() avance al menos 1ms
      await new Promise((r) => setTimeout(r, 5));
      await logout();
      const u2 = await register('Usuario 2', 'u2@test.cl', 'pass2');

      expect(u1.id).not.toBe(u2.id);
      expect(u1.email).not.toBe(u2.email);
    });
  });
});
