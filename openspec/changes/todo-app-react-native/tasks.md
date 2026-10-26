# Tareas: ToDo App en React Native (EVU1)

Cambio: `todo-app-react-native`. Strict TDD: OFF (Jest + RNTL se configuran en la Fase 7 como opcionales). Commits: conventional commits, sin atribución de IA ni `Co-Authored-By`. Repo git ya inicializado, rama `main`, remoto `origin` = github.com/MariaJoseTolmo/Eva_01_Desarrollo_de_Aplicaciones_moviles (privado).

## Review Workload Forecast

| Campo | Valor |
|---|---|
| Líneas cambiadas estimadas | ~1.250 (código ~950, tests ~200, README/docs ~100; sin `package-lock.json` ni assets generados) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Decision needed before apply | Resuelta (2026-10-26): **un solo PR con `size:exception`**, decidido por el equipo. Sin `chain_strategy`. Los 10 commits de trabajo se mantienen para que el historial se pueda revisar. |
| Delivery strategy | ask-on-risk |

### Cortes de PR propuestos

| PR | Fases | Contenido | Líneas aprox. | Verificación independiente |
|---|---|---|---|---|
| PR1 | 0, 1, 2 | Scaffold, tema, i18n, utils, dominio, repositorio, reducer, selectores | ~380 | `tsc --noEmit`; `npm run web` abre en 8100 |
| PR2 | 3, 4 | Provider, hooks, componentes UI base, navegación con pantallas placeholder | ~370 | Tabs y stack navegables; tipado de rutas |
| PR3 | 5, 6 | Componentes de tareas, pantallas contenedoras, flujos completos | ~400 | Checklist manual de flujos (web 8100) |
| PR4 | 7, 8 | Tests opcionales, README, checklist de demo y capturas | ~200 | Tests pasan; `tsc` limpio; capturas listas |

Cada PR deja la app en estado coherente. Si se elige `size:exception` (PR único), mantener igual los commits de trabajo de abajo.

## Fase 0: Verificación del entorno y scaffolding (REQ-DEV-1, DEV-2, DEV-3, DEV-4)

- [ ] 0.1 Verificar Node LTS (`node -v`). Fijar la versión LTS a declarar en `engines`. (REQ-DEV-1)
- [ ] 0.2 Confirmar el SDK de Expo soportado por la versión actual de Expo Go (tiendas) y anotarlo; confirmar el flag de puerto con `npx expo start --help`. Registrar el resultado (SDK elegido, flag real) para el README. (REQ-DEV-1, DEV-2)
- [ ] 0.3 Crear el proyecto con `create-expo-app` plantilla `blank-typescript` fijando el SDK de 0.2; generar `package.json`, `app.json`, `App.tsx`, `tsconfig.json`. Si la carpeta no está vacía, crear en subcarpeta y mover. (REQ-DEV-1)
- [ ] 0.4 Instalar con `npx expo install`: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`, `@expo/vector-icons`, y `react-dom`, `react-native-web`, `@expo/metro-runtime` para web. Fijar versiones. (REQ-DEV-4)
- [ ] 0.5 Configurar scripts: `start` = `expo start`, `web` = `expo start --web --port 8100` (o el flag real de 0.2) y `typecheck` = `tsc --noEmit`; declarar `engines.node`. Verificar que `npm run web` sirve en `http://localhost:8100`. (REQ-DEV-1, DEV-2)
- [ ] 0.6 Crear el árbol vacío `src/{navigation,features/tasks/{data,context,hooks,screens,components},components,theme,i18n,utils}`. (REQ-DEV-4)

Commit 1: `chore: scaffold expo blank-typescript project with web port 8100`

## Fase 1: Fundaciones transversales (REQ-DEV-4; apoya REQ-TM-5, TM-6)

Paralelizables entre sí (1.1 a 1.4); dependen de la Fase 0.

- [ ] 1.1 [P] `src/theme/colors.ts`, `spacing.ts`, `typography.ts`, `index.ts` (más `radius` y `touchTarget: 44`) con los valores de diseño. (Principios UI)
- [ ] 1.2 [P] `src/i18n/es.ts` con `as const`: tabs, encabezados, "Título", "Descripción", "Agregar tarea", "Guardar", "El título es obligatorio", "La tarea no existe", "Tarea agregada", confirmación de eliminar (título, mensaje, "Cancelar", "Eliminar"), filtro ("Todas", "Pendientes"), vacíos ("Aún no tienes tareas", "Agrega una desde la pestaña Nueva tarea", "No tienes tareas pendientes") y etiquetas de accesibilidad con `${title}`. (REQ-TM-1, TM-2, TM-4, TM-5, TL-2, TL-3)
- [ ] 1.3 [P] `src/utils/createId.ts` según diseño. (REQ-TM-1)
- [ ] 1.4 [P] `src/utils/confirm.ts` con `confirmAsync` (`window.confirm` en web, `Alert.alert` en nativo, `Promise<boolean>`). (REQ-TM-5)

