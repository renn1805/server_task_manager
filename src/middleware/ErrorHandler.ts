import { NextFunction, Request, Response } from "express";
import AppError from "../error/AppError";

export default function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            code: error.code,
            message: error.message,
        });
    }

    console.error(error);

    return res.status(500).json({
        code: "INTERNAL_ERROR",
        message: "Erro no servidor",
    });
}
