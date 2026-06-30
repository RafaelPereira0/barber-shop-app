import z from "zod";

export const createServiceSchema = z.object({
    name: z.string().min(3, "nome muito curto"),
    price: z.number().positive(),
    duration: z.number().positive()
})