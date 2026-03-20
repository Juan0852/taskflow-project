import { TaskRequestDTO } from './task.request.dto.js';
import { TaskService } from './task.service.js';

export const TaskController = {
    getStatus(_req, res) {
        res.status(200).json({
            ok: true,
            module: 'tasks',
            message: 'El módulo de tareas está en línea.'
        });
    },

    async list(req, res, next) {
        try {
            const query = TaskRequestDTO.parseListQuery(req.query);
            const response = await TaskService.listTasks(req.session.userId, query);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    async listTrash(req, res, next) {
        try {
            const query = TaskRequestDTO.parseListQuery(req.query);
            const response = await TaskService.listTasks(req.session.userId, query, { trashed: true });
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    async getTypes(req, res, next) {
        try {
            const query = TaskRequestDTO.parseTypesQuery(req.query);
            const response = await TaskService.getAvailableTypes(req.session.userId, query);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    async create(req, res, next) {
        try {
            const payload = TaskRequestDTO.parseCreate(req.body);
            const response = await TaskService.createTask(req.session.userId, payload);
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const payload = TaskRequestDTO.parseUpdate(req.body);
            const response = await TaskService.updateTask(req.session.userId, req.params.id, payload);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    async trash(req, res, next) {
        try {
            const response = await TaskService.trashTask(req.session.userId, req.params.id);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    async restore(req, res, next) {
        try {
            const response = await TaskService.restoreTask(req.session.userId, req.params.id);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    async remove(req, res, next) {
        try {
            const response = await TaskService.deleteTask(req.session.userId, req.params.id);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    async emptyTrash(req, res, next) {
        try {
            const response = await TaskService.emptyTrash(req.session.userId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    async completeAll(req, res, next) {
        try {
            const response = await TaskService.markAllAsCompleted(req.session.userId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    async trashCompleted(req, res, next) {
        try {
            const response = await TaskService.trashCompletedTasks(req.session.userId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },

    async trashAll(req, res, next) {
        try {
            const response = await TaskService.trashAllTasks(req.session.userId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
};
