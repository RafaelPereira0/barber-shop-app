import { api } from "./axios";

export async function forgotPass(email:string) {
    const response = await api.post('/password/forgot', {email})

    return response.data
}

export async function resetPass(token: string, newPassword: string) {
    const response = await api.post('/password/reset', {token, newPassword})

    return response
}