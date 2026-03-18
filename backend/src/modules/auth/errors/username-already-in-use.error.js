import { ConflictError } from '../../../common-errors/conflict.error.js';

export class UsernameAlreadyInUseError extends ConflictError {
    constructor(message = 'Este nombre de usuario ya está en uso.') {
        super(message);
        this.code = 'USERNAME_ALREADY_IN_USE';
    }
}
