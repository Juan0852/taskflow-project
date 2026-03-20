import { TaskListViewModel } from '../task-list/task-list.viewmodel.js';

export const TrashBinViewModel = {
    state: {
        items: [],
        selectedTaskId: null,
        loading: false
    },

    setLoading(listeners, isLoading) {
        listeners.state.loading = Boolean(isLoading);
    },

    setItems(listeners, items = []) {
        listeners.state.items = Array.isArray(items) ? items : [];

        if (!listeners.state.items.some(task => task.id === listeners.state.selectedTaskId)) {
            listeners.state.selectedTaskId = null;
        }
    },

    setSelectedTaskId(listeners, taskId) {
        listeners.state.selectedTaskId = taskId;
    },

    getSelectedTask(listeners) {
        return listeners.state.items.find(task => task.id === listeners.state.selectedTaskId) || null;
    },

    getEmptyStateText() {
        return 'La papelera está vacía. Aquí aparecerán las tareas que mandes a reciclaje.';
    },

    formatDateTime(value) {
        return TaskListViewModel.formatDisplayDateTime(value);
    },

    getDisplayIdMap(items) {
        return TaskListViewModel.buildDisplayIdMap(items);
    },

    getDisplayId(displayIdMap, taskId) {
        return TaskListViewModel.getDisplayId(displayIdMap, taskId);
    }
};
