import type TaskInterface from '../task/TaskInterface';

export default interface ListTaskInterface {
  tasks: TaskInterface[];
  emptyMessage?: string;
  onDeleteTask: (id: number) => void;
  onEditTask: (task: TaskInterface) => void;
  onToggleTask: (id: number) => void;
}
