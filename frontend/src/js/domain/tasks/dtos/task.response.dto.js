import { z } from 'zod';

const taskResponseSchema = z.object({
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

export const TaskResponseDTO = {
    schema: taskResponseSchema,

    parse(payload) {
        return taskResponseSchema.parse(payload);
    }
};
