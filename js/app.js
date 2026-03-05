// app.js - El Iniciador
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
                    if (typeof UIManager !== 'undefined' && UIManager.toggleTerminal) {
                        UIManager.toggleTerminal(terminal.panel);
                    }
                });
            }
        }
    };

    // Controlador de tema Dark/Light
    const ThemeControl = {
        storageKey: 'bitask_theme',
        btn: null,
        iconSun:
            'data:image/svg+xml;utf8,' +
            encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f5c542"><circle cx="12" cy="12" r="5"/><g stroke="#f5c542" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="1.8" x2="12" y2="4.3"/><line x1="12" y1="19.7" x2="12" y2="22.2"/><line x1="1.8" y1="12" x2="4.3" y2="12"/><line x1="19.7" y1="12" x2="22.2" y2="12"/><line x1="4.6" y1="4.6" x2="6.4" y2="6.4"/><line x1="17.6" y1="17.6" x2="19.4" y2="19.4"/><line x1="4.6" y1="19.4" x2="6.4" y2="17.6"/><line x1="17.6" y1="6.4" x2="19.4" y2="4.6"/></g></svg>'),
        iconMoon:
            'data:image/svg+xml;utf8,' +
            encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8ea4c9"><path d="M15.9 2.7a9.5 9.5 0 1 0 5.4 16.8A8.3 8.3 0 0 1 15.9 2.7Z"/></svg>'),

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
        },

        _updateThemeButton(activeTheme) {
            if (!this.btn) return;

            // Si estoy en modo dark, muestro sol (acción siguiente: pasar a light).
            if (activeTheme === 'dark') {
                this.btn.src = this.iconSun;
                this.btn.alt = 'Cambiar a tema light';
                this.btn.title = 'Cambiar a tema light';
            } else {
                this.btn.src = this.iconMoon;
                this.btn.alt = 'Cambiar a tema dark';
                this.btn.title = 'Cambiar a tema dark';
            }
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

            splashPanel.classList.add('show');
            this._saveToken();

            setTimeout(() => {
                splashPanel.classList.add('hide');
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
                if (window.getComputedStyle(gui.addPanel).display !== 'none') {
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
            gui.addPanel.style.display = 'none';
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
    if (domElements.navigation.manualContainer && typeof BITASK_MANUAL !== 'undefined') {
        domElements.navigation.manualContainer.innerHTML = BITASK_MANUAL;
    }
    if (domElements.navigation.kanbanContainer && typeof BITASK_KANBAN !== 'undefined') {
        domElements.navigation.kanbanContainer.innerHTML = BITASK_KANBAN;
    }

    console.log("V1.0 Oso de Anteojos: Todos los sistemas operativos y controladores listos.");
});
