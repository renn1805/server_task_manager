import AppError from "./AppError";

export default class FailSearchUsersError extends AppError {
    constructor() {
        super(
            "FAIL_SEARCH_USERS",
            "Falha na busca de usuarios",
            500,
        );
    }
}