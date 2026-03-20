import { z } from 'zod';

const registerResponseSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string(),
    displayName: z.string().nullable(),
    profileImageUrl: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.string()
});

export const RegisterResponseDTO = {
    schema: registerResponseSchema,

    parse(payload) {
        return registerResponseSchema.parse(payload);
    }
};
