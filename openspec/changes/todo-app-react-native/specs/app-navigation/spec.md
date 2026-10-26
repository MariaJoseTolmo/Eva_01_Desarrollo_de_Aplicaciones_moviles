# Especificación: app-navigation (delta, capacidad nueva)

Estructura de navegación: pestañas inferiores y pila en "Tareas". Agnóstica de stack salvo donde se indica.

## Requisitos

### REQ-NAV-1: Pestañas
- La app MUST tener navegación inferior por pestañas con exactamente dos: "Tareas" y "Nueva tarea".
- La pestaña inicial MUST ser "Tareas".
- Cada pestaña MUST tener etiqueta de texto (no solo ícono) y MUST indicar cuál está activa.

### REQ-NAV-2: Pila en Tareas
- La pestaña "Tareas" MUST contener una pila con dos pantallas: Lista (raíz) y "Editar tarea".
- Desde un ítem de la lista, el usuario MUST poder abrir "Editar tarea" pasando el identificador de la tarea.
- Guardar con éxito MUST regresar a la Lista; el usuario MUST poder volver también sin guardar (botón atrás del encabezado o gesto del sistema).

### REQ-NAV-3: Encabezados
- Cada pantalla MUST mostrar un encabezado con título en español: "Tareas", "Nueva tarea", "Editar tarea".
- "Editar tarea" MUST mostrar control de retroceso.

### REQ-NAV-4: Rutas tipadas
- Los nombres de rutas y sus parámetros MUST estar tipados estáticamente (el compilador MUST rechazar navegar con parámetros faltantes o erróneos). Requisito específico de TypeScript.

### REQ-NAV-5: Estado entre pestañas
- Cambiar de pestaña MUST NOT perder tareas ni el estado del filtro.
- Tras agregar una tarea en "Nueva tarea", el usuario SHOULD poder verla al volver a "Tareas".

## Escenarios

### Arranque
- **Dado** que abro la app
- **Cuando** termina de cargar
- **Entonces** veo la pestaña "Tareas" activa y las dos pestañas con sus etiquetas.

### Cambiar de pestaña
- **Dado** que estoy en "Tareas"
- **Cuando** toco "Nueva tarea"
- **Entonces** veo el formulario con el encabezado "Nueva tarea".

### Abrir edición
- **Dado** una tarea en la lista
- **Cuando** toco su acción de editar
- **Entonces** veo "Editar tarea" con los datos de esa tarea y control de retroceso.

### Volver sin guardar
- **Dado** que estoy en "Editar tarea" con cambios sin guardar
- **Cuando** uso el retroceso
- **Entonces** regreso a la lista y la tarea conserva sus valores originales.

### Guardar y volver
- **Dado** que modifiqué el título en "Editar tarea"
- **Cuando** pulso "Guardar"
- **Entonces** regreso a la lista con el cambio visible.

### Conservación del filtro
- **Dado** el filtro "Pendientes" activo
- **Cuando** voy a "Nueva tarea" y regreso a "Tareas"
- **Entonces** el filtro sigue en "Pendientes".

### Rutas tipadas
- **Dado** código que navega a "Editar tarea" sin identificador
- **Cuando** se verifica el tipado del proyecto
- **Entonces** el verificador de tipos reporta error.
