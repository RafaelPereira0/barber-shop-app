import userRepository from "../repositories/user.repository"
import { CreateUserDTO } from "../types/Auth.types"
import bcrypt from "bcryptjs"

class UserService {


    async create(data: CreateUserDTO) {
        const userExists = await userRepository.findByEmail(data.email)

        if (userExists) {
            throw new Error("E-mail já cadastrado!")
        }

        const hashedPassword = await bcrypt.hash(data.password, 8)
        
        return await userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role
        })

    }
}

export default new UserService()