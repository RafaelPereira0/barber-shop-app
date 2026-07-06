import appointmentRepository from "../repositories/appointment.repository";
import availabilityRepository from "../repositories/availability.repository";
import serviceRepository from "../repositories/service.repository";
import { AvailabilityDTO, SearchAvailabilityDTO, TimeSlotDTO } from "../types/Availability.type";

class AvailabilityService {

    async setAvailability(barberId: number, data: AvailabilityDTO) {
        const { dayOfWeek, startTime, endTime } = data

        if (dayOfWeek < 0 || dayOfWeek > 6) {
            throw new Error("Dia da semana inválido")
        }

        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            throw new Error("Formato de horário inválido. Use o padrão HH:MM (ex: 09:00).");
        }

        const startNum = Number(startTime.replace(":", ""));
        const endNum = Number(endTime.replace(":", ""));

        if (startNum >= endNum) {
            throw new Error("O horário de início do atendimento não pode ser maior ou igual ao horário de término.");
        }

        return await availabilityRepository.upsert(barberId, data);
    }

    async getBarberAvailability(barberId: number) {
    if (!barberId) {
      throw new Error("Selecione um barbeiro.");
    }

    const schedule = await availabilityRepository.findByBarberId(barberId);
    return schedule;
  }

  async getAvailableSlots(query: SearchAvailabilityDTO): Promise<TimeSlotDTO[]>{
    const { barberId, date, serviceId } = query

    const parsedDate = new Date(`${date}T00:00:00`)
    const dayOfWeek = parsedDate.getDay()

    const availability = await availabilityRepository.availabilitySlot(barberId, dayOfWeek)

    if(!availability) return []

    const service = await serviceRepository.findById(serviceId)
    if(!service) throw new Error("Serviço não encontrado")
    
    const serviceDuration = service.duration

    const startOfDay = new Date(`${date}T00:00:00`)
    const endOfDay = new Date(`${date}T23:59:59`)

    const appointments = await appointmentRepository.findByBarberAndDate(barberId, startOfDay, endOfDay)

    const busySlots = appointments.map(app => {
      const appTime = new Date(app.date);
      const startMinutes = appTime.getHours() * 60 + appTime.getMinutes();
      return { start: startMinutes, end: startMinutes + serviceDuration };
    });

    const slots: TimeSlotDTO[] = [];
    const [startHour, startMin] = availability.startTime.split(":").map(Number);
    const [endHour, endMin] = availability.endTime.split(":").map(Number);

    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    while (currentMinutes + serviceDuration <= endMinutes) {

      const hour = Math.floor(currentMinutes / 60).toString().padStart(2, "0");
      const min = (currentMinutes % 60).toString().padStart(2, "0");
      const timeString = `${hour}:${min}`;

      const isBusy = busySlots.some(busy => {

        return currentMinutes < busy.end && (currentMinutes + serviceDuration) > busy.start;
      });

      slots.push({
        time: timeString,
        available: !isBusy
      });

      currentMinutes += serviceDuration;
    }

    return slots;
  }
}

export default new AvailabilityService();