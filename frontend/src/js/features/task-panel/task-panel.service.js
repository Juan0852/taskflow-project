import { AuthService } from '../../domain/auth/auth-service.js';
import { TaskService } from '../../domain/tasks/task-service.js';
import { TaskApiService } from '../../domain/tasks/task-api-service.js';

export const TaskPanelService = {
    MAX_GUEST_TASKS: 2,

    getGuestTaskCount() {
        return TaskService.getGuestTasks().length;
    },

    getGuestSlotsRemaining() {
        return Math.max(0, this.MAX_GUEST_TASKS - this.getGuestTaskCount());
    },

    isGuestMode() {
        return !AuthService.isLoggedIn();
    },

    async submitTask({ mode, editingTaskId, payload }) {
        if (!payload?.text) return false;

        if (mode === 'edit' && editingTaskId !== null) {
            if (typeof editingTaskId === 'string') {
                const updatedTask = await TaskApiService.updateTask(editingTaskId, payload);
                TaskService.upsert(updatedTask);
                return updatedTask;
            }

            return TaskService.update(editingTaskId, payload);
        }

        if (!AuthService.isLoggedIn()) {
            if (this.getGuestTaskCount() >= this.MAX_GUEST_TASKS) {
                const error = new Error('Tienes que iniciar sesión para crear más tareas.');
                error.code = 'AUTH_REQUIRED_FOR_MORE_TASKS';
                throw error;
            }

            return TaskService.add(payload.text, payload.priority, payload.type, payload.status);
        }

        const createdTask = await TaskApiService.createTask(payload);
        TaskService.upsert(createdTask);
        return createdTask;
    },

    async getAvailableTypes() {
        try {
            const response = await TaskApiService.getTaskTypes({ limit: 10 });
            return response.items;
        } catch (_error) {
            return TaskService.getAvailableTypes();
        }
    },

    async syncGuestTasksToBackend() {
        if (!AuthService.isLoggedIn()) {
            return { syncedCount: 0 };
        }

        const guestTasks = TaskService.getGuestTasks();
        if (!guestTasks.length) {
            return { syncedCount: 0 };
        }

        const createdTasks = [];

        for (const guestTask of guestTasks) {
            const createdTask = await TaskApiService.createTask({
                text: guestTask.text,
                priority: guestTask.priority,
                type: guestTask.type,
                status: guestTask.status
            });
            createdTasks.push(createdTask);
        }

        TaskService.clearGuestTasks();
        createdTasks.forEach(task => TaskService.upsert(task));

        return { syncedCount: createdTasks.length };
    }
};
