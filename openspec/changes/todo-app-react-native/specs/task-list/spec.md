# Especificación: task-list (delta, capacidad nueva)

Listado de tareas, filtro Todas/Pendientes y estado vacío. Agnóstica de stack.

## Requisitos

### REQ-TL-1: Listado
- La pantalla "Tareas" MUST mostrar todas las tareas existentes en orden de creación (la más reciente al final, salvo decisión de diseño documentada).
- Cada ítem MUST mostrar título, descripción si existe, estado (pendiente/completada) y acciones de completar, editar y eliminar.
- La lista MUST ser desplazable cuando excede la pantalla.

### REQ-TL-2: Filtro
- La pantalla MUST ofrecer un filtro con opciones "Todas" y "Pendientes"; el valor inicial MUST ser "Todas".
- "Pendientes" MUST mostrar solo tareas no completadas; "Todas" MUST mostrar todas.
- La opción activa MUST ser visualmente identificable y SHOULD exponerse como seleccionada a tecnologías de asistencia.
- La lista MUST actualizarse de inmediato cuando una tarea cambia de estado, se crea, edita o elimina.

### REQ-TL-3: Estados vacíos
- Sin ninguna tarea, la pantalla MUST mostrar "Aún no tienes tareas" y una guía como "Agrega una desde la pestaña Nueva tarea".
- Con tareas pero ninguna pendiente bajo el filtro "Pendientes", la pantalla MUST mostrar "No tienes tareas pendientes" (mensaje distinto al anterior).
- El filtro MUST seguir visible en ambos estados vacíos.

## Escenarios

### Lista con tareas
- **Dado** que existen "Comprar pan" y "Estudiar"
- **Cuando** abro "Tareas"
- **Entonces** veo ambas, con el filtro en "Todas".

### Estado vacío inicial
- **Dado** que no hay tareas
- **Cuando** abro "Tareas"
- **Entonces** veo "Aún no tienes tareas" y la guía para agregar.

### Filtrar pendientes
- **Dado** una tarea completada "Estudiar" y una pendiente "Comprar pan"
- **Cuando** elijo "Pendientes"
- **Entonces** solo veo "Comprar pan".

### Filtro sin tareas pendientes
- **Dado** que todas las tareas están completadas
- **Cuando** elijo "Pendientes"
- **Entonces** veo "No tienes tareas pendientes" (no "Aún no tienes tareas") y puedo volver a "Todas".

### Completar bajo filtro Pendientes
- **Dado** el filtro "Pendientes" con una tarea pendiente
- **Cuando** la marco como completada
- **Entonces** desaparece de la vista; si era la última, veo "No tienes tareas pendientes".

### Eliminar la última tarea
- **Dado** que existe una sola tarea
- **Cuando** la elimino con confirmación
- **Entonces** veo "Aún no tienes tareas".

### Nueva tarea visible
- **Dado** el filtro "Pendientes" activo
- **Cuando** agrego una tarea desde "Nueva tarea" y regreso a "Tareas"
- **Entonces** la tarea aparece, por ser pendiente.
