import { Request, Response } from "express";
import * as z from "zod"
import { prisma } from "../app"
import { nanoid } from "nanoid"
import { sizeWorspaceId, sizeWorspaceMemberId } from "../Server";

export default class WorkspaceController {

    async workspaces(res: Response) {
        try {
            const workspaces = await prisma.workspace.findMany({
                include: {
                    members: {
                        select: {
                            id: true,
                            memberId: true,
                            nameMember: true
                        }
                    },
                    teams: true
                }
            })
            return res.status(200).send(workspaces)
        } catch (error) {
            return res.status(500).send(error)
        }

    }

    async create(req: Request, res: Response) {
        try {

            const reqSchema = z.object({
                projectName: z.string(),
                description: z.string(),
                managerId: z.string()
            })

            const request = reqSchema.safeParse(req.body)

            if (!request.success) {
                return res.status(400).json({
                    error: "Invalid data!",
                    description: request.error
                })
            }

            const { projectName, description, managerId } = request.data

            await prisma.workspace.create({
                data: {
                    id: nanoid(sizeWorspaceId),
                    project_name: projectName.toLowerCase(),
                    description: description.toLowerCase(),
                    managerId: managerId
                }
            })

            return res.status(201).end()

        } catch (error) {
            return res.status(500).send(error)
        }
    }

    async delete(req: Request, res: Response) {
        try {

            const reqSchema = z.object({
                workspaceId: z.string(),
                managerId: z.string()
            })

            const request = reqSchema.safeParse(req.body)
            if (!request.success) {
                return res.status(400).json({
                    error: "Invalid data!",
                    description: request.error
                })
            }

            const { workspaceId, managerId } = request.data

            await prisma.workspace.delete({
                where: {
                    id: workspaceId,
                    managerId: managerId
                }
            })

            return res.status(201).end()

        } catch (error) {
            return res.status(500).send(error)
        }
    }

    async complete(req: Request, res: Response) {
        try {

            const reqSchema = z.object({
                workspaceId: z.string()
            })

            const request = reqSchema.safeParse(req.body)
            if (!request.success) {
                return res.status(400).json({
                    error: "workspace undefined",
                    description: request.error
                })
            }

            const { workspaceId } = request.data

            if (!workspaceId) {
                return res.status(400).send("workspace undefined")
            }

            await prisma.workspace.update({
                where: { id: workspaceId },
                data: {
                    completedAt: new Date()
                }
            })
            return res.status(201).end()

        } catch (error) {
            return res.status(500).send(error)
        }
    }

    async include(req: Request, res: Response) {
        try {

            const reqSchema = z.object({
                memberId: z.string(),
                workspaceId: z.string(),
                managerId: z.string()
            })

            const request = reqSchema.safeParse(req.body)
            if (!request.success) {
                return res.status(400).json({
                    error: "Invalid data",
                    description: request.error
                })
            }

            const { memberId, workspaceId, managerId } = request.data

            const workspaceManager = await prisma.workspace.findUnique({
                where: {
                    id: workspaceId
                },
                select: {
                    managerId: true
                }
            })

            const isManager = managerId === workspaceManager?.managerId

            if (!isManager) {
                return res.status(400).send("The user is not worspace manager")
            }

            const nameMember = await prisma.user.findUnique({
                where: {
                    id: memberId
                },
                select: {
                    name: true
                }
            })

            await prisma.workspaceMember.create({
                data: {
                    id: nanoid(sizeWorspaceMemberId),
                    memberId,
                    workspaceId,
                    nameMember: nameMember?.name!
                }
            })

            return res.status(201).end()

        } catch (error) {
            return res.status(500).send(error)
        }
    }

    async remove(req: Request, res: Response) {
        try {

            const reqSchema = z.object({
                workspaceMemberId: z.string(),
                workspaceId: z.string(),
                managerId: z.string()
            })

            const request = reqSchema.safeParse(req.body)

            if (!request.success) {
                return res.status(400).json({
                    error: "Invalid data!",
                    description: request.error
                })
            }

            const { workspaceMemberId, workspaceId, managerId } = request.data

            const managerWorspace = await prisma.workspace.findUnique({
                where: {
                    id: workspaceId
                },
                select: {
                    managerId: true
                }
            })
            const isManager = managerId === managerWorspace?.managerId

            if (!isManager) {
                return res.status(400).send("The user is not workspace manager")
            }

            await prisma.workspaceMember.delete({
                where: {
                    id: workspaceMemberId
                }
            })

            return res.status(201).end()

        } catch (error) {
            return res.status(500).send(error)
        }
    }

}