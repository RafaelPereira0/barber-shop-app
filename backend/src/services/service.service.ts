import { UserRole } from "@prisma/client";
import serviceRepository from "../repositories/service.repository";
import { CreateServiceDTO } from "../types/Service.type";


class ServiceService {

    async create(data: CreateServiceDTO) {

        if (!data.name.trim()) {
            throw new Error("Nome obrigatório.");
        }

        if (data.price <= 0) {
            throw new Error("Preço inválido.");
        }

        if (data.duration <= 0) {
            throw new Error("Duração inválida.");
        }

        return serviceRepository.create(data);
    }

    async findAll() {
        return serviceRepository.findAll();
    }

    async findById(id: number) {

        const service = await serviceRepository.findById(id);

        if (!service) {
            throw new Error("Serviço não encontrado.");
        }

        return service;
    }

    async update(id: number, data: Partial<CreateServiceDTO>, user: UserRole) {

        const updatedService = await this.findById(id);

        if (!updatedService) {
            throw new Error("Serviço não encontrado")
        }

        if (user === UserRole.CLIENT) {
            throw new Error("Sem Premissão")
        }

        return serviceRepository.update(id, data);
    }

    async delete(id: number, user: UserRole) {

        const service = await this.findById(id);

        if (!service) {
            throw new Error("Serviço não encontrado")
        }

        if (user === UserRole.CLIENT) {
            throw new Error("Sem Premissão")
        }

        const deletedService = await serviceRepository.delete(id);

        return {
            id: deletedService.id,
            name: deletedService.name
        }
    }

}

export default new ServiceService();