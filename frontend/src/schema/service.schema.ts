import z from "zod";

export const ServiceSchema = z.object({
    name: z.string().min(3, "O nome deve ter mais de 3 caracteres"),
    price: z.number({error: "Preço obrigatório"}).positive(),
    duration: z.number({error: "Duração é obrigatória"})
})

export type ServiceFormData = z.infer<typeof ServiceSchema>