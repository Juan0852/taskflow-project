# TaskFlow Project

TaskFlow Project es una app de productividad estilo IDE para gestionar tareas desde una interfaz visual y una terminal integrada.

El proyecto ya no es solo un frontend experimental: hoy vive como un monorepo con frontend, backend, autenticación por sesión, persistencia real de tareas, preferencias de usuario y una arquitectura bastante más sólida que la versión inicial.

## Qué es hoy el proyecto

BiTask mezcla dos formas de trabajar:

- una experiencia visual tipo editor/IDE
- y una capa de comandos para operar tareas desde terminal

El objetivo es que un desarrollador pueda:

- crear, editar y organizar tareas rápido
- trabajar entre vista de lista y kanban
- usar papelera real en vez de borrado destructivo inmediato
- mantener preferencias persistidas por usuario
- entrar como invitado o iniciar sesión para desbloquear persistencia completa

## Estado actual

Actualmente el proyecto incluye:

- frontend separado en `/frontend`
- backend separado en `/backend`
- autenticación con sesiones y cookie `httpOnly`
- registro e inicio de sesión con validaciones en frontend y backend
- tareas persistidas por usuario en una base de datos real mediante backend
- papelera de reciclaje real
- acciones masivas conectadas al backend
- preferencias persistidas en backend
- modo invitado con límite de 2 tareas
- sincronización de tareas de invitado al iniciar sesión
- sin `localStorage` como fuente de verdad de la aplicación

## Stack tecnológico

### Frontend

- Vite
- Tailwind CSS
- PostCSS
- JavaScript ES Modules
- Zod

### Backend

- Node.js
- Express
- Prisma
- Zod
- Argon2
- express-session
- CORS
- dotenv

## Arquitectura general

### Frontend

El frontend está organizado por capas y por features.

- `domain/`
  contratos y servicios del dominio frontend
- `features/`
  módulos de UI organizados por funcionalidad
- `shared/`
  utilidades y componentes reutilizables

Además, la refactorización del frontend se apoyó en una separación práctica tipo:

- `listeners`
- `view`
- `viewmodel`
- `service`

No se buscó una pureza académica rígida, sino una estructura mantenible y fácil de evolucionar hacia backend real.

### Backend

El backend está organizado por módulos:

- `auth`
- `tasks`
- `preferences`
- `users`

Cada módulo sigue una separación por:

- `routes`
- `controller`
- `service`
- `repository`
- `mapper`
- `request/response DTOs`

La validación estructural vive en DTOs con `zod`, y la validación de negocio vive en `services`.

## Estructura del repositorio

```text
taskflow-project/
├─ backend/
│  ├─ prisma/
│  │  └─ schema.prisma
│  ├─ src/
│  │  ├─ app.js
│  │  ├─ server.js
│  │  ├─ config/
│  │  ├─ lib/
│  │  ├─ middlewares/
│  │  ├─ security/
│  │  └─ modules/
│  │     ├─ auth/
│  │     ├─ preferences/
│  │     ├─ tasks/
│  │     └─ users/
│  ├─ README.md
│  └─ TASKS_SUGGESTED_ENDPOINTS.md
├─ frontend/
│  ├─ public/
│  │  └─ assets/
│  ├─ src/
│  │  └─ js/
│  │     ├─ domain/
│  │     │  ├─ auth/
│  │     │  ├─ preferences/
│  │     │  └─ tasks/
│  │     ├─ features/
│  │     │  ├─ auth/
│  │     │  ├─ calendar-filter/
│  │     │  ├─ kanban-board/
│  │     │  ├─ task-list/
│  │     │  ├─ task-panel/
│  │     │  ├─ terminal/
│  │     │  ├─ toolbar-personalization/
│  │     │  └─ trash-bin/
│  │     ├─ shared/
│  │     ├─ app.js
│  │     ├─ innerhtmls.js
│  │     └─ ui-manager.js
│  ├─ index.html
│  ├─ FRONTEND_REFACTOR_GUIDE.md
│  └─ package.json
├─ docs/
│  └─ ai/
└─ README.md
```

## Modelos principales

En la base de datos hoy existen estos modelos principales:

- `User`
- `Task`
- `UserPreference`

### User

Guarda:

- email
- username
- password hash
- display name opcional
- imagen de perfil opcional
- estado activo
- último login

### Task

Guarda:

- texto
- tipo
- estado
- prioridad
- fecha de creación
- fecha de actualización
- fecha de completado
- fecha de papelera (`trashedAt`)

### UserPreference

Guarda:

- tema visual
- configuración del toolbar
- preferencias de filtros
- preferencias del calendario
- `lastSplashShownAt`

