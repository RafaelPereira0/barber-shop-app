import prisma from "../config/database"
import { CreateUserDTO } from "../types/Auth.types"


class UserRepository{

    async findByEmail(email: string){
        return await prisma.user.findUnique({
            where: {email: email}
        })
    }

    async create(data: CreateUserDTO){
        return await prisma.user.create({data})
    }
}

export default new UserRepository()