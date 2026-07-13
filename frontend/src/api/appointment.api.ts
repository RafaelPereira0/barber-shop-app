import type { AppointmentType, CreateAppointmentData, GetAvailableSlotsParams, TimeSlot } from "../types/appointment";
import { api } from "./axios";

export async function getAppointments(): Promise<AppointmentType[]>{
    const response = await api.get("/appointment/all")

    return response.data.result
}

export async function createAppointment(data: CreateAppointmentData) {
    const response = await api.post("/appointment/create", data)

    return response.data
}

export async function updateAppointmentStatus(id: number, status: string) {
    const response = await api.patch(`/appointment/update/${id}`, {status})

    return response.data
}

export async function cancelAppointment(id:number) {
    const response = await api.patch(`/appointment/cancel/${id}`)

    return response.data
}

export async function getAvailableSlots(params: GetAvailableSlotsParams): Promise<TimeSlot[]> {
    const response = await api.get("/availability/slots", {
        params: {
            barberId: params.barberId,
            date: params.date,
            serviceId: params.serviceId
        }
    })

    return response.data
}

