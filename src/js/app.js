// app.js - El Iniciador
import { BITASK_KANBAN, BITASK_MANUAL } from './innerhtmls.js';
import { Shortcuts } from './shortcuts.js';
import { TaskService } from './task-service.js';
import { TerminalCore } from './terminal-core.js';
import { UIManager } from './ui-manager.js';

document.addEventListener('DOMContentLoaded', () => {

    /** * 1. MAPEO DE ELEMENTOS DEL DOM
     */
    const domElements = {
        splash: {
            panel: document.getElementById('startup-splash')
        },
        terminal: {
            btn: document.getElementById('tool-terminal'),
            panel: document.getElementById('terminal-file'),
            input: document.getElementById('cli-input')
        },
        theme: {
            btn: document.getElementById('tool-theme')
        },
        navigation: {
            links: document.querySelectorAll('.file-link'),
            manualContainer: document.getElementById('manual-content-container'),
            kanbanContainer: document.getElementById('kanban-display')
        },
        gui: {
            btnAdd: document.getElementById('btn-add-gui'),
            btnClear: document.getElementById('btn-clear-gui'),
            // Referencias del nuevo formulario (PanelAddControl)
            addPanel: document.getElementById('gui-add-panel'),
            inputName: document.getElementById('gui-task-name'),
            selectPrio: document.getElementById('gui-task-priority'),
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
                terminal.btn.addEventListener('click', () => {
                    UIManager.toggleTerminal(terminal.panel);
                });
            }
        }
    };

    // Controlador de tema Dark/Light
    const ThemeControl = {
        storageKey: 'bitask_theme',
        btn: null,
        iconLight: '/assets/Light.png',
        iconDark: '/assets/Dark.png',
        darkIconClass: 'filter-[brightness(0)_saturate(100%)_invert(76%)_sepia(11%)_saturate(286%)_hue-rotate(170deg)_brightness(90%)_contrast(90%)]',

        _getStoredTheme() {
            try {
                return localStorage.getItem(this.storageKey) || 'dark';
            } catch (error) {
                return 'dark';
            }
        },

        _saveTheme(theme) {
            try {
                localStorage.setItem(this.storageKey, theme);
            } catch (error) {
                // Ignorado: entornos sin acceso a storage
            }
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
            this._updateIconTint(safeTheme);
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

        _updateIconTint(activeTheme) {
            const icons = document.querySelectorAll('.icon-tint');
            icons.forEach((icon) => {
                const shouldDarkFilter = activeTheme !== 'light';
                icon.classList.toggle(this.darkIconClass, shouldDarkFilter);
            });
        }
    };

    // Pantalla de arranque (2s)
    const StartupSplash = {
        storageKey: 'bitask_startup_splash_token',
        ttlMs: 30 * 60 * 1000, // 30 minutos

        _isTokenValid() {
            try {
                const rawToken = localStorage.getItem(this.storageKey);
                if (!rawToken) return false;

                const parsed = JSON.parse(rawToken);
                return Boolean(parsed && parsed.expiresAt && Date.now() < parsed.expiresAt);
            } catch (error) {
                return false;
            }
        },

        _saveToken() {
            const token = { expiresAt: Date.now() + this.ttlMs };
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(token));
            } catch (error) {
                // Ignorado: entornos sin acceso a storage
            }
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
                        TerminalCore.lastCommand = rawValue;
                    }

                    TerminalCore.pipeline(rawValue);
                    e.target.value = "";
                }
            });
        }
    };

    // Controlador para el panel de añadir tarea
    const TaskAddPanel = {
        init(gui) {
            if (!gui.btnAdd || !gui.addPanel) return;

            gui.btnAdd.addEventListener('click', () => {
                UIManager.toggleGeneric(gui.addPanel);
                if (!gui.addPanel.classList.contains('hidden')) {
                    gui.inputName.focus();
                }
            });

            gui.btnConfirm.addEventListener('click', () => {
                const name = gui.inputName.value.trim();
                const priority = gui.selectPrio.value;
                if (name) {
                    TaskService.add(name, priority);
                    UIManager.renderTaskList(TaskService.getAll());
                    this._close(gui);
                }
            });

            gui.btnCancel.addEventListener('click', () => this._close(gui));

            gui.inputName.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') gui.btnConfirm.click();
            });
        },
        _close(gui) {
            gui.inputName.value = '';
            gui.addPanel.classList.add('hidden');
            gui.addPanel.classList.remove('flex');
        }
    };

    // Controlador para limpiar la lista
    const TaskClearControl = {
        init(btnClear) {
            if (!btnClear) return;
            btnClear.addEventListener('click', () => {
                if (confirm("¿Estás seguro de que quieres borrar todas las tareas?")) {
                    TaskService.hardReset();
                    UIManager.renderTaskList([]);
                }
            });
        }
    };

    // Controlador para la búsqueda de tareas
    const TaskSearchControl = {
        init(inputSearch) {
            if (!inputSearch) return;
            inputSearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const allTasks = TaskService.getAll();

                if (searchTerm === '') {
                    UIManager.renderTaskList(allTasks);
                } else {
                    const filteredTasks = allTasks.filter(task =>
                        task.text.toLowerCase().includes(searchTerm) ||
                        task.id.toString().includes(searchTerm)
                    );
                    UIManager.renderTaskList(filteredTasks);
                }
            });
        }
    };

    /** * 3. EJECUCIÓN DE INITS
     */

    // UI & Eventos
    StartupSplash.init(domElements.splash.panel);
    ThemeControl.init(domElements.theme.btn);
    TerminalUI.init(domElements.terminal);
    TerminalInputControl.init(domElements.terminal.input);
    TaskAddPanel.init(domElements.gui);
    TaskClearControl.init(domElements.gui.btnClear);
    TaskSearchControl.init(domElements.gui.inputSearch);
    UIManager.init(domElements.navigation);
    UIManager.switchTab('readme-file');

    // Motores Lógicos
    TerminalCore.init(domElements.terminal);
    Shortcuts.init();

    // Renderizado Inicial
    UIManager.renderTaskList(TaskService.getAll());
    if (domElements.navigation.manualContainer) {
        domElements.navigation.manualContainer.innerHTML = BITASK_MANUAL;
    }
    if (domElements.navigation.kanbanContainer) {
        domElements.navigation.kanbanContainer.innerHTML = BITASK_KANBAN;
    }

    console.log("V1.0 Oso de Anteojos: Todos los sistemas operativos y controladores listos.");
});
