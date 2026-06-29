import { User, UserRole } from "@prisma/client";
import appointmentRepository from "../repositories/appointment.repository";
import userRepository from "../repositories/user.repository";
import { CreateAppointmentDTO } from "../types/Appointment.type";
import { AuthUser } from "../types/User.type";

class AppointmentService {

    async createAppointment(clientId:number, data: CreateAppointmentDTO) {
        const appointmentDate = new Date(data.date);

        if (appointmentDate < new Date()) {
            throw new Error("Não é possível fazer agendamentos em dias passados!")
        }

        const barber =
        await userRepository.findById(data.barberId)

        if (!barber) {
            throw new Error("Barbeiro não encontrado")
        }

        if (barber.role !== UserRole.BARBER) {
            throw new Error("Usuário informado não é barbeiro")
        }

        const conflict =
            await appointmentRepository.findByBarberAndDate(data.barberId, appointmentDate)

        if (conflict) {
            throw new Error("Horário indisponível")
        }

        return appointmentRepository.create({

            clientId,

            barberId: data.barberId,

            serviceId: data.serviceId,

            date: appointmentDate

        })
    }

    async findAll(userid: number, userRole: any){
        if(userRole === UserRole.CLIENT){
            return appointmentRepository.findByClient({clientId: userid})  
        }

        if(userRole === UserRole.BARBER){
            return appointmentRepository.findByBarber({barberId: userid})
        }

        return appointmentRepository.findAll()
    }
}

export default new AppointmentService()