import { TaskService } from '../../domain/tasks/task-service.js';
import { UIManager } from '../../ui-manager.js';

export const TerminalService = {
    addTask(taskText, priority, type, status) {
        TaskService.add(taskText, priority, type, status);
        this.refreshVisibleTasks();
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

    completeAllTasks() {
        const updatedCount = TaskService.markAllAsCompleted();
        this.refreshVisibleTasks();
        return updatedCount;
    },

    clearAllTasks() {
        const totalTasks = TaskService.getAll().length;
        TaskService.hardReset();
        this.refreshVisibleTasks();
        return totalTasks;
    },

    clearCompletedTasks() {
        const removedCount = TaskService.clearCompleted();
        this.refreshVisibleTasks();
        return removedCount;
    },

    getAllTasks() {
        return TaskService.getAll();
    },

    refreshVisibleTasks() {
        if (typeof UIManager.refreshVisibleTasks === 'function') {
            UIManager.refreshVisibleTasks();
            return;
        }

        UIManager.renderTaskList(TaskService.getAll());
    }
};
