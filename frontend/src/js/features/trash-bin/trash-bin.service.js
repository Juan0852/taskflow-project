import { TaskApiService } from '../../domain/tasks/task-api-service.js';
import { TaskService } from '../../domain/tasks/task-service.js';

export const TrashBinService = {
    async loadTrash(query = {}) {
        return TaskApiService.listTrash(query);
    },

    async restoreTask(taskId) {
        const restoredTask = await TaskApiService.restoreTask(taskId);
        TaskService.upsert(restoredTask);
        return restoredTask;
    },

    async emptyTrash() {
        return TaskApiService.emptyTrash();
    }
};
