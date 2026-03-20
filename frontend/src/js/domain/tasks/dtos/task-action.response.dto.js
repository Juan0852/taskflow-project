import { z } from 'zod';

const taskActionResponseSchema = z.object({
    ok: z.boolean(),
    message: z.string(),
    count: z.number().int().min(0).optional()
});

export const TaskActionResponseDTO = {
    schema: taskActionResponseSchema,

    parse(payload) {
        return taskActionResponseSchema.parse(payload);
    }
};
