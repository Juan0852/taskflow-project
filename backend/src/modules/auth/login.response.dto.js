import { z } from 'zod';

const loginResponseSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string(),
    displayName: z.string().nullable(),
    profileImageUrl: z.string().nullable(),
    isActive: z.boolean(),
    lastLoginAt: z.string().nullable(),
    createdAt: z.string()
});

export const LoginResponseDTO = {
    schema: loginResponseSchema,

    parse(payload) {
        return loginResponseSchema.parse(payload);
    }
};
