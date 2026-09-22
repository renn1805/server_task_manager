import { afterEach, describe, it, mock } from "node:test";
import { prisma } from "../../src/Server";
import { UserRepository } from "../../src/repository/UserRepository";
import assert from "node:assert";
import FailSearchError from "../../src/error/FailSearchError";

describe("UserRepository Tests", () => {

    const userRepository = new UserRepository()

    type selectUser = {
        select: {
            id?: true | undefined,
            name?: true | undefined,
            email?: true | undefined,
            password?: true | undefined,
        }
    }

    describe("findAll", () => {

        afterEach(() => { mock.restoreAll() })

        it("return all users", async () => {

            const mockUsers = [
                {
                    id: "1",
                    name: "User 1",
                    email: "user1@gmail.com",
                    password: "passwordUser1"
                },
                {
                    id: "2",
                    name: "User 2",
                    email: "user2@gmail.com",
                    password: "passwordUser2"
                },
                {
                    id: "3",
                    name: "User 3",
                    email: "user3@gmail.com",
                    password: "passwordUser3"
                },
                {
                    id: "4",
                    name: "User 4",
                    email: "user4@gmail.com",
                    password: "passwordUser4"
                }
            ];

            const mockResponse = mockUsers.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
            }))

            //?mocka a função de findMany simulando uma chamada comum
            mock.method(prisma.user, "findMany", async (query?: selectUser) => {
                if (!query) return mockUsers

                const selectedAttr = Object.entries(query.select).filter(attr => attr[1] === true).map(attr => attr[0])

                return mockUsers.map(user => {
                    return Object.fromEntries(Object.entries(user).filter(attr => selectedAttr.includes(attr[0])))
                })
            });

            const response = await userRepository.findAll()
            assert.deepStrictEqual(response, mockResponse)

        })

        it("in case of an error, it throws a FailSearchError", async () => {
            mock.method(prisma.user, "findMany", async () => {
                throw new Error("unexpected error")
            })

            await assert.rejects(
                userRepository.findAll(),
                FailSearchError
            )
        })
    })

})