import { ZodError } from 'zod';
import { AppError } from '../common-errors/app.error.js';

export function errorHandler(error, _req, res, _next) {
    console.error(error);

    if (error instanceof ZodError) {
        return res.status(400).json({
            ok: false,
            code: 'VALIDATION_ERROR',
            message: 'La validación de la solicitud falló.',
            details: error.flatten().fieldErrors
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            ok: false,
            code: error.code,
            message: error.message
        });
    }

    return res.status(500).json({
        ok: false,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ocurrió un error interno del servidor.'
    });
}
