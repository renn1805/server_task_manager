import { any } from "zod";
import { prisma } from "../Server";
import FailSearchError from "../error/FailSearchError";

export class UserRepository {
    async findAll() {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            })
            return users
        } catch (error) { throw new FailSearchError() }
    }
}