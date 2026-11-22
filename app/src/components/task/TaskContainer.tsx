import {
  IonBadge,
  IonButton,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonThumbnail,
} from '@ionic/react';
import { cameraOutline, createOutline, locationOutline, trashOutline } from 'ionicons/icons';
import React from 'react';
import type TaskInterface from './TaskInterface';
import { formatLocation } from '../../services/geolocationService';

interface TaskContainerProps {
  task: TaskInterface;
  onDelete: (id: number) => void;
  onEdit: (task: TaskInterface) => void;
  onToggleComplete: (id: number) => void;
}

const TaskContainer: React.FC<TaskContainerProps> = ({ task, onDelete, onEdit, onToggleComplete }) => {
  return (
    <IonItem
      id={`task-container-${task.id}`}
      className={`task-item ${task.completed ? 'task-item--completed' : ''}`}
      lines="full"
    >
      <IonCheckbox
        slot="start"
        checked={Boolean(task.completed)}
        aria-label={`Marcar "${task.title}" como ${task.completed ? 'pendiente' : 'completada'}`}
        onIonChange={() => onToggleComplete(task.id)}
      />

      {/* Miniatura de imagen si existe */}
      {task.imageBase64 && (
        <IonThumbnail slot="start" style={{ '--size': '48px', marginRight: '8px' } as React.CSSProperties}>
          <img src={task.imageBase64} alt={`Foto de la tarea ${task.title}`} />
        </IonThumbnail>
      )}

      <IonLabel className="ion-text-wrap">
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '2px' }}>
          <IonBadge color={task.completed ? 'success' : 'primary'}>
            #{task.id} · {task.completed ? 'Completada' : 'Pendiente'}
          </IonBadge>
          {task.syncPending && (
            <IonBadge color="warning">Sin sincronizar</IonBadge>
          )}
          {task.remoteId && !task.syncPending && (
            <IonBadge color="tertiary">Sincronizada</IonBadge>
          )}
          {task.imageBase64 && (
            <IonBadge color="medium">
              <IonIcon icon={cameraOutline} /> Foto
            </IonBadge>
          )}
        </div>

        <h2
          style={{
            textDecoration: task.completed ? 'line-through' : 'none',
            fontWeight: 600,
          }}
        >
          {task.title}
        </h2>

        {task.description ? (
          <p style={{ color: 'var(--ion-color-medium)' }}>{task.description}</p>
        ) : (
          <p style={{ color: 'var(--ion-color-medium)', fontStyle: 'italic' }}>Sin descripción</p>
        )}

        {/* Ubicación GPS */}
        {task.location && (
          <IonNote
            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
          >
            <IonIcon icon={locationOutline} />
            {task.location.label ?? formatLocation(task.location)}
          </IonNote>
        )}
      </IonLabel>

      <div slot="end" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <IonButton
          id={`edit-task-${task.id}`}
          fill="clear"
          color="primary"
          size="small"
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
