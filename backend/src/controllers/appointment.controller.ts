import { Request, Response } from "express";
import appointmentService from "../services/appointment.service";

class AppointmentController {

    async create(req: Request, res: Response): Promise<Response> {
        try{
            const clientId = Number(req.user?.id)
            const {date, barberId, serviceId} = req.body

            const appointment = await appointmentService.createAppointment({
                date,
                barberId,
                clientId,
                serviceId
            })

            return res.status(201).json({result: appointment, message: "Agendamento criado com sucesso!"})
        }catch(err: any){
            return res.status(400).json({error: err.message})
        }
    }
}

export default new AppointmentController()