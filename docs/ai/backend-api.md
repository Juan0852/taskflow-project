# Backend API

Este documento resume varias herramientas y conceptos importantes alrededor del backend de TaskFlow y de su consumo desde frontend.

No todo lo que aparece aquí está implementado hoy en el proyecto, pero sí forma parte del ecosistema real con el que se construyen, prueban, observan y documentan APIs profesionales.

## Qué es una API backend

Una API backend es la capa del sistema que expone recursos y operaciones a través de HTTP.

En TaskFlow, esa API permite:

- autenticar usuarios
- crear, editar y listar tareas
- mover tareas a papelera
- restaurarlas o eliminarlas definitivamente
- guardar preferencias del usuario

La idea es que el frontend no persista por su cuenta ni tome decisiones “a ciegas”, sino que consuma contratos bien definidos desde el servidor.

## Axios

`Axios` es una librería de cliente HTTP para JavaScript.

Sirve para:

- hacer peticiones `GET`, `POST`, `PATCH`, `DELETE`
- interceptar requests y responses
- manejar errores de red de forma consistente
- simplificar algunas tareas repetitivas frente a `fetch`

### Por qué se usa

Se usa mucho porque:

- tiene una API muy cómoda
- permite configurar una base URL fácilmente
- simplifica la gestión de headers
- hace más sencillo centralizar autenticación, interceptores y serialización

### En este proyecto

En TaskFlow no estamos usando `Axios` ahora mismo.

Estamos usando:

- `fetch`

La razón es que `fetch` nativo es suficiente para el tamaño actual del proyecto y evita añadir otra dependencia más.

Aun así, si el frontend creciera mucho, `Axios` podría ser una buena evolución.

## Postman

`Postman` es una herramienta para probar, organizar y documentar APIs.

Sirve para:

- enviar peticiones manuales al backend
- validar respuestas correctas
- forzar errores
- comprobar códigos HTTP
- agrupar endpoints en colecciones
- compartir escenarios de prueba

### Por qué se usa

Se usa porque permite comprobar si una API está bien construida sin depender todavía del frontend.

Eso ayuda muchísimo para responder preguntas como:

- ¿el endpoint devuelve `201` cuando crea?
- ¿responde `401` si no hay sesión?
- ¿responde `404` si el recurso no existe?
- ¿la estructura JSON coincide con lo esperado?

### En este proyecto

En TaskFlow sí lo estamos usando.

Se creó y organizó una colección con carpetas como:

- `Auth`
- `Task`
- `Task_USE_Types`
- `Preferences`

Y se usó para probar:

- login
- register
- listado de tareas
- filtros
- papelera
- acciones masivas
- preferencias

### Mapa de la colección de Postman

La colección de Postman del proyecto quedó organizada por áreas funcionales. Este es el mapa práctico de endpoints que usamos hoy.

```text
TaskFlow Collection
├─ Auth
│  ├─ GET    /api/auth/status
│  ├─ POST   /api/auth/register
│  ├─ POST   /api/auth/login
│  ├─ GET    /api/auth/me
│  └─ POST   /api/auth/logout
├─ Task
│  ├─ GET    /api/tasks/status
│  ├─ POST   /api/tasks
│  ├─ PATCH  /api/tasks/:id
│  ├─ PATCH  /api/tasks/:id/trash
│  ├─ PATCH  /api/tasks/:id/restore
│  ├─ GET    /api/tasks/trash
│  ├─ DELETE /api/tasks/:id
│  ├─ PATCH  /api/tasks/bulk/complete-all
│  ├─ PATCH  /api/tasks/bulk/trash-completed
│  ├─ PATCH  /api/tasks/bulk/trash-all
│  └─ DELETE /api/tasks/bulk/delete-trash
├─ Task_USE_Types
│  ├─ GET    /api/tasks
│  ├─ GET    /api/tasks?search=...
│  ├─ GET    /api/tasks?from=...&to=...
│  ├─ GET    /api/tasks/types
│  └─ GET    /api/tasks/types?search=...&limit=...
└─ Preferences
   ├─ GET    /api/preferences/status
   ├─ GET    /api/preferences
   └─ PATCH  /api/preferences
```

### Qué representa cada bloque

#### `Auth`

Agrupa todo lo relacionado con autenticación y sesión:

- estado del módulo
- registro
- login
- usuario actual
- logout

