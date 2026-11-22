/**
 * HomePage.tsx
 * Página principal: lista de tareas con filtros, sincronización, importación API,
 * y acceso a creación de tareas con cámara y GPS.
 */
import {
  IonAlert,
  IonBadge,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonModal,
  IonPage,
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import {
  addOutline,
  checkmarkCircleOutline,
  cloudDownloadOutline,
  cloudUploadOutline,
  listOutline,
  logOutOutline,
  timeOutline,
} from 'ionicons/icons';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormTask from '../../components/formTask/FormTask';
import type { TaskFormPayload } from '../../components/formTask/FormTaskInterface';
import ListTask from '../../components/listTask/ListTask';
import type TaskInterface from '../../components/task/TaskInterface';
import { useAuthContext } from '../../hooks/AuthContext';
import { useTasks } from '../../hooks/useTasks';

type TaskFilter = 'all' | 'pending' | 'completed';

const HomePage: React.FC = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { tasks, loading, syncing, add, toggle, remove, edit, sync, importFromApi, reload } =
    useTasks(user?.id ?? null);

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [editingTask, setEditingTask] = useState<TaskInterface | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskInterface | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastColor, setToastColor] = useState<'dark' | 'success' | 'danger' | 'warning'>('dark');
  const [showAddModal, setShowAddModal] = useState(false);

  // Recargar al volver a la vista
  useIonViewWillEnter(() => { void reload(); });

  const counts = useMemo(() => {
    const completed = tasks.filter((t) => Boolean(t.completed)).length;
    return { all: tasks.length, pending: tasks.length - completed, completed };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (filter === 'pending') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') return tasks.filter((t) => Boolean(t.completed));
    return tasks;
  }, [tasks, filter]);

  const emptyMessage = useMemo(() => {
    if (tasks.length === 0) return 'Aún no tienes tareas. Presiona + para agregar una.';
    if (filter === 'pending') return '¡Excelente! No tienes tareas pendientes.';
    if (filter === 'completed') return 'Todavía no has completado ninguna tarea.';
    return 'No hay tareas para mostrar.';
  }, [tasks.length, filter]);

  const toast = (msg: string, color: typeof toastColor = 'dark') => {
    setToastMsg(msg);
    setToastColor(color);
  };

  // ── Acciones ──────────────────────────────────────────────────────────────

  const handleAddTask = async (payload: TaskFormPayload) => {
    const form = document.querySelector<HTMLFormElement>('form[aria-label="Formulario para agregar tarea"]');
    const withPhoto = form?.querySelector<HTMLInputElement>('[name="withPhoto"]')?.value === '1';
    const withLocation = form?.querySelector<HTMLInputElement>('[name="withLocation"]')?.value === '1';

    try {
      await add(payload.title, payload.description, withPhoto, withLocation);
      setShowAddModal(false);
      toast('Tarea agregada correctamente.', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Error al agregar la tarea.', 'danger');
    }
  };

  const handleUpdateTask = async (payload: TaskFormPayload) => {
    if (!editingTask) return;
    try {
      await edit(editingTask.id, payload);
      setEditingTask(null);
      toast(`Tarea #${editingTask.id} actualizada.`);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Error al actualizar.', 'danger');
    }
  };

  const handleSync = async () => {
    try {
      const count = await sync();
      toast(`${count} ${count === 1 ? 'tarea sincronizada' : 'tareas sincronizadas'}.`, 'success');
    } catch {
      toast('Error al sincronizar con la API.', 'danger');
    }
  };

  const handleImport = async () => {
    try {
      const count = await importFromApi(5);
      if (count === 0) {
        toast('No hay tareas nuevas para importar.', 'warning');
      } else {
        toast(`${count} ${count === 1 ? 'tarea importada' : 'tareas importadas'} desde la API.`, 'success');
      }
    } catch {
      toast('Error al importar desde la API.', 'danger');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const pendingSync = tasks.filter((t) => t.syncPending).length;

  return (
    <>
      {/* ── Menú lateral ── */}
      <IonMenu contentId="main-content" type="overlay">
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Menú To-Do IPSS</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ padding: '16px' }}>
            <p style={{ fontWeight: 600 }}>{user?.username}</p>
            <p style={{ color: 'var(--ion-color-medium)', fontSize: '0.85rem' }}>{user?.email}</p>
          </div>

          <IonMenuToggle autoHide>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 8px' }}>
              {(['all', 'pending', 'completed'] as TaskFilter[]).map((f) => (
                <IonButton
                  key={f}
                  expand="block"
                  fill={filter === f ? 'solid' : 'outline'}
                  color={f === 'pending' ? 'warning' : f === 'completed' ? 'success' : 'primary'}
                  onClick={() => setFilter(f)}
                >
                  <IonIcon
                    slot="start"
                    icon={f === 'all' ? listOutline : f === 'pending' ? timeOutline : checkmarkCircleOutline}
                  />
                  {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
                  <IonBadge
                    slot="end"
                    color={f === 'pending' ? 'warning' : f === 'completed' ? 'success' : 'primary'}
                  >
                    {counts[f]}
                  </IonBadge>
                </IonButton>
              ))}
            </div>
          </IonMenuToggle>

          <div style={{ padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <IonButton expand="block" color="tertiary" onClick={handleSync} disabled={syncing}>
              <IonIcon slot="start" icon={cloudUploadOutline} />
              Sincronizar ({pendingSync} pend.)
            </IonButton>
            <IonButton expand="block" color="secondary" onClick={handleImport} disabled={syncing}>
              <IonIcon slot="start" icon={cloudDownloadOutline} />
              Importar desde API
            </IonButton>
            <IonButton expand="block" fill="outline" color="danger" onClick={handleLogout}>
              <IonIcon slot="start" icon={logOutOutline} />
              Cerrar sesión
            </IonButton>
          </div>
        </IonContent>
      </IonMenu>

      {/* ── Página principal ── */}
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton aria-label="Abrir menú de navegación" />
            </IonButtons>
            <IonTitle>To-Do IPSS v2</IonTitle>
            <IonButtons slot="end">
              <IonChip>
                <IonLabel>
                  {counts.pending} pend. / {counts.all} total
                </IonLabel>
              </IonChip>
            </IonButtons>
          </IonToolbar>
          {(loading || syncing) && <IonProgressBar type="indeterminate" color="secondary" />}
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">To-Do IPSS v2</IonTitle>
            </IonToolbar>
          </IonHeader>

          <div style={{ padding: '8px' }}>
            {/* Botones de acción rápida */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <IonButton size="small" color="tertiary" onClick={handleSync} disabled={syncing}>
                {syncing ? <IonSpinner name="crescent" style={{ '--size': '16px' } as React.CSSProperties} /> : <IonIcon slot="start" icon={cloudUploadOutline} />}
                Sync ({pendingSync})
              </IonButton>
              <IonButton size="small" color="secondary" onClick={handleImport} disabled={syncing}>
                <IonIcon slot="start" icon={cloudDownloadOutline} />
                Importar API
              </IonButton>
            </div>

            {/* Filtros */}
            <IonSegment
              value={filter}
              onIonChange={(e) => setFilter((e.detail.value as TaskFilter) || 'all')}
              style={{ marginBottom: '8px' }}
            >
              <IonSegmentButton value="all">
                <IonLabel>Todas ({counts.all})</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="pending">
                <IonLabel>Pend. ({counts.pending})</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="completed">
                <IonLabel>Listas ({counts.completed})</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            <ListTask
              tasks={visibleTasks}
              emptyMessage={emptyMessage}
              onDeleteTask={(id) => setTaskToDelete(tasks.find((t) => t.id === id) ?? null)}
              onEditTask={(task) => setEditingTask(task)}
              onToggleTask={(id) => void toggle(id)}
            />
          </div>

          {/* FAB para agregar tarea */}
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => setShowAddModal(true)} aria-label="Agregar nueva tarea">
              <IonIcon icon={addOutline} />
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonPage>

      {/* ── Modal: Agregar tarea ── */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Nueva Tarea</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddModal(false)}>Cerrar</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <FormTask onSubmitTask={(payload) => void handleAddTask(payload)} />
        </IonContent>
      </IonModal>

      {/* ── Modal: Editar tarea ── */}
      <IonModal isOpen={Boolean(editingTask)} onDidDismiss={() => setEditingTask(null)}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Editar Tarea #{editingTask?.id}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setEditingTask(null)}>Cerrar</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <FormTask
            key={editingTask?.id ?? 'edit'}
            editingTask={editingTask}
            onSubmitTask={(payload) => void handleUpdateTask(payload)}
            onCancelEdit={() => setEditingTask(null)}
          />
        </IonContent>
      </IonModal>

      {/* ── Alerta: Confirmar eliminación ── */}
      <IonAlert
        isOpen={Boolean(taskToDelete)}
        header="Eliminar tarea"
        subHeader={taskToDelete ? `Tarea #${taskToDelete.id}: ${taskToDelete.title}` : undefined}
        message="¿Seguro que quieres eliminar esta tarea? Esta acción no se puede deshacer."
        onDidDismiss={() => setTaskToDelete(null)}
        buttons={[
          { text: 'Cancelar', role: 'cancel', handler: () => setTaskToDelete(null) },
          {
            text: 'Eliminar',
            role: 'destructive',
            handler: () => {
              if (taskToDelete) {
                void remove(taskToDelete.id).then(() =>
                  toast(`Tarea #${taskToDelete.id} eliminada.`),
                );
                setTaskToDelete(null);
              }
            },
          },
        ]}
      />

      {/* ── Toast ── */}
      <IonToast
        isOpen={Boolean(toastMsg)}
        message={toastMsg}
        duration={2500}
        position="bottom"
        color={toastColor}
        onDidDismiss={() => setToastMsg('')}
      />
    </>
  );
};

export default HomePage;
