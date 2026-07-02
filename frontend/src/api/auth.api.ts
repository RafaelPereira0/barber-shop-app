import {api} from "./axios";

export async function login(email: string, password: string) {
    const response = await api.post("/login/auth",{
        email,
        password
    })

    return response.data
}