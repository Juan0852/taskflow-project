import { TaskService } from '../../domain/tasks/task-service.js';

export const KanbanBoardService = {
    getAllTasks() {
        return TaskService.getAll();
    },

    getTaskById(taskId) {
        return this.getAllTasks().find(task => task.id === taskId) || null;
    },

    moveTaskToStatus(taskId, nextStatus) {
        return TaskService.update(taskId, { status: nextStatus });
    },

    getTaskDefaults() {
        return {
            type: TaskService.DEFAULT_TYPE,
            status: TaskService.DEFAULT_STATUS
        };
    }
};
