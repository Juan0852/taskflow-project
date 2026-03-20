import { AuthService } from '../../domain/auth/auth-service.js';
import { TaskApiService } from '../../domain/tasks/task-api-service.js';
import { TaskService } from '../../domain/tasks/task-service.js';
import { UIManager } from '../../ui-manager.js';

export const TerminalService = {
    _buildAuthRequiredError(message) {
        const error = new Error(message);
        error.code = 'AUTH_REQUIRED_FOR_TRASH_ACTIONS';
        return error;
    },

    async addTask(taskText, priority, type, status) {
        TaskService.add(taskText, priority, type, status);
        await this.refreshVisibleTasks();
        return true;
    },

    removeTask(taskId) {
        const removed = TaskService.delete(taskId);
        if (removed) {
            this.refreshVisibleTasks();
        }
        return removed;
    },

    updateTask(taskId, updates) {
        const updated = TaskService.update(taskId, updates);
        if (updated) {
            this.refreshVisibleTasks();
        }
        return updated;
    },

    async completeAllTasks() {
        if (!AuthService.isLoggedIn()) {
            const updatedCount = TaskService.markAllAsCompleted();
            await this.refreshVisibleTasks();
            return updatedCount;
        }

        const response = await TaskApiService.completeAllTasks();
        await this.refreshVisibleTasks();
        return response.count || 0;
    },

    async clearAllTasks() {
        if (!AuthService.isLoggedIn()) {
            throw this._buildAuthRequiredError('Mandar todas las tareas a la papelera requiere iniciar sesión.');
        }

        const response = await TaskApiService.trashAllTasks();
        await this.refreshVisibleTasks();
        return response.count || 0;
    },

    async clearCompletedTasks() {
        if (!AuthService.isLoggedIn()) {
            throw this._buildAuthRequiredError('Mandar tareas completadas a la papelera requiere iniciar sesión.');
        }

        const response = await TaskApiService.trashCompletedTasks();
        await this.refreshVisibleTasks();
        return response.count || 0;
    },

    getAllTasks() {
        return TaskService.getAll();
    },

    async refreshVisibleTasks() {
        if (typeof UIManager.refreshVisibleTasks === 'function') {
            await UIManager.refreshVisibleTasks();
            return;
        }

        UIManager.renderTaskList(TaskService.getAll());
    }
};
