import { Request, Response } from "express";
import * as z from "zod"
import { prisma } from "../app"
import { nanoid } from "nanoid";
import { sizeTeamId, sizeTeamMemberId } from "../Server";

export class TeamController {

    async teams(req: Request, res: Response) {
        try {
            const teams = await prisma.team.findMany({
                include: {
                    members: { select: { id: true, memberId: true, nameMember: true } },
                }
            })

            return res.status(200).send(teams)
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    async create(req: Request, res: Response) {
        try {

            const reqSchema = z.object({
                name: z.string(),
                description: z.string(),
                managerId: z.string(),
                workspaceId: z.string()
            })

            const request = reqSchema.safeParse(req.body)

            if (!request.success) {
                return res.status(400).json({
                    error: "Invalid data!",
                    description: request.error
                })
            }

            const { name, description, managerId, workspaceId } = request.data

            await prisma.team.create({
                data: {
                    id: nanoid(sizeTeamId),
                    name,
                    description,
                    managerId,
                    workspaceId
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
                teamId: z.string(),
                memberId: z.string()
            })

            const request = reqSchema.safeParse(req.body)
            if (!request.success) {
                return res.status(400).json({
                    error: "Invalid data",
                    description: request.error
                })
            }

            const { teamId, memberId } = request.data

            const userName = await prisma.user.findUnique({
                where: {
                    id: memberId
                },
                select: {
                    name: true
                }
            })

            await prisma.teamsMembers.create({
                data: {
                    id: nanoid(sizeTeamMemberId),
                    teamId,
                    memberId,
                    nameMember: userName?.name!
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
                managerId: z.string(),
                teamMemberId: z.string()
            })

            const request = reqSchema.safeParse(req.body)
            if (!request.success) {
                return res.status(400).json(
                    {
                        error: "Invalid Data",
                        description: request.error
                    }
                )
            }

            const { managerId, teamMemberId } = request.data
            const teamMemberManagerId = await prisma.teamsMembers.findUnique({
                where: {
                    id: teamMemberId
                },
                select: {
                    team: {
                        select: {
                            managerId: true
                        }
                    }
                }
            })

            const isManager = managerId === teamMemberManagerId?.team.managerId

            if (!isManager) {
                return res.status(400).send("The user is not the team manager")
            }

            await prisma.teamsMembers.delete({
                where: {
                    id: teamMemberId
                }
            })

            return res.status(201).end()

        } catch (error) {
            return res.status(500).send(error)
        }
    }
}