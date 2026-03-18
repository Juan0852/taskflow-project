import { AppError } from '../../../common-errors/app.error.js';

export class TaskNotTrashedError extends AppError {
    constructor() {
        super(409, 'La tarea no está en la papelera.', 'TASK_NOT_TRASHED');
    }
}
