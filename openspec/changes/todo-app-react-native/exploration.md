# Exploración: ToDo App en React Native (EVU1)

## Respuesta rápida

Construir con **Expo (managed, plantilla `blank-typescript`) + React Navigation 7 (bottom tabs + native stack) + `useReducer` + Context + un custom hook `useTasks`**. La persistencia queda detrás de una interfaz de repositorio, para sumar AsyncStorage, auth y API sin reescribir. Se muestra en web con `npx expo start --web`.

## 1. Hechos verificados de las fuentes

| Fuente | Hecho verificado |
|---|---|
| Brief | Entrega de 100 pts, grupal de máx. 3 integrantes, 10% de la nota final. Exigencia 60% = nota 4,0 (59 pts = 4,0; 60 = 4,0; 100 = 7,0). |
| Brief | Requisitos: agregar, editar y eliminar, con título y descripción. Instrucciones detalladas solo de agregar (el formulario se limpia) y eliminar (botón junto a cada tarea). **Editar no tiene instrucciones**. |
| Brief | Entorno: Node + Ionic CLI, plantilla en blanco, `http://localhost:8100`, uso de `ion-header/content/list/item/input/button`. |
| Brief | Entrega: documento Word/PDF con portada (asignatura, logo CIISA, profesor, alumnos), Arial 12, interlineado 1,15, justificado, páginas numeradas. Documentar estructura de archivos y componentes principales, con capturas. Zip `EVU1_APELLIDO_NOMBRE`. Coevaluación obligatoria. |
| Rúbrica | 14 conceptos/arquitectura/terminología; 18 patrones de diseño con ejemplos; 12 principios de UI (jerarquía, balance, contraste, ritmo, proporción); 28 componentes (botones, menús, formularios, listas, navegadores); 28 UX intuitiva. |
| Rúbrica | Niveles: Bajo (<59%), Medio (60-69%), Alto (80-89%), Sobresaliente (90-100%). Valores en pts: 14: 0/4/8/14; 18: 0/5/10/18; 12: 0/3/6/12; 28: 0/7/14/28. Los saltos Alto→Sobresaliente son grandes. |
| Rúbrica | En el indicador de 14 pts, el nivel Sobresaliente exige ejemplos prácticos y un proyecto "bien estructurado, funcional y optimizado". |
| Apunte | Estructura: historia/importancia, **arquitectura en capas (UI, lógica de negocio, integración)**, componentes clave, patrones, comparativa con React Native/Flutter/Xamarin. El documento del equipo debe espejar ese esquema para React Native. |
| Versiones | React Navigation es 7.x. Se instala con `npm install @react-navigation/native` y `npx expo install react-native-screens react-native-safe-area-context`. |
| Versiones | Expo: la doc muestra `default@sdk-57` y `default@sdk-58` según la página. Para Expo Go en celular, usar el SDK que soporte la app de la tienda. **Verificar al crear.** |

## 2. Mapeo Ionic a React Native

| Requisito Ionic | Equivalente React Native |
|---|---|
| Node.js | Node.js (LTS), igual |
| Ionic CLI + `ionic start blank` | `npx create-expo-app@latest todo-app --template blank-typescript` (verificar que la plantilla siga con ese nombre) |
| `ion-header` | Header de React Navigation (`headerTitle`, `headerRight`) |
| `ion-content` | `SafeAreaView` + `View` / `ScrollView` (o el propio `FlatList`) |
| `ion-list` + `ion-item` | `FlatList` + componente `TaskItem` (`renderItem`, `keyExtractor`) |
| `ion-input` | `TextInput` (`value`, `onChangeText`, `placeholder`) |
| `ion-button` | `Pressable` envuelto en un `AppButton` propio (más control que `Button`) |
| `ion-icon` / eliminar | `@expo/vector-icons` (incluido en Expo), botón con ícono junto a cada tarea |
| `ion-tabs` / `ion-menu` | Bottom tabs / stack de React Navigation |
| `ion-alert` | `Alert.alert` para confirmar eliminar |
| Servidor `localhost:8100` | Metro en `localhost:8081`; web con `npx expo start --web`. Para clavar 8100: `npx expo start --web --port 8100` (verificar el flag en la versión usada) |
| HTML + CSS | JSX + `StyleSheet` (CSS-in-JS con Flexbox). No hay DOM: son componentes nativos |

Dependencias web: `npx expo install react-dom react-native-web @expo/metro-runtime`.

