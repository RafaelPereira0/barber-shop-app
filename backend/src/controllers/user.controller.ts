import { Request, Response } from "express";
import userService from "../services/user.service";
import { createUserSchema } from "../validations/user.validation";

class UserController{

    async getAllUsers(req: Request, res: Response): Promise<Response> {
        try{
            const users = await userService.findAll()

            return res.status(200).json({message: "Usuários encontrados", result: users})
        }catch(err: any){
            return res.status(400).json({error: err.message})
        }
    }

    async getBarbers(req: Request, res: Response): Promise<Response> {
        try{
            const barbers = await userService.findAllBarbers()

            return res.status(200).json({message: "Usuários encontrados", result: barbers})
        }catch(err: any){
            return res.status(400).json({error: err.message})
        }
    }
    
    async userRegister(req: Request, res: Response): Promise<Response>{
        try{
            const data = createUserSchema.parse(req.body)
            const newUser = await userService.createUser(data)

            return res.status(201).json({message: "Usuário criado com sucesso", result: [newUser.name, newUser.email, newUser.role]})
        }catch(err: any){
            return res.status(400).json({error: err.message})
        }
    }

    async barberRegister(req: Request, res: Response): Promise<Response>{
        try{
            const data = createUserSchema.parse(req.body)
            const newBarber = await userService.createBarber(data)

            return res.status(201).json({message: "Barbeiro criado com sucesso", result: [newBarber.name, newBarber.email, newBarber.role]})
        }catch(err: any){
            return res.status(400).json({error: err.message})
        }
    }

    async updateUser(req: Request, res: Response): Promise<Response>{
        try{
            const idNumber = Number(req.params.id)
            const updatedData = req.body

            const updateUser = await userService.updateUser(idNumber, updatedData)

            return res.status(200).json({message: "Usuário atualizado com sucesso", result: updateUser})
        }catch(err:any){
            return res.status(400).json({error: err.message})
        }
    }

    async deleteUser(req: Request, res: Response): Promise<Response>{
        try{
            const idNumber = Number(req.params.id)
            
            const deletedUser = await userService.deleteUser(idNumber)

            return res.status(200).json({message: "Usuário deletadocom sucesso", result: deletedUser})
        }catch(err:any){
            return res.status(400).json({error: err.message})
        }
    }
}

export default new UserController()