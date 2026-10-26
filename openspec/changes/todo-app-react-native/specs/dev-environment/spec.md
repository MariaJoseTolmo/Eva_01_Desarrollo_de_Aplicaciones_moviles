# Especificación: dev-environment (delta, capacidad nueva)

Entorno de desarrollo y ejecución. Específica de Expo (no aplica al plan B Ionic, que usaría su propio equivalente).

## Requisitos

### REQ-DEV-1: Proyecto base
- El proyecto MUST crearse como Expo managed con TypeScript (plantilla `blank-typescript`) y MUST compilar sin errores de tipos (`tsc --noEmit`).
- La versión del SDK de Expo MUST ser compatible con la versión de Expo Go disponible en las tiendas al momento de la demo.
- El proyecto MUST declarar el Node LTS requerido (p. ej. `engines` o README).

### REQ-DEV-2: Ejecución web en puerto 8100
- Un script `npm run web` (o equivalente documentado) MUST iniciar la app en navegador en `http://localhost:8100`.
- Si el flag de puerto de Expo difiere, el puerto real MUST verificarse con `npx expo start --help` y documentarse; el objetivo sigue siendo 8100.

### REQ-DEV-3: Ejecución en Expo Go
- `npm start` MUST iniciar el servidor de desarrollo y mostrar un QR que permita abrir la app en Expo Go (iOS/Android) sin build nativo.
- La app MUST funcionar en Expo Go sin módulos nativos personalizados.

### REQ-DEV-4: Estructura y dependencias
- El código MUST organizarse en `src/` con `navigation/`, `features/tasks/`, `components/` y `theme/`.
- Las dependencias de navegación MUST ser compatibles con el SDK elegido (instaladas con `npx expo install` cuando aplique).
- El proyecto MUST NOT requerir persistencia, autenticación ni API en esta unidad.

### REQ-DEV-5: Documentación mínima
- Un README MUST explicar instalación, `npm start`, `npm run web` (puerto 8100) y cómo abrir Expo Go.

## Escenarios

### Instalación limpia
- **Dado** un clon limpio con Node LTS
- **Cuando** ejecuto `npm install`
- **Entonces** finaliza sin errores de dependencias incompatibles.

### Web en 8100
- **Dado** dependencias instaladas
- **Cuando** ejecuto `npm run web`
- **Entonces** puedo abrir `http://localhost:8100` y ver la pestaña "Tareas".

### Puerto distinto al esperado
- **Dado** que la versión de Expo cambia el flag de puerto
- **Cuando** verifico con `npx expo start --help`
- **Entonces** el script usa el flag correcto o el README documenta el puerto real.

### Expo Go
- **Dado** el servidor iniciado con `npm start` y Expo Go instalado
- **Cuando** escaneo el QR en la misma red
- **Entonces** la app abre y el flujo completo funciona.

### Expo Go no disponible
- **Dado** que Expo Go no puede abrir la app (SDK desalineado o sin red)
- **Cuando** se prepara la demo
- **Entonces** la demo web en 8100 MUST ser suficiente para mostrar todas las funciones.

### Tipado
- **Dado** el proyecto completo
- **Cuando** ejecuto `npx tsc --noEmit`
- **Entonces** termina sin errores.
