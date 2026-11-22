/**
 * Modelo principal de una Tarea.
 * Extiende la versión de la Unidad 1 con soporte para imagen, ubicación y sincronización remota.
 */
export default interface TaskInterface {
  /** Identificador único local */
  id: number;
  /** Título obligatorio */
  title: string;
  /** Descripción opcional */
  description?: string;
  /** Estado de completitud */
  completed?: boolean;
  /** ID del usuario propietario (para multi-usuario) */
  userId: string;
  /** Ruta base64 o dataURL de la imagen adjunta capturada con la cámara */
  imageBase64?: string;
  /** Ubicación GPS donde se creó la tarea */
  location?: TaskLocation;
  /** Fecha de creación (ISO 8601) */
  createdAt: string;
  /** Fecha de última modificación (ISO 8601) */
  updatedAt: string;
  /** ID remoto asignado por la API externa (null si aún no sincronizada) */
  remoteId?: number | null;
  /** Indica si hay cambios locales pendientes de subir */
  syncPending?: boolean;
}

export interface TaskLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  /** Etiqueta legible opcional (ej. "Santiago, Chile") */
  label?: string;
}
