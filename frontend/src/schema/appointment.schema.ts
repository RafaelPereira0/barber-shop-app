import z from "zod";

export const AppointmentSchema = z.object({
    barberId: z.number({message: "Selecione um barbeiro"}).int().positive(),

    serviceId: z.number({message:"Selecione um serviço"}).int().positive(),

    date: z.string()
})

export type AppointmentFormData = z.infer<typeof AppointmentSchema>