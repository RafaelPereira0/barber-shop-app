import { User } from "@prisma/client"
import userRepository from "../repositories/user.repository"
import { LoginDTO } from "../types/Auth.types"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT = process.env.JWT_SECRET
const REFRESH_TOKEN = process.env.REFRESH_JWT_SECRET

class AuthService{

    async login(credentials: LoginDTO){

        const user = await userRepository.findByEmail(credentials.email)
        if(!user) throw new Error("Email ou senha inválidos")

        const passwordValid = await bcrypt.compare(credentials.password, user.password)
        if(!passwordValid) throw new Error("Email ou senha inválidos")

        const accessToken = jwt.sign(
            {id: user.id, role: user.role},
            JWT!,
            {expiresIn: '15m'}
        )

        const refreshToken = jwt.sign(
            {id: user.id, role: user.role},
            REFRESH_TOKEN!,
            {expiresIn: '7d'}
        )

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        }
    }

    async refresh(refreshToken: string): Promise<{newAccessToken: string}>{
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, REFRESH_TOKEN!, async (err: any, decoded: any) => {
            if(err) return reject(new Error("Refresh inválido"))

            const user = await userRepository.findById(decoded.id);

            if (!user) {
                    return reject(new Error("Usuário não encontrado"));
            }

            const newAccessToken = jwt.sign({
                id: user.id, role: user.role
            }, JWT!, { expiresIn: '15m'})

            resolve({
                newAccessToken
            }) 
        })
        })
    }
}

export default new AuthService()