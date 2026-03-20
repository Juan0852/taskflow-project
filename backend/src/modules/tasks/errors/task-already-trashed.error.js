import { AppError } from '../../../common-errors/app.error.js';

export class TaskAlreadyTrashedError extends AppError {
    constructor() {
        super(409, 'La tarea ya está en la papelera.', 'TASK_ALREADY_TRASHED');
    }
}
