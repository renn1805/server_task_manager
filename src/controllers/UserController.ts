import * as z from "zod"
import { Request, Response } from "express"
import { prisma } from "../app"
import { hashPassword, comparePassword } from "../utils/BcryptFunctions"


export default class UserController {

    async users(req: Request, res: Response) {
        try {
            const users = await prisma.users.findMany()
            return res.status(200).send(users)
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    async create(req: Request, res: Response) {
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
            const emailAlreadyUsed = await prisma.users.findUnique({
                where: {
                    email: email
                }
            }) ? true : false

            if (emailAlreadyUsed) {
                return res.status(401).send("Email already used")
            }

            await prisma.users.create({
                data: {
                    name: name.toLowerCase(),
                    email: email.toLowerCase(),
                    password: await hashPassword(password)
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
            const user = await prisma.users.findUnique({
                where: {
                    email: email.toLowerCase()
                }
            })
            if (!user) {
                return res.status(400).send("User not found!")
            }
            if (!(comparePassword(password, user!.password))) {
                return res.status(400).send("Password not match!")
            }
            await prisma.users.delete({
                where: {
                    email: email
                }
            })

            return res.status(204).end()
        } catch (error) {
            return res.status(500).send(error)
        }

    }

}