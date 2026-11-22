/**
 * storageService.ts
 * -----------------------------------------------------------------------
 * Almacenamiento local avanzado con Capacitor Preferences.
 * Guarda las tareas por usuario, permitiendo acceso offline.
 *
 * Requisito evaluativo:
 *  - Almacenamiento local utilizando Capacitor para guardar tareas incluso
 *    sin conexión a internet.
 */
import { Preferences } from '@capacitor/preferences';
import type TaskInterface from '../components/task/TaskInterface';

const tasksKey = (userId: string) => `tasks_${userId}`;

export const loadTasks = async (userId: string): Promise<TaskInterface[]> => {
  const { value } = await Preferences.get({ key: tasksKey(userId) });
  return value ? (JSON.parse(value) as TaskInterface[]) : [];
};

export const saveTasks = async (userId: string, tasks: TaskInterface[]): Promise<void> => {
  await Preferences.set({ key: tasksKey(userId), value: JSON.stringify(tasks) });
};

export const clearTasks = async (userId: string): Promise<void> => {
  await Preferences.remove({ key: tasksKey(userId) });
};
