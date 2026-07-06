import prisma from "../config/database";
import { AvailabilityDTO } from "../types/Availability.type";

class AvailabilityRepository {
    async upsert(barberId: number, data: AvailabilityDTO){
        return await prisma.availability.upsert({
            where: {
                barberId_dayOfWeek: {
                    barberId,
                    dayOfWeek: data.dayOfWeek
                },
            },
            update: {
                startTime: data.startTime,
                endTime: data.endTime
            },
            create: {
                barberId,
                dayOfWeek: data.dayOfWeek,
                startTime: data.startTime,
                endTime: data.endTime
            }
        })
    }

    async findByBarberId(barberId: number) {
        return await prisma.availability.findMany({
            where: {
                barberId
            },orderBy: {
                dayOfWeek: 'asc'
            }
        })
    }

    async availabilitySlot(barberId: number, dayOfWeek: number){
        return await prisma.availability.findUnique({
            where: {
                barberId_dayOfWeek:{
                    barberId: barberId,
                    dayOfWeek: dayOfWeek
                }
            }
        })
    }
}

export default new AvailabilityRepository()