## 3. Comparación de enfoques

### 3.1 Tooling

| | Expo managed | React Native CLI |
|---|---|---|
| Setup | `npx`, sin Android Studio ni Xcode | Requiere SDKs nativos, JDK, CocoaPods |
| Demo | Expo Go (QR) + web | Emulador obligatorio |
| Riesgo | Limitado a módulos compatibles con Expo (basta para Unidades futuras: AsyncStorage, fetch, auth) | Alta fricción de entorno por 3 integrantes |
| Esfuerzo | **Bajo** | Alto |

**Elegir Expo.** Es la recomendación oficial de React Native para apps nuevas, y calza con los resultados de aprendizaje: "instalar y configurar el entorno" se documenta con pasos reales.

### 3.2 Navegación

| | React Navigation 7 | Expo Router |
|---|---|---|
| Modelo | Navegadores explícitos en código (Stack, Tabs, Drawer) | File-based (carpetas `app/`) sobre React Navigation |
| Terminología rúbrica ("navegadores") | Muy clara y enseñable | Más implícita (layouts) |
| Plantilla | Se parte de `blank-typescript` | Viene con la plantilla `default` |
| Esfuerzo | Bajo-medio | Bajo, pero más "magia" |

**Elegir React Navigation**: hace visibles los conceptos Navigator/Screen/Route, que son lo que se evalúa. Expo Router es válido pero esconde esa terminología.

Navegadores a usar, de menor a mayor complejidad:
- **Bottom tabs** (2 pestañas: *Tareas* y *Nueva tarea*): cubre "menú/navegador" sin librerías extra.
- **Native stack** dentro de Tareas (Lista a Editar tarea): cubre editar con una pantalla real.
- **Drawer**: descartado, exige `react-native-reanimated` y `gesture-handler`, mucho costo para poco valor.
- "Menú" adicional barato: en el header un botón con `Alert`/`Modal` de filtros (Todas/Pendientes), o un `SegmentedControl` hecho con `Pressable`.

### 3.3 Estado y patrones

| Opción | Pros | Contras | Esfuerzo |
|---|---|---|---|
| `useState` en pantalla | Mínimo | No escala a 2 pantallas, patrones pobres para los 18 pts | Bajo |
| **`useReducer` + Context + custom hook** | Cero dependencias, muestra varios patrones, escala a persistencia | Más código base | Medio |
| Zustand/Redux Toolkit | Muy escalable | Dependencia extra, rúbrica premia patrones del framework, no de una librería | Medio |

**Elegir `useReducer` + Context.**

Patrones a mostrar en el documento (cada uno con ejemplo de código del proyecto):
1. Composición de componentes (`TaskList` > `TaskItem` > `AppButton`).
2. Presentacional/contenedor (`TaskFormScreen` contenedor, `TaskForm` presentacional).
3. Hooks y custom hooks (`useTasks`, `useTaskForm`).
4. Flujo de datos unidireccional (props abajo, callbacks arriba).
5. Context/Provider (`TasksProvider`).
6. Reducer (acciones `ADD_TASK`, `UPDATE_TASK`, `DELETE_TASK`, `TOGGLE_TASK`).
7. Componentes controlados (`TextInput` con `value`/`onChangeText`).
8. Listas con `key` estable (`FlatList.keyExtractor`).

### 3.4 Compatibilidad con unidades futuras

Estructura propuesta, orientada a features:

```
src/
  navigation/    RootNavigator.tsx, types.ts
  features/tasks/
    components/  TaskItem.tsx, TaskForm.tsx, TaskList.tsx
    screens/     TaskListScreen.tsx, TaskFormScreen.tsx
    context/     TasksProvider.tsx, tasksReducer.ts
    hooks/       useTasks.ts, useTaskForm.ts
    data/        TaskRepository.ts (interfaz), inMemoryTaskRepository.ts
    types.ts
  components/    AppButton.tsx, AppTextInput.tsx
  theme/         colors.ts, spacing.ts, typography.ts
App.tsx
```

- **Almacenamiento local (U2)**: se agrega `asyncStorageTaskRepository.ts` y `TasksProvider` lo hidrata al montar. El reducer no cambia.
- **Auth (U3)**: un `AuthProvider` y un navegador condicional (stack Auth vs tabs). Encaja con React Navigation.
- **APIs (U4)**: `apiTaskRepository.ts` implementa la misma interfaz. Las pantallas no se tocan.

