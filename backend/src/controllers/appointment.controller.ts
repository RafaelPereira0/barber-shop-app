import { Request, Response } from "express";
import appointmentService from "../services/appointment.service";
import { AuthUser } from "../types/User.type";
import { createAppointmentSchema } from "../validations/appointment.validation";

class AppointmentController {

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const clientId = Number(req.user?.id)
            const data = createAppointmentSchema.parse(req.body)

            const appointment = await appointmentService.createAppointment(
                clientId,
                data
            )

            return res.status(201).json({ result: appointment, message: "Agendamento criado com sucesso!" })
        } catch (err: any) {
            return res.status(400).json({ error: err.message })
        }
    }

    async updateStatus(req: Request, res: Response): Promise<Response> {
        try {
            const idAppointment = Number(req.params.id)
            const user: AuthUser = {
                id: Number(req.user!.id),
                role: req.user!.role
            };
            const updatedAppointment = await appointmentService.updateStatus(idAppointment, req.body.status, user)

            return res.status(200).json(updatedAppointment)
        } catch (err: any) {
            return res.status(400).json({ error: err.message })
        }
    }

    async cancelAppointment(req: Request, res: Response): Promise<Response> {
        try {
            const idAppointment = Number(req.params.id)
            const user: AuthUser = {
                id: Number(req.user!.id),
                role: req.user!.role
            };

            const appointment = await appointmentService.cancelAppointment(idAppointment, user)

            return res.status(200).json({ result: appointment, message: "Status do agendamento atualizado!" })
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