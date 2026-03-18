import { UnauthorizedError } from '../common-errors/unauthorized.error.js';

export function requireAuth(req, _res, next) {
    if (!req.session?.userId) {
        next(new UnauthorizedError('No has iniciado sesión.'));
        return;
    }

    next();
}
