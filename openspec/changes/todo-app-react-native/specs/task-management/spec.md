# Especificación: task-management (delta, capacidad nueva)

Crear, editar, eliminar y completar tareas, con validación del título. Agnóstica de stack. El texto de UI está en español.

## Requisitos

### REQ-TM-1: Crear tarea
- El sistema MUST permitir crear una tarea con `título` (obligatorio) y `descripción` (opcional).
- Cada tarea MUST tener un identificador único, y MUST iniciar como pendiente (no completada).
- El formulario de creación MUST estar en la pestaña "Nueva tarea", con los campos "Título" y "Descripción" y el botón "Agregar tarea".

### REQ-TM-2: Validación del título
- El título MUST ser rechazado si está vacío o contiene solo espacios en blanco.
- Al rechazarlo, el sistema MUST mostrar el error "El título es obligatorio" junto al campo y MUST NOT crear ni modificar ninguna tarea.
- El sistema MUST recortar (trim) los espacios al inicio y al final del título antes de guardarlo.
- El error SHOULD desaparecer cuando el usuario edita el campo.

### REQ-TM-3: Limpieza del formulario
- Tras agregar una tarea válida, el formulario MUST vaciar título y descripción y MUST quitar cualquier error visible.
- Tras un intento rechazado, el formulario MUST conservar lo que el usuario escribió.

### REQ-TM-4: Editar tarea
- El usuario MUST poder editar título y descripción en una pantalla aparte ("Editar tarea") con el botón "Guardar".
- La pantalla MUST precargar los valores actuales de la tarea.
- Las mismas reglas de validación de REQ-TM-2 MUST aplicar al guardar.
- Si la tarea no existe (id inválido o ya eliminada), el sistema MUST mostrar "La tarea no existe" y MUST NOT fallar; el usuario MUST poder volver a la lista.

### REQ-TM-5: Eliminar con confirmación
- Eliminar MUST pedir confirmación antes de borrar: título "Eliminar tarea", mensaje "¿Seguro que quieres eliminar esta tarea?", acciones "Cancelar" y "Eliminar".
- La confirmación MUST funcionar con acciones distinguibles (confirmar / cancelar) tanto en dispositivo nativo como en navegador web.
- Si el usuario cancela, la tarea MUST permanecer sin cambios.

### REQ-TM-6: Completar tarea
- El usuario MUST poder alternar una tarea entre pendiente y completada.
- Una tarea completada MUST distinguirse visualmente de una pendiente, SHOULD NOT depender solo del color (p. ej. tachado o indicador), y MUST exponer su estado a tecnologías de asistencia.

## Escenarios

### Crear (camino feliz)
- **Dado** que estoy en "Nueva tarea" con el formulario vacío
- **Cuando** escribo "Comprar pan" en Título y pulso "Agregar tarea"
- **Entonces** se crea una tarea pendiente "Comprar pan" y aparece en la lista "Tareas".

### Formulario se limpia tras agregar
- **Dado** que escribí título "Estudiar" y descripción "Capítulo 3"
- **Cuando** pulso "Agregar tarea" y la tarea se crea
- **Entonces** Título y Descripción quedan vacíos y no hay error visible.

### Título vacío
- **Dado** que el campo Título está vacío
- **Cuando** pulso "Agregar tarea"
- **Entonces** veo "El título es obligatorio" y el número de tareas no cambia.

### Título solo con espacios
- **Dado** que escribí "     " (solo espacios) en Título
- **Cuando** pulso "Agregar tarea"
- **Entonces** veo "El título es obligatorio", no se crea la tarea y el formulario conserva lo escrito.

### Título con espacios alrededor
- **Dado** que escribí "  Llamar al banco  "
- **Cuando** pulso "Agregar tarea"
- **Entonces** la tarea se guarda como "Llamar al banco".

### Descripción opcional
- **Dado** un título válido y descripción vacía
- **Cuando** pulso "Agregar tarea"
- **Entonces** la tarea se crea sin descripción.

### Editar (camino feliz)
- **Dado** una tarea "Comprar pan" en la lista
- **Cuando** la abro para editar, cambio el título a "Comprar pan integral" y pulso "Guardar"
- **Entonces** vuelvo a la lista y la tarea muestra "Comprar pan integral".

### Editar con título inválido
- **Dado** que estoy en "Editar tarea" y borro todo el título
- **Cuando** pulso "Guardar"
- **Entonces** veo "El título es obligatorio" y la tarea original no cambia.

### Editar una tarea inexistente
- **Dado** que abro "Editar tarea" con un id que no existe (o la tarea fue eliminada)
- **Cuando** la pantalla carga
- **Entonces** veo "La tarea no existe" con una vía para volver a la lista, sin errores ni cierre de la app.

### Eliminar confirmando
- **Dado** una tarea "Comprar pan"
- **Cuando** pulso "Eliminar" y en la confirmación elijo "Eliminar"
- **Entonces** la tarea desaparece de la lista.

### Eliminar cancelando
- **Dado** una tarea "Comprar pan"
- **Cuando** pulso "Eliminar" y en la confirmación elijo "Cancelar"
- **Entonces** la tarea sigue en la lista sin cambios.

### Confirmación en web
- **Dado** que la app corre en un navegador
- **Cuando** pulso "Eliminar" en una tarea
- **Entonces** aparece una confirmación con opción de aceptar y cancelar, y ambas producen el resultado de los dos escenarios anteriores.

### Completar y revertir
- **Dado** una tarea pendiente
- **Cuando** la marco como completada
- **Entonces** se muestra como completada; **y cuando** la desmarco, vuelve a pendiente.
