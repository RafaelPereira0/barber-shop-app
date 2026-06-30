import { AppointmentStatus } from "@prisma/client";

export interface CreateAppointmentDTO {
    date: Date;
    barberId: number;
    serviceId: number;
}
export interface AppointmentStatusDTO {
    status: AppointmentStatus
}