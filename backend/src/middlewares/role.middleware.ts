import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const roleMiddleware = (...allowedRole: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const hasPermition = allowedRole.includes(req.user?.role as UserRole)

        if(!hasPermition){
            return res.status(403).json({error: "Acesso negado"})
        }

        return next()
    }
}