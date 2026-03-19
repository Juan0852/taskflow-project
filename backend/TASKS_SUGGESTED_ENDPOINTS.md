# Endpoints Sugeridos De Tasks

## Propósito

Este documento existe para no perder de vista los endpoints relacionados con tareas que el frontend va a necesitar durante la refactorización.

La idea es:

- mantener un mapa claro de posibles endpoints de tareas,
- explicar por qué existe cada endpoint,
- relacionar cada endpoint con el comportamiento del frontend,
- y evitar que se nos olviden flujos importantes mientras el frontend sigue migrándose.

Este documento **todavía no es el contrato final**.

Es un **mapa sugerido de endpoints** que debe ir evolucionando a medida que la arquitectura del frontend quede más limpia.

---

## Recordatorio Importante

No toda acción del frontend se convierte en un endpoint del backend.

Ejemplos de cosas que **no** se convierten en endpoint:

- abrir un modal,
- cerrar un modal,
- parsear comandos de terminal,
- feedback visual de terminal,
- estado local de selección,
- ordenación visual temporal mientras las tareas sigan siendo locales.

Lo que **sí** se convierte en endpoint:

- persistencia,
- lecturas autenticadas,
- búsqueda real sobre tareas,
- filtrado por rango de fechas,
- filtrado del backend,
- paginación del backend,
- mutaciones reales sobre tareas,
- y catálogos o sugerencias remotas.

---

## Base Actual Del Backend De Tasks

Estos endpoints ya existen hoy en el backend:

