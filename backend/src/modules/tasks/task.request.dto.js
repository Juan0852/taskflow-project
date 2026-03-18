import { z } from 'zod';

const taskStatusSchema = z.enum(['pendiente', 'haciendo', 'completado']);
const taskPrioritySchema = z.enum(['baja', 'media', 'alta']);
const sortBySchema = z.enum(['createdAt', 'updatedAt', 'priority', 'status', 'type', 'text']);
const sortOrderSchema = z.enum(['asc', 'desc']);

const createTaskSchema = z.object({
    text: z.string({
        error: 'Debes indicar el texto de la tarea.'
    })
        .trim()
        .min(1, 'Debes indicar el texto de la tarea.')
        .max(500, 'La tarea no puede superar los 500 caracteres.'),
    priority: taskPrioritySchema.default('media'),
    type: z.string()
        .trim()
        .max(100, 'El tipo no puede superar los 100 caracteres.')
        .optional()
        .default('general'),
    status: taskStatusSchema.default('pendiente')
});

const updateTaskSchema = z.object({
    text: z.string()
        .trim()
        .min(1, 'El texto de la tarea no puede estar vacío.')
        .max(500, 'La tarea no puede superar los 500 caracteres.')
        .optional(),
    priority: taskPrioritySchema.optional(),
    type: z.string()
        .trim()
        .min(1, 'El tipo no puede estar vacío.')
        .max(100, 'El tipo no puede superar los 100 caracteres.')
        .optional(),
    status: taskStatusSchema.optional()
}).refine((payload) => Object.keys(payload).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar.',
    path: ['body']
});

const listTasksQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().max(200).optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    type: z.string().trim().max(100).optional(),
    sortBy: sortBySchema.default('createdAt'),
    sortOrder: sortOrderSchema.default('desc')
});

export const TaskRequestDTO = {
    createSchema: createTaskSchema,
    updateSchema: updateTaskSchema,
    listQuerySchema: listTasksQuerySchema,

    parseCreate(payload) {
        return createTaskSchema.parse(payload);
    },

    parseUpdate(payload) {
        return updateTaskSchema.parse(payload);
    },

    parseListQuery(payload) {
        return listTasksQuerySchema.parse(payload);
    }
};
