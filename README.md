# TaskFlow Project

TaskFlow Project es una app web estilo IDE para gestionar tareas con comandos de terminal y vista visual.
El objetivo del proyecto es combinar productividad (CLI) con una interfaz tipo editor para crear, listar, actualizar y eliminar tareas de forma rápida.

## Caracteristicas

- Interfaz inspirada en un IDE (panel lateral, editor y terminal integrada).
- Comandos de terminal para operar tareas (`/bitask ...`).
- Formularios GUI para crear, editar, limpiar y visualizar tareas.
- Vista `TaskController` y vista `KanbanBoard` compartiendo controles de trabajo.
- Filtros por tipo, busqueda, ordenacion y calendario con seleccion de rango.
- Personalizacion de toolbar, controles visibles y panel lateral.
- Tema `dark/light` con persistencia en `localStorage`.
- Splash inicial con expiracion temporal.
- Estilos migrados a Tailwind CSS (con tokens semanticos de color).

## Stack Tecnologico

- Vite
- Tailwind CSS
- PostCSS + Autoprefixer
- JavaScript (ES Modules)

## Estructura del Proyecto

```text
taskflow-project/
├─ index.html
├─ docs/
│  └─ ai/
├─ public/
│  └─ assets/
├─ src/
│  ├─ main.js
│  ├─ style.css
│  └─ js/
│     ├─ app.js
│     ├─ innerhtmls.js
│     ├─ ui-manager.js
│     ├─ domain/
│     │  └─ tasks/
│     │     └─ task-service.js
│     ├─ shared/
│     │  ├─ storage-keys.js
│     │  └─ storage-service.js
│     └─ features/
│        ├─ calendar-filter/
│        ├─ kanban-board/
│        ├─ task-list/
│        ├─ task-panel/
│        ├─ terminal/
│        └─ toolbar-personalization/
├─ tailwind.config.cjs
├─ postcss.config.cjs
└─ package.json
```

## Instalacion

```bash
npm install
```

## Desarrollo Local

```bash
npm run dev
```

Vite levantara el proyecto en `http://localhost:5173` (o el puerto disponible).

## Build de Produccion

```bash
npm run build
```

La salida queda en `dist/`.

## Preview del Build

```bash
npm run preview
```

## Comandos Disponibles (NPM Scripts)

- `npm run dev`: inicia entorno de desarrollo.
- `npm run build`: genera build optimizado.
- `npm run preview`: sirve localmente el build de `dist`.

## Flujo Funcional (Resumen)

1. El usuario interactua por GUI o por terminal.
2. `app.js` inicializa tema, splash, dialogos y orquestacion general.
3. `features/terminal` interpreta comandos y shortcuts, y delega acciones al resto del sistema.
4. `domain/tasks/task-service.js` administra el estado de tareas, sus mutaciones y su persistencia.
5. `shared/storage-service.js` centraliza el acceso a `localStorage` y `shared/storage-keys.js` define las claves persistidas.
6. `ui-manager.js` coordina la interfaz principal y conecta vistas compartidas.
7. Las features (`task-panel`, `task-list`, `calendar-filter`, `toolbar-personalization`, `kanban-board`) renderizan y gestionan partes concretas de la UI.

## Principios de Ingenieria Aplicados

- `DRY (Don't Repeat Yourself)`: se redujo duplicacion de estilos y referencias, centralizando tokens semanticos y reutilizando utilidades.
- `Responsabilidad Unica (SRP)`: cada modulo tiene un rol mas claro (`domain`, `shared` y `features`).
- `Mantenibilidad`: metodos pequeños, responsabilidades bien delimitadas y nombres de constantes/funciones mas expresivos.
- `Separation of Concerns`: logica de dominio, render/UI y orquestacion estan separadas para facilitar evolucion y debugging.
- `Feature-based organization`: la aplicacion se reorganizo por areas funcionales en lugar de crecer con archivos globales cada vez mas grandes.
- `Encapsulacion de persistencia`: el acceso a `localStorage` ya no queda regado entre muchas funciones, sino centralizado y con claves explicitas.
- `Arquitectura hibrida MVC/MVVM`: varias features se separaron en `controller`, `view` y `viewmodel`, manteniendo una aproximacion practica en lugar de academica pura.
- `Refactor guiado por iteracion`: gran parte de la reorganizacion se hizo en pequenos pasos, validando comportamiento y build tras cada cambio importante.
- `Refactor incremental`: ya se tenia una base completa en CSS tradicional, pero se decidio migrar a Tailwind. Por eso el proceso se hizo con debugging paso a paso, validando modulo por modulo para evitar regresiones. Despues de bastantes cafes, se logro estabilizar toda la migracion.

## Flujo de Ramas (GitFlow)

- Durante el proyecto se siguio enfoque `GitFlow`.
- La rama principal de trabajo fue `feature/develop`.
- `main` queda como rama a proteger para merges mas estables.
- Tambien se utilizaron ramas puntuales de `hotfix` cuando fue necesario corregir problemas concretos sin mezclar todo el trabajo.
- Se mantuvo la disciplina de cambios incrementales y commits tematicos aun cuando hubo refactors grandes.

## Estado Actual

- Migracion a Vite completada.
- Migracion de estilos a Tailwind completada (sin preflight custom extra).
- Tokens de color semanticos activos para facilitar mantenimiento del tema.
- Arquitectura reorganizada por `features`, `domain` y `shared`.
- `TaskController` y `KanbanBoard` activos dentro de la interfaz.
- Terminal modularizada con comandos, shortcuts y controlador propio.
- Documentacion de IA ampliada en `docs/ai`, incluyendo comparativas, workflow y experimentos.
