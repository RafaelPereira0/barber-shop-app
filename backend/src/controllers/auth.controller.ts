import { Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {

    async login(req: Request, res: Response): Promise<Response>{
        try{
            const result = await authService.login(req.body)

            return res.status(200).json({message: "Login feito com sucesso", result: result})
        }catch(err: any){
            return res.status(401).json({error: err.message})
        }
    }
}

export default new AuthController()