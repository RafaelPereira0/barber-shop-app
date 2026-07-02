import type { AppointmentType, CreateAppointmentData } from "../types/appointment";
import { api } from "./axios";

export async function getAppointments(): Promise<AppointmentType[]>{
    const response = await api.get("/appointment/all")

    return response.data
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

