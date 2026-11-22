/**
 * useTasks.ts
 * Hook que encapsula toda la lógica de gestión de tareas: CRUD,
 * captura de imagen, geolocalización e integración con la API.
 */
import { useCallback, useEffect, useState } from 'react';
import type TaskInterface from '../components/task/TaskInterface';
import { capturePhoto } from '../services/cameraService';
import { getCurrentLocation } from '../services/geolocationService';
import {
  createTask,
  deleteTask,
  getTasks,
  importTasksFromApi,
  syncPendingTasks,
  toggleTask,
  updateTask,
} from '../services/taskService';

export const useTasks = (userId: string | null) => {
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getTasks(userId);
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error cargando tareas.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const add = useCallback(
    async (
      title: string,
      description: string,
      withPhoto: boolean,
      withLocation: boolean,
    ) => {
      if (!userId) return;
      let imageBase64: string | undefined;
      let location = undefined;

      if (withPhoto) {
        const photo = await capturePhoto();
        imageBase64 = photo?.dataUrl;
      }
      if (withLocation) {
        const loc = await getCurrentLocation();
        location = loc ?? undefined;
      }

      await createTask(userId, title, description, imageBase64, location);
      await reload();
    },
    [userId, reload],
  );

  const toggle = useCallback(
    async (id: number) => {
      if (!userId) return;
      await toggleTask(userId, id);
      await reload();
    },
    [userId, reload],
  );

  const remove = useCallback(
    async (id: number) => {
      if (!userId) return;
      await deleteTask(userId, id);
      await reload();
    },
    [userId, reload],
  );

  const edit = useCallback(
    async (id: number, changes: Partial<Pick<TaskInterface, 'title' | 'description'>>) => {
      if (!userId) return;
      await updateTask(userId, id, changes);
      await reload();
    },
    [userId, reload],
  );

  const sync = useCallback(async (): Promise<number> => {
    if (!userId) return 0;
    setSyncing(true);
    try {
      const count = await syncPendingTasks(userId);
      await reload();
      return count;
    } finally {
      setSyncing(false);
    }
  }, [userId, reload]);

  const importFromApi = useCallback(
    async (limit = 5): Promise<number> => {
      if (!userId) return 0;
      setSyncing(true);
      try {
        const count = await importTasksFromApi(userId, limit);
        await reload();
        return count;
      } finally {
        setSyncing(false);
      }
    },
    [userId, reload],
  );

  return { tasks, loading, syncing, error, add, toggle, remove, edit, sync, importFromApi, reload };
};
