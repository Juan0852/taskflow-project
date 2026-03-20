import { TaskService } from '../../domain/tasks/task-service.js';
import { UIManager } from '../../ui-manager.js';
import { TaskPanelView } from './task-panel.view.js';
import { TaskPanelService } from './task-panel.service.js';
import { TaskPanelViewModel } from './task-panel.viewmodel.js';

export const TaskAddPanel = {
    init(gui, services = {}) {
        if (!gui.btnAdd || !gui.addPanel) return;
        this.dialogService = services.dialogService || null;
        TaskPanelView.enhanceSelectFields(gui);
        this.bindEvents(gui);
    },

    bindEvents(gui) {
        gui.btnAdd.addEventListener('click', () => this.handleToggleClick(gui));
        gui.btnConfirm.addEventListener('click', () => this.handleConfirmClick(gui));
        gui.btnCancel.addEventListener('click', () => this.handleCancelClick(gui));
        gui.addPanelClose?.addEventListener('click', () => this.handleCancelClick(gui));
        gui.addPanelBackdrop?.addEventListener('click', () => this.handleCancelClick(gui));
        gui.inputName.addEventListener('keypress', (event) => this.handleNameKeyPress(event, gui));
    },

    async handleToggleClick(gui) {
        if (TaskPanelViewModel.isOpen(gui)) {
            this.close(gui);
            return;
        }

        if (TaskPanelService.isGuestMode() && TaskPanelService.getGuestSlotsRemaining() <= 0) {
            if (this.dialogService) {
                await this.dialogService.alert({
                    title: 'No puedes crear más tareas',
                    message: 'Ya usaste tus 2 tareas de invitado. Inicia sesión para seguir creando y guardando tareas en tu perfil.',
                    confirmText: 'Entendido',
                    eyebrow: 'Tareas'
                });
            }
            return;
        }

        await this.openForCreate(gui);
    },

    async handleConfirmClick(gui) {
        const payload = TaskPanelViewModel.buildTaskPayload(gui);
        if (!TaskPanelViewModel.canSubmit(payload)) return;

        try {
            const didSubmit = await TaskPanelService.submitTask(TaskPanelViewModel.getSubmitContext(payload));
            if (!didSubmit) return;

            UIManager.renderTaskList(TaskService.getAll());
            this.close(gui);

            if (TaskPanelService.isGuestMode() && this.dialogService) {
                const remainingGuestSlots = TaskPanelService.getGuestSlotsRemaining();
                await this.dialogService.alert({
                    title: remainingGuestSlots > 0 ? 'Tarea creada en modo invitado' : 'Límite de invitado alcanzado',
                    message: remainingGuestSlots > 0
                        ? `Puedes crear ${remainingGuestSlots} tarea(s) más sin iniciar sesión.`
                        : 'Ya usaste tus 2 tareas de invitado. Inicia sesión para crear más y guardarlas en tu perfil.',
                    confirmText: 'Entendido',
                    eyebrow: 'Tareas'
                });
            }
        } catch (error) {
            if (this.dialogService) {
                await this.dialogService.alert({
                    title: 'No se pudo guardar la tarea',
                    message: error.payload?.message || error.message || 'La operación de tareas falló.',
                    confirmText: 'Entendido',
                    eyebrow: 'Tareas'
                });
            }
        }
    },

    handleCancelClick(gui) {
        this.close(gui);
    },

    async handleNameKeyPress(event, gui) {
        if (event.key === 'Enter') {
            await this.handleConfirmClick(gui);
        }
    },

    async openForCreate(gui) {
        TaskPanelViewModel.beginCreate();
        TaskPanelView.applyFormValues(gui, TaskPanelViewModel.getDefaultFormValues({
            isGuestMode: TaskPanelService.isGuestMode(),
            remainingGuestSlots: TaskPanelService.getGuestSlotsRemaining()
        }));
        TaskPanelView.open(gui);
        TaskPanelView.focusForCreate(gui);
        TaskPanelView.renderTypeSuggestions(gui, await TaskPanelService.getAvailableTypes());
    },

    async openForEdit(gui, task) {
        TaskPanelViewModel.beginEdit(task);
        TaskPanelView.applyFormValues(gui, TaskPanelViewModel.getEditFormValues(task));
        TaskPanelView.open(gui);
        TaskPanelView.focusForEdit(gui);
        TaskPanelView.renderTypeSuggestions(gui, await TaskPanelService.getAvailableTypes());
    },

    close(gui) {
        TaskPanelViewModel.resetState();
        TaskPanelView.applyFormValues(gui, TaskPanelViewModel.getDefaultFormValues());
        TaskPanelView.close(gui);
    }
};
