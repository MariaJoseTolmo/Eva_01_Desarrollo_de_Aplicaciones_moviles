import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonText,
  IonToggle,
} from '@ionic/react';
import {
  addCircleOutline,
  cameraOutline,
  closeCircleOutline,
  locationOutline,
  saveOutline,
} from 'ionicons/icons';
import React, { useState } from 'react';
import type FormTaskInterface from './FormTaskInterface';

const FormTask: React.FC<FormTaskInterface> = ({
  onSubmitTask,
  editingTask = null,
  onCancelEdit,
}) => {
  const [title, setTitle] = useState<string>(editingTask?.title ?? '');
  const [description, setDescription] = useState<string>(editingTask?.description ?? '');
  const [withPhoto, setWithPhoto] = useState(false);
  const [withLocation, setWithLocation] = useState(false);
  const [titleError, setTitleError] = useState('');

  const isEditMode = Boolean(editingTask);

  const validateTitle = (value: string): boolean => {
    if (!value.trim()) {
      setTitleError('El título de la tarea es obligatorio.');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateTitle(title)) return;

    onSubmitTask({
      title: title.trim(),
      description: description.trim(),
    });

    if (!isEditMode) {
      setTitle('');
      setDescription('');
      setWithPhoto(false);
      setWithLocation(false);
      setTitleError('');
    }
  };

  return (
    <IonCard className="task-form-card">
      <IonCardHeader>
        <IonCardSubtitle color={isEditMode ? 'warning' : 'primary'}>
          {isEditMode ? `Editando tarea #${editingTask?.id}` : 'Registro de actividades'}
        </IonCardSubtitle>
        <IonCardTitle>{isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label={isEditMode ? 'Formulario para editar tarea' : 'Formulario para agregar tarea'}
        >
          <IonList lines="none">
            <IonItem className={titleError ? 'ion-invalid ion-touched' : ''}>
              <IonInput
                label="Título de la tarea *"
                labelPlacement="stacked"
                placeholder="Ej. Estudiar componentes de Ionic"
                value={title}
                clearInput
                onIonInput={(e) => {
                  const v = String(e.detail.value ?? '');
                  setTitle(v);
                  if (titleError && v.trim()) setTitleError('');
                }}
                onIonBlur={() => { if (title.length > 0) validateTitle(title); }}
              />
            </IonItem>

            {titleError && (
              <div role="alert" aria-live="polite" style={{ padding: '0 16px 8px' }}>
                <IonText color="danger">
                  <small>{titleError}</small>
                </IonText>
              </div>
            )}

            <IonItem>
              <IonInput
                label="Descripción de la tarea"
                labelPlacement="stacked"
                placeholder="Ej. Revisar ion-list, ion-item, ion-input"
                value={description}
                clearInput
                onIonInput={(e) => setDescription(String(e.detail.value ?? ''))}
              />
            </IonItem>

            {/* Opciones de periféricos solo para nuevas tareas */}
            {!isEditMode && (
              <>
                <IonItem>
                  <IonIcon slot="start" icon={cameraOutline} color="primary" />
                  <IonText>Capturar foto con cámara</IonText>
                  <IonToggle
                    slot="end"
                    checked={withPhoto}
                    onIonChange={(e) => setWithPhoto(e.detail.checked)}
                    aria-label="Activar captura de foto"
                  />
                </IonItem>
                <IonItem>
                  <IonIcon slot="start" icon={locationOutline} color="primary" />
                  <IonText>Registrar ubicación GPS</IonText>
                  <IonToggle
                    slot="end"
                    checked={withLocation}
                    onIonChange={(e) => setWithLocation(e.detail.checked)}
                    aria-label="Activar registro de ubicación"
                  />
                </IonItem>
              </>
            )}
          </IonList>

          {/* Pasar los toggles al padre mediante el payload extendido */}
          <input type="hidden" name="withPhoto" value={withPhoto ? '1' : '0'} />
          <input type="hidden" name="withLocation" value={withLocation ? '1' : '0'} />

          <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <IonButton type="submit" expand="block" color="primary">
              <IonIcon slot="start" icon={isEditMode ? saveOutline : addCircleOutline} />
              {isEditMode ? 'Guardar cambios' : 'Guardar tarea'}
            </IonButton>

            {isEditMode && onCancelEdit && (
              <IonButton
                type="button"
                expand="block"
                fill="outline"
                color="medium"
                onClick={onCancelEdit}
              >
                <IonIcon slot="start" icon={closeCircleOutline} />
                Cancelar edición
              </IonButton>
            )}
          </div>
        </form>
      </IonCardContent>
    </IonCard>
  );
};

export default FormTask;
