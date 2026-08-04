import { Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const result = await authService.login(req.body)


            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 7 * 20 * 60 * 60 * 1000
            })

            return res.status(200).json({ message: "Login feito com sucesso", accessToken: result.accessToken, user: result.user })
        } catch (err: any) {
            return res.status(401).json({ error: err.message })
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken

            if (!refreshToken) {
                return res.status(401).json({ message: "Refresh expirado" })
            }

            const result = await authService.refresh(refreshToken)

            return res.status(200).json({accessToken: result.newAccessToken, user: result.user})

        } catch (err: any) {
            return res.status(401).json({ error: err.message })
        }

    }

    async logout(req: Request, res: Response){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: 'lax'
        })

        return res.status(200).json({
            message: "Deslogado com sucesso!"
        })
    }
}

export default new AuthController()