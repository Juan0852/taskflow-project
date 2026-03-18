import { TaskService } from '../../domain/tasks/task-service.js';

export const TaskListService = {
    getAllTasks() {
        return TaskService.getAll();
    },

    getAvailableTypes() {
        return TaskService.getAvailableTypes();
    },

    getTaskById(taskId) {
        return TaskService.getAll().find((task) => task.id === taskId) || null;
    },

    deleteTask(taskId) {
        return TaskService.delete(taskId);
    },

    getTaskDefaults() {
        return {
            type: TaskService.DEFAULT_TYPE,
            status: TaskService.DEFAULT_STATUS
        };
    }
};
