import { ForbiddenError } from '../../../common-errors/forbidden.error.js';

export class InactiveAccountError extends ForbiddenError {
    constructor(message = 'Esta cuenta está inactiva.') {
        super(message);
        this.code = 'INACTIVE_ACCOUNT';
    }
}
