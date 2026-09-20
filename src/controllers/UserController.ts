import * as z from "zod";
import { Request, Response } from "express";
import { prisma } from "../App";
import { hashPassword, comparePassword } from "../utils/BcryptFunctions";
import { nanoid } from "nanoid";
import { SizeIds } from "../utils/SizeIds";

export default class UserController {
    async users(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    position: true,
                },
            });
            return res.status(200).send(users);
        } catch (error) {
            return res.status(500).json({
                code: "FAIL_SEARCH_USERS",
                message: "Falha na busca de usuarios",
            });
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

                return res.status(400).json({
                    code: "INVALID_DATA",
                    message: message || "O fornato da requisição é invalido",
                });
            }

            const { email, password } = request.data;

            const normalizedEmail = email.toLowerCase();

            const emailUser = await prisma.user.findUnique({
                where: {
                    email: normalizedEmail,
                },
            });
            if (emailUser === null)
                return res.status(400).json({
                    code: "USER_NOT_FOUND",
                    message: "Usuário não encontrado",
                });

            const validPassword = await comparePassword(
                password,
                emailUser.password,
            );

            if (validPassword) {
                return res.status(200).json({
                    user: {
                        id: emailUser.id,
                        name: emailUser.name,
                        email: emailUser.email,
                    },
                });
            } else {
                return res.status(400).json({
                    code: "INVALID_DATA",
                    message: "Senha invalida",
                });
            }
        } catch (error) {
            return res.status(500).json({
                code: "INTERNAL_ERROR",
                message: "Erro no servidor",
                details: error,
            });
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

                return res.status(400).json({
                    code: "INVALID_DATA",
                    message: message || "O formato da requisição é inválido",
                });
            }

            const { name, email, password } = request.data;
            const normalizedEmail = email.toLowerCase();

            const emailUser = await prisma.user.findUnique({
                where: {
                    email: normalizedEmail,
                },
            });

            if (emailUser !== null)
                return res.status(400).json({
                    code: "USER_ALREADY_EXISTS",
                    message: "Já existe um usuário com este email",
                });

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
            return res.status(500).json({
                code: "INTERNAL_ERROR",
                message: "Erro no servidor",
                details: error,
            });
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
                return res.status(400).json({
                    error: "Invalid data",
                    description: request.error,
                });
            }

            const { email, password } = request.data;
            const user = await prisma.user.findUnique({
                where: {
                    email: email.toLowerCase(),
                },
            });
            if (!user) {
                return res.status(400).send("User not found!");
            }
            if (!(await comparePassword(password, user!.password))) {
                return res.status(400).send("Password not match!");
            }
            await prisma.user.delete({
                where: {
                    email: email,
                },
            });

            return res.status(204).end();
        } catch (error) {
            return res.status(500).send(error);
        }
    }
}
