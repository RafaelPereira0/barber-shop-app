import axios from 'axios'
import { setAccessToken } from './token'
import { emitLogout } from './authEvents'

export const api = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

api.interceptors.response.use(
    response => response,

    async error => {
        const originalRequest = error.config

        if(error.response.status === 403 && !originalRequest._retry){
            originalRequest._retry = true

            try{
                const response = await api.post('/refresh')

                const newToken = response.data.accessToken

                setAccessToken(newToken)

                originalRequest.headers.Authorization = `Bearer ${newToken}`

                return api(originalRequest)
            }catch{
                emitLogout()

                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }
)