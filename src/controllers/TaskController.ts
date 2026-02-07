import { Difficulty, difficultyMap } from "../enum/TaskDifficulty"
import { Status, stateMap } from "../enum/TaskStatus"
import { prisma } from "../app"
import * as z from "zod"
import { Request, Response } from "express"
import { nanoid } from "nanoid"
import { sizeTaskId } from "../Server"


export default class TaskController {
    async create(req: Request, res: Response) {
        try {
            const reqSchema = z.object({
                teamId: z.string(),
                managerId: z.string(),
                title: z.string().max(50),
                description: z.string(),
                status: z.union([z.literal(0), z.literal(1), z.literal(2)]),
                difficulty: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
                workspaceId: z.string().optional(),
                objectiveId: z.string().optional()
            })

            const request = reqSchema.safeParse(req.body)

            if (!request.success) {
                return res.status(400).json({
                    error: "Invalid data!",
                    description: request.error
                })
            }

            const { teamId, managerId, title, description, status, difficulty, workspaceId, objectiveId } = request.data

            const isTwoUndefined = workspaceId === undefined && objectiveId === undefined
            const isTwoDefined = workspaceId !== undefined && objectiveId !== undefined

            if (isTwoUndefined || isTwoDefined) {
                return res.status(400).json({
                    error: "Invalid Data",
                    description: "Choose only one of the options: workspaceId and objectiveId."
                })
            }

            const difficultyConverted = difficultyMap[difficulty as keyof typeof difficultyMap] ?? Difficulty.Undefined
            const stateConverted = stateMap[status as keyof typeof stateMap] ?? Status.Pending

            await prisma.task.create({
                data: {
                    id: nanoid(sizeTaskId),
                    title: title.toLowerCase(),
                    description: description.toLowerCase(),
                    difficulty: difficultyConverted,
                    status: stateConverted,
                    managerId: managerId,
                    teamId: teamId,
                    workspaceId: workspaceId !== undefined ? workspaceId : null,
                    objectiveId: objectiveId !== undefined ? objectiveId : null
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
                taskId: z.string(),
                userId: z.string()
            })

            const request = reqSchema.safeParse(req.body)

            if (!request.success) {
                return res.status(400).json({
                    error: "Invalid data!",
                    description: request.error
                })
            }

            const { taskId, userId } = request.data

            await prisma.task.delete({
                where: {
                    id: taskId,
                    managerId: userId
                }
            })

            return res.status(204).end()

        } catch (error) {
            return res.status(500).send(error)
        }
    }
}