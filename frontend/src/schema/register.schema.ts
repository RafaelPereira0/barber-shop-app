import z, { email } from "zod";

export const registerSchema = z.object({
    name: z.string().min(3, "O nome deve conter no mínimo 3 caracteres"),
    email: z.string().email("Insira um e-mail válido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
})

export type RegisterFormData = z.infer<typeof registerSchema>