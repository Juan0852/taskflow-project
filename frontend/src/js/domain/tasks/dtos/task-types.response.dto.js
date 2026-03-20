import { z } from 'zod';

const taskTypesResponseSchema = z.object({
    items: z.array(z.string())
});

export const TaskTypesResponseDTO = {
    schema: taskTypesResponseSchema,

    parse(payload) {
        return taskTypesResponseSchema.parse(payload);
    }
};
