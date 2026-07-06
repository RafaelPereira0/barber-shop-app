import { api } from "./axios";

export interface AvailabilityData{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

export async function getBarberAvailability(barberId: number) {
    const response = await api.get(`/availability/barber/${barberId}`)

    return response.data.result
}

export async function setBarberAvailability(barberId: number, data: AvailabilityData) {
    const response = await api.post(`/availability/create/${barberId}`, data)

    return response.data
}