import { UnauthorizedError } from '../../../common-errors/unauthorized.error.js';

export class InvalidCredentialsError extends UnauthorizedError {
    constructor(message = 'Las credenciales no son válidas.') {
        super(message);
        this.code = 'INVALID_CREDENTIALS';
    }
}
