import { TaskService } from '../../domain/tasks/task-service.js';
import { UIManager } from '../../ui-manager.js';
import { TaskPanelView } from './task-panel.view.js';
import { TaskPanelViewModel } from './task-panel.viewmodel.js';

export const TaskAddPanel = {
    init(gui) {
        if (!gui.btnAdd || !gui.addPanel) return;
        this.bindEvents(gui);
    },

    bindEvents(gui) {
        gui.btnAdd.addEventListener('click', () => this.handleToggleClick(gui));
        gui.btnConfirm.addEventListener('click', () => this.handleConfirmClick(gui));
        gui.btnCancel.addEventListener('click', () => this.handleCancelClick(gui));
        gui.inputName.addEventListener('keypress', (event) => this.handleNameKeyPress(event, gui));
    },

    handleToggleClick(gui) {
        if (TaskPanelViewModel.isOpen(gui)) {
            this.close(gui);
            return;
        }

        this.openForCreate(gui);
    },

    handleConfirmClick(gui) {
        const payload = TaskPanelViewModel.buildTaskPayload(gui);
        const didSubmit = TaskPanelViewModel.submitTask(payload);
        if (!didSubmit) return;

        UIManager.renderTaskList(TaskService.getAll());
        this.close(gui);
    },

    handleCancelClick(gui) {
        this.close(gui);
    },

    handleNameKeyPress(event, gui) {
        if (event.key === 'Enter') {
            this.handleConfirmClick(gui);
        }
    },

    openForCreate(gui) {
        TaskPanelViewModel.beginCreate();
        TaskPanelView.applyFormValues(gui, TaskPanelViewModel.getDefaultFormValues());
        TaskPanelView.open(gui);
        TaskPanelView.focusForCreate(gui);
    },

    openForEdit(gui, task) {
        TaskPanelViewModel.beginEdit(task);
        TaskPanelView.applyFormValues(gui, TaskPanelViewModel.getEditFormValues(task));
        TaskPanelView.open(gui);
        TaskPanelView.focusForEdit(gui);
    },

    close(gui) {
        TaskPanelViewModel.resetState();
        TaskPanelView.applyFormValues(gui, TaskPanelViewModel.getDefaultFormValues());
        TaskPanelView.close(gui);
    }
};
