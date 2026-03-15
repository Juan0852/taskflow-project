/**
 * BiTask - UI Manager [Oso de Anteojos]
 * Adaptado al layout de IntelliJ Darcula.
 */
import { CalendarFilterController } from './features/calendar-filter/calendar-filter.controller.js';
import { KanbanBoardController } from './features/kanban-board/kanban-board.controller.js';
import { TaskListController } from './features/task-list/task-list.controller.js';
import { TaskService } from './domain/tasks/task-service.js';

export const UIManager = {
    // Sincronizado con tus IDs de HTML/CSS
    elements: {
        taskContainer: document.getElementById('task-list-container'), // El area del editor
        terminalOutput: document.querySelector('.log-output'),
        terminalInput: document.getElementById('cli-input'),
        searchInput: document.getElementById('gui-search-task'),
        typeFilters: document.getElementById('task-type-filters'),
        filtersRow: document.getElementById('task-type-filters')?.parentElement || null,
        sortControls: document.getElementById('task-sort-controls'),
        sortAddButton: document.getElementById('task-sort-add'),
        kanbanContainer: document.getElementById('kanban-display'),
        sharedWorkspaceControls: document.getElementById('shared-workspace-controls'),
        controllerWorkspaceControlsSlot: document.getElementById('controller-workspace-controls-slot'),
        kanbanWorkspaceControlsSlot: document.getElementById('kanban-workspace-controls-slot'),
        calendarZone: document.getElementById('calendar-filter-zone'),
        calendarMonthLabel: document.getElementById('calendar-filter-month-label'),
        calendarGrid: document.getElementById('calendar-filter-grid'),
        calendarClearButton: document.getElementById('calendar-filter-clear')
    },
    dialogService: null,
    filterPreferences: {
        showFiltersRow: true,
        showNameSearch: true,
        showTypeFilters: true,
        allowMultipleSortRules: true,
        showCalendarZone: true
    },
    ...CalendarFilterController,
    ...KanbanBoardController,
    ...TaskListController,

    /**
     * Inicializa el UI Manager con elementos del DOM
     */
    init(navigation, services = {}) {
        this.dialogService = services.dialogService || null;

        if (navigation && navigation.links) {
            navigation.links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        const tabId = href.substring(1);
                        this.switchTab(tabId);
                    }
                });
            });
        }

        this.bindEvents();
        this.bindTaskListEvents();

        this.renderSortControls();
        this.renderCalendarGrid();

        // Renderizar las tareas iniciales
        this.renderTaskList(TaskService.getAll());
    },

    applyFilterPreferences(preferences = {}) {
        this.filterPreferences = {
            ...this.filterPreferences,
            ...preferences
        };

        if (this.elements.searchInput) {
            this.elements.searchInput.classList.toggle('hidden', !this.filterPreferences.showNameSearch);
        }

        if (this.elements.filtersRow) {
            this.elements.filtersRow.classList.toggle('hidden', !this.filterPreferences.showFiltersRow);
        }

        if (this.elements.typeFilters) {
            this.elements.typeFilters.classList.toggle('hidden', !this.filterPreferences.showTypeFilters);
        }

        if (this.elements.calendarZone) {
            this.elements.calendarZone.classList.toggle('hidden', !this.filterPreferences.showCalendarZone);
        }

        if (!this.filterPreferences.allowMultipleSortRules && this.filters.sortRules.length > 1) {
            this.filters.sortRules = [this.filters.sortRules[0]];
        }

        this.renderSortControls();
        this.renderCalendarGrid();
        this.renderTaskList(TaskService.getAll());
    },

    /**
     * Imprime en la terminal acoplada (#terminal-file)
     */
    printTerminalLine(input, response) {
        const output = this.elements.terminalOutput;
        if (!output) return;

        const entry = document.createElement('div');
        entry.className = 'log-line mb-1 leading-[1.4]';
        entry.innerHTML = `
            <div><span class="info text-[var(--color-accent-info)]">➜</span> <span class="user-cmd text-[var(--color-text-strong)]">${this._escapeHTML(input)}</span></div>
            <div class="terminal-response pl-[15px]">${response}</div>
        `;

        output.appendChild(entry);

        // Auto-scroll de la terminal
        output.scrollTop = output.scrollHeight;
    },

    /**
     * Comando clear
     */
    clearTerminal() {
        if (this.elements.terminalOutput) {
            this.elements.terminalOutput.innerHTML = '';
        }
    },

    _escapeHTML(str) {
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    },

    /**
     * Muestra u oculta la terminal
     */
    setTerminalButtonState(isActive) {
        const terminalButton = document.getElementById('tool-terminal');
        if (!terminalButton) return;

        terminalButton.classList.toggle('border-l-2', isActive);
        terminalButton.classList.toggle('border-[var(--color-text-strong)]', isActive);
        terminalButton.classList.toggle('opacity-100', isActive);
        terminalButton.classList.toggle('opacity-60', !isActive);
    },

    /**
     * Muestra u oculta la terminal
     */
    toggleTerminal(panel) {
        if (!panel) return;

        const isHidden = panel.classList.contains('hidden');
        if (isHidden) {
            panel.classList.remove('hidden');
            panel.classList.add('flex');
            this.setTerminalButtonState(true);
            const input = document.getElementById('cli-input');
            if (input) input.focus();
        } else {
            panel.classList.add('hidden');
            panel.classList.remove('flex');
            this.setTerminalButtonState(false);
        }
    },

    /**
     * Muestra u oculta un panel genérico leyendo su estilo real 
     */
    toggleGeneric(panel) {
        if (!panel) return;

        const isHidden = panel.classList.contains('hidden');
        if (isHidden) {
            panel.classList.remove('hidden');
            panel.classList.add('flex');
        } else {
            panel.classList.add('hidden');
            panel.classList.remove('flex');
        }
    },

    /**
     * Cambia de pestaña (Controller / Kanban)
     */
    switchTab(tabId) {
        const pages = document.querySelectorAll('.code-page');
        pages.forEach(page => {
            const isActive = page.id === tabId;
            page.classList.toggle('hidden', !isActive);
            page.classList.toggle('flex', isActive);
        });
        this.syncWorkspaceControlsVisibility(tabId);
        this.setActiveFileLink(tabId);
    },

    /**
     * Sincroniza el archivo activo en el árbol lateral
     */
    setActiveFileLink(tabId) {
        const links = document.querySelectorAll('.file-link');
        links.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${tabId}`;
            const treeItem = link.closest('.tree-item');
            if (treeItem) {
                treeItem.classList.toggle('bg-[var(--color-bg-hover)]', isActive);
                treeItem.classList.toggle('border-l-2', isActive);
                treeItem.classList.toggle('border-[var(--color-accent-info)]', isActive);
            }
        });
    },

    syncWorkspaceControlsVisibility(tabId) {
        const controls = this.elements.sharedWorkspaceControls;
        if (!controls) return;

        const slot = tabId === 'kanban-file'
            ? this.elements.kanbanWorkspaceControlsSlot
            : tabId === 'controller-file'
                ? this.elements.controllerWorkspaceControlsSlot
                : null;

        if (!slot) {
            controls.classList.add('hidden');
            return;
        }

        slot.appendChild(controls);
        controls.classList.remove('hidden');
    }
};
