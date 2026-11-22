/**
 * apiService.test.ts
 * ═══════════════════════════════════════════════════════════════════
 * Pruebas automatizadas para la integración con la API externa.
 *
 * Requisito evaluativo (punto 6):
 *  - Probar la integración de aplicaciones móviles con servicios web
 *    y APIs, asegurando la fiabilidad y seguridad de la comunicación
 *    y el manejo de datos externos.
 * ═══════════════════════════════════════════════════════════════════
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createRemoteTask,
  deleteRemoteTask,
  fetchRemoteTasks,
  updateRemoteTask,
} from '../services/apiService';

// Mock global de fetch para no hacer llamadas reales a internet durante tests
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

/** Helper para crear una respuesta mock de fetch exitosa */
const mockOkResponse = (body: unknown) =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(body),
  } as Response);

/** Helper para crear una respuesta mock de fetch con error */
const mockErrorResponse = (status: number, statusText: string) =>
  Promise.resolve({
    ok: false,
    status,
    statusText,
    json: () => Promise.resolve({}),
  } as Response);

describe('apiService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // ── fetchRemoteTasks ────────────────────────────────────────────────────

  describe('fetchRemoteTasks', () => {
    const mockTodos = [
      { userId: 1, id: 1, title: 'Tarea importada 1', completed: false },
      { userId: 1, id: 2, title: 'Tarea importada 2', completed: true },
    ];

    beforeEach(() => {
      mockFetch.mockReturnValue(mockOkResponse(mockTodos));
    });

    it('debe retornar un array de ApiTodo', async () => {
      const result = await fetchRemoteTasks(2);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it('cada elemento debe tener id, title y completed', async () => {
      const [first] = await fetchRemoteTasks(2);

      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('title');
      expect(first).toHaveProperty('completed');
    });

    it('debe llamar a la URL correcta con el parámetro limit', async () => {
      await fetchRemoteTasks(5);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('_limit=5'),
        expect.any(Object),
      );
    });

    it('debe usar el límite por defecto de 10 cuando no se especifica', async () => {
      mockFetch.mockReturnValue(mockOkResponse([]));
      await fetchRemoteTasks();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('_limit=10'),
        expect.any(Object),
      );
    });
  });

  // ── createRemoteTask ────────────────────────────────────────────────────

  describe('createRemoteTask', () => {
    const mockCreated = { userId: 1, id: 201, title: 'Nueva tarea', completed: false };

    beforeEach(() => {
      mockFetch.mockReturnValue(mockOkResponse(mockCreated));
    });

    it('debe retornar el objeto creado con id asignado', async () => {
      const result = await createRemoteTask({
        title: 'Nueva tarea',
        completed: false,
        userId: 1,
      });

      expect(result.id).toBe(201);
      expect(result.title).toBe('Nueva tarea');
    });

    it('debe usar método POST', async () => {
      await createRemoteTask({ title: 'Test', completed: false, userId: 1 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'POST' }),
      );
    });

    it('debe enviar el body como JSON', async () => {
      await createRemoteTask({ title: 'Test', completed: false, userId: 1 });

      const callArgs = mockFetch.mock.calls[0][1] as RequestInit;
      expect(callArgs.headers).toMatchObject({ 'Content-Type': 'application/json' });
      expect(JSON.parse(callArgs.body as string)).toMatchObject({ title: 'Test' });
    });
  });

  // ── updateRemoteTask ────────────────────────────────────────────────────

  describe('updateRemoteTask', () => {
    const mockUpdated = { userId: 1, id: 5, title: 'Actualizada', completed: true };

    beforeEach(() => {
      mockFetch.mockReturnValue(mockOkResponse(mockUpdated));
    });

    it('debe retornar el objeto actualizado', async () => {
      const result = await updateRemoteTask(5, {
        title: 'Actualizada',
        completed: true,
        userId: 1,
      });

      expect(result.title).toBe('Actualizada');
      expect(result.completed).toBe(true);
    });

    it('debe usar método PUT', async () => {
      await updateRemoteTask(5, { title: 'Test', completed: false, userId: 1 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PUT' }),
      );
    });

    it('debe llamar a la URL con el id correcto', async () => {
      await updateRemoteTask(42, { title: 'Test', completed: false, userId: 1 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos/42'),
        expect.any(Object),
      );
    });
  });

  // ── deleteRemoteTask ────────────────────────────────────────────────────

  describe('deleteRemoteTask', () => {
    beforeEach(() => {
      mockFetch.mockReturnValue(mockOkResponse({}));
    });

    it('debe completarse sin error cuando la respuesta es exitosa', async () => {
      await expect(deleteRemoteTask(1)).resolves.toBeUndefined();
    });

    it('debe usar método DELETE', async () => {
      await deleteRemoteTask(1);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  // ── Manejo de errores HTTP ──────────────────────────────────────────────

  describe('manejo de errores HTTP', () => {
    it('debe lanzar error cuando la API responde con 404', async () => {
      mockFetch.mockReturnValue(mockErrorResponse(404, 'Not Found'));

      await expect(fetchRemoteTasks()).rejects.toThrow(/404/);
    });

    it('debe lanzar error cuando la API responde con 500', async () => {
      mockFetch.mockReturnValue(mockErrorResponse(500, 'Internal Server Error'));

      await expect(fetchRemoteTasks()).rejects.toThrow(/500/);
    });

    it('debe lanzar error de timeout cuando fetch se cancela por AbortController', async () => {
      mockFetch.mockImplementation(() => {
        const error = new Error('Aborted');
        error.name = 'AbortError';
        return Promise.reject(error);
      });

      await expect(fetchRemoteTasks()).rejects.toThrow(/tardó demasiado|conexión/i);
    });
  });
});
