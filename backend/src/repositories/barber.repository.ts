import prisma from "../config/database"
import { Barber } from "../types/Barber.type"


class BarberRepository {
    
    async findAll(): Promise<Barber[]>{
        return prisma.barber.findMany()
    }
}

export default new BarberRepository()