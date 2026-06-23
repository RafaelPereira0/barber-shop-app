import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { UserRole } from "@prisma/client"

const JWT = process.env.JWT_SECRET || "9f8a7b6c5d4e3f2a1b9c8d7e6f5a4b3c"

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(4001).json({error: "Acesso Negado!"})
    }

    const token = authHeader.split(" ")[1]

    try{
        const decoded = jwt.verify(token, JWT) as unknown as {id: string; role: UserRole}

        req.user = {
            id: decoded.id,
            role: decoded.role
        }
    }catch(err: any){
        return res.status(401).json({error: "Token inválido ou expirado"})
    }
}