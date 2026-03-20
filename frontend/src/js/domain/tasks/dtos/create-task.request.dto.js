import { z } from 'zod';

const taskStatusSchema = z.enum(['pendiente', 'haciendo', 'completado']);
const taskPrioritySchema = z.enum(['baja', 'media', 'alta']);

const createTaskRequestSchema = z.object({
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

export const CreateTaskRequestDTO = {
    schema: createTaskRequestSchema,

    parse(payload) {
        return createTaskRequestSchema.parse(payload);
    },

    safeParse(payload) {
        return createTaskRequestSchema.safeParse(payload);
    }
};
