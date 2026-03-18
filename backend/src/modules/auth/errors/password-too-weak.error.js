import { ConflictError } from '../../../common-errors/conflict.error.js';

export class PasswordTooWeakError extends ConflictError {
    constructor(message = 'La contraseña no cumple la política de seguridad. Revisa las condiciones e inténtalo de nuevo.') {
        super(message);
        this.code = 'PASSWORD_TOO_WEAK';
    }
}
