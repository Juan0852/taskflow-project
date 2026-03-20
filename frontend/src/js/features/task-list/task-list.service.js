import { TaskService } from '../../domain/tasks/task-service.js';
import { TaskApiService } from '../../domain/tasks/task-api-service.js';

export const TaskListService = {
    async loadTasks(query = {}) {
        const response = await TaskApiService.listTasks(query);
        TaskService.replaceAll(response.items);
        return response;
    },

    getAllTasks() {
        return TaskService.getAll();
    },

    getAvailableTypes() {
        return TaskService.getAvailableTypes();
    },

    getTaskById(taskId) {
        return TaskService.getAll().find((task) => task.id === taskId) || null;
    },

    async moveTaskToTrash(taskId) {
        if (typeof taskId === 'string') {
            const response = await TaskApiService.moveTaskToTrash(taskId);
            TaskService.delete(taskId);
            return response;
        }

        const didDelete = TaskService.delete(taskId);

        return {
            ok: didDelete,
            message: didDelete ? 'La tarea se movió a la papelera local.' : 'No se pudo mover la tarea a la papelera.'
        };
    },

    getTaskDefaults() {
        return {
            type: TaskService.DEFAULT_TYPE,
            status: TaskService.DEFAULT_STATUS
        };
    }
};
