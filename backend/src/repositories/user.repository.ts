import { User } from "@prisma/client"
import prisma from "../config/database"
import { CreateUserDTO } from "../types/Auth.types"
import { UpdateUserDTO, UserResponseDTO } from "../types/User.type"


class UserRepository{

    async findAll(): Promise<UserResponseDTO[]>{
        return await prisma.user.findMany()
    }

    async findById(id: number): Promise<User | null>{
        return await prisma.user.findUnique({where: {
            id
        }})
    }   

    async findByEmail(email: string){
        return await prisma.user.findUnique({
            where: {email: email}
        })
    }

    async create(data: CreateUserDTO){
        return await prisma.user.create({data})
    }

    async update(id:number, data: UpdateUserDTO): Promise<User>{
        return await prisma.user.update({
            where: {id},
            data
        })
    }

    async deleteUser(id: number){
        return await prisma.user.delete({
            where: {
                id: id
            }
        })
    }
}

export default new UserRepository()