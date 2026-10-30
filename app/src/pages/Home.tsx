import {
  IonAlert,
  IonBadge,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonModal,
  IonNote,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import {
  checkmarkCircleOutline,
  clipboardOutline,
  closeOutline,
  listOutline,
  timeOutline,
} from 'ionicons/icons';
import React, { useMemo, useState } from 'react';

import FormTask from '../components/formTask/FormTask';
import type { TaskFormPayload } from '../components/formTask/FormTaskInterface';
import ListTask from '../components/listTask/ListTask';
import type TaskInterface from '../components/task/TaskInterface';
import taskList from '../data/taskList';
import './Home.css';

type TaskFilter = 'all' | 'pending' | 'completed';

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<TaskInterface[]>(taskList.tasks);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [editingTask, setEditingTask] = useState<TaskInterface | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskInterface | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  const counts = useMemo(() => {
    const completed = tasks.filter((t) => Boolean(t.completed)).length;
    const pending = tasks.length - completed;
    return {
      all: tasks.length,
      pending,
      completed,
    };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (filter === 'pending') {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === 'completed') {
      return tasks.filter((task) => Boolean(task.completed));
    }
    return tasks;
  }, [tasks, filter]);

  const emptyMessage = useMemo(() => {
    if (tasks.length === 0) {
      return 'Aún no tienes tareas registradas. Agrega tu primera tarea en el formulario superior.';
    }
    if (filter === 'pending') {
      return '¡Excelente! No tienes tareas pendientes por completar.';
    }
    if (filter === 'completed') {
      return 'Todavía no has marcado ninguna tarea como completada.';
    }
    return 'No hay tareas para mostrar.';
  }, [tasks.length, filter]);

  const handleAddTask = ({ title, description }: TaskFormPayload) => {
    const nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const newTask: TaskInterface = {
      id: nextId,
      title,
      description: description || undefined,
      completed: false,
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setToastMessage(`Tarea #${nextId} "${title}" agregada correctamente.`);
  };

  const handleUpdateTask = ({ title, description }: TaskFormPayload) => {
    if (!editingTask) {
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title,
              description: description || undefined,
            }
          : task,
      ),
    );
    setToastMessage(`Tarea #${editingTask.id} actualizada.`);
    setEditingTask(null);
  };

  const handleToggleTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleRequestDeleteTask = (id: number) => {
    const target = tasks.find((t) => t.id === id) ?? null;
    setTaskToDelete(target);
  };

  const handleConfirmDeleteTask = () => {
    if (!taskToDelete) {
      return;
    }
    const deletedId = taskToDelete.id;
    const deletedTitle = taskToDelete.title;
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== deletedId));
    setTaskToDelete(null);
    setToastMessage(`Tarea #${deletedId} "${deletedTitle}" eliminada.`);
  };

  return (
    <>
      <IonMenu contentId="main-content" type="overlay">
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Menú To-Do IPSS</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList lines="inset">
            <IonListHeader>
              <IonLabel>Filtrar vista</IonLabel>
            </IonListHeader>

            <IonMenuToggle autoHide={true}>
              <IonItem
                button={true}
                detail={false}
                color={filter === 'all' ? 'light' : undefined}
                onClick={() => setFilter('all')}
              >
                <IonIcon slot="start" icon={listOutline} color="primary" />
                <IonLabel>Todas las tareas</IonLabel>
                <IonBadge color="primary">{counts.all}</IonBadge>
              </IonItem>

              <IonItem
                button={true}
                detail={false}
                color={filter === 'pending' ? 'light' : undefined}
                onClick={() => setFilter('pending')}
              >
                <IonIcon slot="start" icon={timeOutline} color="warning" />
                <IonLabel>Pendientes</IonLabel>
                <IonBadge color="warning">{counts.pending}</IonBadge>
              </IonItem>

              <IonItem
                button={true}
                detail={false}
                color={filter === 'completed' ? 'light' : undefined}
                onClick={() => setFilter('completed')}
              >
                <IonIcon slot="start" icon={checkmarkCircleOutline} color="success" />
                <IonLabel>Completadas</IonLabel>
                <IonBadge color="success">{counts.completed}</IonBadge>
              </IonItem>
            </IonMenuToggle>
          </IonList>

          <div className="menu-summary">
            <IonNote>
              <strong>Evaluación Unidad 1</strong>
              <br />
              Desarrollo de Aplicaciones Móviles · Ionic + React
            </IonNote>
          </div>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton aria-label="Abrir menú de navegación" />
            </IonButtons>
            <IonTitle>To-Do IPSS</IonTitle>
            <IonButtons slot="end">
              <IonChip className="header-status-chip">
                <IonIcon icon={clipboardOutline} />
                <IonLabel>
                  {counts.pending} pend. / {counts.all} total
                </IonLabel>
              </IonChip>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen className="home-content">
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">To-Do IPSS</IonTitle>
            </IonToolbar>
          </IonHeader>

          <main className="home-container">
            <FormTask onSubmitTask={handleAddTask} />

            <div className="filter-bar">
              <IonSegment
                value={filter}
                aria-label="Filtrar tareas por estado"
                onIonChange={(e) => setFilter((e.detail.value as TaskFilter) || 'all')}
              >
                <IonSegmentButton value="all">
                  <IonLabel>Todas ({counts.all})</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="pending">
                  <IonLabel>Pendientes ({counts.pending})</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="completed">
                  <IonLabel>Completadas ({counts.completed})</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </div>

            <ListTask
              tasks={visibleTasks}
              emptyMessage={emptyMessage}
              onDeleteTask={handleRequestDeleteTask}
              onEditTask={(task) => setEditingTask(task)}
              onToggleTask={handleToggleTask}
            />
          </main>

          <IonModal isOpen={Boolean(editingTask)} onDidDismiss={() => setEditingTask(null)}>
            <IonHeader>
              <IonToolbar color="primary">
                <IonTitle>Editar tarea #{editingTask?.id}</IonTitle>
                <IonButtons slot="end">
                  <IonButton
                    aria-label="Cerrar edición"
                    onClick={() => setEditingTask(null)}
                  >
                    <IonIcon slot="icon-only" icon={closeOutline} />
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <FormTask
                key={editingTask?.id ?? 'edit'}
                editingTask={editingTask}
                onSubmitTask={handleUpdateTask}
                onCancelEdit={() => setEditingTask(null)}
              />
            </IonContent>
          </IonModal>

          <IonAlert
            isOpen={Boolean(taskToDelete)}
            header="Eliminar tarea"
            subHeader={taskToDelete ? `Tarea #${taskToDelete.id}: ${taskToDelete.title}` : undefined}
            message="¿Seguro que quieres eliminar esta tarea? Esta acción no se puede deshacer."
            onDidDismiss={() => setTaskToDelete(null)}
            buttons={[
              {
                text: 'Cancelar',
                role: 'cancel',
                handler: () => setTaskToDelete(null),
              },
              {
                text: 'Eliminar',
                role: 'destructive',
                handler: handleConfirmDeleteTask,
              },
            ]}
          />

          <IonToast
            isOpen={Boolean(toastMessage)}
            message={toastMessage}
            duration={2400}
            position="bottom"
            color="dark"
            onDidDismiss={() => setToastMessage('')}
          />
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;

