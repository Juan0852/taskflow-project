export class AppError extends Error {
    constructor(statusCode, message, code = 'APP_ERROR') {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
    }
}
