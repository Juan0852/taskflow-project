import { z } from 'zod';

const taskListItemSchema = z.object({
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

const taskListResponseSchema = z.object({
    items: z.array(taskListItemSchema),
    meta: z.object({
        page: z.number().int().min(1),
        limit: z.number().int().min(1),
        totalItems: z.number().int().min(0),
        totalPages: z.number().int().min(0),
        hasNextPage: z.boolean(),
        hasPreviousPage: z.boolean()
    })
});

export const TaskListResponseDTO = {
    schema: taskListResponseSchema,
    itemSchema: taskListItemSchema,

    parse(payload) {
        return taskListResponseSchema.parse(payload);
    }
};
