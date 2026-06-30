import z from "zod";

export const createAppointmentSchema = z.object({
    barberId: z.number().int().positive(),
    serviceId: z.number().int().positive(),

    date: z.coerce.date()
})