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
            status: 'pendiente',
            priority: 'media',
            confirmText: 'Añadir tarea',
            modalTitle: 'Nueva tarea',
            modalDescription: 'Organiza el trabajo con un lightbox limpio donde la descripción, el tipo, la prioridad y el estado quedan bien delimitados.'
        };
    },

    getEditFormValues(task) {
        return {
            name: task.text,
            type: task.type,
            status: task.status,
            priority: task.priority,
            confirmText: 'Guardar cambios',
            modalTitle: `Editar tarea #${task.id}`,
            modalDescription: 'Ajusta la descripción o recategoriza la tarea sin perder el contexto del resto del IDE.'
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

    getSubmitContext(payload) {
        return {
            mode: this.mode,
            editingTaskId: this.editingTaskId,
            payload
        };
    },

    canSubmit(payload) {
        return Boolean(payload?.text);
    }
};
