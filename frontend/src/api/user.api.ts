import type { UserFormData, UserType } from "../types/user";
import { api } from "./axios";

export async function getUsers(): Promise<UserType[]> {
    const response = await api.get("/user/all")

    return response.data.result
}

export async function getBarbers(): Promise<UserType[]> {
    const response = await api.get("/user/barber")

    return response.data.result
}

export async function createBarber(data: UserFormData) {
    const response = await api.post("/user/create/barber", data)

    return response.data
}

export async function createUser(data :UserFormData) {
    const response = await api.post("user/create", data)
    console.log('api')
    console.log(response)
    return response.data
}

export async function updateUser(id: number, data: Partial<UserFormData>) {
    const response = await api.patch(`/user/update/${id}`, data)

    return response.data
}

export async function deleteUser(id:number){
    const response = await api.delete(`/user/delete/${id}`)

    return response.data
}