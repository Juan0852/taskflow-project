import { ConflictError } from '../../../common-errors/conflict.error.js';

export class UsernameReservedError extends ConflictError {
    constructor(message = 'Este nombre de usuario está reservado y no puede utilizarse.') {
        super(message);
        this.code = 'USERNAME_RESERVED';
    }
}
