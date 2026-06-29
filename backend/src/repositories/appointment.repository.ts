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

    async findByBarberAndDate(barberId: number, appointmentDate: Date){
        return await prisma.appointment.findFirst({
            where:{
                barberId: barberId,
                date: appointmentDate
            }
        })
    }

    async findByClient(data: {clientId: number}){
        return await prisma.appointment.findMany({
            where:{
                userId: data.clientId
            }, include: {
                barber: true
            }
        })
    }

    async findByBarber(data: {barberId: number}){
        return await prisma.appointment.findMany({
            where: {
                barberId: data.barberId
            },include: { 
                user: true
            }
        })
    }

    async findAll(){
        return await prisma.appointment.findMany({
            include:{
                user: true,
                barber: true
            }
        })
    }
}

export default new AppointmentRepository()