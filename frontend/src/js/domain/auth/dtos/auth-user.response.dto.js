import { z } from 'zod';

const authUserResponseSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string(),
    displayName: z.string().nullable(),
    profileImageUrl: z.string().nullable(),
    isActive: z.boolean(),
    lastLoginAt: z.string().nullable(),
    createdAt: z.string()
});

export const AuthUserResponseDTO = {
    schema: authUserResponseSchema,

    parse(payload) {
        return authUserResponseSchema.parse(payload);
    }
};
