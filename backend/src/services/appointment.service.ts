import appointmentRepository from "../repositories/appointment.repository";
import { CreateAppointmentDTO } from "../types/Appointment.type";

class AppointmentService {

    async createAppointment({date, clientId, barberId, serviceId}: CreateAppointmentDTO){
        const appointmentDate = new Date(date);

        if(appointmentDate < new Date()){
            throw new Error("Não é possível fazer agendamentos em dias passados!")
        }
        
        return await appointmentRepository.create({
            date: appointmentDate,
            clientId,
            barberId,
            serviceId
        })
    }
}

export default new AppointmentService()