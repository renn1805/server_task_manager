import Task from "./Task";
import { Users as PrismaUser } from '../generated/prisma/index.js'

export default class User {

    #id: number;
    #name: string;
    #email: string;
    #password: string;
    #tasks: Task[] = []
    
    
    constructor(id: number, name: string, email: string, password: string) {
        this.#id = id
        this.#name = name.toLowerCase();
        this.#email = email.toLowerCase();
        this.#password = password
    };

    static fromPrisma (prismaUser: PrismaUser ): User {
        return new User(
            prismaUser.id,
            prismaUser.name,
            prismaUser.email,
            prismaUser.password,
        )
    }
    
    get name() {return this.#name}
    get email() {return this.#email}
    get tasks() {return this.#tasks}

    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            email: this.#email,
            tasks: this.#tasks
        }
    }

}