Commit 2: `feat(core): add theme tokens, Spanish copy, id and confirm utils`

## Fase 2: Dominio, datos y lógica pura (REQ-TM-1, TM-2, TM-6, TL-2)

Secuencial: 2.1 -> 2.2 -> 2.3/2.4.

- [ ] 2.1 `src/features/tasks/types.ts`: `Task`, `TaskInput`, `TaskFilter`. (REQ-TM-1)
- [ ] 2.2 `data/TaskRepository.ts` (interfaz async) y `data/inMemoryTaskRepository.ts` (`getAll`, `create` con `createId` + `completed: false` + `createdAt`, `update` que lanza si no existe, `remove`). (REQ-TM-1, TM-4, TM-6)
- [ ] 2.3 `context/tasksReducer.ts` puro: `LOAD_TASKS`, `ADD_TASK`, `UPDATE_TASK`, `DELETE_TASK`, `SET_FILTER`; `TasksState`/`TasksAction` e `initialState` (`status: 'loading'`). (REQ-TL-2, NAV-5)
- [ ] 2.4 `context/selectors.ts`: `selectVisibleTasks(state)` en orden de creación; filtro `pending`. (REQ-TL-1, TL-2)

Commit 3: `feat(tasks): add task domain, in-memory repository, reducer and selectors`

## Fase 3: Provider, hooks y UI reutilizable (REQ-TM-1..TM-6, TL-2, NAV-5)

- [ ] 3.1 `context/TasksProvider.tsx`: recibe `repository` por prop, carga con `getAll` al montar, expone acciones (`addTask`, `updateTask`, `toggleTask`, `deleteTask`, `setFilter`, `getTaskById`) con `useCallback` y valor con `useMemo`; `addTask`/`updateTask` revalidan `trim()`. (REQ-TM-1, TM-2, TM-6)
- [ ] 3.2 `hooks/useTasks.ts`: consume el contexto, lanza error fuera del provider. (REQ-TM-1)
- [ ] 3.3 `hooks/useTaskForm.ts`: `title`, `description`, `error`, `validate()`, `reset()`; el error se limpia al editar el campo; conserva lo escrito si es rechazado. (REQ-TM-2, TM-3)
- [ ] 3.4 [P] `src/components/AppButton.tsx` (variantes primary/secondary/danger/icon, `minHeight 44`, roles y estados de accesibilidad). (REQ-TM-5, Principios UI)
- [ ] 3.5 [P] `src/components/AppTextInput.tsx` (controlado, etiqueta, mensaje de error con `accessibilityRole="alert"`). (REQ-TM-2)
- [ ] 3.6 [P] `src/components/Checkbox.tsx` (`accessibilityRole="checkbox"`, `accessibilityState.checked`, indicador de check). (REQ-TM-6)

Commit 4: `feat(tasks): add TasksProvider, useTasks and useTaskForm hooks`
Commit 5: `feat(ui): add AppButton, AppTextInput and Checkbox components`

## Fase 4: Navegación (REQ-NAV-1, NAV-2, NAV-3, NAV-4)

- [ ] 4.1 `src/navigation/types.ts`: `TasksStackParamList`, `RootTabParamList` y `declare global` de `RootParamList`. (REQ-NAV-4)
- [ ] 4.2 `src/navigation/TasksStack.tsx` (native stack: `TaskList` "Tareas", `TaskEdit` "Editar tarea" con retroceso) y `RootNavigator.tsx` (tabs "Tareas" y "Nueva tarea", inicial "Tareas", íconos + etiquetas, `headerShown: false` en `TasksTab`). Pantallas placeholder provisionales hasta la Fase 6. (REQ-NAV-1, NAV-2, NAV-3)
- [ ] 4.3 `App.tsx`: `SafeAreaProvider` > `TasksProvider` (inyectando `inMemoryTaskRepository`) > `NavigationContainer` > `RootNavigator`. (REQ-NAV-5)
- [ ] 4.4 Verificar `npx tsc --noEmit` y que navegar a `TaskEdit` sin `taskId` falla en tipado (comprobación temporal, no se commitea). (REQ-NAV-4, DEV-1)

Commit 6: `feat(nav): add typed bottom tabs and tasks stack with provider wiring`

## Fase 5: Componentes de tareas (REQ-TM-6, TL-1, TL-2, TL-3)

Todos [P] salvo 5.5, que depende de 5.1 a 5.4.

