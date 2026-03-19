import { z } from 'zod';

const taskStatusSchema = z.enum(['pendiente', 'haciendo', 'completado']);
const taskPrioritySchema = z.enum(['baja', 'media', 'alta']);
const sortBySchema = z.enum(['createdAt', 'updatedAt', 'priority', 'status', 'type', 'text']);
const sortOrderSchema = z.enum(['asc', 'desc']);
const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Debes indicar una fecha válida con formato YYYY-MM-DD.');

const listTasksQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().max(200).optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    type: z.string().trim().max(100).optional(),
    from: isoDateSchema.optional(),
    to: isoDateSchema.optional(),
    sortBy: sortBySchema.default('createdAt'),
    sortOrder: sortOrderSchema.default('desc')
}).refine((query) => {
    if (!query.from || !query.to) return true;
    return query.from <= query.to;
}, {
    message: 'La fecha inicial no puede ser posterior a la fecha final.',
    path: ['from']
});

export const ListTasksQueryDTO = {
    schema: listTasksQuerySchema,

    parse(payload) {
        return listTasksQuerySchema.parse(payload);
    },

    safeParse(payload) {
        return listTasksQuerySchema.safeParse(payload);
    }
};
