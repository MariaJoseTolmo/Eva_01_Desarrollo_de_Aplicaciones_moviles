/**
 * taskService.ts
 * -----------------------------------------------------------------------
 * Lógica de negocio para gestión de tareas: CRUD local + sincronización
 * con la API remota.
 *
 * Requisito evaluativo:
 *  - CRUD de tareas con almacenamiento local (Capacitor Preferences).
 *  - Sincronización con API externa.
 *  - Importación de tareas desde API.
 */
import type TaskInterface from '../components/task/TaskInterface';
import type { TaskLocation } from '../components/task/TaskInterface';
import { createRemoteTask, deleteRemoteTask, fetchRemoteTasks, updateRemoteTask } from './apiService';
import { loadTasks, saveTasks } from './storageService';

// ---------------------------------------------------------------------------
// CRUD local
// ---------------------------------------------------------------------------

export const getTasks = (userId: string): Promise<TaskInterface[]> => loadTasks(userId);

export const createTask = async (
  userId: string,
  title: string,
  description: string,
  imageBase64?: string,
  location?: TaskLocation,
): Promise<TaskInterface> => {
  const tasks = await loadTasks(userId);
  const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

  const now = new Date().toISOString();
  const task: TaskInterface = {
    id: nextId,
    title: title.trim(),
    description: description.trim() || undefined,
    completed: false,
    userId,
    imageBase64,
    location,
    createdAt: now,
    updatedAt: now,
    remoteId: null,
    syncPending: true,
  };

  await saveTasks(userId, [task, ...tasks]);
  return task;
};

export const updateTask = async (
  userId: string,
  id: number,
  changes: Partial<Pick<TaskInterface, 'title' | 'description' | 'completed' | 'imageBase64' | 'location'>>,
): Promise<TaskInterface> => {
  const tasks = await loadTasks(userId);
  let updated: TaskInterface | undefined;

  const next = tasks.map((t) => {
    if (t.id !== id) return t;
    updated = { ...t, ...changes, updatedAt: new Date().toISOString(), syncPending: true };
    return updated;
  });

  if (!updated) throw new Error(`Tarea #${id} no encontrada.`);
  await saveTasks(userId, next);
  return updated;
};

export const deleteTask = async (userId: string, id: number): Promise<void> => {
  const tasks = await loadTasks(userId);
  const task = tasks.find((t) => t.id === id);

  // Si tiene ID remoto, intentar borrarlo en la API
  if (task?.remoteId) {
    try {
      await deleteRemoteTask(task.remoteId);
    } catch {
      // No bloquear el borrado local si la API falla
      console.warn('No se pudo eliminar la tarea remota:', task.remoteId);
    }
  }

  await saveTasks(userId, tasks.filter((t) => t.id !== id));
};

export const toggleTask = async (userId: string, id: number): Promise<TaskInterface> => {
  const tasks = await loadTasks(userId);
  const task = tasks.find((t) => t.id === id);
  if (!task) throw new Error(`Tarea #${id} no encontrada.`);
  return updateTask(userId, id, { completed: !task.completed });
};

// ---------------------------------------------------------------------------
// Sincronización con API remota
// ---------------------------------------------------------------------------

/**
 * Sube todas las tareas pendientes de sincronizar.
 * Actualiza el remoteId y sincPending localmente tras cada operación exitosa.
 */
export const syncPendingTasks = async (userId: string): Promise<number> => {
  const tasks = await loadTasks(userId);
  const pending = tasks.filter((t) => t.syncPending);
  let synced = 0;

  const updated = [...tasks];

  for (const task of pending) {
    try {
      if (task.remoteId) {
        await updateRemoteTask(task.remoteId, {
          title: task.title,
          completed: Boolean(task.completed),
          userId: 1,
        });
      } else {
        const remote = await createRemoteTask({
          title: task.title,
          completed: Boolean(task.completed),
          userId: 1,
        });
        const idx = updated.findIndex((t) => t.id === task.id);
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], remoteId: remote.id, syncPending: false };
        }
      }
      const idx = updated.findIndex((t) => t.id === task.id);
      if (idx !== -1) updated[idx] = { ...updated[idx], syncPending: false };
      synced++;
    } catch (err) {
      console.warn(`No se pudo sincronizar tarea #${task.id}:`, err);
    }
  }

  await saveTasks(userId, updated);
  return synced;
};

/**
 * Importa las primeras `limit` tareas desde JSONPlaceholder y las agrega
 * al listado local si no existen ya (por remoteId).
 */
export const importTasksFromApi = async (userId: string, limit = 5): Promise<number> => {
  const [remoteTasks, localTasks] = await Promise.all([
    fetchRemoteTasks(limit),
    loadTasks(userId),
  ]);

  const existingRemoteIds = new Set(localTasks.map((t) => t.remoteId).filter(Boolean));
  const toImport = remoteTasks.filter((rt) => !existingRemoteIds.has(rt.id));

  if (toImport.length === 0) return 0;

  const maxId = localTasks.length > 0 ? Math.max(...localTasks.map((t) => t.id)) : 0;
  const now = new Date().toISOString();

  const newTasks: TaskInterface[] = toImport.map((rt, i) => ({
    id: maxId + i + 1,
    title: rt.title,
    description: 'Importada desde API externa (JSONPlaceholder)',
    completed: rt.completed,
    userId,
    createdAt: now,
    updatedAt: now,
    remoteId: rt.id,
    syncPending: false,
  }));

  await saveTasks(userId, [...localTasks, ...newTasks]);
  return newTasks.length;
};
