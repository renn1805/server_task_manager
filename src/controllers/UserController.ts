import * as z from "zod"
import { Request, Response } from "express"
import { prisma } from "../app"
import { hashPassword, comparePassword } from "../utils/BcryptFunctions"
import { nanoid } from "nanoid"
import { sizeUserId } from "../Server"

export default class UserController {
    
    async users(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany()
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
                    position: z.string()
                }
            )

            const request = reqSchema.safeParse(req.body)
            if (!request.success) {
                return res.status(400).json({
                    error: "Invalid data",
                    description: request.error
                })
            }

            const { position, name, email, password } = request.data
            
            await prisma.user.create({
                data: {
                    id: nanoid(sizeUserId),
                    name: name.toLowerCase(),
                    email: email.toLowerCase(),
                    password: await hashPassword(password),
                    position: position.toLowerCase()
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
            const user = await prisma.user.findUnique({
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
            await prisma.user.delete({
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