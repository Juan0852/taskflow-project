import { TaskApiService } from '../../domain/tasks/task-api-service.js';
import { TaskService } from '../../domain/tasks/task-service.js';

export const KanbanBoardService = {
    getAllTasks() {
        return TaskService.getAll();
    },

    getTaskById(taskId) {
        return this.getAllTasks().find(task => task.id === taskId) || null;
    },

    async moveTaskToStatus(taskId, nextStatus) {
        if (typeof taskId === 'string') {
            const updatedTask = await TaskApiService.updateTask(taskId, { status: nextStatus });
            TaskService.upsert(updatedTask);
            return updatedTask;
        }

        return TaskService.update(taskId, { status: nextStatus });
    },

    getTaskDefaults() {
        return {
            type: TaskService.DEFAULT_TYPE,
            status: TaskService.DEFAULT_STATUS
        };
    }
};
