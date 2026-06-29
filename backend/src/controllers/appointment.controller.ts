import { Request, Response } from "express";
import appointmentService from "../services/appointment.service";

class AppointmentController {

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const clientId = Number(req.user?.id)
            const { date, barberId, serviceId } = req.body

            const appointment = await appointmentService.createAppointment(
                clientId,
                {
                    date,
                    barberId,
                    clientId,
                    serviceId
                })

            return res.status(201).json({ result: appointment, message: "Agendamento criado com sucesso!" })
        } catch (err: any) {
            return res.status(400).json({ error: err.message })
        }
    }

    async findAll(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number(req.user?.id)
            const userRole = req.user?.role

            const appointments = await appointmentService.findAll(userId, userRole)

            return res.status(200).json({ result: appointments, message: "Agendamentos encontrados!" })
        } catch (err: any) {
            return res.status(400).json({ error: err.message })
        }
    }
}

export default new AppointmentController()