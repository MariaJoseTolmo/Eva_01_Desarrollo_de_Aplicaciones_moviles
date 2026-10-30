import { IonBadge, IonButton, IonCheckbox, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import React from 'react';

import type TaskInterface from './TaskInterface';

interface TaskContainerProps {
  task: TaskInterface;
  onDelete: (id: number) => void;
  onEdit: (task: TaskInterface) => void;
  onToggleComplete: (id: number) => void;
}

const TaskContainer: React.FC<TaskContainerProps> = ({
  task,
  onDelete,
  onEdit,
  onToggleComplete,
}) => {
  return (
    <IonItem
      id={`task-container-${task.id}`}
      className={`task-item ${task.id}-task ${task.completed ? 'task-item--completed' : ''}`}
      lines="full"
    >
      <IonCheckbox
        slot="start"
        checked={Boolean(task.completed)}
        aria-label={`Marcar tarea "${task.title}" como ${task.completed ? 'pendiente' : 'completada'}`}
        onIonChange={() => onToggleComplete(task.id)}
      />

      <IonLabel className="ion-text-wrap">
        <div className="task-item__header">
          <IonBadge color={task.completed ? 'success' : 'primary'} className="task-item__badge">
            #{task.id} · {task.completed ? 'Completada' : 'Pendiente'}
          </IonBadge>
        </div>
        <h2 className="task-item__title">{task.title}</h2>
        {task.description ? (
          <p className="task-item__description">{task.description}</p>
        ) : (
          <p className="task-item__description task-item__description--empty">Sin descripción</p>
        )}
      </IonLabel>

      <div slot="end" className="task-item__actions">
        <IonButton
          id={`edit-task-${task.id}`}
          fill="clear"
          color="primary"
          aria-label={`Editar tarea ${task.title}`}
          onClick={() => onEdit(task)}
        >
          <IonIcon slot="icon-only" icon={createOutline} />
        </IonButton>

        <IonButton
          id={`delete-task-${task.id}`}
          fill="solid"
          color="danger"
          size="small"
          aria-label={`Eliminar tarea ${task.title}`}
          onClick={() => onDelete(task.id)}
        >
          <IonIcon slot="start" icon={trashOutline} />
          Eliminar
        </IonButton>
      </div>
    </IonItem>
  );
};

export default TaskContainer;

