import AppError from "./AppError";

export default class InternalError extends AppError {
    constructor() {
        super("INTERNAL_ERROR", "Erro no servidor", 500);
    }
}
