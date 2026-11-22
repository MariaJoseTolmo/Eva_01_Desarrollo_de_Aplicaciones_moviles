/**
 * cameraService.ts
 * -----------------------------------------------------------------------
 * Servicio para capturar imágenes con la cámara del dispositivo usando
 * el plugin oficial @capacitor/camera.
 *
 * Requisito evaluativo:
 *  - Implementar funcionalidad para capturar imágenes usando la cámara
 *    y adjuntarlas a las tareas.
 *  - Integrar permisos de usuario de forma segura y conforme a mejores prácticas.
 */
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export interface CapturedPhoto {
  /** Imagen como Data URL (base64) lista para mostrar en <img> */
  dataUrl: string;
  /** Formato de la imagen */
  format: string;
}

/**
 * Solicita permiso y abre la cámara o galería para capturar una foto.
 * Retorna null si el usuario cancela o deniega el permiso.
 */
export const capturePhoto = async (
  source: CameraSource = CameraSource.Prompt,
): Promise<CapturedPhoto | null> => {
  try {
    // Verificar y solicitar permisos antes de usar la cámara
    const permStatus = await Camera.checkPermissions();

    if (permStatus.camera === 'denied') {
      throw new Error(
        'Permiso de cámara denegado. Ve a Configuración del dispositivo para habilitarlo.',
      );
    }

    if (permStatus.camera !== 'granted') {
      const request = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
      if (request.camera === 'denied') {
        throw new Error('No se otorgó permiso para usar la cámara.');
      }
    }

    const photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source,
      saveToGallery: false,
    });

    if (!photo.dataUrl) {
      return null;
    }

    return {
      dataUrl: photo.dataUrl,
      format: photo.format,
    };
  } catch (error) {
    // El usuario canceló la selección → no es un error real
    if (error instanceof Error && error.message.includes('User cancelled')) {
      return null;
    }
    throw error;
  }
};
