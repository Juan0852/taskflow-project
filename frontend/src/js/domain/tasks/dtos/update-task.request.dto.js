import { z } from 'zod';

const taskStatusSchema = z.enum(['pendiente', 'haciendo', 'completado']);
const taskPrioritySchema = z.enum(['baja', 'media', 'alta']);

const updateTaskRequestSchema = z.object({
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

export const UpdateTaskRequestDTO = {
    schema: updateTaskRequestSchema,

    parse(payload) {
        return updateTaskRequestSchema.parse(payload);
    },

    safeParse(payload) {
        return updateTaskRequestSchema.safeParse(payload);
    }
};
