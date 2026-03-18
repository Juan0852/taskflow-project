import { AppError } from '../../../common-errors/app.error.js';

export class TaskNotFoundError extends AppError {
    constructor() {
        super(404, 'La tarea solicitada no existe.', 'TASK_NOT_FOUND');
    }
}
