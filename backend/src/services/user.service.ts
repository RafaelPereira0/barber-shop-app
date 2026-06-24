import userRepository from "../repositories/user.repository"
import { CreateUserDTO } from "../types/Auth.types"
import bcrypt from "bcryptjs"
import { UpdateUserDTO, UserResponseDTO } from "../types/User.type"

class UserService {

    async findAll(): Promise<UserResponseDTO[]>{
        const allUsers = await userRepository.findAll()

        return allUsers.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }))
    }


    async createUser(data: CreateUserDTO) {
        const userExists = await userRepository.findByEmail(data.email)

        if (userExists) {
            throw new Error("E-mail já cadastrado!")
        }

        const hashedPassword = await bcrypt.hash(data.password, 8)
        
        return await userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: "CLIENT"
        })

    }

    async createBarber(data: CreateUserDTO){
        const userExists = await userRepository.findByEmail(data.email)

        if (userExists) {
            throw new Error("E-mail já cadastrado!")
        }

        const hashedPassword = await bcrypt.hash(data.password, 8)

        return await userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: "BARBER"
        })
    }

    async updateUser(id:number, data: UpdateUserDTO): Promise<UserResponseDTO>{
        const userExists = await userRepository.findById(id)
        if(!userExists){
            throw new Error("Usuário não encontrado")
        }

        if(data.password){
            data.password = await bcrypt.hash(data.password, 10)
        }

        const updatedUser = await userRepository.update(id, data)

        return {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        }
    }
}

export default new UserService()