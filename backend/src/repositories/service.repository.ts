import prisma from "../config/database"
import { CreateServiceDTO } from "../types/Service.type";

class ServiceRepository {

    create(data: CreateServiceDTO) {
        return prisma.service.create({
            data
        });
    }

    findAll() {
        return prisma.service.findMany({
            orderBy: {
                name: "asc"
            }
        });
    }

    findById(id: number) {
        return prisma.service.findUnique({
            where: {
                id
            }
        });
    }

    update(id: number, data: Partial<CreateServiceDTO>) {
        return prisma.service.update({
            where: {
                id
            },
            data
        });
    }

    delete(id: number) {
        return prisma.service.delete({
            where: {
                id
            }
        });
    }
}

export default new ServiceRepository();