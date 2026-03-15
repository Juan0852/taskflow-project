import { TaskService } from '../../domain/tasks/task-service.js';

export const TaskPanelViewModel = {
    mode: 'create',
    editingTaskId: null,

    isOpen(gui) {
        return !gui.addPanel.classList.contains('hidden');
    },

    resetState() {
        this.mode = 'create';
        this.editingTaskId = null;
    },

    beginCreate() {
        this.mode = 'create';
        this.editingTaskId = null;
    },

    beginEdit(task) {
        this.mode = 'edit';
        this.editingTaskId = task.id;
    },

    getDefaultFormValues() {
        return {
            name: '',
            type: '',
            status: TaskService.DEFAULT_STATUS,
            priority: 'media',
            confirmText: 'Añadir Tarea'
        };
    },

    getEditFormValues(task) {
        return {
            name: task.text,
            type: task.type,
            status: task.status,
            priority: task.priority,
            confirmText: 'Guardar Cambios'
        };
    },

    buildTaskPayload(gui) {
        return {
            text: gui.inputName.value.trim(),
            priority: gui.selectPrio.value,
            type: gui.inputType.value.trim(),
            status: gui.selectStatus.value
        };
    },

    submitTask(payload) {
        if (!payload.text) return false;

        if (this.mode === 'edit' && this.editingTaskId !== null) {
            TaskService.update(this.editingTaskId, payload);
            return true;
        }

        TaskService.add(payload.text, payload.priority, payload.type, payload.status);
        return true;
    }
};