- `GET /api/tasks/status`
- `GET /api/tasks`
- `GET /api/tasks/trash`
- `GET /api/tasks/types`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `PATCH /api/tasks/:id/trash`
- `PATCH /api/tasks/:id/restore`
- `DELETE /api/tasks/bulk/delete-trash`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/bulk/complete-all`
- `PATCH /api/tasks/bulk/trash-completed`

Este es el punto de partida actual, no necesariamente la forma final.

---

## Endpoints Que Salen Del Task Panel

El `task-panel` deja ver con muchísima claridad qué endpoints necesita el frontend cuando deje de depender de persistencia local.

Esos endpoints son:

- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `GET /api/tasks/types`

### Por qué estos tres son importantes

- `POST /api/tasks`
  porque el panel crea tareas nuevas.

- `PATCH /api/tasks/:id`
  porque el panel también edita tareas existentes.

- `GET /api/tasks/types`
  porque el campo `Tipo` ya no es un input tonto: usa sugerencias/filtrado y, cuando la fuente de datos deje de ser local, tendrá que traer esos tipos desde backend.

Este tercer endpoint es importante incluso aunque el modal siga siendo frontend, porque el dato que alimenta el combobox de tipos terminará viniendo del servidor.

---

## Lista De Endpoints Sugeridos

### 1. Listar tareas activas

- `GET /api/tasks`

#### Para qué sirve

Traer la colección visible de tareas del usuario autenticado.

#### Por qué importa

Ahora mismo el frontend renderiza la lista principal y el kanban desde `localStorage`.
Más adelante esto tiene que convertirse en una lectura real contra backend, no en un “cargarlo todo siempre desde memoria”.

#### Query params sugeridos

- `page`
- `limit`
- `search`
- `status`
- `priority`
- `type`
- `sortBy`
- `sortOrder`

#### Partes del frontend que dependerán de esto

- task list
- kanban board
- barra de búsqueda
- filtros
- ordenación
- paginación futura

---

### 2. Listar tareas en papelera

- `GET /api/tasks/trash`

#### Para qué sirve

Traer las tareas que fueron eliminadas lógicamente y ahora están en la papelera.

#### Por qué importa

La papelera es un concepto real del backend porque las tareas usan soft delete con `trashedAt`.

#### Query params sugeridos

- `page`
- `limit`
- `search`
- `type`
- `sortBy`
- `sortOrder`

#### Partes del frontend que podrían depender de esto más adelante

- vista de papelera
- flujo de restauración
- borrado definitivo masivo si algún día se añade

---

### 3. Crear tarea

- `POST /api/tasks`

#### Para qué sirve

Crear una nueva tarea para el usuario autenticado.

#### Por qué importa

Esta es una de las piezas principales que hoy vive en el `TaskService` local.
Más adelante será uno de los primeros writes reales de tareas contra backend.

#### Partes del frontend que dependen de esto

- task panel / lightbox
- flujo de añadir tarea desde terminal
- cualquier widget de quick-add futuro

---

### 4. Editar tarea

- `PATCH /api/tasks/:id`

#### Para qué sirve

Actualizar una tarea ya existente.

#### Por qué importa

Editar texto, tipo, prioridad o estado debe terminar siendo persistencia real en backend.

#### Partes del frontend que dependen de esto

- edición desde task panel
- cambio de estado desde kanban
- flujo de update desde terminal

---

### 5. Mandar tarea a papelera

- `PATCH /api/tasks/:id/trash`

#### Para qué sirve

Hacer soft delete de una tarea mandándola a la papelera.

#### Por qué importa

Esto reemplaza el borrado destructivo directo del frontend por el modelo de papelera del backend.

#### Partes del frontend que podrían depender de esto

- acción de eliminar una sola tarea
- comando remove de terminal si decidimos que remove signifique “mandar a papelera”

---

### 6. Restaurar tarea

- `PATCH /api/tasks/:id/restore`

#### Para qué sirve

Restaurar una tarea eliminada lógicamente y devolverla a la colección activa.

#### Por qué importa

Es necesario en cuanto la papelera tenga presencia real en frontend.

---

### 7. Eliminar tarea definitivamente

- `DELETE /api/tasks/:id`

#### Para qué sirve

Borrar una tarea definitivamente de la base de datos.

#### Por qué importa

Aunque la UX normal pase primero por la papelera, el sistema necesita seguir teniendo un camino de borrado definitivo.

#### Partes del frontend que podrían depender de esto más adelante

- limpieza de papelera
- flujos de depuración o administración si aparecen

---

### 8. Vaciar papelera

- `DELETE /api/tasks/bulk/delete-trash`

#### Para qué sirve

Eliminar definitivamente todas las tareas que ya están en papelera para el usuario autenticado.

#### Por qué importa

La papelera queda incompleta si solo permite listar, restaurar o borrar ítems sueltos.
Hace falta una acción masiva final para “vaciar papelera” de una sola vez.

#### Partes del frontend que podrían depender de esto

- vista de papelera
- acción masiva de vaciar papelera
- confirmación destructiva antes de borrar todo definitivamente

---

### 9. Marcar todas como completadas

- `PATCH /api/tasks/bulk/complete-all`

#### Para qué sirve

Completar en bloque las tareas del usuario autenticado.

#### Por qué importa

Hoy ya existe como acción local en el frontend y claramente pertenece a reglas reales de persistencia / negocio.

#### Partes del frontend que dependen de esto

- acción masiva de la toolbar
- flujo complete-all desde terminal

---

### 10. Mandar completadas a papelera

- `PATCH /api/tasks/bulk/trash-completed`

#### Para qué sirve

Mover las tareas completadas a papelera en una sola acción masiva.

#### Por qué importa

Hoy el frontend tiene una acción “borrar completadas”.
Bajo el modelo de papelera del backend, esto seguramente debería pasar primero a “mandar completadas a papelera” y solo después, si hace falta, borrarlas definitivamente desde allí.

#### Partes del frontend que dependen de esto

- limpieza masiva desde la toolbar
- flujo clear-completed desde terminal

---

### 11. Traer sugerencias de tipos de tarea

- `GET /api/tasks/types`

#### Para qué sirve

Devolver el catálogo de tipos existentes del usuario autenticado.

#### Por qué importa

Ahora el task panel usa un combobox filtrable para sugerir tipos.
Hoy esos tipos se leen localmente desde las tareas en memoria.
Más adelante deben venir del backend.

#### Query params sugeridos

- `search`
- `limit`
- `scope`

#### Comportamiento sugerido a futuro

Si la lista crece mucho, este endpoint no debería devolver el universo completo de tipos, sino respuestas limitadas y filtradas.

#### Partes del frontend que dependen de esto

- combobox de tipo en task panel
- futuros filtros por tipo

---

### 12. Buscar tareas

- `GET /api/tasks?search=...`

#### Para qué sirve

Permitir que la barra de búsqueda consulte tareas reales del usuario autenticado usando texto libre.

#### Por qué importa

La búsqueda no debería quedarse como una operación local para siempre si la fuente de verdad va a ser backend.
En cuanto las tareas dejen de vivir solo en memoria, la búsqueda debe apoyarse en el servidor.

#### Query params sugeridos

- `search`
- `page`
- `limit`
- `sortBy`
- `sortOrder`

#### Partes del frontend que dependen de esto

- barra de búsqueda de tareas
- task list
- kanban board, si más adelante comparte el mismo criterio de búsqueda

---

### 13. Filtrar tareas por rango de fechas

- `GET /api/tasks?from=...&to=...`

#### Para qué sirve

Traer las tareas cuya fecha relevante caiga dentro de un rango concreto seleccionado desde el calendario o los filtros de fecha.

#### Por qué importa

Aquí sí hay una necesidad clara de backend.
Filtrar de “esta fecha a esta fecha” es un criterio de consulta real y no debería depender de tener todas las tareas cargadas en el frontend.

#### Query params sugeridos

- `from`
- `to`
- `page`
- `limit`
- `search`
- `sortBy`
- `sortOrder`

#### Partes del frontend que dependen de esto

- filtro de calendario
- task list
- vistas futuras centradas en fechas

---

## Notas Sobre Task Panel

El task panel **no** crea endpoints para cosas como:

- abrir el modal,
- cerrar el modal,
- cambiar entre modo create y edit,
- actualizar etiquetas visuales locales.

Pero el task panel sí deja ver muy bien qué dependencias reales de backend necesita:

- crear tarea,
- editar tarea,
- traer sugerencias de tipos.

Por eso el task panel es un buen módulo para empezar a refactorizar en frontend: deja clara la frontera entre UI y persistencia.

---

## Notas De Transición

### Verdad transicional actual

- las tareas del frontend siguen siendo locales por ahora,
- auth ya puede hablar con backend,
- los endpoints de tasks del backend ya empezaron,
- la refactorización del frontend debe ocurrir antes de conectar por completo la persistencia de tareas al backend.

### Regla importante de diseño

No debemos conservar por inercia un contrato viejo tipo “traer siempre todo” si ya sabemos que la arquitectura final quiere:

- paginación en backend,
- búsqueda en backend,
- filtros de fecha en backend,
- filtros en backend,
- ordenación en backend,
- sugerencias remotas de tipos.

### Nota específica sobre ordenación por fecha

Ordenar por fecha puede tolerar una fase transitoria en frontend mientras el listado siga siendo local y pequeño.

Pero el filtro por rango de fechas no entra en la misma categoría:

- ordenar localmente por `createdAt` puede ser una solución temporal,
- filtrar por “desde esta fecha hasta esta fecha” debe considerarse endpoint real desde el diseño.

### Prioridad sugerida para migrar filtros a backend

Para no mezclarlo todo al mismo tiempo, conviene distinguir qué filtros deberían migrar antes y cuáles pueden sobrevivir un rato más en frontend.

#### Filtros que deberían migrar primero a backend

- búsqueda por texto (`search`)
- rango de fechas (`from` / `to`)
- paginación (`page` / `limit`)

Estos tres cambian de verdad la forma de consultar la colección y no tienen sentido si el frontend depende de cargar todas las tareas siempre.

#### Filtros que pueden quedarse temporales en frontend

- tipo de tarea
- estado
- prioridad
- ordenación visual simple, mientras la colección siga siendo pequeña y local

La UI puede seguir organizando temporalmente estos criterios mientras termina la refactorización, pero la intención final es que también puedan viajar al backend como query params cuando la integración real esté lista.

Así que la transición debería ir más o menos en este orden:

1. refactorizar módulos de tareas del frontend hacia MVVM,
2. separar estado visual de estado de persistencia,
3. mantener `localStorage` temporalmente,
4. mapear cada módulo a los endpoints de backend que realmente necesitará,
5. y solo después sustituir la persistencia local por integración real con backend.

---

## Preguntas Abiertas

### 1. ¿Las sugerencias de tipos deben paginarse o solo limitarse?

Sigue abierto.

### 2. ¿El remove de terminal debería mandar a papelera o borrar definitivamente?

Sigue abierto.

### 3. ¿Qué filtros del frontend deberían seguir siendo locales y cuáles migrarán a backend?

Sigue abierto.

### 4. ¿La acción final de “borrar completadas” debería significar papelera o borrado definitivo?

Sigue abierto.

### 5. ¿Cómo debe comportarse la búsqueda en vivo para no disparar demasiadas peticiones?

Cuando `search` empiece a pegarle al backend de verdad, no deberíamos hacer una request por cada tecla sin control.

La implementación deseable más adelante sería algo como:

- `debounce` en frontend,
- mínimo de caracteres antes de disparar búsqueda real,
- cancelación de requests anteriores cuando llegue una nueva,
- y volver al listado normal cuando el término quede vacío.

Se deja aquí como tarea pendiente de integración real frontend-backend.

---

## Regla Para Futuras Actualizaciones

Cada vez que descubramos:

- un endpoint faltante,
- un endpoint que sobre,
- o un comportamiento del frontend que revele una nueva dependencia real con backend,

lo añadimos aquí.
