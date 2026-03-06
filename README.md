# TaskFlow Project

TaskFlow Project es una app web estilo IDE para gestionar tareas con comandos de terminal y vista visual.
El objetivo del proyecto es combinar productividad (CLI) con una interfaz tipo editor para crear, listar, actualizar y eliminar tareas de forma rápida.

## Caracteristicas

- Interfaz inspirada en un IDE (panel lateral, editor y terminal integrada).
- Comandos de terminal para operar tareas (`/bitask ...`).
- Formularios GUI para crear y limpiar tareas.
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
├─ public/
│  └─ assets/
├─ src/
│  ├─ main.js
│  ├─ style.css
│  └─ js/
│     ├─ app.js
│     ├─ commands.js
│     ├─ innerhtmls.js
│     ├─ shortcuts.js
│     ├─ task-service.js
│     ├─ terminal-core.js
│     └─ ui-manager.js
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
2. `terminal-core.js` interpreta comandos y delega acciones.
3. `task-service.js` administra el estado de tareas.
4. `ui-manager.js` renderiza cambios en editor y terminal.
5. `app.js` inicializa tema, splash, listeners y orquestacion general.

## Principios de Ingenieria Aplicados

- `DRY (Don't Repeat Yourself)`: se redujo duplicacion de estilos y referencias, centralizando tokens semanticos y reutilizando utilidades.
- `Responsabilidad Unica (SRP)`: cada modulo tiene un rol claro (`task-service`, `terminal-core`, `ui-manager`, `app`).
- `Mantenibilidad`: metodos pequeños, responsabilidades bien delimitadas y nombres de constantes/funciones mas expresivos.
- `Separation of Concerns`: logica de dominio, render/UI y orquestacion estan separadas para facilitar evolucion y debugging.
- `Refactor incremental`: ya se tenia una base completa en CSS tradicional, pero se decidio migrar a Tailwind. Por eso el proceso se hizo con debugging paso a paso, validando modulo por modulo para evitar regresiones. Despues de bastantes cafes, se logro estabilizar toda la migracion.

## Flujo de Ramas (GitFlow)

- Durante el proyecto se siguio enfoque `GitFlow`.
- La rama principal de trabajo fue `feature/develop`.
- Aunque no se abrieron ramas adicionales en esta etapa, se mantuvo la disciplina de cambios incrementales y commits tematicos.

## Estado Actual

- Migracion a Vite completada.
- Migracion de estilos a Tailwind completada (sin preflight custom extra).
- Tokens de color semanticos activos para facilitar mantenimiento del tema.
