
/**
 * BiTask - Terminal Core Engine [Pipeline Edition]
 */
const TerminalCore = {
    init(terminalDom) {
        // terminalDom es lo que app.js llama "domElements.terminal"
        this.input = terminalDom.input;
        this.panel = terminalDom.panel;
        this.btn = terminalDom.btn;

        if (this.btn) {
            this.btn.addEventListener('click', () => {
                if (typeof UIManager !== 'undefined' && UIManager.toggleTerminal) {
                    UIManager.toggleTerminal();
                }
            });
        }

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.pipeline(e.target.value);
                e.target.value = "";
            }
        });
    },
    /**
     * El Pipeline: El flujo de purificación del comando
     */
    pipeline(input) {
        // 1. LIMPIEZA: Regex para quitar espacios extra y dejarlo nítido
        const cleanInput = input.trim().replace(/\s+/g, ' ');
        if (!cleanInput) return;

        // 2. VALIDACIÓN DE PREFIJO: ¿Es un comando legal?
        const isGlobal = cleanInput.toLowerCase() === 'clear';
        const isSuite = cleanInput.toLowerCase().startsWith('/bitask');

        if (!isGlobal && !isSuite) {
            return this._err(cleanInput, "Formato inválido. Usa /bitask [comando]");
        }

        // 3. DESPACHO: Si es clear, va directo. Si es /bitask, entra a cirugía.
        if (isGlobal) return UIManager.clearTerminal();

        this.processSuite(cleanInput);
    },

    /**
     * Cirugía del comando /bitask
     */
    processSuite(raw) {
        // Buscamos qué flag está presente (la "primera parte" del comando)
        const foundFlag = Object.keys(Commands.registry).find(flag => raw.includes(flag));

        if (!foundFlag) {
            return this._err(raw, "Acción no identificada. Usa -a, -rm o -u.");
        }

        // Obtenemos el ID de acción (1: Add, 2: Remove, etc.)
        const actionId = Commands.registry[foundFlag]();

        // 4. EJECUCIÓN CON PRIORIDAD OBLIGATORIA
        this.execute(actionId, raw);
    },

    execute(actionId, raw) {
        const executionMap = {
            1: () => this.runAdd(raw),
            2: () => this.runRemove(raw),
            3: () => this.runUpdate(raw),
            4: () => this.runHelp()
        };

        if (executionMap[actionId]) executionMap[actionId]();
    },

    // --- MÉTODOS ESPECIALIZADOS ---

    runAdd(raw) {
        // Regex para extraer: [0] completo, [1] tarea entre comillas, [2] lo que sigue
        const parts = raw.match(/["'](.+?)["']\s*(.*)/);

        if (!parts) return this._err(raw, "Error: El formato debe ser: -a \"tarea\" -p [prioridad]");

        const taskText = parts[1];
        const remaining = parts[2].trim();

        // Buscamos la prioridad obligatoria después de las comillas
        const prioMatch = remaining.match(/^-(?:p|priority)\s+(alta|media|baja)/i);

        if (!prioMatch) {
            return this._err(raw, "¡Prioridad Obligatoria! Añade -p [alta|media|baja] al final.");
        }

        const priority = prioMatch[1].toLowerCase();

        // Acción final
        const newTask = TaskService.add(taskText, priority);
        UIManager.renderTaskList(TaskService.getAll());
        UIManager.printTerminalLine(raw, `<span class="success">OK:</span> Tarea creada con éxito.`);
    },

    runRemove(raw) {
        const idMatch = raw.match(/\d+/);
        if (!idMatch) return this._err(raw, "Indica el ID para eliminar.");

        if (TaskService.delete(parseInt(idMatch[0]))) {
            UIManager.renderTaskList(TaskService.getAll());
            UIManager.printTerminalLine(raw, "Tarea eliminada correctamente.");
        }
    },

    runUpdate(raw) {
        const idMatch = raw.match(/\d+/);
        const nameMatch = raw.match(/-n\s+["'](.+?)["']/);
        const prioMatch = raw.match(/-p\s+(\w+)/);

        if (!idMatch) return this._err(raw, "Falta ID");

        const updates = {};
        if (nameMatch) updates.text = nameMatch[1];
        if (prioMatch) updates.priority = prioMatch[1];

        if (TaskService.update(parseInt(idMatch[0]), updates)) {
            UIManager.renderTaskList(TaskService.getAll());
            UIManager.printTerminalLine(raw, "Tarea actualizada.");
        } else {
            this._err(raw, "Error al actualizar");
        }
    },

    runHelp() {
        UIManager.printTerminalLine('/bitask', `
            Guía rápida:<br>
            -a "tarea" -p alta<br>
            -rm [id]<br>
            -u [id] -n "nuevo"<br>
            clear
        `);
    },

    _err(input, msg) {
        UIManager.printTerminalLine(input, `<span class="error">ERROR:</span> ${msg}`);
    }
};