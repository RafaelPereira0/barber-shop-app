import { AppointmentStatus } from "@prisma/client";
import prisma from "../config/database"

class AppointmentRepository {

    async create(data: { date: Date; clientId: number; barberId: number; serviceId: number }) {
        return await prisma.appointment.create({
            data: {
                date: data.date,
                barberId: data.barberId,
                clientId: data.clientId,
                serviceId: data.serviceId,
                status: AppointmentStatus.PENDING
            }
        })
    }

    async updateStatus(id: number, status: AppointmentStatus) {
        return await prisma.appointment.update({
            where: { id },
            data: { status }
        })
    }

    async findById(appointmentId: number) {
        return await prisma.appointment.findUnique({
            where: {
                id: appointmentId
            }
        })
    }

    async findByBarberAndDate(barberId: number, dateStart: Date, dateEnd: Date) {
        return await prisma.appointment.findMany({
            where: {
                barberId: barberId,

                date: {
                    gte: dateStart,
                    lte: dateEnd
                },

                status: {
                    in: [
                        "PENDING",
                        "CONFIRMED"
                    ]
                }
            },
            include: { service: true }

        })
    }

    async findByClient(data: { clientId: number }) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        return await prisma.appointment.findMany({
            where: {
                clientId: data.clientId,
                date: {
                    gte: hoje
                }
            }, include: {
                barber: true,
                service: true
            }
        })
    }

    async findByBarber(data: { barberId: number }) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        return await prisma.appointment.findMany({
            where: {
                barberId: data.barberId,
                date: {
                    gte: hoje
                }
            }, include: {
                client: true,
                service: true
            }
        })
    }

    async findAll() {
        return await prisma.appointment.findMany({
            include: {
                client: true,
                barber: true,
                service: true
            }
        })
    }
}

export default new AppointmentRepository()