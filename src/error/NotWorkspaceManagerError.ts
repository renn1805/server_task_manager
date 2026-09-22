import AppError from "./AppError";

export default class NotWorkspaceManagerError extends AppError {
    constructor() {
        super(
            "NOT_WORKSPACE_MANAGER",
            "O usuário não é o gerente do workspace",
            400,
        );
    }
}
