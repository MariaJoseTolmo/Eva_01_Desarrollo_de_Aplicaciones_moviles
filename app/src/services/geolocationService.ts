/**
 * geolocationService.ts
 * -----------------------------------------------------------------------
 * Servicio para obtener la ubicación GPS del dispositivo usando
 * @capacitor/geolocation.
 *
 * Requisito evaluativo:
 *  - Integrar el GPS para registrar la ubicación donde se crea cada tarea.
 *  - Integrar permisos de usuario de forma segura.
 */
import { Geolocation } from '@capacitor/geolocation';
import type { TaskLocation } from '../components/task/TaskInterface';

/** Error propio para distinguir problemas de permiso de fallos de hardware */
export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

/**
 * Solicita permisos y obtiene la posición GPS actual.
 * - Lanza PermissionError si el usuario deniega el permiso.
 * - Retorna null si el GPS falla por señal/timeout (error de hardware).
 */
export const getCurrentLocation = async (): Promise<TaskLocation | null> => {
  // Verificar permisos primero
  const permStatus = await Geolocation.checkPermissions();

  if (permStatus.location === 'denied') {
    throw new PermissionError(
      'Permiso de ubicación denegado. Habilítalo en Configuración del dispositivo.',
    );
  }

  if (permStatus.location !== 'granted') {
    const request = await Geolocation.requestPermissions();
    if (request.location === 'denied') {
      throw new PermissionError('No se otorgó permiso para acceder a la ubicación.');
    }
  }

  try {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy ?? undefined,
    };
  } catch (error) {
    // Error de hardware/señal (timeout, sin GPS) → null silencioso
    console.warn('No se pudo obtener la ubicación GPS:', error);
    return null;
  }
};

/**
 * Formatea una ubicación como texto legible.
 */
export const formatLocation = (loc: TaskLocation): string =>
  `${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}`;
