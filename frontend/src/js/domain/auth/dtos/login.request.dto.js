import { z } from 'zod';

const loginRequestSchema = z.object({
    identifier: z
        .string()
        .trim()
        .min(1, 'Debes introducir tu identificador.')
        .max(100, 'El identificador es demasiado largo.'),
    password: z
        .string()
        .min(1, 'Debes introducir tu contraseña.')
        .max(255, 'La contraseña es demasiado larga.')
});

export const LoginRequestDTO = {
    schema: loginRequestSchema,

    parse(payload) {
        return loginRequestSchema.parse(payload);
    },

    safeParse(payload) {
        return loginRequestSchema.safeParse(payload);
    }
};
