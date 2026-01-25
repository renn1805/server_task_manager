import { Request, Response } from "express";
import * as z from "zod"
import { prisma } from "../app"
import { nanoid } from "nanoid"
import { error } from "node:console";

export default class WorkspaceController {

    async workspaces(res: Response) {
        try {
            const workspaces = await prisma.workspace.findMany()
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
                    id: nanoid(6),
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
                    description: error
                })
            }

            const { workspaceId } = request.data

            if (!workspaceId) {
                return res.status(400).send("workspace undefined")
            }

            await prisma.workspace.update({
                where: {id: workspaceId},
                data: {
                    completedAt: new Date()
                }
            })
            return res.status(201).end()

        } catch (error) {
            return res.status(500).send(error)
        }
    }

}