### 3.5 Testing (solo nota)

Jest (viene con `jest-expo`) + React Native Testing Library. Cubrir primero `tasksReducer` (función pura, barato) y luego `TaskForm` (limpiar campos tras agregar). Prioridad baja: la rúbrica no lo evalúa.

## 4. Recomendación

Expo + React Navigation (tabs + stack) + `useReducer`/Context + capa de repositorio. Es lo más barato que cubre las 5 filas de la rúbrica con una app que parece real, no un formulario único.

Extras baratos para UX (28 pts) y UI (12 pts):
- Marcar tarea como completada (un `TOGGLE_TASK`).
- Validación de título vacío con mensaje.
- Estado vacío ("Aún no tienes tareas").
- Confirmación antes de eliminar.
- `KeyboardAvoidingView`.
- Áreas táctiles de al menos 44 px.
- Un `theme/` con una escala de espaciado y tipografía consistentes (ritmo/proporción), y contraste AA en texto.

## 5. Cobertura de la rúbrica

| Criterio | Pts | Cómo lo cubre el enfoque | Evidencia a entregar |
|---|---|---|---|
| Fundamentos / arquitectura / terminología | 14 | Explicar RN: componentes nativos (no WebView), bridge/New Architecture, JSX, props/state, Metro, Expo; arquitectura en 3 capas (UI, lógica, datos) como pide el apunte | Capítulo del informe con comparación Ionic vs RN y diagrama de capas |
| Patrones de diseño del framework | 18 | Los 8 patrones de 3.3, cada uno con fragmento de código del proyecto | Tabla patrón / archivo / por qué |
| Principios de UI | 12 | `theme/` con espaciado, jerarquía tipográfica (título vs descripción), contraste, balance en el formulario | Capturas anotadas |
| Componentes UI comunes | 28 | Botones (`AppButton`), formularios (`TaskForm`), listas (`FlatList`), navegadores (tabs + stack), menú (filtro) | Capturas + lista de componentes |
| UX intuitiva | 28 | Flujo claro: ver, agregar, editar, eliminar; validación, vacío, confirmación, feedback | Recorrido paso a paso con capturas |

Nota: el apunte no cubre RN a fondo. El equipo tendrá que sustentar el criterio de 14 y 18 pts con documentación oficial de React Native/Expo, y citarla.

## 6. Riesgos por el cambio de stack

| Riesgo | Mitigación |
|---|---|
| El docente exige Ionic literal (`ion-*`, `localhost:8100`) | Pedir aprobación escrita; incluir en el informe una tabla de equivalencias Ionic a RN |
| "Servidor localhost:8100" | Mostrar web con `--port 8100` y/o Expo Go; documentar la diferencia |
| Criterio "framework de desarrollo web" | Justificar que RN no es web-first, pero Expo web lo sirve; el concepto aplica por analogía |
| Versiones de Expo / Expo Go desalineadas | Fijar SDK y Node LTS en el informe y en `package.json`; verificar antes de empezar |
| Entregar el zip con `node_modules` pesado | Excluir `node_modules` y `.expo` y documentar `npm install` |
| Falta de contenido del apunte sobre RN | Citar documentación oficial |

## 7. Preguntas abiertas para el equipo

1. ¿El docente confirmó por escrito que React Native sustituye a Ionic para esta rúbrica?
2. ¿La demostración será web (`localhost`), Expo Go en celular, o ambas?
3. ¿Entra el campo "completada" (toggle)? Mejora UX pero no está en el brief.
4. ¿Cómo se edita: pantalla aparte (stack, recomendado) o inline en el formulario?
5. ¿Qué dos pestañas o "menús" se quieren? (propuesta: Tareas y Nueva tarea, más filtro)
6. ¿Alguien del equipo tiene Android Studio o Xcode? Si no, Expo Go es obligatorio.
7. ¿Se usa TypeScript? (recomendado, pero sube la curva si el equipo no lo conoce)

## 8. Siguiente paso

`sdd-propose`: formalizar alcance (CRUD + tabs + stack + persistencia fuera de alcance en U1), decisiones de stack y entregables (app, informe con formato Arial 12, capturas, zip).

Fuentes: [Expo create-expo-app](https://docs.expo.dev/more/create-expo/), [Crear nueva app Expo](https://docs.expo.dev/get-started/create-a-new-app/), [React Navigation: Getting started](https://reactnavigation.org/docs/getting-started)
