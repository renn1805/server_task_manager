import { app, prisma } from "./app"
import * as z from "zod"

import User, * as U from "./User"
import Task from "./Task"

import { TaskStatus } from "./enum/TaskStatus"
import { TaskDifficulty } from "./enum/TaskDifficulty"
import id from "zod/v4/locales/id.js"
import { truncate } from "node:fs"


const port = 3000
app.listen(port, () => console.log("The server is running"))

app.get("/users", async (req, res) => {
    try {

        const users = await prisma.users.findMany()
        return res.status(200).send(users)

    } catch (error) {

        return res.status(500).send(error)

    }

})

app.post("/users", async (req, res) => {

    try {

        const reqSchema = z.object(
            {
                name: z.string(),
                email: z.email(),
                password: z.string().min(8),
            }
        )

        const request = reqSchema.safeParse(req.body)

        if (!request.success) {
            return res.status(400).json({
                error: "Invalid data",
                description: request.error
            })
        }

        const { name, email, password } = request.data

        await prisma.users.create({
            data: {
                name: name,
                email: email,
                password: password
            }
        })

        return res.status(201).end()


    } catch (error) {
        return res.status(500).send(error)
    }

})

app.post("/users/delete", async (req, res) => {

    try {

        const reqSchema = z.object({
            email: z.email(),
            password: z.string()
        })

        const request = reqSchema.safeParse(req.body)

        if (!request.success) {
            return res.status(400).json({
                error: "Invalid data",
                description: request.error
            })
        }

        const { email, password } = request.data

        const prismaUser = await prisma.users.delete({
            where: {
                email: email,
                password: password
            }
        })

        return res.status(204).end()

    } catch (error) {
        return res.status(500).send(error)
    }

})

app.post("/users/task", async (req, res) => {

    try {

        const reqSchema = z.object({
            id: z.number().int(),
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

        const { id, title, description, status, difficulty } = request.data

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
                title: title,
                description: description,
                difficulty: difficultyConverted,
                status: taskStateConverted,
                creatorId: id
            }
        })

        return res.status(201).end()

    } catch (error) {
        return res.status(500).send(error)
    }
})