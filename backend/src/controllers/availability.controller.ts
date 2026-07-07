import { UserRole } from "@prisma/client";
import { Request, Response } from "express";
import availabilityService from "../services/availability.service";

class AvailabilityController {
    
    async setAvailability(req: Request, res: Response): Promise<Response>{
        try{
            const {barberId} = req.params
            const {dayOfWeek, startTime, endTime} = req.body
            const user = req.user

            if(user?.role !== UserRole.ADMIN && Number(user?.id) !== Number(barberId)){
                return res.status(400).json({error: "Acesso negado. Você só pode mudar sua agenda!"})
            }

            const availability = await availabilityService.setAvailability(Number(barberId), {
                dayOfWeek: Number(dayOfWeek),
                startTime,
                endTime
            })

            return res.status(200).json({message: "Horário de atendimento atualizado", result: availability})
        }catch(err: any){
            return res.status(400).json({ error: err.message });
        }
    }

    async getBarberAvailability(req: Request, res: Response){
        try{
            const {barberId} = req.params

            const schedule = await availabilityService.getBarberAvailability(Number(barberId))

            return res.status(200).json({ result: schedule });
        }catch(err:any){
            return res.status(400).json({ error: err.message });
        }
    }

    async getAvailableSlots(req: Request, res: Response) {
    try {
      const { barberId, date, serviceId } = req.query;

      if (!barberId || !date || !serviceId) {
        return res.status(400).json({ error: "Faltam parâmetros obrigatórios: barberId, date, serviceId" });
      }

      const slots = await availabilityService.getAvailableSlots({
        barberId: Number(barberId),
        date: String(date),
        serviceId: Number(serviceId)
      });

      return res.status(200).json({ result: slots });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export default new AvailabilityController()