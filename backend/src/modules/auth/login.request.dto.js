import { z } from 'zod';

const loginRequestSchema = z.object({
    identifier: z.string()
        .trim()
        .min(1, 'Debes indicar tu correo o nombre de usuario.')
        .max(100, 'El identificador es demasiado largo.'),
    password: z.string()
        .min(1, 'Debes indicar tu contraseña.')
        .max(255, 'La contraseña es demasiado larga.')
});

export const LoginRequestDTO = {
    schema: loginRequestSchema,

    parse(payload) {
        return loginRequestSchema.parse(payload);
    }
};
