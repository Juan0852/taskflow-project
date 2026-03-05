// app.js - El Iniciador
document.addEventListener('DOMContentLoaded', () => {

    /** * 1. MAPEO DE ELEMENTOS DEL DOM
     */
    const domElements = {
        terminal: {
            btn: document.getElementById('tool-terminal'),
            panel: document.getElementById('terminal-file'),
            input: document.getElementById('cli-input')
        },
        navigation: {
            links: document.querySelectorAll('.file-link')
        },
        gui: {
            btnAdd: document.getElementById('btn-add-gui'),
            btnClear: document.getElementById('btn-clear-gui'),
            // Referencias del nuevo formulario (PanelAddControl)
            addPanel: document.getElementById('gui-add-panel'),
            inputName: document.getElementById('gui-task-name'),
            selectPrio: document.getElementById('gui-task-priority'),
            btnConfirm: document.getElementById('btn-confirm-add'),
            btnCancel: document.getElementById('btn-cancel-add')
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
                    TaskService.clearAll();
                    UIManager.renderTaskList([]);
                }
            });
        }
    };

    /** * 3. EJECUCIÓN DE INITS
     */

    // UI & Eventos
    TerminalUI.init(domElements.terminal);
    TaskAddPanel.init(domElements.gui);
    TaskClearControl.init(domElements.gui.btnClear);
    UIManager.init(domElements.navigation);
    Shortcuts.init();

    // Motores Lógicos
    TerminalCore.init(domElements.terminal);

    // Renderizado Inicial
    UIManager.renderTaskList(TaskService.getAll());

    console.log("V1.0 Oso de Anteojos: Todos los sistemas operativos y controladores listos.");
});