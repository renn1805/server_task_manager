import AppError from "./AppError";

export default class InvalidDataError extends AppError {
    constructor(message: string) {
        super("INVALID_DATA", message, 400);
    }
}
