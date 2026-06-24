import { CreateAppointmentDTO } from "../types/Appointment.type";
import prisma from "../config/database"

class AppointmentRepository{

    async create(data: {date: Date; clientId: number; barberId: number; serviceId: number}){
        return await prisma.appointment.create({data: {
            date: data.date,
            barberId: data.barberId,
            userId: data.clientId,
            serviceId: data.serviceId
        }})
    }
}

export default new AppointmentRepository()