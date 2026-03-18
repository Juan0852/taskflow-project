import { UIManager } from '../../ui-manager.js';
import { ComboboxField } from '../../shared/ui/combobox-field/combobox-field.js';
import { SelectField } from '../../shared/ui/select-field/select-field.js';

export const TaskPanelView = {
    applyFormValues(gui, values) {
        gui.inputName.value = values.name;
        gui.inputType.value = values.type;
        gui.selectStatus.value = values.status;
        gui.selectPrio.value = values.priority;
        SelectField.sync(gui.selectStatus);
        SelectField.sync(gui.selectPrio);
        gui.btnConfirm.textContent = values.confirmText;
        if (gui.addPanelTitle) {
            gui.addPanelTitle.textContent = values.modalTitle;
        }
        if (gui.addPanelDescription) {
            gui.addPanelDescription.textContent = values.modalDescription;
        }
    },

    renderTypeSuggestions(gui, types = []) {
        ComboboxField.setOptions(gui.inputType, types);
    },

    enhanceSelectFields(gui) {
        SelectField.enhance(gui.selectPrio);
        SelectField.enhance(gui.selectStatus);
        ComboboxField.enhance(gui.inputType);
    },

    open(gui) {
        gui.addPanel.classList.remove('hidden');
        gui.addPanel.classList.add('flex');
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
        gui.inputName.select?.();
    }
};
