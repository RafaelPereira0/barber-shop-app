import { Request, Response } from "express";
import userService from "../services/user.service";

class UserController{
    
    async register(req: Request, res: Response): Promise<Response>{
        try{
            const newUser = await userService.create(req.body)

            return res.status(201).json({message: "Usuário criado com sucesso", result: newUser})
        }catch(err: any){
            return res.status(400).json({error: err.message})
        }
    }
}

export default new UserController()