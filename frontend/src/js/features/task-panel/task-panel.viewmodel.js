export const TaskPanelViewModel = {
    mode: 'create',
    editingTaskId: null,
    GUEST_TASK_LIMIT: 2,

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

    getDefaultFormValues(options = {}) {
        const {
            isGuestMode = false,
            remainingGuestSlots = this.GUEST_TASK_LIMIT
        } = options;

        const modalDescription = isGuestMode
            ? remainingGuestSlots > 0
                ? `Puedes crear ${remainingGuestSlots} tarea(s) más sin iniciar sesión. Después tendrás que entrar para seguir guardando tareas en tu perfil.`
                : 'Ya usaste tus tareas de invitado. Inicia sesión para seguir creando y guardando tareas.'
            : 'Organiza el trabajo con un lightbox limpio donde la descripción, el tipo, la prioridad y el estado quedan bien delimitados.';

        return {
            name: '',
            type: '',
            status: 'pendiente',
            priority: 'media',
            confirmText: 'Añadir tarea',
            modalTitle: 'Nueva tarea',
            modalDescription
        };
    },

    getEditFormValues(task) {
        return {
            name: task.text,
            type: task.type,
            status: task.status,
            priority: task.priority,
            confirmText: 'Guardar cambios',
            modalTitle: 'Editar tarea',
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
