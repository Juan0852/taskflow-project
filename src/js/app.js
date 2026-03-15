// app.js - El Iniciador
import { BITASK_MANUAL } from './innerhtmls.js';
import { TaskService } from './domain/tasks/task-service.js';
import { TaskAddPanel } from './features/task-panel/task-panel.controller.js';
import { TerminalController } from './features/terminal/terminal-controller.js';
import { ToolbarPersonalization } from './features/toolbar-personalization/toolbar-personalization.controller.js';
import { STORAGE_KEYS } from './shared/storage-keys.js';
import { StorageService } from './shared/storage-service.js';
import { UIManager } from './ui-manager.js';

document.addEventListener('DOMContentLoaded', () => {

    /** * 1. MAPEO DE ELEMENTOS DEL DOM
     */
    const domElements = {
        splash: {
            panel: document.getElementById('startup-splash')
        },
        windowControls: {
            red: document.getElementById('window-dot-red'),
            yellow: document.getElementById('window-dot-yellow')
        },
        terminal: {
            btn: document.getElementById('tool-terminal'),
            panel: document.getElementById('terminal-file'),
            input: document.getElementById('cli-input')
        },
        theme: {
            btn: document.getElementById('tool-theme')
        },
        toolbarSettings: {
            trigger: document.getElementById('toolbar-settings-trigger'),
            modal: document.getElementById('toolbar-settings-modal'),
            backdrop: document.getElementById('toolbar-settings-backdrop'),
            close: document.getElementById('toolbar-settings-close'),
            hiddenList: document.getElementById('toolbar-settings-hidden'),
            visibleList: document.getElementById('toolbar-settings-visible'),
            filterSettings: document.getElementById('toolbar-filter-settings'),
            calendarSettings: document.getElementById('toolbar-calendar-settings')
        },
        dialog: {
            modal: document.getElementById('app-dialog-modal'),
            backdrop: document.getElementById('app-dialog-backdrop'),
            eyebrow: document.getElementById('app-dialog-eyebrow'),
            title: document.getElementById('app-dialog-title'),
            message: document.getElementById('app-dialog-message'),
            actions: document.getElementById('app-dialog-actions')
        },
        navigation: {
            links: document.querySelectorAll('.file-link'),
            manualContainer: document.getElementById('manual-content-container'),
            kanbanContainer: document.getElementById('kanban-display')
        },
        gui: {
            btnAdd: document.getElementById('btn-add-gui'),
            btnEditSelected: document.getElementById('btn-edit-selected-gui'),
            btnClear: document.getElementById('btn-clear-gui'),
            btnCompleteAll: document.getElementById('btn-complete-all-gui'),
            btnClearCompleted: document.getElementById('btn-clear-completed-gui'),
            // Referencias del nuevo formulario (PanelAddControl)
            addPanel: document.getElementById('gui-add-panel'),
            inputName: document.getElementById('gui-task-name'),
            inputType: document.getElementById('gui-task-type'),
            selectPrio: document.getElementById('gui-task-priority'),
            selectStatus: document.getElementById('gui-task-status'),
            btnConfirm: document.getElementById('btn-confirm-add'),
            btnCancel: document.getElementById('btn-cancel-add'),
            inputSearch: document.getElementById('gui-search-task')
        }
    };

    /** * 2. DEFINICIÓN DE CONTROLADORES INTERNOS
     */

    // Controlador para la apertura de la terminal
    const TerminalUI = {
        init(terminal) {
            if (terminal.btn && terminal.panel) {
                UIManager.setTerminalButtonState(!terminal.panel.classList.contains('hidden'));
                terminal.btn.addEventListener('click', () => {
                    UIManager.toggleTerminal(terminal.panel);
                });
            }
        }
    };

    // Controlador de tema Dark/Light
    const ThemeControl = {
        storageKey: STORAGE_KEYS.THEME,
        btn: null,
        iconLight: '/assets/Light.png',
        iconDark: '/assets/Dark.png',

        _getStoredTheme() {
            return StorageService.getString(this.storageKey, 'dark') || 'dark';
        },

        _saveTheme(theme) {
            StorageService.setString(this.storageKey, theme);
        },

        init(btn) {
            this.btn = btn || null;
            const storedTheme = this._getStoredTheme();
            this.applyTheme(storedTheme);

            if (!btn) return;
            btn.addEventListener('click', () => {
                const currentTheme = document.body.getAttribute('data-theme') || 'dark';
                const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.applyTheme(nextTheme);
            });
        },

        applyTheme(theme) {
            const safeTheme = theme === 'light' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', safeTheme);
            this._saveTheme(safeTheme);
            this._updateThemeButton(safeTheme);
        },

        _updateThemeButton(activeTheme) {
            if (!this.btn) return;

            // Si estoy en modo dark, muestro icono light (acción siguiente: pasar a light).
            if (activeTheme === 'dark') {
                this.btn.src = this.iconLight;
                this.btn.alt = 'Cambiar a tema light';
                this.btn.title = 'Cambiar a tema light';
            } else {
                this.btn.src = this.iconDark;
                this.btn.alt = 'Cambiar a tema dark';
                this.btn.title = 'Cambiar a tema dark';
            }
        },

        _updateIconTint() {}
    };

    const DialogService = {
        modal: null,
        backdrop: null,
        eyebrow: null,
        title: null,
        message: null,
        card: null,
        actions: null,
        escapeHandler: null,
        pendingResolver: null,
        defaultMessageClassName: '',
        defaultCardClassName: '',

        init(dialog) {
            this.modal = dialog.modal || null;
            this.backdrop = dialog.backdrop || null;
            this.eyebrow = dialog.eyebrow || null;
            this.title = dialog.title || null;
            this.message = dialog.message || null;
            this.card = document.getElementById('app-dialog-card');
            this.actions = dialog.actions || null;
            this.defaultMessageClassName = this.message?.className || '';
            this.defaultCardClassName = this.card?.className || '';

            if (this.backdrop) {
                this.backdrop.addEventListener('click', () => this._resolve(false));
            }
        },

        alert({ title = 'Mensaje', message = '', eyebrow = 'BiTask', confirmText = 'Entendido', tone = 'info', ...rest } = {}) {
            return this._open({
                title,
                message,
                eyebrow,
                tone,
                ...rest,
                actions: [
                    { label: confirmText, value: true, variant: tone === 'danger' ? 'danger' : 'primary' }
                ]
            });
        },

        confirm({ title = 'Confirmar', message = '', eyebrow = 'BiTask', confirmText = 'Confirmar', cancelText = 'Cancelar', tone = 'info' } = {}) {
            return this._open({
                title,
                message,
                eyebrow,
                tone,
                actions: [
                    { label: cancelText, value: false, variant: 'secondary' },
                    { label: confirmText, value: true, variant: tone === 'danger' ? 'danger' : 'primary' }
                ]
            });
        },

        _open({ title, message = '', messageHTML = '', messageClassName = '', cardClassName = '', eyebrow, actions }) {
            if (!this.modal || !this.actions || !this.title || !this.message || !this.eyebrow) {
                return Promise.resolve(false);
            }

            if (this.pendingResolver) {
                this._resolve(false);
            }

            this.eyebrow.textContent = eyebrow;
            this.title.textContent = title;
            this.message.className = messageClassName || this.defaultMessageClassName;
            if (this.card) {
                this.card.className = cardClassName || this.defaultCardClassName;
            }
            if (messageHTML) {
                this.message.innerHTML = messageHTML;
            } else {
                this.message.textContent = message;
            }
            this.actions.innerHTML = '';

            actions.forEach(action => {
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = action.label;
                button.className = this._getButtonClassName(action.variant);
                button.addEventListener('click', () => this._resolve(action.value));
                this.actions.appendChild(button);
            });

            this.modal.classList.remove('hidden');
            this.modal.classList.add('flex');

            this.escapeHandler = (event) => {
                if (event.key === 'Escape') {
                    this._resolve(false);
                }
            };
            document.addEventListener('keydown', this.escapeHandler);

            return new Promise(resolve => {
                this.pendingResolver = resolve;
            });
        },

        _resolve(value) {
            if (!this.pendingResolver) return;

            const resolver = this.pendingResolver;
            this.pendingResolver = null;

            this.modal.classList.add('hidden');
            this.modal.classList.remove('flex');
            if (this.escapeHandler) {
                document.removeEventListener('keydown', this.escapeHandler);
                this.escapeHandler = null;
            }

            resolver(value);
        },

        _getButtonClassName(variant) {
            const base = 'inline-flex items-center justify-center rounded-md border px-4 py-2 text-[13px] font-medium transition-colors duration-200';

            if (variant === 'danger') {
                return `${base} border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[var(--color-danger-text)] hover:bg-[var(--color-danger-hover)]`;
            }

            if (variant === 'secondary') {
                return `${base} border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-soft)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-strong)]`;
            }

            return `${base} border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-text-strong)] hover:bg-[var(--color-accent-hover)]`;
        }
    };

    const WindowControls = {
        init(windowControls) {
            if (windowControls.red) {
                windowControls.red.addEventListener('click', () => {
                    DialogService.alert({
                        title: 'Sigue en foco',
                        message: '¿Qué haces? Ponte a trabajar...',
                        eyebrow: 'Ventana',
                        confirmText: 'Vale'
                    });
                });
            }

            if (windowControls.yellow) {
                windowControls.yellow.addEventListener('click', () => {
                    DialogService.alert({
                        title: 'Minimizar no permitido',
                        message: '¿De nuevo tú?',
                        eyebrow: 'Ventana',
                        confirmText: 'Ups'
                    });
                });
            }
        }
    };

    // Pantalla de arranque (2s)
    const StartupSplash = {
        storageKey: STORAGE_KEYS.STARTUP_SPLASH_TOKEN,
        ttlMs: 30 * 60 * 1000, // 30 minutos

        _isTokenValid() {
            const parsed = StorageService.getJSON(this.storageKey, null);
            return Boolean(parsed && parsed.expiresAt && Date.now() < parsed.expiresAt);
        },

        _saveToken() {
            const token = { expiresAt: Date.now() + this.ttlMs };
            StorageService.setJSON(this.storageKey, token);
        },

        init(splashPanel) {
            if (!splashPanel) return;

            if (this._isTokenValid()) {
                splashPanel.remove();
                return;
            }

            splashPanel.classList.remove('invisible', 'opacity-0');
            splashPanel.classList.add('visible', 'opacity-100');
            this._saveToken();

            setTimeout(() => {
                splashPanel.classList.remove('visible', 'opacity-100');
                splashPanel.classList.add('invisible', 'opacity-0');
                setTimeout(() => splashPanel.remove(), 400);
            }, 2000);
        }
    };

    // Controlador del input de terminal (ENTER + memoria de comando)
    const TerminalInputControl = {
        init(input) {
            if (!input) return;

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const rawValue = e.target.value;

                    if (rawValue.trim() !== "") {
                        TerminalController.core.lastCommand = rawValue;
                    }

                    TerminalController.core.pipeline(rawValue);
                    e.target.value = "";
                }
            });
        }
    };

    // Controlador para el panel de añadir tarea
    const TaskEditSelectedControl = {
        init(btnEditSelected, gui) {
            if (!btnEditSelected) return;

            btnEditSelected.addEventListener('click', async () => {
                const selectedTask = UIManager.getSelectedTask();

                if (!selectedTask) {
                    await DialogService.alert({
                        title: 'Selecciona una tarea',
                        message: 'Primero selecciona una tarea de la lista para poder editarla.',
                        confirmText: 'Entendido',
                        eyebrow: 'Edición'
                    });
                    return;
                }

                TaskAddPanel.openForEdit(gui, selectedTask);
            });
        }
    };

    // Controlador para limpiar la lista
    const TaskClearControl = {
        init(btnClear) {
            if (!btnClear) return;
            btnClear.addEventListener('click', async () => {
                const shouldClear = await DialogService.confirm({
                    title: 'Borrar todas las tareas',
                    message: '¿Estás seguro de que quieres borrar todas las tareas?',
                    confirmText: 'Borrar todo',
                    cancelText: 'Cancelar',
                    tone: 'danger',
                    eyebrow: 'Acción masiva'
                });

                if (shouldClear) {
                    TaskService.hardReset();
                    UIManager.renderTaskList([]);
                }
            });
        }
    };

    const TaskCompleteAllControl = {
        init(btnCompleteAll) {
            if (!btnCompleteAll) return;

            btnCompleteAll.addEventListener('click', async () => {
                const totalTasks = TaskService.getAll().length;
                if (!totalTasks) {
                    await DialogService.alert({
                        title: 'Nada que completar',
                        message: 'No hay tareas para marcar como completadas.',
                        confirmText: 'Entendido',
                        eyebrow: 'Acción masiva'
                    });
                    return;
                }

                const updatedCount = TaskService.markAllAsCompleted();
                UIManager.renderTaskList(TaskService.getAll());

                if (updatedCount === 0) {
                    await DialogService.alert({
                        title: 'Sin cambios',
                        message: 'Todas las tareas ya estaban marcadas como completadas.',
                        confirmText: 'Ok',
                        eyebrow: 'Acción masiva'
                    });
                    return;
                }

                await DialogService.alert({
                    title: 'Tareas completadas',
                    message: `Se marcaron ${updatedCount} tarea(s) como completadas.`,
                    confirmText: 'Perfecto',
                    eyebrow: 'Acción masiva'
                });
            });
        }
    };

    const TaskClearCompletedControl = {
        init(btnClearCompleted) {
            if (!btnClearCompleted) return;

            btnClearCompleted.addEventListener('click', async () => {
                const completedTasks = TaskService.getAll().filter(task => task.status === 'completado').length;

                if (!completedTasks) {
                    await DialogService.alert({
                        title: 'Nada que borrar',
                        message: 'No hay tareas completadas para borrar.',
                        confirmText: 'Entendido',
                        eyebrow: 'Acción masiva'
                    });
                    return;
                }

                const shouldClearCompleted = await DialogService.confirm({
                    title: 'Borrar tareas completadas',
                    message: `Se van a borrar ${completedTasks} tarea(s) completada(s).`,
                    confirmText: 'Borrar completadas',
                    cancelText: 'Cancelar',
                    tone: 'danger',
                    eyebrow: 'Acción masiva'
                });

                if (!shouldClearCompleted) return;

                const removedCount = TaskService.clearCompleted();
                UIManager.renderTaskList(TaskService.getAll());

                await DialogService.alert({
                    title: 'Tareas borradas',
                    message: `Se borraron ${removedCount} tarea(s) completada(s).`,
                    confirmText: 'Perfecto',
                    eyebrow: 'Acción masiva'
                });
            });
        }
    };

    // Controlador para la búsqueda de tareas
    const TaskSearchControl = {
        init(inputSearch) {
            if (!inputSearch) return;
            inputSearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                UIManager.setSearchTerm(searchTerm);
                UIManager.renderTaskList(TaskService.getAll());
            });
        }
    };

    /** * 3. EJECUCIÓN DE INITS
     */

    // UI & Eventos
    StartupSplash.init(domElements.splash.panel);
    ThemeControl.init(domElements.theme.btn);
    DialogService.init(domElements.dialog);
    WindowControls.init(domElements.windowControls);
    TerminalUI.init(domElements.terminal);
    TerminalInputControl.init(domElements.terminal.input);
    TaskAddPanel.init(domElements.gui);
    TaskEditSelectedControl.init(domElements.gui.btnEditSelected, domElements.gui);
    TaskClearControl.init(domElements.gui.btnClear);
    TaskCompleteAllControl.init(domElements.gui.btnCompleteAll);
    TaskClearCompletedControl.init(domElements.gui.btnClearCompleted);
    TaskSearchControl.init(domElements.gui.inputSearch);
    ToolbarPersonalization.init(domElements.toolbarSettings, domElements.gui);
    UIManager.init(domElements.navigation, { dialogService: DialogService });
    UIManager.switchTab('readme-file');

    // Motores Lógicos
    TerminalController.init(domElements.terminal, { personalizationService: ToolbarPersonalization });

    // Renderizado Inicial
    UIManager.renderTaskList(TaskService.getAll());
    if (domElements.navigation.manualContainer) {
        domElements.navigation.manualContainer.innerHTML = BITASK_MANUAL;
    }
    console.log("V1.0 Oso de Anteojos: Todos los sistemas operativos y controladores listos.");
});
