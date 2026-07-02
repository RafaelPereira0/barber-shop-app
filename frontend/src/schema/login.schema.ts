import {z} from 'zod'

export const LoginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha precisa ter no mínimo 6 caracteres")
})

export type LoginFormData = z.infer<typeof LoginSchema>