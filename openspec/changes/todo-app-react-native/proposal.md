# Propuesta: ToDo App en React Native (EVU1)

## Intención

Construir la ToDo List de la Unidad 1 (brief escrito para Ionic) con **Expo + TypeScript + React Navigation 7**, cubriendo las 5 filas de la rúbrica con una app real y una arquitectura que soporte U2-U4 sin reescribir. Este SDD cubre solo planificación e implementación de la app.

## Alcance

### Dentro
- Proyecto Expo managed (`blank-typescript`), demo web en `localhost:8100` y Expo Go.
- Navegación: bottom tabs "Tareas" / "Nueva tarea" + native stack en Tareas (Lista -> Editar).
- Tareas con título y descripción: listar, agregar (form se limpia, título obligatorio), editar en pantalla aparte, eliminar con confirmación, marcar completada.
- Filtro Todas/Pendientes y estado vacío.
- `useReducer` + `TasksProvider` + `useTasks`; `TaskRepository` con implementación en memoria.
- `theme/` (espaciado, tipografía, colores con contraste AA).

### Fuera
- Persistencia (AsyncStorage), auth, API: U2-U4.
- Informe Word/PDF, zip y coevaluación (etapa posterior).
- Drawer, tests automatizados (opcionales, no evaluados).

## Capacidades

### Nuevas
- `task-management`: crear, editar, eliminar, completar; validación de título.
- `task-list`: listado, filtro Todas/Pendientes, estado vacío.
- `app-navigation`: tabs + stack, headers, rutas tipadas.
- `dev-environment`: scaffolding Expo, scripts web en puerto 8100, ejecución en Expo Go.

### Modificadas
- Ninguna (proyecto nuevo).

## Enfoque

Arquitectura en 3 capas (UI, lógica, datos), espejo del apunte: pantallas/componentes -> reducer + context + hooks -> repositorio. Estructura `src/features/tasks/` según la exploración.

## Trazabilidad Ionic -> React Native

| Brief Ionic | Implementación RN |
|---|---|
| `ionic start blank` | `create-expo-app --template blank-typescript` |
| `ion-header` / `ion-content` | Header de React Navigation / `SafeAreaView` + `FlatList` |
| `ion-list` / `ion-item` | `FlatList` + `TaskItem` |
| `ion-input` / `ion-button` | `TextInput` / `AppButton` (`Pressable`) |
| Confirmación (`ion-alert`) | `Alert.alert` (fallback web: `window.confirm`) |
| `localhost:8100` | `expo start --web --port 8100` |

## Cobertura de rúbrica y evidencia a facilitar

| Criterio | Pts | Evidencia que la app debe permitir capturar |
|---|---|---|
| Fundamentos/arquitectura | 14 | Árbol `src/` legible, capas separadas |
| Patrones | 18 | Archivos aislados por patrón: reducer, Provider, custom hooks, contenedor/presentacional, componentes controlados |
| Principios UI | 12 | Pantallas con jerarquía y espaciado consistente (`theme/`) |
| Componentes | 28 | Botones, formulario, lista, tabs, stack, filtro visibles |
| UX | 28 | Flujo completo: vacío, validación, agregar, editar, confirmar eliminar |

## Áreas afectadas

| Área | Impacto |
|---|---|
| `App.tsx`, `package.json`, `app.json` | Nuevo |
| `src/navigation/`, `src/features/tasks/`, `src/components/`, `src/theme/` | Nuevo |

## Riesgos

| Riesgo | Prob. | Mitigación |
|---|---|---|
| Docente no acepta RN | Media | Aprobación escrita antes de implementar; tabla de equivalencias |
| SDK Expo vs Expo Go desalineados | Media | Fijar SDK soportado por Expo Go al crear; Node LTS |
| Flag `--port 8100` cambia | Baja | Verificar con `npx expo start --help`; documentar el puerto real si difiere |
| `Alert.alert` sin botones en web | Alta | Wrapper `confirmDelete` con `window.confirm` en web |

## Rollback / Plan B

- RN rechazado: rehacer en Ionic reutilizando specs (comportamiento es agnóstico) y tabla de trazabilidad.
- Expo Go falla: demo solo web en 8100.
- Proyecto greenfield: revertir = borrar la carpeta de la app.

## Dependencias

- Aprobación del docente; Node LTS; Expo SDK compatible con Expo Go.

## Criterios de éxito

- [ ] App corre en `localhost:8100` y en Expo Go.
- [ ] CRUD + completar + filtro + estado vacío funcionan.
- [ ] Formulario se limpia tras agregar; título vacío muestra error.
- [ ] Eliminar pide confirmación (nativo y web).
- [ ] Cada patrón de la rúbrica tiene un archivo citable.