#### `Task`

Agrupa las mutaciones principales de tareas y las operaciones más sensibles:

- crear
- editar
- mandar a papelera
- restaurar
- listar papelera
- borrar definitivamente
- acciones masivas

#### `Task_USE_Types`

Agrupa los endpoints de consulta y exploración que comparten el mismo recurso principal pero distintos casos de uso:

- listado general de tareas
- búsqueda por texto
- filtrado por fechas
- catálogo de tipos
- búsqueda de tipos

Esta carpeta existe para dejar claro que no todo lo que cuelga de `/api/tasks` representa una mutación. Muchas rutas viven aquí como “casos de uso de lectura” del mismo recurso.

#### `Preferences`

Agrupa la lectura y actualización de preferencias persistidas del usuario:

- estado del módulo
- lectura de preferencias
- actualización de preferencias

## Sentry

`Sentry` es una plataforma de monitorización de errores y observabilidad.

Sirve para:

- capturar excepciones en frontend y backend
- agrupar errores repetidos
- registrar contexto útil
- ver trazas de ejecución
- detectar fallos reales en producción

### Por qué se usa

Se usa para no depender solo de:

- `console.error`
- logs manuales
- o reportes del usuario

Con Sentry puedes saber:

- qué error ocurrió
- en qué archivo
- en qué línea
- con qué usuario
- en qué flujo

### En este proyecto

En TaskFlow todavía no está integrado.

Sería una mejora posterior muy útil, sobre todo cuando la app se despliegue y empiece a recibir uso real.

## Swagger

`Swagger` es un conjunto de herramientas para documentar APIs, normalmente a través del estándar OpenAPI.

Sirve para:

- describir endpoints de forma formal
- documentar request y response bodies
- documentar parámetros y códigos HTTP
- generar una interfaz visual para probar la API

### Por qué se usa

Se usa porque convierte la API en un contrato legible y compartible.

Ayuda a:

- frontend
- backend
- QA
- y cualquier persona del equipo

a entender exactamente cómo consumir cada endpoint.

### Qué aporta

Con Swagger/OpenAPI puedes dejar documentado:

- método HTTP
- URL
- parámetros
- body esperado
- ejemplo de respuesta
- errores posibles

### En este proyecto

En TaskFlow sí está integrado en el backend.

Se utiliza para generar una documentación formal navegable de la API y complementar lo que ya existe en Postman.

La exposición de la interfaz está controlada por entorno:

- en desarrollo puede quedar activa
- en producción puede apagarse con `ENABLE_SWAGGER=false`

Eso permite mantener Swagger en el repositorio y en GitHub sin dejar la ruta pública por accidente en despliegues reales.

Ahora mismo la documentación práctica de la API vive sobre todo en:

- Postman
- Swagger/OpenAPI
- README
- documentos internos del proyecto

La UI de documentación se monta solo cuando el backend la habilita por entorno, y el código de integración vive dentro del repositorio para que cualquiera del equipo pueda revisarlo.

## Diferencia entre estas herramientas

### `fetch` / `Axios`

Sirven para consumir la API desde código.

### `Postman`

Sirve para probar la API manualmente y organizar colecciones.

### `Sentry`

Sirve para observar errores reales y fallos en producción.

### `Swagger`

Sirve para documentar la API como contrato técnico.

## Relación con TaskFlow

En el estado actual del proyecto:

- el backend está hecho con Express
- el frontend consume la API con `fetch`
- Postman se usa para pruebas y documentación práctica
- Swagger/OpenAPI está integrado y protegido por entorno
- Sentry no está integrado todavía

Esto significa que TaskFlow ya tiene una API funcional real, documentación práctica con Postman y documentación formal con Swagger, aunque todavía puede crecer en observabilidad.

## Conclusión

Construir un backend no consiste solo en exponer endpoints.

También implica:

- consumirlos bien desde frontend
- probarlos correctamente
- documentarlos
- y observar su comportamiento cuando algo falla

Dentro de ese ecosistema:

- `Axios` es una opción de cliente HTTP
- `Postman` sirve para probar y organizar la API
- `Sentry` ayuda a monitorizar errores
- `Swagger` ayuda a documentar contratos de red

En TaskFlow, Postman y Swagger ya forman parte del flujo de trabajo del backend, mientras que Sentry queda como mejora clara para fases posteriores.