## Flujo funcional principal

### Autenticación

- registro con email, username y contraseña
- login con email o username
- sesión persistida por cookie
- dropdown de usuario cuando ya hay sesión
- logout real

### Tareas

- crear tarea
- editar tarea
- listar tareas
- filtrar por búsqueda
- filtrar por rango de fechas
- filtrar por tipo
- ordenar
- cambiar estado en kanban
- mover a papelera
- restaurar
- vaciar papelera

### Acciones masivas

- completar todas
- mandar completadas a papelera
- mandar todas a papelera

### Modo invitado

- hasta 2 tareas sin iniciar sesión
- si intenta crear más, se le pide iniciar sesión o registrarse
- al iniciar sesión, esas tareas se sincronizan con backend

## Endpoints principales

### Auth

- `GET /api/auth/status`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Tasks

- `GET /api/tasks/status`
- `GET /api/tasks`
- `GET /api/tasks/trash`
- `GET /api/tasks/types`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `PATCH /api/tasks/:id/trash`
- `PATCH /api/tasks/:id/restore`
- `PATCH /api/tasks/bulk/complete-all`
- `PATCH /api/tasks/bulk/trash-completed`
- `PATCH /api/tasks/bulk/trash-all`
- `DELETE /api/tasks/:id`
- `DELETE /api/tasks/bulk/delete-trash`

### Preferences

- `GET /api/preferences/status`
- `GET /api/preferences`
- `PATCH /api/preferences`

## Variables de entorno

### Frontend

Archivo esperado:

- `frontend/.env`

Ejemplo:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Backend

Archivo esperado:

- `backend/.env`

Variables principales:

```env
PORT=3000
DATABASE_URL=postgresql://...
SESSION_SECRET=super-secret-value
CLIENT_URL=http://localhost:5173
ENABLE_SWAGGER=true
```

## Instalación

### 1. Instalar dependencias del frontend

```bash
cd /Users/juanmontero/Documents/taskflow-project/frontend
npm install
```

### 2. Instalar dependencias del backend

```bash
cd /Users/juanmontero/Documents/taskflow-project/backend
npm install
```

### 3. Configurar variables de entorno

- crear `frontend/.env`
- crear `backend/.env`

### 4. Ejecutar migraciones de Prisma si hace falta

```bash
cd /Users/juanmontero/Documents/taskflow-project/backend
npx prisma migrate dev
```

## Desarrollo local

### Backend

```bash
cd /Users/juanmontero/Documents/taskflow-project/backend
npm run dev
```

Backend por defecto:

- `http://localhost:3000`

### Frontend

```bash
cd /Users/juanmontero/Documents/taskflow-project/frontend
npm run dev
```

Frontend por defecto:

- `http://localhost:5173`

## Build

### Frontend

```bash
cd /Users/juanmontero/Documents/taskflow-project/frontend
npm run build
```

### Backend

```bash
cd /Users/juanmontero/Documents/taskflow-project/backend
npm run start
```

## Principios aplicados en el proyecto

- refactor incremental
- separación de responsabilidades
- validación en frontend y backend
- DTOs con `zod`
- arquitectura modular
- persistencia real por usuario
- UI y dominio desacoplados
- transición controlada desde una versión local-first hacia una app completa

## Documentación interna útil

- guía de refactor del frontend:
  - [frontend/FRONTEND_REFACTOR_GUIDE.md](/Users/juanmontero/Documents/taskflow-project/frontend/FRONTEND_REFACTOR_GUIDE.md)
- documento de endpoints sugeridos de tareas:
  - [backend/TASKS_SUGGESTED_ENDPOINTS.md](/Users/juanmontero/Documents/taskflow-project/backend/TASKS_SUGGESTED_ENDPOINTS.md)
- documentación del backend:
  - [backend/README.md](/Users/juanmontero/Documents/taskflow-project/backend/README.md)

## Lo que viene después

Algunas ideas ya identificadas para siguientes fases:

- OAuth con Google y GitHub
- checks en tiempo real para disponibilidad de username/email
- restauración múltiple desde papelera
- más QA y pulido visual
- endurecimiento adicional de seguridad y uploads

## Estado del proyecto

El proyecto ya está en una fase muy distinta a la inicial.

Pasó de ser una interfaz local con persistencia de navegador a una aplicación con:

- backend real
- sesiones
- persistencia real en base de datos
- DTOs
- preferencias persistidas
- guest mode controlado
- papelera real
- y una arquitectura mucho más mantenible

Después de bastante refactor, bastante integración y bastante café, ya hay una base muy seria sobre la que seguir construyendo.
