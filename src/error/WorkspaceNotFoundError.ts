import AppError from "./AppError";

export default class WorkspaceNotFoundError extends AppError {
    constructor() {
        super("WORKSPACE_NOT_FOUND", "Workspace não encontrado", 400);
    }
}
