import { ConflictError } from '../../../common-errors/conflict.error.js';

export class EmailAlreadyInUseError extends ConflictError {
    constructor(message = 'Este correo ya está en uso.') {
        super(message);
        this.code = 'EMAIL_ALREADY_IN_USE';
    }
}