- [ ] 5.1 [P] `components/TaskItem.tsx`: título (`heading`), descripción muted, tachado + check si completada, acciones completar/editar/eliminar con etiquetas accesibles; `onToggle`/`onEdit`/`onDelete` hacia arriba. (REQ-TL-1, TM-6)
- [ ] 5.2 [P] `components/FilterBar.tsx`: segmentos "Todas"/"Pendientes", `accessibilityRole="tab"` y `selected`. (REQ-TL-2)
- [ ] 5.3 [P] `components/EmptyState.tsx`: dos variantes de mensaje (sin tareas / sin pendientes). (REQ-TL-3)
- [ ] 5.4 [P] `components/TaskForm.tsx`: presentacional y controlado (`title`, `description`, `error`, `submitLabel`, callbacks). (REQ-TM-1, TM-2, TM-4)
- [ ] 5.5 `components/TaskList.tsx`: `FlatList` con `keyExtractor` por id, `ListEmptyComponent`, `ListHeaderComponent` con `FilterBar` visible también en vacíos. (REQ-TL-1, TL-3)

Commit 7: `feat(tasks): add TaskItem, TaskList, FilterBar, EmptyState and TaskForm`

## Fase 6: Pantallas contenedoras y flujos (REQ-TM-1..TM-6, TL-1..TL-3, NAV-2, NAV-5)

- [ ] 6.1 `screens/TaskListScreen.tsx`: conecta `useTasks`, filtro, `toggleTask`, navegación a `TaskEdit` con `{ taskId }`, eliminación con `confirmAsync` y textos de `es.ts`. Elegir mensaje vacío según `allCount` y filtro. (REQ-TL-1..3, TM-5, TM-6)
- [ ] 6.2 `screens/NewTaskScreen.tsx`: `useTaskForm` + `TaskForm`; al enviar válido llama `addTask`, hace `reset()` y muestra "Tarea agregada" (`accessibilityLiveRegion="polite"`, `role alert`, color success) sin navegar; `KeyboardAvoidingView`. Tras intento rechazado conserva lo escrito. (REQ-TM-1, TM-2, TM-3)
- [ ] 6.3 `screens/TaskEditScreen.tsx`: lee la tarea por `taskId`, precarga valores, valida, `updateTask` y `goBack()`; si no existe muestra "La tarea no existe" con botón para volver. (REQ-TM-4, NAV-2)
- [ ] 6.4 Reemplazar placeholders de la Fase 4 por las pantallas reales; ejecutar `tsc --noEmit`. (REQ-NAV-5, DEV-1)
- [ ] 6.5 Recorrido manual en `localhost:8100`: crear, validar vacío y solo espacios, trim, editar, volver sin guardar, eliminar (confirmar y cancelar), completar, filtro, vacíos, conservación del filtro entre pestañas. (todos los REQ)

Commit 8: `feat(tasks): add list, new and edit screens with full task flows`

## Fase 7: Tests opcionales (no evaluados; TDD estricto OFF)

- [ ] 7.1 Instalar `jest`, `jest-expo`, `@testing-library/react-native`, `@types/jest`; configurar `jest` en `package.json` y script `test`. (Estrategia de testing)
- [ ] 7.2 Tests unitarios: `tasksReducer`, `selectVisibleTasks`, `createId`, `inMemoryTaskRepository`. (REQ-TM-1, TL-2)
- [ ] 7.3 Test de componente: `TaskForm` + `useTaskForm` (error con título vacío, limpieza tras enviar). (REQ-TM-2, TM-3)

Commit 9: `test(tasks): set up jest and cover reducer, selectors, repository and form`

## Fase 8: Documentación y evidencia (REQ-DEV-5; rúbrica)

- [ ] 8.1 `README.md`: requisitos (Node LTS), `npm install`, `npm start` (QR y Expo Go), `npm run web` (puerto 8100 o el real documentado), estructura `src/` y tabla Ionic -> React Native. (REQ-DEV-5, DEV-1)
- [ ] 8.2 Probar en Expo Go (iOS/Android) con `npm start`; si falla, documentar plan B de demo solo web. (REQ-DEV-3)
- [ ] 8.3 Checklist de demo manual (`openspec/changes/todo-app-react-native/demo-checklist.md`) con pasos y resultado esperado por escenario de las specs.
- [ ] 8.4 Capturar evidencia por criterio de rúbrica: árbol `src/` (14 pts), archivos de patrones según el mapa del diseño (18 pts), pantallas con jerarquía y espaciado (12 pts), componentes visibles: botones, formulario, lista, tabs, stack, filtro (28 pts), flujo UX: vacío, validación, agregar, editar, confirmar eliminar (28 pts). El informe Word/PDF queda fuera de alcance.

Commit 10: `docs: add README, demo checklist and evidence guide`

## Resumen y dependencias

- Total: 8 fases, 40 tareas, 10 commits de trabajo.
- Secuencial: Fase 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8. Paralelo dentro de fase: 1.1 a 1.4, 3.4 a 3.6, 5.1 a 5.4.
- Camino crítico: 0.2 (SDK/flag) -> 0.3 -> 2.2 -> 3.1 -> 4.3 -> 6.1 -> 6.5.
- Preguntas abiertas del diseño resueltas: tras agregar se queda en "Nueva tarea" (REQ-TM-3 y REQ-NAV-5 compatibles); SDK y flag se verifican en 0.2.
