import { TaskPriority, TaskStatus } from '@prisma/client';
import { TaskResponseDTO } from './task.response.dto.js';

const statusToDbMap = {
    pendiente: TaskStatus.PENDING,
    haciendo: TaskStatus.IN_PROGRESS,
    completado: TaskStatus.COMPLETED
};

const statusFromDbMap = {
    [TaskStatus.PENDING]: 'pendiente',
    [TaskStatus.IN_PROGRESS]: 'haciendo',
    [TaskStatus.COMPLETED]: 'completado'
};

const priorityToDbMap = {
    baja: TaskPriority.LOW,
    media: TaskPriority.MEDIUM,
    alta: TaskPriority.HIGH
};

const priorityFromDbMap = {
    [TaskPriority.LOW]: 'baja',
    [TaskPriority.MEDIUM]: 'media',
    [TaskPriority.HIGH]: 'alta'
};

function toISODate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const TaskMapper = {
    toDbStatus(status) {
        return status ? statusToDbMap[status] : undefined;
    },

    toDbPriority(priority) {
        return priority ? priorityToDbMap[priority] : undefined;
    },

    toCreateEntity(userId, payload) {
        return {
            userId,
            text: payload.text,
            type: payload.type?.trim().toLowerCase() || 'general',
            status: statusToDbMap[payload.status ?? 'pendiente'],
            priority: priorityToDbMap[payload.priority ?? 'media']
        };
    },

    toUpdateEntity(payload) {
        const data = {};

        if (typeof payload.text === 'string') {
            data.text = payload.text;
        }

        if (typeof payload.type === 'string') {
            data.type = payload.type.trim().toLowerCase() || 'general';
        }

        if (payload.status) {
            data.status = statusToDbMap[payload.status];
        }

        if (payload.priority) {
            data.priority = priorityToDbMap[payload.priority];
        }

        return data;
    },

    toResponseDTO(task) {
        return TaskResponseDTO.parseTask({
            id: task.id,
            text: task.text,
            type: task.type,
            status: statusFromDbMap[task.status],
            priority: priorityFromDbMap[task.priority],
            completedAt: task.completedAt ? task.completedAt.toISOString() : null,
            trashedAt: task.trashedAt ? task.trashedAt.toISOString() : null,
            createdAt: task.createdAt.toISOString(),
            updatedAt: task.updatedAt.toISOString(),
            createdDate: toISODate(task.createdAt)
        });
    },

    toTaskListResponseDTO(tasks, meta) {
        return TaskResponseDTO.parseTaskList({
            items: tasks.map((task) => this.toResponseDTO(task)),
            meta
        });
    },

    toTypesResponseDTO(types) {
        return TaskResponseDTO.parseTypes({
            items: types
        });
    },

    toBulkActionResponseDTO(count, message) {
        return TaskResponseDTO.parseBulkAction({
            ok: true,
            count,
            message
        });
    }
};
