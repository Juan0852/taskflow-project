import { UIManager } from '../../ui-manager.js';

export const TaskPanelView = {
    applyFormValues(gui, values) {
        gui.inputName.value = values.name;
        gui.inputType.value = values.type;
        gui.selectStatus.value = values.status;
        gui.selectPrio.value = values.priority;
        gui.btnConfirm.textContent = values.confirmText;
    },

    open(gui) {
        if (gui.addPanel.classList.contains('hidden')) {
            UIManager.toggleGeneric(gui.addPanel);
        }
    },

    close(gui) {
        gui.addPanel.classList.add('hidden');
        gui.addPanel.classList.remove('flex');
    },

    focusForCreate(gui) {
        gui.inputName.focus();
    },

    focusForEdit(gui) {
        gui.inputName.focus();
        gui.inputName.select();
    }
};
