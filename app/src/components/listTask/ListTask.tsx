import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
} from '@ionic/react';
import { checkmarkDoneCircleOutline } from 'ionicons/icons';
import React from 'react';
import TaskContainer from '../task/TaskContainer';
import type ListTaskInterface from './ListTaskInterface';

const ListTask: React.FC<ListTaskInterface> = ({
  tasks,
  emptyMessage = 'Aún no tienes tareas registradas. Usa el formulario superior para crear una nueva.',
  onDeleteTask,
  onEditTask,
  onToggleTask,
}) => {
  return (
    <section aria-labelledby="task-list-heading">
      <IonList inset>
        <IonListHeader>
          <IonLabel id="task-list-heading">
            <h2>Lista de Tareas</h2>
          </IonLabel>
          <IonNote color="medium">
            {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
          </IonNote>
        </IonListHeader>

        {tasks.length === 0 ? (
          <IonCard>
            <IonCardContent
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px' }}
            >
              <IonIcon
                icon={checkmarkDoneCircleOutline}
                style={{ fontSize: '48px', color: 'var(--ion-color-medium)', marginBottom: '12px' }}
                aria-hidden
              />
              <p style={{ textAlign: 'center', color: 'var(--ion-color-medium)' }}>
                {emptyMessage}
              </p>
            </IonCardContent>
          </IonCard>
        ) : (
          tasks.map((task) => (
            <TaskContainer
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
              onToggleComplete={onToggleTask}
            />
          ))
        )}
      </IonList>
    </section>
  );
};

export default ListTask;
