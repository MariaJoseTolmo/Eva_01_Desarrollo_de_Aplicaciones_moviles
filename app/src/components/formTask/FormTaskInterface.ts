import type TaskInterface from '../task/TaskInterface';

export interface TaskFormPayload {
  title: string;
  description: string;
}

export default interface FormTaskInterface {
  onSubmitTask: (payload: TaskFormPayload) => void;
  editingTask?: TaskInterface | null;
  onCancelEdit?: () => void;
}
