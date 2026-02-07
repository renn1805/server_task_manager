import { Request, Response } from "express";
import { error } from "node:console";
import * as z from "zod"
import { Difficulty, difficultyMap } from "../enum/TaskDifficulty";
import { Status, stateMap } from "../enum/TaskStatus";
import { prisma } from "../app"
import { nanoid } from "nanoid";
import { sizeObjectiveId } from "../Server";

export default class ObjectiveController {

    async objectives(req: Request, res: Response) {
        try {
            const objectives = await prisma.objective.findMany({
                include: {
                    team: {
                        select: {
                            name: true
                        }
                    },
                    manager: {
                        select: {
                            name: true,
                            position: true
                        }
                    },
                    workspace: {
                        select: {
                            project_name: true,
                        }
                    },
                    tasks: {
                        select: {
                            title: true,
                            description: true
                        }
                    }
                }
            })
            return res.status(200).send(objectives)
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    async create(req: Request, res: Response) {
        try {

            const reqSchema = z.object({
                title: z.string(),
                description: z.string(),
                status: z.union([z.literal(0), z.literal(1), z.literal(2)]),
                difficulty: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
                workspaceId: z.string(),
                managerId: z.string(),
                teamId: z.string(),
            })

            const request = reqSchema.safeParse(req.body)
            if (!request.success) {
                return res.status(400).json({
                    error: "invalid data",
                    description: error
                })
            }

            const { title, description, status, difficulty, workspaceId, managerId, teamId } = request.data

            const difficultyConverted = difficultyMap[difficulty as keyof typeof difficultyMap] ?? Difficulty.Undefined
            const stateConverted = stateMap[status as keyof typeof stateMap] ?? Status.Pending

            await prisma.objective.create({
                data: {
                    id: nanoid(sizeObjectiveId),
                    title,
                    description,
                    status: stateConverted,
                    difficulty: difficultyConverted,
                    workspaceId,
                    managerId,
                    teamId
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
                objectiveId: z.string()
            })

            const request = reqSchema.safeParse(req.body)
            if (!request.success) {
                return res.status(400).json({
                    error: "Invalid data",
                    description: request.error
                })
            }

            const { objectiveId } = request.data

            await prisma.objective.update({
                where: {
                    id: objectiveId
                },
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