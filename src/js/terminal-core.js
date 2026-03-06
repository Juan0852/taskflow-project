/**
 * BiTask - Terminal Core Engine [Pipeline Edition]
 */
import { Commands } from './commands.js';
import { HELP_TERMINAL } from './innerhtmls.js';
import { TaskService } from './task-service.js';
import { UIManager } from './ui-manager.js';

export const TerminalCore = {

    lastCommand: "", // Nuestra "memoria" interna
    errorCount: 0,

    init(terminalDom) {
        this.input = terminalDom.input;
        this.panel = terminalDom.panel;
        this.btn = terminalDom.btn;
    },

    /**
     * Recupera el último comando al input (Se llamará desde la fecha de arriba)
     */
    restoreLastCommand() {
        if (this.lastCommand && this.input) {
            this.input.value = this.lastCommand;
            this.input.focus();
            const len = this.input.value.length;
            this.input.setSelectionRange(len, len);
        }
    },

    pipeline(input) {
        const cleanInput = input.trim().replace(/\s+/g, ' ');
        if (!cleanInput) return;

        const isGlobal = cleanInput.toLowerCase() === 'clear';
        const isSuite = cleanInput.toLowerCase().startsWith('/bitask');

        if (!isGlobal && !isSuite) {
            return this._err(cleanInput, "Formato inválido. Usa /bitask [comando]");
        }

        if (isGlobal) {
            this._markSuccess();
            return UIManager.clearTerminal();
        }

        this.processSuite(cleanInput);
    },

    processSuite(raw) {
        const foundFlag = Object.keys(Commands.registry).find(flag => raw.includes(flag));

        if (!foundFlag) {
            return this._err(raw, "Acción no identificada. Usa -a, -rm o -u.");
        }

        const actionId = Commands.registry[foundFlag]();
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
        const parts = raw.match(/["'](.+?)["']\s*(.*)/);
        if (!parts) return this._err(raw, "Error: El formato debe ser: -a \"tarea\" -p [prioridad]");

        const taskText = parts[1];
        const remaining = parts[2].trim();
        const prioMatch = remaining.match(/^-(?:p|priority)\s+(alta|media|baja)/i);

        if (!prioMatch) {
            return this._err(raw, "¡Prioridad Obligatoria! Añade -p [alta|media|baja] al final.");
        }

        const priority = prioMatch[1].toLowerCase();
        TaskService.add(taskText, priority);
        UIManager.renderTaskList(TaskService.getAll());
        this._markSuccess();
        UIManager.printTerminalLine(raw, `<span class="success text-[var(--mac-green)]">OK:</span> Tarea creada con éxito.`);
    },

    runRemove(raw) {
        const idMatch = raw.match(/\d+/);
        if (!idMatch) return this._err(raw, "Indica el ID para eliminar.");

        if (TaskService.delete(parseInt(idMatch[0]))) {
            UIManager.renderTaskList(TaskService.getAll());
            this._markSuccess();
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
            this._markSuccess();
            UIManager.printTerminalLine(raw, "Tarea actualizada.");
        } else {
            this._err(raw, "Error al actualizar");
        }
    },

    runHelp() {
        // 1. Imprime la guía rápida en la terminal
        this._markSuccess();
        UIManager.printTerminalLine('/bitask -help', HELP_TERMINAL);

        // 2. Lanza el manual visual en el editor principal
        if (UIManager.showHelp) {
            UIManager.showHelp();
        }
    },

    _err(input, msg) {
        this.errorCount += 1;

        if (this.errorCount >= 5) {
            UIManager.printTerminalLine(
                input,
                `<span class="error text-[var(--mac-red)]">ERROR:</span> Bro mejor relajate, prepara un café y leete la documentacion del readme.md :)`
            );
            this.errorCount = 0;
            return;
        }

        UIManager.printTerminalLine(input, `<span class="error text-[var(--mac-red)]">ERROR:</span> ${msg}`);
    },

    _markSuccess() {
        this.errorCount = 0;
    }
};
