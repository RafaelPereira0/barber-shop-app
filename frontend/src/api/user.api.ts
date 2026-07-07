import type { BarberFormData, UserType } from "../types/user";
import { api } from "./axios";

export async function getUsers(): Promise<UserType[]> {
    const response = await api.get("/user/all")

    return response.data.result
}

export async function getBarbers(): Promise<UserType[]> {
    const response = await api.get("/user/barber")

    return response.data.result
}

export async function createBarber(data: BarberFormData) {
    const response = await api.post("/user/create/barber", data)

    return response.data
}

export async function updateUser(id: number, data: Partial<BarberFormData>) {
    const response = await api.patch(`/user/update/${id}`, data)

    return response.data
}

export async function deleteUser(id:number){
    const response = await api.delete(`/user/delete/${id}`)

    return response.data
}