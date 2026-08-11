import { describe, vi, expect, it, beforeEach } from "vitest";
import serviceRepository from "../../repositories/service.repository";
import { Prisma, UserRole } from "@prisma/client"
import serviceService from "../../services/service.service";

vi.mock('../../repositories/service.repository', () => ({
    default: {
        findAll: vi.fn(),
        findById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
    }
}))


describe("ServiceService test", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should create new service", async () => {
        const data = {
            name: "Corte",
            price: 50,
            duration: 30
        }

        vi.mocked(serviceRepository.create)
            .mockResolvedValue({
                id: 1,
                name: "Corte",
                price: new Prisma.Decimal(50) ,
                duration: 30,
                createdAt: new Date(),
                updatedAt: new Date()
            })

        const result = await serviceService.create(data)

        expect(serviceRepository.create)
            .toHaveBeenCalledWith(data)

        expect(result).toEqual({
            id: 1,
            name: "Corte",
            price: new Prisma.Decimal(50),
            duration: 30,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        })
    })

    it("should bring all services", async () => {
        const service = {
            id: 1,
            name: "Corte",
            price: new Prisma.Decimal(50),
            duration: 30
        }

        vi.mocked(serviceRepository.findAll)
            .mockResolvedValue([service] as any)
        
        const result = await serviceService.findAll()

        expect(serviceRepository.findAll)
            .toHaveBeenCalled()

        expect(result).toEqual([service])
    })

    it("should bring the service by ID", async () => {
        const service = {
            id: 1,
            name: "Corte",
            price: new Prisma.Decimal(50),
            duration: 30
        }

        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(service as any)
        
        const result = await serviceService.findById(1)

        expect(serviceRepository.findById)
            .toHaveBeenCalledWith(1)
        
        expect(result).toEqual(service)
    })

    it("should update service", async () => {
        const service = {
            id: 1,
            name: "Corte",
            price: new Prisma.Decimal(50),
            duration: 30
        }

        const data = {
            name: "Corte Premium",
            price: 65
        }

        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(service as any)
        
        vi.mocked(serviceRepository.update)
            .mockResolvedValue({
                ...service,
                ...data
            }as any)

        const result = await serviceService.update(
            1,
            data,
            UserRole.ADMIN
        )

        expect(serviceRepository.findById)
            .toHaveBeenCalledWith(1)
        
        expect(serviceRepository.update)
            .toHaveBeenCalledWith(1, data)
        
        expect(result).toEqual({
            ...service,
            ...data
        })
    })

    it("should delete service", async () => {
        const service = {
            id: 1,
            name: "Corte",
            price: new Prisma.Decimal(50),
            duration: 30
        }

        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(service as any)

        vi.mocked(serviceRepository.delete)
            .mockResolvedValue(service as any)
        
        const result = await serviceService.delete(1, UserRole.ADMIN)

        expect(serviceRepository.findById)
            .toHaveBeenCalledWith(1)

        expect(serviceRepository.delete)
            .toHaveBeenCalledWith(1)
        
        expect(result).toEqual({
            id: 1,
            name: "Corte"
        })
    })

    it("creating - should throw error when name does not exists", async () => {
        const data = {
            name: "",
            price: new Prisma.Decimal(50),
            duration: 30
        }

        await expect(serviceService.create(data as any))
            .rejects.toThrow("Nome obrigatório.")

        expect(serviceRepository.create)
            .not.toHaveBeenCalled()
    })

    it("creating - should throw error when price does not exists", async () => {
        const data = {
            name: "Corte",
            price: 0,
            duration: 30
        }

        await expect(serviceService.create(data as any))
            .rejects.toThrow("Preço inválido.")

        expect(serviceRepository.create)
            .not.toHaveBeenCalled()
    })

    it("creating - should throw error when duration does not exists", async () => {
        const data = {
            name: "Corte",
            price: 50,
            duration: 0
        }

        await expect(serviceService.create(data as any))
            .rejects.toThrow("Duração inválida.")

        expect(serviceRepository.create)
            .not.toHaveBeenCalled()
    })

    it("find ID - should throw error when service does not exists", async () => {

        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(null)

        expect(serviceService.findById(999))
            .rejects.toThrow("Serviço não encontrado.")

        expect(serviceRepository.findById)
            .toHaveBeenCalledWith(999)
    })

    it("updating - should throw error when service does not exists", async () => {
        
        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(null)

        expect(serviceService.update(999, {
            name: "Corte Premium"
        }, UserRole.ADMIN))
            .rejects.toThrow("Serviço não encontrado")

        expect(serviceRepository.findById)
            .toHaveBeenCalledWith(999)
        
        expect(serviceRepository.update)
            .not.toHaveBeenCalled()
    })

    it("updating - should throw error when role is not authorized", async () => {
       
        const service = {
            id: 1,
            name: "Corte",
            price: 50,
            duration: 30
        }

        const data = {
            name: "Corte Premium",
            price: 70
        }
        
        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(service as any)

        expect(serviceService.update(1, data, UserRole.CLIENT))
            .rejects.toThrow("Sem Premissão")

        expect(serviceRepository.findById)
            .toHaveBeenCalledWith(1)
        
        expect(serviceRepository.update)
            .not.toHaveBeenCalled()
    })

    it("deleting - should throw error when service does not exists", async () => {

        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(null)
        
        expect(serviceService.delete(999, UserRole.ADMIN))
            .rejects.toThrow("Serviço não encontrado")

        expect(serviceRepository.findById)
            .toHaveBeenCalledWith(999)

        expect(serviceRepository.delete)
            .not.toHaveBeenCalled()
    })

    it("deleting - should throw error when role is not authorized", async () => {

        const service = {
            id: 1,
            name: "Corte",
            price: 50,
            duration: 30
        }

        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(service as any)
        
        expect(serviceService.delete(1, UserRole.CLIENT))
            .rejects.toThrow("Sem Premissão")

        expect(serviceRepository.findById)
            .toHaveBeenCalledWith(1)

        expect(serviceRepository.delete)
            .not.toHaveBeenCalled()
    })
})

