import AppError from "./AppError";

export default class UserNotFoundError extends AppError {
    constructor() {
        super("USER_NOT_FOUND", "Usuário não encontrado", 400);
    }
}
