import * as z from "zod";
import { Request, Response } from "express";
import { prisma } from "../Server";
import { hashPassword, comparePassword } from "../utils/BcryptFunctions";
import { nanoid } from "nanoid";
import { SizeIds } from "../utils/SizeIds";
import FailSearchUsersError from "../errors/FailSearchUsersError";
import InvalidDataError from "../errors/InvalidDataError";
import UserNotFoundError from "../errors/UserNotFoundError";
import AppError from "../errors/AppError";
import InternalError from "../errors/InternalError";
import UserAlreadyExistsError from "../errors/UserAlreadyExistsError";

export default class UserController {
    async users(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });

            return res.status(200).send(users);
        } catch (error) {
            throw new FailSearchUsersError();
        }
    }

    async login(req: Request, res: Response) {
        try {
            const reqSchema = z.object({
                email: z.email(),
                password: z.string(),
            });

            const request = reqSchema.safeParse(req.body);

            if (!request.success) {
                const message = JSON.parse(request.error.message)
                    .map((m: any) => m.message)
                    .join("; ");

                throw new InvalidDataError(
                    message || "O formato da requisição é inválido",
                );
            }

            const { email, password } = request.data;

            const normalizedEmail = email.toLowerCase();

            const emailUser = await prisma.user.findUnique({
                where: {
                    email: normalizedEmail,
                },
            });

            if (emailUser === null) {
                throw new UserNotFoundError();
            }

            const validPassword = await comparePassword(
                password,
                emailUser.password,
            );

            if (!validPassword) {
                throw new InvalidDataError("Senha invalida");
            }

            return res.status(200).json({
                user: {
                    id: emailUser.id,
                    name: emailUser.name,
                    email: emailUser.email,
                },
            });
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new InternalError();
        }
    }

    async create(req: Request, res: Response) {
        try {
            const reqSchema = z.object({
                name: z.string(),
                email: z.email(),
                password: z.string().min(8),
            });

            const request = reqSchema.safeParse(req.body);

            if (!request.success) {
                const message = JSON.parse(request.error.message)
                    .map(
                        (m: any) =>
                            `${(m.path as string[]).findLast((e) => true)} -> ${m.message}`,
                    )
                    .join("; ");

                throw new InvalidDataError(
                    message || "O formato da requisição é inválido",
                );
            }

            const { name, email, password } = request.data;
            const normalizedEmail = email.toLowerCase();

            const emailUser = await prisma.user.findUnique({
                where: {
                    email: normalizedEmail,
                },
            });

            if (emailUser !== null) {
                throw new UserAlreadyExistsError();
            }

            const user = await prisma.user.create({
                data: {
                    id: nanoid(SizeIds.sizeUserId),
                    name: name.toLowerCase(),
                    email: normalizedEmail,
                    password: await hashPassword(password),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });

            return res.status(201).json({ user });
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new InternalError();
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const reqSchema = z.object({
                email: z.email(),
                password: z.string(),
            });

            const request = reqSchema.safeParse(req.body);

            if (!request.success) {
                const message = JSON.parse(request.error.message)
                    .map(
                        (m: any) =>
                            `${(m.path as string[]).findLast((e) => true)} -> ${m.message}`,
                    )
                    .join("; ");

                throw new InvalidDataError(
                    message || "O formato da requisição é inválido",
                );
            }

            const { email, password } = request.data;

            const user = await prisma.user.findUnique({
                where: {
                    email: email.toLowerCase(),
                },
            });

            if (!user) {
                throw new UserNotFoundError();
            }

            if (!(await comparePassword(password, user.password))) {
                throw new InvalidDataError("Senha invalida");
            }

            await prisma.user.delete({
                where: {
                    email: email.toLowerCase(),
                },
            });

            return res.status(204).end();
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new InternalError();
        }
    }
}
