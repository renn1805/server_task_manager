import { Request, Response } from "express";
import * as z from "zod";
import { prisma } from "../Server";
import { nanoid } from "nanoid";
import { sizeWorspaceId, sizeWorspaceMemberId } from "../utils/SizeIds";

import AppError from "../errors/AppError";
import InvalidDataError from "../errors/InvalidDataError";
import InternalError from "../errors/InternalError";
import UserNotFoundError from "../errors/UserNotFoundError";
import WorkspaceNotFoundError from "../errors/WorkspaceNotFoundError";
import NotWorkspaceManagerError from "../errors/NotWorkspaceManagerError";
import FailSearchError from "../errors/FailSearchError";

export default class WorkspaceController {
    async workspaceById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id || id.trim().length === 0) {
                throw new InvalidDataError("ID do workspace não enviado");
            }

            const workspace = await prisma.workspace.findUnique({
                where: {
                    id,
                },
                include: {
                    members: {
                        select: {
                            id: true,
                            member: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    teams: true,
                    tasks: true,
                    objectives: true,
                },
            });

            if (!workspace) {
                throw new WorkspaceNotFoundError();
            }

            return res.status(200).json({ workspace });
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new FailSearchError();
        }
    }

    async workspaces(req: Request, res: Response) {
        try {
            const { user } = req.query;
            if (!user || user.toString().trim().length === 0) {
                throw new InvalidDataError("Usuário não enviado");
            }

            const workspaces = await prisma.workspace.findMany({
                where: {
                    members: {
                        some: {
                            memberId: user.toString(),
                        },
                    },
                },
                include: {
                    members: {
                        select: {
                            id: true,
                            memberId: true,
                            nameMember: true,
                        },
                    },
                    teams: true,
                },
            });

            return res.status(200).json({ workspaces });
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new FailSearchError();
        }
    }

    async create(req: Request, res: Response) {
        try {
            const reqSchema = z.object({
                projectName: z.string(),
                description: z.string(),
                managerId: z.string(),
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

            const { projectName, description, managerId } = request.data;

            const manager = await prisma.user.findUnique({
                where: {
                    id: managerId,
                },
            });

            if (!manager) {
                throw new UserNotFoundError();
            }

            const workspace = await prisma.workspace.create({
                data: {
                    id: nanoid(sizeWorspaceId),
                    project_name: projectName.toLowerCase(),
                    description: description.toLowerCase(),
                    managerId: manager.id,
                },
            });

            await prisma.workspaceMember.create({
                data: {
                    id: nanoid(sizeWorspaceMemberId),
                    memberId: manager.id,
                    workspaceId: workspace.id,
                    nameMember: manager.name,
                },
            });

            return res.status(201).json({ workspace });
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
                workspaceId: z.string(),
                managerId: z.string(),
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

            const { workspaceId, managerId } = request.data;

            await prisma.workspace.delete({
                where: {
                    id: workspaceId,
                    managerId,
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

    async complete(req: Request, res: Response) {
        try {
            const reqSchema = z.object({
                workspaceId: z.string(),
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

            const { workspaceId } = request.data;

            const workspace = await prisma.workspace.findUnique({
                where: { id: workspaceId },
            });

            if (!workspace) {
                throw new WorkspaceNotFoundError();
            }

            await prisma.workspace.update({
                where: { id: workspaceId },
                data: {
                    completedAt: new Date(),
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

    async include(req: Request, res: Response) {
        try {
            //? apenas gerente adiciona
            const reqSchema = z.object({
                memberId: z.string(),
                workspaceId: z.string(),
                managerId: z.string(),
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

            const { memberId, workspaceId, managerId } = request.data;

            const workspaceManager = await prisma.workspace.findUnique({
                where: {
                    id: workspaceId,
                },
                select: {
                    managerId: true,
                },
            });

            if (!workspaceManager) {
                throw new WorkspaceNotFoundError();
            }

            const isManager = managerId === workspaceManager?.managerId;

            if (!isManager) {
                throw new NotWorkspaceManagerError();
            }

            const nameMember = await prisma.user.findUnique({
                where: {
                    id: memberId,
                },
                select: {
                    name: true,
                },
            });

            if (!nameMember) {
                throw new UserNotFoundError();
            }

            await prisma.workspaceMember.create({
                data: {
                    id: nanoid(sizeWorspaceMemberId),
                    memberId,
                    workspaceId,
                    nameMember: nameMember.name,
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

    async remove(req: Request, res: Response) {
        try {
            //? exclui o usuario direto da lista de membros do workspace e só o gerente pode fazer isso
            const reqSchema = z.object({
                workspaceMemberId: z.string(),
                managerId: z.string(),
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

            const { workspaceMemberId, managerId } = request.data;

            const workspaceMember = await prisma.workspaceMember.findUnique({
                where: {
                    id: workspaceMemberId,
                },
                include: {
                    workspace: {
                        select: {
                            managerId: true,
                        },
                    },
                },
            });

            if (!workspaceMember) {
                throw new WorkspaceNotFoundError();
            }

            if (managerId !== workspaceMember.workspace.managerId) {
                throw new NotWorkspaceManagerError();
            }

            await prisma.workspaceMember.delete({
                where: {
                    id: workspaceMemberId,
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
