/**
 * apiService.ts
 * -----------------------------------------------------------------------
 * Integración con JSONPlaceholder (https://jsonplaceholder.typicode.com)
 * como API externa de demostración.
 *
 * Requisito evaluativo:
 *  - Implementar capacidad de sincronizar tareas con un servicio web/API
 *    externa para almacenarlas de forma remota.
 *  - Permitir importación de tareas desde una API externa.
 *  - Optimizar la interacción mejorando rendimiento y experiencia de usuario.
 *  - Probar integración asegurando fiabilidad y seguridad.
 */

const BASE_URL = 'https://jsonplaceholder.typicode.com';

/** Forma que devuelve JSONPlaceholder para /todos */
export interface ApiTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

/** Payload para crear/actualizar una tarea en la API */
export interface ApiTaskPayload {
  title: string;
  completed: boolean;
  userId: number;
}

// ---------------------------------------------------------------------------
// Helper fetch con timeout y manejo de errores
// ---------------------------------------------------------------------------
const apiFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('La solicitud a la API tardó demasiado. Verifica tu conexión.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

// ---------------------------------------------------------------------------
// Importar tareas desde la API
// ---------------------------------------------------------------------------

/**
 * Obtiene las primeras `limit` tareas desde JSONPlaceholder.
 * Se usa para importar tareas externas a la lista local.
 */
export const fetchRemoteTasks = async (limit = 10): Promise<ApiTodo[]> => {
  return apiFetch<ApiTodo[]>(`/todos?_limit=${limit}`);
};

// ---------------------------------------------------------------------------
// Sincronización: crear tarea en la API
// ---------------------------------------------------------------------------

/**
 * "Sube" una tarea a la API remota. JSONPlaceholder simula la creación
 * y devuelve el objeto con un ID asignado (siempre 201 en demo).
 */
export const createRemoteTask = async (payload: ApiTaskPayload): Promise<ApiTodo> => {
  return apiFetch<ApiTodo>('/todos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

// ---------------------------------------------------------------------------
// Sincronización: actualizar tarea en la API
// ---------------------------------------------------------------------------

/**
 * Actualiza una tarea remota. JSONPlaceholder acepta PUT pero los datos
 * no persisten entre sesiones (es una API de prueba).
 */
export const updateRemoteTask = async (
  remoteId: number,
  payload: ApiTaskPayload,
): Promise<ApiTodo> => {
  return apiFetch<ApiTodo>(`/todos/${remoteId}`, {
    method: 'PUT',
    body: JSON.stringify({ id: remoteId, ...payload }),
  });
};

// ---------------------------------------------------------------------------
// Sincronización: eliminar tarea en la API
// ---------------------------------------------------------------------------
export const deleteRemoteTask = async (remoteId: number): Promise<void> => {
  await apiFetch<Record<string, never>>(`/todos/${remoteId}`, { method: 'DELETE' });
};
