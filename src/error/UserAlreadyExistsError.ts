import AppError from "./AppError";

export default class UserAlreadyExistsError extends AppError {
    constructor() {
        super(
            "USER_ALREADY_EXISTS",
            "Já existe um usuário com este email",
            400,
        );
    }
}
