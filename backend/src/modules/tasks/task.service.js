import { TaskMapper } from './task.mapper.js';
import { TaskRepository } from './task.repository.js';
import { TaskNotFoundError } from './errors/task-not-found.error.js';
import { TaskAlreadyTrashedError } from './errors/task-already-trashed.error.js';
import { TaskNotTrashedError } from './errors/task-not-trashed.error.js';

function buildListWhere(query, { trashed = false } = {}) {
    const where = {
        trashedAt: trashed ? { not: null } : null
    };

    if (query.search) {
        where.text = {
            contains: query.search,
            mode: 'insensitive'
        };
    }

    if (query.type) {
        where.type = query.type.trim().toLowerCase();
    }

    if (query.from || query.to) {
        where.createdAt = {};

        if (query.from) {
            where.createdAt.gte = new Date(`${query.from}T00:00:00.000Z`);
        }

        if (query.to) {
            where.createdAt.lte = new Date(`${query.to}T23:59:59.999Z`);
        }
    }

    if (query.status) {
        where.status = TaskMapper.toDbStatus(query.status);
    }

    if (query.priority) {
        where.priority = TaskMapper.toDbPriority(query.priority);
    }

    return where;
}

function buildOrderBy(query) {
    return {
        [query.sortBy]: query.sortOrder
    };
}

function buildPaginationMeta(page, limit, totalItems) {
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

    return {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: totalPages > 0 && page < totalPages,
        hasPreviousPage: page > 1
    };
}

export const TaskService = {
    async listTasks(userId, query, { trashed = false } = {}) {
        const where = buildListWhere(query, { trashed });
        const skip = (query.page - 1) * query.limit;
        const orderBy = buildOrderBy(query);

        const [tasks, totalItems] = await Promise.all([
            TaskRepository.findManyByUserId(userId, {
                where,
                skip,
                take: query.limit,
                orderBy
            }),
            TaskRepository.countByUserId(userId, where)
        ]);

        const meta = buildPaginationMeta(query.page, query.limit, totalItems);

        return TaskMapper.toTaskListResponseDTO(tasks, meta);
    },

    async getAvailableTypes(userId, query = {}) {
        const where = {
            trashedAt: query.scope === 'trash' ? { not: null } : null
        };

        if (query.search) {
            where.type = {
                contains: query.search.trim().toLowerCase(),
                mode: 'insensitive'
            };
        }

        const rows = await TaskRepository.getDistinctTypesByUserId(userId, {
            where,
            take: query.limit ?? 10
        });

        return TaskMapper.toTypesResponseDTO(rows.map((row) => row.type));
    },

    async createTask(userId, payload) {
        const data = TaskMapper.toCreateEntity(userId, payload);

        if (data.status === 'COMPLETED') {
            data.completedAt = new Date();
        }

        const task = await TaskRepository.create(data);
        return TaskMapper.toResponseDTO(task);
    },

    async updateTask(userId, taskId, payload) {
        const existingTask = await TaskRepository.findByIdAndUserId(taskId, userId);

        if (!existingTask) {
            throw new TaskNotFoundError();
        }

        if (existingTask.trashedAt) {
            throw new TaskAlreadyTrashedError();
        }

        const data = TaskMapper.toUpdateEntity(payload);

        if (data.status) {
            if (data.status === 'COMPLETED' && !existingTask.completedAt) {
                data.completedAt = new Date();
            }

            if (data.status !== 'COMPLETED') {
                data.completedAt = null;
            }
        }

        const task = await TaskRepository.updateAndReturn(taskId, userId, data);
        return TaskMapper.toResponseDTO(task);
    },

    async trashTask(userId, taskId) {
        const task = await TaskRepository.findByIdAndUserId(taskId, userId);

        if (!task) {
            throw new TaskNotFoundError();
        }

        if (task.trashedAt) {
            throw new TaskAlreadyTrashedError();
        }

        const trashedTask = await TaskRepository.updateAndReturn(taskId, userId, {
            trashedAt: new Date()
        });

        return TaskMapper.toResponseDTO(trashedTask);
    },

    async restoreTask(userId, taskId) {
        const task = await TaskRepository.findByIdAndUserId(taskId, userId);

        if (!task) {
            throw new TaskNotFoundError();
        }

        if (!task.trashedAt) {
            throw new TaskNotTrashedError();
        }

        const restoredTask = await TaskRepository.updateAndReturn(taskId, userId, {
            trashedAt: null
        });

        return TaskMapper.toResponseDTO(restoredTask);
    },

    async deleteTask(userId, taskId) {
        const task = await TaskRepository.findByIdAndUserId(taskId, userId);

        if (!task) {
            throw new TaskNotFoundError();
        }

        await TaskRepository.delete(taskId, userId);

        return {
            ok: true,
            message: 'La tarea se eliminó definitivamente.'
        };
    },

    async emptyTrash(userId) {
        const result = await TaskRepository.deleteTrashByUserId(userId);

        return TaskMapper.toBulkActionResponseDTO(
            result.count,
            result.count === 0
                ? 'No había tareas en la papelera para eliminar definitivamente.'
                : `Se eliminaron definitivamente ${result.count} tarea(s) de la papelera.`
        );
    },

    async markAllAsCompleted(userId) {
        const result = await TaskRepository.markAllAsCompleted(userId, new Date());

        return TaskMapper.toBulkActionResponseDTO(
            result.count,
            result.count === 0
                ? 'No había tareas activas pendientes por completar.'
                : `Se marcaron ${result.count} tarea(s) como completadas.`
        );
    },

    async trashCompletedTasks(userId) {
        const result = await TaskRepository.trashCompleted(userId, new Date());

        return TaskMapper.toBulkActionResponseDTO(
            result.count,
            result.count === 0
                ? 'No había tareas completadas para enviar a la papelera.'
                : `Se enviaron ${result.count} tarea(s) completada(s) a la papelera.`
        );
    }
};
