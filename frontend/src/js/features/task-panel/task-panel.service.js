import { TaskService } from '../../domain/tasks/task-service.js';

export const TaskPanelService = {
    submitTask({ mode, editingTaskId, payload }) {
        if (!payload?.text) return false;

        if (mode === 'edit' && editingTaskId !== null) {
            TaskService.update(editingTaskId, payload);
            return true;
        }

        TaskService.add(payload.text, payload.priority, payload.type, payload.status);
        return true;
    },

    getAvailableTypes() {
        return TaskService.getAvailableTypes();
    }
};
