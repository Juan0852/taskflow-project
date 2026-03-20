import { z } from 'zod';

const USERNAME_ALLOWED_PATTERN = /^[a-zA-Z0-9._-]+$/;

const registerRequestSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'Debes indicar un correo electrónico.')
        .email('Debes introducir un correo electrónico válido.')
        .max(255, 'El correo electrónico es demasiado largo.'),
    username: z
        .string()
        .trim()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
        .max(50, 'El nombre de usuario no puede superar los 50 caracteres.')
        .refine((value) => !value.includes('@'), 'El nombre de usuario no puede incluir el símbolo "@".')
        .refine((value) => !/\s/.test(value), 'El nombre de usuario no puede contener espacios.')
        .refine(
            (value) => USERNAME_ALLOWED_PATTERN.test(value),
            'El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos.'
        ),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres.')
        .max(255, 'La contraseña es demasiado larga.'),
    displayName: z
        .string()
        .trim()
        .min(1, 'El nombre visible no puede estar vacío.')
        .max(100, 'El nombre visible no puede superar los 100 caracteres.')
        .optional()
});

export const RegisterRequestDTO = {
    schema: registerRequestSchema,

    parse(payload) {
        return registerRequestSchema.parse(payload);
    },

    safeParse(payload) {
        return registerRequestSchema.safeParse(payload);
    }
};
