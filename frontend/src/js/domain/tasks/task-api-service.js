import { AppConfig } from '../../shared/config.js';
import { CreateTaskRequestDTO } from './dtos/create-task.request.dto.js';
import { UpdateTaskRequestDTO } from './dtos/update-task.request.dto.js';
import { ListTasksQueryDTO } from './dtos/list-tasks.query.dto.js';
import { TaskResponseDTO } from './dtos/task.response.dto.js';
import { TaskListResponseDTO } from './dtos/task-list.response.dto.js';
import { TaskActionResponseDTO } from './dtos/task-action.response.dto.js';
import { TaskTypesResponseDTO } from './dtos/task-types.response.dto.js';

const TASKS_BASE_URL = `${AppConfig.apiBaseUrl}/tasks`;

function buildQueryString(query = {}) {
    const searchParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        searchParams.set(key, String(value));
    });

    const result = searchParams.toString();
    return result ? `?${result}` : '';
}

async function request(path = '', options = {}) {
    const response = await fetch(`${TASKS_BASE_URL}${path}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
        ? await response.json()
        : null;

    if (!response.ok) {
        const error = new Error(payload?.message || 'La solicitud de tareas falló.');
        error.status = response.status;
        error.code = payload?.code || 'TASK_REQUEST_FAILED';
        error.payload = payload;
        throw error;
    }

    return payload;
}

export const TaskApiService = {
    async listTasks(query = {}) {
        const parsedQuery = ListTasksQueryDTO.parse(query);
        const response = await request(buildQueryString(parsedQuery), {
            method: 'GET'
        });

        return TaskListResponseDTO.parse(response);
    },

    async createTask(payload) {
        const parsedPayload = CreateTaskRequestDTO.parse(payload);
        const response = await request('', {
            method: 'POST',
            body: JSON.stringify(parsedPayload)
        });

        return TaskResponseDTO.parse(response);
    },

    async updateTask(taskId, payload) {
        const parsedPayload = UpdateTaskRequestDTO.parse(payload);
        const response = await request(`/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify(parsedPayload)
        });

        return TaskResponseDTO.parse(response);
    },

    async deleteTask(taskId) {
        const response = await request(`/${taskId}`, {
            method: 'DELETE'
        });

        return TaskActionResponseDTO.parse(response);
    },

    async moveTaskToTrash(taskId) {
        const response = await request(`/${taskId}/trash`, {
            method: 'PATCH'
        });

        return TaskResponseDTO.parse(response);
    },

    async listTrash(query = {}) {
        const parsedQuery = ListTasksQueryDTO.parse(query);
        const response = await request(`/trash${buildQueryString(parsedQuery)}`, {
            method: 'GET'
        });

        return TaskListResponseDTO.parse(response);
    },

    async restoreTask(taskId) {
        const response = await request(`/${taskId}/restore`, {
            method: 'PATCH'
        });

        return TaskResponseDTO.parse(response);
    },

    async emptyTrash() {
        const response = await request('/bulk/delete-trash', {
            method: 'DELETE'
        });

        return TaskActionResponseDTO.parse(response);
    },

    async completeAllTasks() {
        const response = await request('/bulk/complete-all', {
            method: 'PATCH'
        });

        return TaskActionResponseDTO.parse(response);
    },

    async trashCompletedTasks() {
        const response = await request('/bulk/trash-completed', {
            method: 'PATCH'
        });

        return TaskActionResponseDTO.parse(response);
    },

    async trashAllTasks() {
        const response = await request('/bulk/trash-all', {
            method: 'PATCH'
        });

        return TaskActionResponseDTO.parse(response);
    },

    async getTaskTypes(query = {}) {
        const response = await request(`/types${buildQueryString(query)}`, {
            method: 'GET'
        });

        return TaskTypesResponseDTO.parse(response);
    }
};
