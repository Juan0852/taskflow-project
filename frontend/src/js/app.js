// app.js - El Iniciador
import { BITASK_MANUAL } from './innerhtmls.js';
import { AuthAccessListeners } from './features/auth/auth-access.listeners.js';
import { PreferenceService } from './domain/preferences/preference-service.js';
import { AuthService } from './domain/auth/auth-service.js';
import { TaskApiService } from './domain/tasks/task-api-service.js';
import { TaskService } from './domain/tasks/task-service.js';
import { TaskAddPanel } from './features/task-panel/task-panel.listeners.js';
import { TaskPanelService } from './features/task-panel/task-panel.service.js';
import { TrashBinListeners } from './features/trash-bin/trash-bin.listeners.js';
import { TerminalListeners } from './features/terminal/terminal.listeners.js';
import { ToolbarPersonalization } from './features/toolbar-personalization/toolbar-personalization.controller.js';
import { UIManager } from './ui-manager.js';

document.addEventListener('DOMContentLoaded', async () => {

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
            trigger: document.getElementById('tool-settings'),
            modal: document.getElementById('toolbar-settings-modal'),
            backdrop: document.getElementById('toolbar-settings-backdrop'),
            close: document.getElementById('toolbar-settings-close'),
            hiddenList: document.getElementById('toolbar-settings-hidden'),
            visibleList: document.getElementById('toolbar-settings-visible'),
            filterSettings: document.getElementById('toolbar-filter-settings'),
            calendarSettings: document.getElementById('toolbar-calendar-settings')
        },
        trashBin: {
            trigger: document.getElementById('tool-trash'),
            modal: document.getElementById('trash-bin-modal'),
            backdrop: document.getElementById('trash-bin-backdrop'),
            close: document.getElementById('trash-bin-close'),
            list: document.getElementById('trash-bin-list'),
            status: document.getElementById('trash-bin-status'),
            restoreButton: document.getElementById('trash-bin-restore'),
            emptyButton: document.getElementById('trash-bin-empty')
        },
        dialog: {
            modal: document.getElementById('app-dialog-modal'),
            backdrop: document.getElementById('app-dialog-backdrop'),
            eyebrow: document.getElementById('app-dialog-eyebrow'),
            title: document.getElementById('app-dialog-title'),
            message: document.getElementById('app-dialog-message'),
            actions: document.getElementById('app-dialog-actions')
        },
        auth: {
            anchor: document.getElementById('auth-access-anchor'),
            trigger: document.getElementById('auth-access-trigger'),
            userMenu: document.getElementById('auth-user-menu'),
            userMenuLogout: document.getElementById('auth-user-menu-logout'),
            modal: document.getElementById('auth-modal'),
            backdrop: document.getElementById('auth-backdrop'),
            close: document.getElementById('auth-close'),
            title: document.getElementById('auth-title'),
            description: document.getElementById('auth-description'),
            form: document.getElementById('auth-form'),
            modeToggle: document.getElementById('auth-mode-toggle'),
            identifierField: document.getElementById('auth-identifier-field'),
            identifierInput: document.getElementById('auth-identifier'),
            identifierError: document.getElementById('auth-identifier-error'),
            emailField: document.getElementById('auth-email-field'),
            emailInput: document.getElementById('auth-email'),
            emailError: document.getElementById('auth-email-error'),
            usernameField: document.getElementById('auth-username-field'),
            usernameInput: document.getElementById('auth-username'),
            usernameError: document.getElementById('auth-username-error'),
            confirmPasswordField: document.getElementById('auth-confirm-password-field'),
            confirmPasswordInput: document.getElementById('auth-confirm-password'),
            passwordInput: document.getElementById('auth-password'),
            passwordError: document.getElementById('auth-password-error'),
            confirmPasswordError: document.getElementById('auth-confirm-password-error'),
            submitButton: document.getElementById('auth-submit'),
            logoutButton: document.getElementById('auth-logout'),
            errorBox: document.getElementById('auth-error'),
            sessionState: document.getElementById('auth-session-state')
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
            addPanel: document.getElementById('gui-add-panel'),
            addPanelBackdrop: document.getElementById('gui-add-panel-backdrop'),
            addPanelClose: document.getElementById('gui-task-modal-close'),
            addPanelTitle: document.getElementById('gui-task-modal-title'),
            addPanelDescription: document.getElementById('gui-task-modal-description'),
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
        btn: null,
        iconLight: '/assets/Light.png',
        iconDark: '/assets/Dark.png',

        init(btn) {
            this.btn = btn || null;
            this.applyTheme(document.body.getAttribute('data-theme') || 'dark', { persist: false });

            if (!btn) return;
            btn.addEventListener('click', () => {
                const currentTheme = document.body.getAttribute('data-theme') || 'dark';
                const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.applyTheme(nextTheme);
            });
        },

        applyTheme(theme, options = {}) {
            const safeTheme = theme === 'light' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', safeTheme);
            this._updateThemeButton(safeTheme);

            if (options.persist === false) return;
            void PreferenceService.updatePreferences({ theme: safeTheme });
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

    const GuestCookieStore = {
        splashCookieName: 'bitask_guest_splash_seen_at',

        get(name) {
            const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
            return match ? decodeURIComponent(match[1]) : null;
        },

        set(name, value, maxAgeSeconds) {
            document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; samesite=lax`;
        },

        getGuestSplashTimestamp() {
            return this.get(this.splashCookieName);
        },

        setGuestSplashTimestamp(timestamp) {
            this.set(this.splashCookieName, timestamp, 24 * 60 * 60);
        }
    };

    // Pantalla de arranque (2s)
    const StartupSplash = {
        ttlMs: 24 * 60 * 60 * 1000, // 24 horas

        shouldShow(lastSplashShownAt) {
            if (!lastSplashShownAt) return true;

            const parsedDate = new Date(lastSplashShownAt);
            if (Number.isNaN(parsedDate.getTime())) return true;

            return Date.now() - parsedDate.getTime() >= this.ttlMs;
        },

        markAsShown(timestamp) {
            if (AuthService.isLoggedIn()) {
                void PreferenceService.updatePreferences({
                    lastSplashShownAt: timestamp
                });
                return;
            }

            GuestCookieStore.setGuestSplashTimestamp(timestamp);
        },

        init(splashPanel, lastSplashShownAt = null) {
            if (!splashPanel) return;

            const effectiveTimestamp = AuthService.isLoggedIn()
                ? lastSplashShownAt
                : GuestCookieStore.getGuestSplashTimestamp();

            if (!this.shouldShow(effectiveTimestamp)) {
                splashPanel.remove();
                return;
            }

            splashPanel.classList.remove('invisible', 'opacity-0');
            splashPanel.classList.add('visible', 'opacity-100');
            this.markAsShown(new Date().toISOString());

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
                        TerminalListeners.core.lastCommand = rawValue;
                    }

                    TerminalListeners.core.pipeline(rawValue);
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
                const totalTasks = TaskService.getAll().length;
                if (!totalTasks) {
                    await DialogService.alert({
                        title: 'Nada que borrar',
                        message: 'No hay tareas para mandar a la papelera.',
                        confirmText: 'Entendido',
                        eyebrow: 'Acción masiva'
                    });
                    return;
                }

                if (!AuthService.isLoggedIn()) {
                    await DialogService.alert({
                        title: 'Inicia sesión para usar la papelera',
                        message: 'La papelera solo está disponible para cuentas con sesión iniciada. Puedes seguir usando "Completar todas" en modo invitado, pero para mandar tareas a la papelera necesitas iniciar sesión.',
                        confirmText: 'Entendido',
                        eyebrow: 'Acción masiva'
                    });
                    return;
                }

                const shouldClear = await DialogService.confirm({
                    title: 'Mandar todas las tareas a la papelera',
                    message: `Se van a mandar ${totalTasks} tarea(s) a la papelera.`,
                    confirmText: 'Mandar a papelera',
                    cancelText: 'Cancelar',
                    tone: 'danger',
                    eyebrow: 'Acción masiva'
                });

                if (shouldClear) {
                    const response = await TaskApiService.trashAllTasks();
                    await UIManager.refreshVisibleTasks();
                    await DialogService.alert({
                        title: 'Tareas enviadas a la papelera',
                        message: response.message,
                        confirmText: 'Perfecto',
                        eyebrow: 'Acción masiva'
                    });
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

                const updatedCount = AuthService.isLoggedIn()
                    ? (await TaskApiService.completeAllTasks()).count || 0
                    : TaskService.markAllAsCompleted();

                await UIManager.refreshVisibleTasks();

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

                if (!AuthService.isLoggedIn()) {
                    await DialogService.alert({
                        title: 'Inicia sesión para usar la papelera',
                        message: 'Mandar tareas completadas a la papelera requiere una cuenta con sesión iniciada.',
                        confirmText: 'Entendido',
                        eyebrow: 'Acción masiva'
                    });
                    return;
                }

                const shouldClearCompleted = await DialogService.confirm({
                    title: 'Mandar tareas completadas a la papelera',
                    message: `Se van a mandar ${completedTasks} tarea(s) completada(s) a la papelera.`,
                    confirmText: 'Mandar a papelera',
                    cancelText: 'Cancelar',
                    tone: 'danger',
                    eyebrow: 'Acción masiva'
                });

                if (!shouldClearCompleted) return;

                const removedCount = (await TaskApiService.trashCompletedTasks()).count || 0;

                await UIManager.refreshVisibleTasks();

                await DialogService.alert({
                    title: 'Tareas enviadas a la papelera',
                    message: `Se mandaron ${removedCount} tarea(s) completada(s) a la papelera.`,
                    confirmText: 'Perfecto',
                    eyebrow: 'Acción masiva'
                });
            });
        }
    };

    /** * 3. EJECUCIÓN DE INITS
     */

    async function applyPreferenceSnapshot() {
        const preferences = await PreferenceService.getPreferences();
        ThemeControl.applyTheme(preferences.theme, { persist: false });

        if (ToolbarPersonalization.controls.length) {
            ToolbarPersonalization.applyExternalPreferences(preferences);
        }

        return preferences;
    }

    // UI & Eventos
    ThemeControl.init(domElements.theme.btn);
    DialogService.init(domElements.dialog);
    await AuthAccessListeners.init(domElements.auth, { dialogService: DialogService });
    const initialPreferences = await applyPreferenceSnapshot();
    StartupSplash.init(domElements.splash.panel, initialPreferences.lastSplashShownAt);
    WindowControls.init(domElements.windowControls);
    TerminalUI.init(domElements.terminal);
    UIManager.updateTerminalPrompt(AuthService.currentUser);
    TerminalInputControl.init(domElements.terminal.input);
    TaskAddPanel.init(domElements.gui, { dialogService: DialogService });
    TaskEditSelectedControl.init(domElements.gui.btnEditSelected, domElements.gui);
    TaskClearControl.init(domElements.gui.btnClear);
    TaskCompleteAllControl.init(domElements.gui.btnCompleteAll);
    TaskClearCompletedControl.init(domElements.gui.btnClearCompleted);
    ToolbarPersonalization.init(domElements.toolbarSettings, domElements.gui, {
        initialVisibilityMap: initialPreferences.toolbarConfig,
        initialFilterPreferences: initialPreferences.filterPreferences,
        preferenceService: PreferenceService
    });
    UIManager.init(domElements.navigation, { dialogService: DialogService });
    TrashBinListeners.init(domElements.trashBin, { dialogService: DialogService, uiManager: UIManager });
    UIManager.switchTab('readme-file');

    document.addEventListener('auth:session-changed', async (event) => {
        const user = event.detail?.user || null;
        await applyPreferenceSnapshot();
        UIManager.updateTerminalPrompt(user);

        if (user) {
            const { syncedCount } = await TaskPanelService.syncGuestTasksToBackend();
            if (syncedCount > 0) {
                await DialogService.alert({
                    title: 'Tareas sincronizadas',
                    message: `Se guardaron ${syncedCount} tarea(s) de invitado dentro de tu perfil.`,
                    confirmText: 'Perfecto',
                    eyebrow: 'Tareas'
                });
            }

            await UIManager.refreshVisibleTasks();
            return;
        }

        TaskService.init();
        await UIManager.refreshVisibleTasks();
    });

    // Motores Lógicos
    TerminalListeners.init(domElements.terminal, { personalizationService: ToolbarPersonalization });

    // Renderizado Inicial
    UIManager.renderTaskList(TaskService.getAll());
    if (domElements.navigation.manualContainer) {
        domElements.navigation.manualContainer.innerHTML = BITASK_MANUAL;
    }
    console.log("V1.0 Oso de Anteojos: Todos los sistemas operativos y controladores listos.");
});
