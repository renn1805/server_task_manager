import { TaskDifficulty } from "../enum/TaskDifficulty"
import { TaskStatus } from "../enum/TaskStatus"
import { prisma } from "../app"
import * as z from "zod"
import { Request, Response } from "express"


export default class TaskController {

    async create(req: Request, res: Response) {
        try {
            const reqSchema = z.object({
                creatorId: z.number().int(),
                title: z.string().max(50),
                description: z.string(),
                status: z.union([z.literal(0), z.literal(1), z.literal(2)]),
                difficulty: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
            })

            const request = reqSchema.safeParse(req.body)

            if (!request.success) {
                return res.status(400).json({
                    error: "Invalid data!",
                    description: request.error
                })
            }

            const { creatorId, title, description, status, difficulty } = request.data

            const difficultyMap = {
                0: TaskDifficulty.Undefined,
                1: TaskDifficulty.Easy,
                2: TaskDifficulty.Medium,
                3: TaskDifficulty.Hard
            }
            const difficultyConverted = difficultyMap[difficulty as keyof typeof difficultyMap] ?? TaskDifficulty.Undefined

            const stateMap = {
                0: TaskStatus.Pending,
                1: TaskStatus.InProgress,
                2: TaskStatus.Finished
            }
            const taskStateConverted = stateMap[status as keyof typeof stateMap] ?? TaskStatus.Pending

            await prisma.tasks.create({
                data: {
                    title: title.toLowerCase(),
                    description: description.toLowerCase(),
                    difficulty: difficultyConverted,
                    status: taskStateConverted,
                    creatorId: creatorId
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
                taskId: z.number().int(),
                userId: z.number().int()
            })

            const request = reqSchema.safeParse(req.body)

            if (!request.success) {
                return res.status(400).json({
                    error: "Invalid data!",
                    description: request.error
                })
            }

            const { taskId, userId } = request.data

            await prisma.tasks.delete({
                where: {
                    id: taskId,
                    creatorId: userId
                }
            })

            return res.status(204).end()

        } catch (error) {
            return res.status(500).send(error)
        }
    }
}