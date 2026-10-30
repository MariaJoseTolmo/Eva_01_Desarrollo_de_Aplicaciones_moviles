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
} from '@ionic/react';
import { addCircleOutline, closeCircleOutline, saveOutline } from 'ionicons/icons';
import React, { useState } from 'react';

import type FormTaskInterface from './FormTaskInterface';

const FormTask: React.FC<FormTaskInterface> = ({
  onSubmitTask,
  editingTask = null,
  onCancelEdit,
}) => {
  const [title, setTitle] = useState<string>(editingTask?.title ?? '');
  const [description, setDescription] = useState<string>(editingTask?.description ?? '');
  const [titleError, setTitleError] = useState<string>('');


  const validateTitle = (value: string): boolean => {
    if (!value.trim()) {
      setTitleError('El título de la tarea es obligatorio.');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateTitle(title)) {
      return;
    }

    onSubmitTask({
      title: title.trim(),
      description: description.trim(),
    });

    // Clear fields after saving a new task (required by evaluation brief)
    if (!editingTask) {
      setTitle('');
      setDescription('');
      setTitleError('');
    }
  };

  const isEditMode = Boolean(editingTask);

  return (
    <IonCard className="task-form-card">
      <IonCardHeader>
        <IonCardSubtitle color={isEditMode ? 'warning' : 'primary'}>
          {isEditMode ? `Editando tarea #${editingTask?.id}` : 'Registro de actividades'}
        </IonCardSubtitle>
        <IonCardTitle>{isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <form onSubmit={handleSubmit} noValidate aria-label={isEditMode ? 'Formulario para editar tarea' : 'Formulario para agregar nueva tarea'}>
          <IonList lines="none" className="task-form-list">
            <IonItem className={`task-form-item ${titleError ? 'ion-invalid ion-touched' : ''}`}>
              <IonInput
                id="task-title-input"
                name="title"
                label="Título de la tarea *"
                labelPlacement="stacked"
                placeholder="Ej. Estudiar componentes de Ionic"
                value={title}
                required={true}
                clearInput={true}
                enterkeyhint="next"
                aria-invalid={Boolean(titleError)}
                aria-describedby={titleError ? 'task-title-error' : undefined}
                onIonInput={(e) => {
                  const nextValue = String(e.detail.value ?? '');
                  setTitle(nextValue);
                  if (titleError && nextValue.trim()) {
                    setTitleError('');
                  }
                }}
                onIonBlur={() => {
                  if (title.length > 0) {
                    validateTitle(title);
                  }
                }}
              />
            </IonItem>

            {titleError && (
              <div
                id="task-title-error"
                role="alert"
                aria-live="polite"
                className="task-form-error"
              >
                <IonText color="danger">
                  <small>{titleError}</small>
                </IonText>
              </div>
            )}

            <IonItem className="task-form-item">
              <IonInput
                id="task-description-input"
                name="description"
                label="Descripción de la tarea"
                labelPlacement="stacked"
                placeholder="Ej. Revisar ion-list, ion-item, ion-input e ion-button"
                value={description}
                clearInput={true}
                enterkeyhint="done"
                onIonInput={(e) => setDescription(String(e.detail.value ?? ''))}
              />
            </IonItem>
          </IonList>

          <div className="task-form-actions">
            <IonButton
              id="save-task-button"
              type="submit"
              expand="block"
              color="primary"
              className="task-submit-button"
            >
              <IonIcon slot="start" icon={isEditMode ? saveOutline : addCircleOutline} />
              {isEditMode ? 'Guardar cambios' : 'Guardar tarea'}
            </IonButton>

            {isEditMode && onCancelEdit && (
              <IonButton
                id="cancel-edit-button"
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
