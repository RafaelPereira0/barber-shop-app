import type { CreateServiceData, UpdateServiceData } from "../types/service";
import { api } from "./axios";

export async function getServices(){
    const response = await api.get('/service/all')

    return response.data
}

export async function createService(data: CreateServiceData){
    const response = await api.post("/service/create", data)

    return response.data
}

export async function updateService(id:number, data: UpdateServiceData){
    const response = await api.patch(`/service/update/${id}`, data)

    return response.data
}

export async function deleteService(id:number){
    const response = await api.delete(`service/delete/${id}`)

    return response.data
}