import { AppointmentStatus, User, UserRole } from "@prisma/client";
import appointmentRepository from "../repositories/appointment.repository";
import userRepository from "../repositories/user.repository";
import { AppointmentStatusDTO, CreateAppointmentDTO } from "../types/Appointment.type";
import { AuthUser } from "../types/User.type";
import serviceRepository from "../repositories/service.repository";

class AppointmentService {

    async createAppointment(clientId: number, data: CreateAppointmentDTO) {
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

        const service = await serviceRepository.findById(data.serviceId);

        if (!service) {
            throw new Error("Serviço não encontrado.");
        }

        const hour = appointmentDate.getHours();

        if (hour < 9 || hour >= 18) {
            throw new Error("A barbearia funciona apenas das 09:00 às 18:00.");
        }

        // Não permitir domingo
        if (appointmentDate.getDay() === 0) {
            throw new Error("A barbearia não funciona aos domingos.");
        }

        // Buscar todos os agendamentos do barbeiro no mesmo dia
        const startDay = new Date(appointmentDate);
        startDay.setHours(0, 0, 0, 0);

        const endDay = new Date(appointmentDate);
        endDay.setHours(23, 59, 59, 999);

        const appointments =
            await appointmentRepository.findByBarberAndDate(
                data.barberId,
                startDay,
                endDay
            );

        // Horário final do novo agendamento
        const newStart = appointmentDate;

        const newEnd = new Date(
            newStart.getTime() + service.duration * 60000
        );

        for (const appointment of appointments) {

            const existingStart = appointment.date;

            const existingEnd = new Date(
                existingStart.getTime() +
                appointment.service.duration * 60000
            );

            const overlap =
                newStart < existingEnd &&
                newEnd > existingStart;

            if (overlap) {
                throw new Error("O barbeiro já possui um agendamento nesse horário.");
            }
        }

        // Criar agendamento
        return appointmentRepository.create({
            clientId,
            barberId: data.barberId,
            serviceId: data.serviceId,
            date: appointmentDate
        });
    }

    async updateStatus(appointmentId: number, status: AppointmentStatus, user: AuthUser) {
        const appointment = await appointmentRepository.findById(appointmentId)

        if (!appointment) {
            throw new Error("Agendamento não encontrado")
        }

        if ((status === AppointmentStatus.CONFIRMED || status === AppointmentStatus.FINISHED) && user.role === UserRole.CLIENT) {
            throw new Error("Clientes não têm permissão para confirmar ou finalizar agendamentos.")
        }

        if (user.role === UserRole.BARBER && appointment.barberId !== user.id) {
            throw new Error("Você não pode gerenciar o agendamento de outro barbeiro.")
        }

        if (status === AppointmentStatus.CANCELED && user.role === UserRole.CLIENT && appointment.clientId !== user.id) {
            throw new Error("Você não pode cancelar o agendamento de outra pessoa.")
        }
        
        const appointmentUpdated = await appointmentRepository.updateStatus(appointmentId, status)

        return {
            status: appointmentUpdated.status
        }
    }

    async cancelAppointment(appointmentId: number, user: AuthUser) {
        const appointment = await appointmentRepository.findById(appointmentId)

        if (!appointment) {
            throw new Error("Agendamento não encontrado")
        }

        if (
            user.role === UserRole.CLIENT &&
            appointment.clientId !== user.id
        ) {
            throw new Error("Você não pode cancelar esse agendamento.");
        }

        if (appointment.status === AppointmentStatus.FINISHED) {
            throw new Error("Agendamento já finalizado.");
        }

        if (user.role === UserRole.CLIENT) {
            const agora = new Date();
            const dataAgendamento = new Date(appointment.date);

            const diferencaEmHoras = (dataAgendamento.getTime() - agora.getTime()) / (1000 * 60 * 60);

            if (diferencaEmHoras < 2) {
                throw new Error("Agendamentos só podem ser cancelados com até 2 horas de antecedência.");
            }
        }

        return appointmentRepository.updateStatus(
            appointmentId,
            AppointmentStatus.CANCELED
        );

    }

    async findAll(userid: number, userRole: any) {
        if (userRole === UserRole.CLIENT) {
            return appointmentRepository.findByClient({ clientId: userid })
        }

        if (userRole === UserRole.BARBER) {
            return appointmentRepository.findByBarber({ barberId: userid })
        }

        return appointmentRepository.findAll()
    }
}

export default new AppointmentService()