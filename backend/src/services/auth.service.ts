import userRepository from "../repositories/user.repository"
import { LoginDTO } from "../types/Auth.types"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT = process.env.JWT_SECRET || "9f8a7b6c5d4e3f2a1b9c8d7e6f5a4b3c"

class AuthService{

    async login(credentials: LoginDTO){

        const user = await userRepository.findByEmail(credentials.email)
        if(!user) throw new Error("Email ou senha inválidos")

        const passwordValid = await bcrypt.compare(credentials.password, user.password)
        if(!passwordValid) throw new Error("Email ou senha inválidos")

        const token = jwt.sign(
            {id: user.id, role: user.role},
            JWT,
            {expiresIn: '1d'}
        )

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        }
    }
}

export default new AuthService()