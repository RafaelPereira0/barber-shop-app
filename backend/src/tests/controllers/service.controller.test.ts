import { describe, it, vi, expect, beforeEach } from 'vitest'
import { Request, Response } from 'express'

import serviceController from '../../controllers/service.controller'
import serviceService from '../../services/service.service'
import { UserRole } from '@prisma/client'

vi.mock("../../services/service.service", () => ({
    default: {
        create: vi.fn(),
        findAll: vi.fn(),
        findById: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
    }
}))


describe("ServiceController test", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should create service", async () => {
        const req = {
            body: {
                name: "Corte Masculino",
                price: 50,
                duration: 30
            }
        } as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const service = {
            id: 1,
            name: "Corte Masculino",
            price: 50,
            duration: 30
        }

        vi.mocked(serviceService.create)
            .mockResolvedValue(service as any)

        await serviceController.create(req, res)

        expect(serviceService.create)
            .toHaveBeenCalledWith({
                name: "Corte Masculino",
                price: 50,
                duration: 30
            })

        expect(res.status)
            .toHaveBeenCalledWith(201)

        expect(res.json)
            .toHaveBeenCalledWith(service)
    })

    it("should bring all services", async () => {
        const services = [
            {
                id: 1,
                name: "Corte masculino",
                price: 50,
                duration: 30
            },
            {
                id: 2,
                name: "corte premium",
                price: 65,
                duration: 40
            }
        ]

        const res = {
            json: vi.fn()
        } as any

        vi.mocked(serviceService.findAll)
            .mockResolvedValue(services as any)

        await serviceController.findAll({} as any, res)

        expect(serviceService.findAll)
            .toHaveBeenCalled()

        expect(res.json)
            .toHaveBeenCalledWith(services)
    })

    it("should bring a service by id", async () => {
        const req = {
            params: {
                id: 1
            }
        } as unknown as Request

        const res = {
            json: vi.fn()
        } as any

        const service = {
            id: 1,
            name: "Corte masculino",
            price: 50,
            duration: 30
        }

        vi.mocked(serviceService.findById)
            .mockResolvedValue(service as any)

        await serviceController.findById(req, res)

        expect(serviceService.findById)
            .toHaveBeenCalledWith(req.params.id)

        expect(res.json)
            .toHaveBeenCalledWith(service)
    })

    it("should update a service", async () => {
        const req = {
            params: {
                id: 1
            },
            user: {
                id: 1,
                role: UserRole.BARBER
            },
            body: {
                name: "corte premium plus"
            }
        } as unknown as Request

        const res = {
            json: vi.fn()
        } as any

        const service = {
            id: 1,
            name: "corte premium plus",
            duration: 30,
            price: 20
        }

        vi.mocked(serviceService.update)
            .mockResolvedValue(service as any)

        await serviceController.update(req, res)

        expect(serviceService.update)
            .toHaveBeenCalledWith(req.params.id, req.body, req.user?.role)

        expect(res.json)
            .toHaveBeenCalledWith(service)
    })

    it("should delete a service", async () => {
        const req = {
            params: {
                id: 1
            },

            user: {
                id: 1,
                role: UserRole.ADMIN
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const service = {
            id: 1,
            name: "Corte masculino"
        }

        vi.mocked(serviceService.delete)
            .mockResolvedValue(service as any)

        await serviceController.delete(req, res)

        expect(serviceService.delete)
            .toHaveBeenCalledWith(req.params.id, req.user?.role)

        expect(res.status)
            .toHaveBeenCalledWith(204)

        expect(res.json)
            .toHaveBeenCalledWith({
                result: service,
                message: "Serviço deletado com sucesso!"
            })
    })

    it("it should throw error when create service fails", async () => {
        const req = {
            body: {
                id: 1,
                name: "Corte masculino",
                price: 50,
                duration: 30
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(serviceService.create)
            .mockRejectedValue(new Error("Erro ao criar serviço"))

        await serviceController.create(req, res)

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Erro ao criar serviço"
            })
    })

    it("it should throw error when service didn't find the id service", async () => {
        const req = {
            params: {
                id: 1
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(serviceService.findById)
            .mockRejectedValue(new Error("Serviço não encontrado"))

        await serviceController.findById(req, res)

        expect(res.status)
            .toHaveBeenCalledWith(404)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Serviço não encontrado"
            })
    })

    it("it should throw error when user not found to update", async () => {
        const req = {
            params: {
                id: 1
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }as any

        await serviceController.update(req, res)

        expect(res.status)
            .toHaveBeenCalledWith(401)

        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Usuário não autenticado"
            })

    })

    it("it should throw error when service fail to update", async () => {
        const req = {
            params: {
                id: 1
            },
            body: {
                name: "Corte premium plus"
            },
            user: {
                id: 1,
                role: UserRole.BARBER
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }as any

        vi.mocked(serviceService.update)
            .mockRejectedValue(new Error("Erro ao atualizar serviço"))

        await serviceController.update(req, res)

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Erro ao atualizar serviço"
            })
    })
})


