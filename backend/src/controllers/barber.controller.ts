import { Request, Response } from "express"
import barberService from "../services/barber.service"

class BarberController {

    async index(req: Request, res: Response): Promise<Response> {
        try{
            const barbers  = await barberService.findAll()

            return res.status(200).json({message: "Barbeiros encontrados", result: barbers})
        }catch(err: any){
            return res.status(400).json({error: err.message})
        }
    }
}

export default new BarberController()