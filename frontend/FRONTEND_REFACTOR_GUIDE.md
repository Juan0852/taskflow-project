# Frontend Refactor Guide

## Purpose

This document is the living guide for the frontend refactor.

It exists to avoid improvising different rules every day while we:

- migrate the frontend toward MVVM,
- keep the current app working,
- preserve `localStorage` temporarily for tasks,
- and progressively move real data access to the backend.

Whenever we find:

- an exception,
- a strange edge case,
- a temporary workaround,
- or a rule that is still unclear,

we add it here.

---

## Current Goal

The current goal is **not** to rewrite the whole frontend from scratch.

The current goal is:

1. keep the app working,
2. refactor frontend modules toward MVVM,
3. separate visual behavior from data behavior,
4. preserve local task persistence for now,
5. and prepare the codebase so `tasks` can later consume the backend cleanly.

---

## Core Rules

### 1. The frontend must keep working during the refactor

- We do not stop the app just to chase architectural purity.
- Temporary coexistence is allowed.
- `localStorage` remains the temporary source of truth for tasks while the refactor is happening.

### 2. We refactor module by module

- We do not refactor the whole frontend in one pass.
- We move one module, or one part of a module, at a time.
- Each change should leave the app in a runnable state.

### 3. We separate view from state from data

- Visual rendering must not own business decisions.
- Data persistence must not be buried inside visual code.
- Backend integration must not be triggered directly from arbitrary DOM code.

### 4. We do not move frontend-only interaction logic to the backend

Examples that stay in frontend:

- terminal parsing,
- terminal visual feedback,
- terminal command mistakes,
- local visual counters,
- modal open/close behavior,
- drag and drop visual handling,
- display-only filters and sorting behavior while the task source is still local.

### 5. We only move real persistence and system rules to the backend

Examples that belong to backend:

- create task,
- update task,
- delete task,
- trash task,
- restore task,
- bulk completion,
- filtered backend listing,
- authenticated ownership checks.

---

## MVVM Rules

### View

The `View`:

- renders UI,
- updates DOM,
- wires presentational interactions,
- and delegates events upward.

The `View` must not:

- call backend directly,
- own persistence,
- or make domain decisions.

### ViewModel

The `ViewModel`:

- prepares state for rendering,
- transforms raw values into UI-friendly values,
- owns local interaction rules,
- and orchestrates what the view should display.

The `ViewModel` can:

- prepare labels,
- prepare modal state,
- derive display state,
- own filter state,
- own selection state,
- and coordinate simple UI behavior.

The `ViewModel` must not:

- render HTML directly,
- or access the DOM in a messy way unless that module explicitly needs a controller-like coordinator during transition.

### Service / Model / Domain layer

The service or domain layer:

- owns data operations,
- owns persistence,
- and becomes the eventual bridge to backend APIs.

For now:

- `TaskService` still persists to `localStorage`,
- but this is temporary.

Long term:

- `TaskService` should become an orchestrator over a backend-facing task API service.

---

## Temporary Rules During Transition

### Tasks

- Tasks remain local for now.
- We do not connect task persistence to backend until the frontend structure is cleaner.
- Existing task flows must remain usable while we refactor.

### Auth

- Auth can already talk to the backend.
- Frontend auth integration is allowed before task migration.

### Filters

- Filters remain local for now.
- Filter state should progressively move into viewmodels instead of being mixed into rendering logic.
- Later, some filters will become backend-driven.

### Sorting

- Sorting remains local while tasks are still local.
- Sorting UI should still be refactored into reusable visual components where possible.

---

## Backend Thinking We Must Keep In Mind

The frontend refactor must anticipate the backend we already started.

### Existing task backend endpoints

- `GET /api/tasks/status`
- `GET /api/tasks`
- `GET /api/tasks/trash`
- `GET /api/tasks/types`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `PATCH /api/tasks/:id/trash`
- `PATCH /api/tasks/:id/restore`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/bulk/complete-all`
- `PATCH /api/tasks/bulk/trash-completed`

### Important architectural implication

The final task flow should not depend on “always load everything”.

That means:

- pagination matters,
- backend filtering matters,
- backend sorting matters,
- and the frontend should progressively stop assuming that all tasks are always in memory.

For now we are not implementing that task migration yet, but the frontend structure must stop making that future impossible.

---

## What Stays Local For Now

These remain local and frontend-owned during the current refactor stage:

- task persistence in `localStorage`,
- visual sorting,
- visual filtering,
- terminal command parsing,
- terminal UX and feedback,
- toolbar personalization local state,
- temporary combobox/select visual behavior.

---

## Refactor Order

Suggested order:

1. `task-panel`
2. `task-list`
3. `kanban-board`
4. `terminal`
5. shared UI pieces
6. task persistence/backend bridge

This order can change if we discover a better dependency path, but changes should be recorded here.

---

## Naming Rules

- Prefer `*.view.js` for rendering concerns.
- Prefer `*.viewmodel.js` for UI state and transformation concerns.
- Prefer `*.service.js` for domain/data concerns.
- Avoid calling something `controller` if it behaves more like a viewmodel or coordinator.
- During transition, mixed names can remain temporarily, but they should be noted here if they become misleading.

---

## Shared UI Components

When we create reusable frontend controls, they should live in shared UI space.

Examples already started:

- custom select field,
- combobox field,
- modal/lightbox patterns.

Goal:

- consistent visual behavior,
- less native-browser inconsistency,
- easier reuse across modules.

---

## Open Questions

### 1. Which filters stay local and which move to backend later?

Still open.

### 2. How much of task sorting should remain frontend-only once backend pagination arrives?

Still open.

### 3. Should task type suggestions eventually become remote instead of local?

Probably yes, if task types become large enough.

### 4. How much current “controller” code should be renamed versus incrementally adapted?

Still open.

---

## Exception Log

Add exceptions here when we discover them.

### Current exceptions

- Auth already talks to backend while tasks still remain local.
- Some modules still use names that predate the MVVM refactor.
- Some interaction flows still combine controller-like and viewmodel-like responsibilities during transition.
- `task-panel` already started the separation: submission/persistence moved out of the viewmodel into a module service, and the event wiring layer now lives in `task-panel.listeners.js`.
- `task-list` already started the separation: task reads/deletes/defaults moved into `task-list.service.js`, and the event wiring layer now lives in `task-list.listeners.js`.
- `task-list` now also centralizes search, sort and date-query intent in its viewmodel/listeners layer, so the future bridge to backend query params does not have to be designed inside `app.js`.
- `kanban-board` now also follows the same transition pattern: reads and status updates moved into `kanban-board.service.js`, and drag/drop interaction now lives in `kanban-board.listeners.js`.
- `calendar-filter` now also follows the listeners pattern and no longer pulls task data directly on its own; it refreshes the visible collection through the shared task-list flow.
- `terminal` now also follows the transition pattern: task mutations moved into `terminal.service.js`, and the module bootstrap/event layer now lives in `terminal.listeners.js`.

---

## Notes For Future Sessions

- Always check this file before making structural frontend changes.
- If a new rule appears during implementation, write it here.
- If a module breaks the MVVM separation for a temporary reason, document it here instead of silently normalizing the exception.
