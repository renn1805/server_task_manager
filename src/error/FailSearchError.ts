import AppError from "./AppError";

export default class FailSearchError extends AppError {
    constructor() {
        super("FAIL_SEARCH", "Falha na busca", 500);
    }
}
