import bcrypt from "bcrypt"

//? serve para declarar quanto do processador vai ser utilizado, o comum é colocar 10
const saltRounds = 10

async function hashPassword (password: string): Promise<string>{

    const salt = await bcrypt.genSalt(saltRounds)
    const hash = bcrypt.hashSync(password, salt)

    return hash

}

async function comparePassword (password: string, hash: string): Promise<boolean>{

    const match = await bcrypt.compare(password, hash)
    return match

}

export {hashPassword, comparePassword}