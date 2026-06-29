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

    async update(id: number, data: Partial<CreateServiceDTO>) {

        await this.findById(id);

        return serviceRepository.update(id, data);
    }

    async delete(id: number) {

        await this.findById(id);

        return serviceRepository.delete(id);
    }

}

export default new ServiceService();