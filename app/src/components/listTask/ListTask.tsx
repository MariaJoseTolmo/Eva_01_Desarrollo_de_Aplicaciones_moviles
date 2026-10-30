import { IonCard, IonCardContent, IonIcon, IonLabel, IonList, IonListHeader, IonNote } from '@ionic/react';
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
    <section aria-labelledby="task-list-heading" className="task-list-section">
      <IonList inset={true} className="task-list">
        <IonListHeader>
          <IonLabel id="task-list-heading">
            <h2>Lista de Tareas</h2>
          </IonLabel>
          <IonNote color="medium" className="task-list__counter">
            {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
          </IonNote>
        </IonListHeader>

        {tasks.length === 0 ? (
          <IonCard className="empty-state-card">
            <IonCardContent className="empty-state-content">
              <IonIcon icon={checkmarkDoneCircleOutline} className="empty-state-icon" aria-hidden="true" />
              <p className="empty-state-text">{emptyMessage}</p>
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
