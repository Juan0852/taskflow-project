import { z } from 'zod';

const taskItemSchema = z.object({
    id: z.string(),
    text: z.string(),
    type: z.string(),
    status: z.enum(['pendiente', 'haciendo', 'completado']),
    priority: z.enum(['baja', 'media', 'alta']),
    completedAt: z.string().nullable(),
    trashedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdDate: z.string()
});

const taskListSchema = z.object({
    items: z.array(taskItemSchema),
    meta: z.object({
        page: z.number().int().min(1),
        limit: z.number().int().min(1),
        totalItems: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNextPage: z.boolean(),
        hasPreviousPage: z.boolean()
    })
});

const taskTypesSchema = z.object({
    items: z.array(z.string())
});

const bulkActionSchema = z.object({
    ok: z.boolean(),
    count: z.number().int().min(0),
    message: z.string()
});

export const TaskResponseDTO = {
    taskItemSchema,
    taskListSchema,
    taskTypesSchema,
    bulkActionSchema,

    parseTask(payload) {
        return taskItemSchema.parse(payload);
    },

    parseTaskList(payload) {
        return taskListSchema.parse(payload);
    },

    parseTypes(payload) {
        return taskTypesSchema.parse(payload);
    },

    parseBulkAction(payload) {
        return bulkActionSchema.parse(payload);
    }
};
