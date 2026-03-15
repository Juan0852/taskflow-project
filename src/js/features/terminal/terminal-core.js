/**
 * BiTask - Terminal Core Engine [Pipeline Edition]
 */
import { Commands } from './terminal-commands.js';
import { TaskService } from '../../domain/tasks/task-service.js';
import { HELP_TERMINAL } from '../../innerhtmls.js';
import { UIManager } from '../../ui-manager.js';

export const TerminalCore = {

    lastCommand: "", // Nuestra "memoria" interna
    errorCount: 0,
    personalizationService: null,

    init(terminalDom, services = {}) {
        this.input = terminalDom.input;
        this.panel = terminalDom.panel;
        this.btn = terminalDom.btn;
        this.personalizationService = services.personalizationService || null;
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
        const foundFlag = Object.keys(Commands.registry)
            .sort((a, b) => b.length - a.length)
            .find(flag => raw.toLowerCase().includes(flag.toLowerCase()));

        if (!foundFlag) {
            return this._err(raw, "Acción no identificada. Usa -a, -rm, -u, -ca, -cla, -clc o -cfg.");
        }

        const actionId = Commands.registry[foundFlag]();
        this.execute(actionId, raw);
    },

    execute(actionId, raw) {
        const executionMap = {
            1: () => this.runAdd(raw),
            2: () => this.runRemove(raw),
            3: () => this.runUpdate(raw),
            4: () => this.runHelp(),
            6: () => this.runCompleteAll(raw),
            7: () => this.runClearAll(raw),
            8: () => this.runClearCompleted(raw),
            9: () => this.runConfig(raw)
        };

        if (executionMap[actionId]) executionMap[actionId]();
    },

    // --- MÉTODOS ESPECIALIZADOS ---

    _extractQuotedValue(raw, flagName) {
        const quotedMatch = raw.match(new RegExp(`-(?:${flagName})\\s+["'](.+?)["']`, 'i'));
        if (quotedMatch) return quotedMatch[1];

        const singleWordMatch = raw.match(new RegExp(`-(?:${flagName})\\s+([^\\s]+)`, 'i'));
        return singleWordMatch ? singleWordMatch[1] : '';
    },

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
        const type = this._extractQuotedValue(raw, 't|type');
        const status = this._extractQuotedValue(raw, 's|status');
        TaskService.add(taskText, priority, type, status);
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
        const type = this._extractQuotedValue(raw, 't|type');
        const status = this._extractQuotedValue(raw, 's|status');

        if (!idMatch) return this._err(raw, "Falta ID");

        const updates = {};
        if (nameMatch) updates.text = nameMatch[1];
        if (prioMatch) updates.priority = prioMatch[1].toLowerCase();
        if (type) updates.type = type;
        if (status) updates.status = status;

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

    runCompleteAll(raw) {
        const updatedCount = TaskService.markAllAsCompleted();
        UIManager.renderTaskList(TaskService.getAll());
        this._markSuccess();

        if (updatedCount === 0) {
            UIManager.printTerminalLine(raw, 'Todas las tareas ya estaban marcadas como completadas.');
            return;
        }

        UIManager.printTerminalLine(raw, `Se marcaron ${updatedCount} tarea(s) como completadas.`);
    },

    runClearAll(raw) {
        const totalTasks = TaskService.getAll().length;
        TaskService.hardReset();
        UIManager.renderTaskList(TaskService.getAll());
        this._markSuccess();
        UIManager.printTerminalLine(raw, `Se borraron ${totalTasks} tarea(s).`);
    },

    runClearCompleted(raw) {
        const removedCount = TaskService.clearCompleted();
        UIManager.renderTaskList(TaskService.getAll());
        this._markSuccess();

        if (removedCount === 0) {
            UIManager.printTerminalLine(raw, 'No había tareas completadas para borrar.');
            return;
        }

        UIManager.printTerminalLine(raw, `Se borraron ${removedCount} tarea(s) completada(s).`);
    },

    runConfig(raw) {
        if (!this.personalizationService) {
            return this._err(raw, 'La personalización no está disponible en este momento.');
        }

        const tokens = raw.trim().split(/\s+/);
        const actionIndex = tokens.findIndex(token => ['-cfg', '-config', 'config', 'configuraciones'].includes(token.toLowerCase()));
        const scope = tokens[actionIndex + 1]?.toLowerCase();
        const target = tokens[actionIndex + 2]?.toLowerCase();
        const stateToken = tokens[actionIndex + 3]?.toLowerCase() || tokens[actionIndex + 2]?.toLowerCase();
        const isEnabled = stateToken === 'on' || stateToken === 'true';
        const isDisabled = stateToken === 'off' || stateToken === 'false';

        if (!scope) {
            return this._err(raw, 'Usa /bitask config [buttons|filters|calendar] [list|target] [on|off].');
        }

        if (['button', 'buttons'].includes(scope) && target === 'list') {
            this._markSuccess();
            UIManager.printTerminalLine(raw, this._formatConfigList('Botones disponibles', [
                'add',
                'edit',
                'clear',
                'completeAll',
                'clearCompleted'
            ]));
            return;
        }

        if (['filter', 'filters'].includes(scope) && target === 'list') {
            this._markSuccess();
            UIManager.printTerminalLine(raw, this._formatConfigList('Filtros disponibles', [
                'row',
                'name',
                'types',
                'multiSort'
            ]));
            return;
        }

        if (scope === 'calendar' && (!target || target === 'list')) {
            this._markSuccess();
            UIManager.printTerminalLine(raw, this._formatConfigList('Opciones de calendario', [
                'calendar on',
                'calendar off'
            ]));
            return;
        }

        if (scope === 'config' && target === 'list') {
            this._markSuccess();
            UIManager.printTerminalLine(raw, this._formatConfigList('Áreas configurables', [
                'buttons list',
                'filters list',
                'calendar list'
            ]));
            return;
        }

        if (!isEnabled && !isDisabled) {
            return this._err(raw, 'Usa /bitask config [buttons|filters|calendar] [target] [on|off] o ... list.');
        }

        if (['button', 'buttons'].includes(scope)) {
            const controlMap = {
                add: 'add-task',
                edit: 'edit-selected-task',
                clear: 'clear-tasks',
                completeall: 'complete-all-tasks',
                clearcompleted: 'clear-completed-tasks'
            };
            const controlId = controlMap[target];
            if (!controlId) {
                return this._err(raw, 'Botón no reconocido. Usa add, edit, clear, completeAll o clearCompleted.');
            }
            this.personalizationService.setControlVisibility(controlId, isEnabled);
            UIManager.renderTaskList(TaskService.getAll());
            this._markSuccess();
            UIManager.printTerminalLine(raw, `Botón ${target} ${isEnabled ? 'activado' : 'ocultado'}.`);
            return;
        }

        if (['filter', 'filters'].includes(scope)) {
            if (!target) {
                return this._err(raw, 'Usa /bitask config filters [row|name|types|multiSort] [on|off] o list.');
            }
            const filterMap = {
                row: 'showFiltersRow',
                name: 'showNameSearch',
                types: 'showTypeFilters',
                multisort: 'allowMultipleSortRules'
            };
            const preferenceKey = filterMap[target];
            if (!preferenceKey) {
                return this._err(raw, 'Filtro no reconocido. Usa row, name, types o multiSort.');
            }
            this.personalizationService.setFilterPreference(preferenceKey, isEnabled);
            this._markSuccess();
            UIManager.printTerminalLine(raw, `Filtro ${target} ${isEnabled ? 'activado' : 'desactivado'}.`);
            return;
        }

        if (scope === 'calendar') {
            const success = this.personalizationService.setFilterPreference('showCalendarZone', isEnabled);
            if (!success) {
                return this._err(raw, 'No se pudo actualizar la zona de calendario.');
            }
            this._markSuccess();
            UIManager.printTerminalLine(raw, `Calendario ${isEnabled ? 'activado' : 'ocultado'}.`);
            return;
        }

        return this._err(raw, 'Config no reconocida. Usa buttons, filters o calendar.');
    },

    _formatConfigList(title, items) {
        const rows = items.map(item => `- ${item}`).join('<br>');
        return `<span class="info text-[var(--color-accent-info)]">${title}:</span><br>${rows}`;
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
