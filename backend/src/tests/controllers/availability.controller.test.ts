import { describe, it, expect, vi, beforeEach } from "vitest"
import { Request, Response } from "express"
import { UserRole } from "@prisma/client"

import availabilityController from "../../controllers/availability.controller"
import availabilityService from "../../services/availability.service"


vi.mock("../../services/availability.service", () => ({
    default: {
        setAvailability: vi.fn(),
        getBarberAvailability: vi.fn(),
        getAvailableSlots: vi.fn()
    }
}))


describe("AvailabilityController tests", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should set barber availability", async () => {

        const req = {
            params: {
                barberId: "2"
            },
            body: {
                dayOfWeek: 1,
                startTime: "09:00",
                endTime: "18:00"
            },
            user: {
                id: 2,
                role: UserRole.BARBER
            }
        } as unknown as Request


        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any


        const availability = {
            id: 1,
            barberId: 2,
            dayOfWeek: 1,
            startTime: "09:00",
            endTime: "18:00"
        }


        vi.mocked(availabilityService.setAvailability)
            .mockResolvedValue(availability as any)


        await availabilityController.setAvailability(req, res)


        expect(availabilityService.setAvailability)
            .toHaveBeenCalledWith(2, {
                dayOfWeek: 1,
                startTime: "09:00",
                endTime: "18:00"
            })


        expect(res.status)
            .toHaveBeenCalledWith(200)


        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Horário de atendimento atualizado",
                result: availability
            })
    })


    it("should allow ADMIN to set another barber availability", async () => {

        const req = {
            params: {
                barberId: "2"
            },
            body: {
                dayOfWeek: 2,
                startTime: "10:00",
                endTime: "17:00"
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


        const availability = {
            id: 1,
            barberId: 2,
            dayOfWeek: 2,
            startTime: "10:00",
            endTime: "17:00"
        }


        vi.mocked(availabilityService.setAvailability)
            .mockResolvedValue(availability as any)


        await availabilityController.setAvailability(req, res)


        expect(availabilityService.setAvailability)
            .toHaveBeenCalledWith(2, {
                dayOfWeek: 2,
                startTime: "10:00",
                endTime: "17:00"
            })


        expect(res.status)
            .toHaveBeenCalledWith(200)
    })


    it("should return 400 when barber tries to change another barber availability", async () => {

        const req = {
            params: {
                barberId: "2"
            },
            body: {
                dayOfWeek: 1,
                startTime: "09:00",
                endTime: "18:00"
            },
            user: {
                id: 3,
                role: UserRole.BARBER
            }
        } as unknown as Request


        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any


        await availabilityController.setAvailability(req, res)


        expect(res.status)
            .toHaveBeenCalledWith(400)


        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Acesso negado. Você só pode mudar sua agenda!"
            })


        expect(availabilityService.setAvailability)
            .not.toHaveBeenCalled()
    })


    it("should return 400 when setAvailability service throws an error", async () => {

        const req = {
            params: {
                barberId: "2"
            },
            body: {
                dayOfWeek: 1,
                startTime: "09:00",
                endTime: "18:00"
            },
            user: {
                id: 2,
                role: UserRole.BARBER
            }
        } as unknown as Request


        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any


        vi.mocked(availabilityService.setAvailability)
            .mockRejectedValue(
                new Error("Horário inválido")
            )


        await availabilityController.setAvailability(req, res)


        expect(availabilityService.setAvailability)
            .toHaveBeenCalled()


        expect(res.status)
            .toHaveBeenCalledWith(400)


        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Horário inválido"
            })
    })


    it("should get barber availability", async () => {

        const req = {
            params: {
                barberId: "2"
            }
        } as unknown as Request


        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any


        const schedule = [
            {
                id: 1,
                barberId: 2,
                dayOfWeek: 1,
                startTime: "09:00",
                endTime: "18:00"
            },
            {
                id: 2,
                barberId: 2,
                dayOfWeek: 2,
                startTime: "09:00",
                endTime: "18:00"
            }
        ]


        vi.mocked(availabilityService.getBarberAvailability)
            .mockResolvedValue(schedule as any)


        await availabilityController.getBarberAvailability(req, res)


        expect(availabilityService.getBarberAvailability)
            .toHaveBeenCalledWith(2)


        expect(res.status)
            .toHaveBeenCalledWith(200)


        expect(res.json)
            .toHaveBeenCalledWith({
                result: schedule
            })
    })


    it("should return 400 when getBarberAvailability service throws an error", async () => {

        const req = {
            params: {
                barberId: "999"
            }
        } as unknown as Request


        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any


        vi.mocked(availabilityService.getBarberAvailability)
            .mockRejectedValue(
                new Error("Barbeiro não encontrado")
            )


        await availabilityController.getBarberAvailability(req, res)


        expect(availabilityService.getBarberAvailability)
            .toHaveBeenCalledWith(999)


        expect(res.status)
            .toHaveBeenCalledWith(400)


        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Barbeiro não encontrado"
            })
    })


    it("should get available slots", async () => {

        const req = {
            query: {
                barberId: "2",
                date: "2026-08-20",
                serviceId: "1"
            }
        } as unknown as Request


        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any


        const slots = [
            "09:00",
            "09:30",
            "10:00",
            "10:30"
        ]


        vi.mocked(availabilityService.getAvailableSlots)
            .mockResolvedValue(slots as any)


        await availabilityController.getAvailableSlots(req, res)


        expect(availabilityService.getAvailableSlots)
            .toHaveBeenCalledWith({
                barberId: 2,
                date: "2026-08-20",
                serviceId: 1
            })


        expect(res.status)
            .toHaveBeenCalledWith(200)


        expect(res.json)
            .toHaveBeenCalledWith({
                result: slots
            })
    })


    it("should return 400 when required parameters are missing", async () => {

        const req = {
            query: {
                barberId: "2"
            }
        } as unknown as Request


        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any


        await availabilityController.getAvailableSlots(req, res)


        expect(res.status)
            .toHaveBeenCalledWith(400)


        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Faltam parâmetros obrigatórios: barberId, date, serviceId"
            })


        expect(availabilityService.getAvailableSlots)
            .not.toHaveBeenCalled()
    })


    it("should return 400 when date is missing", async () => {

        const req = {
            query: {
                barberId: "2",
                serviceId: "1"
            }
        } as unknown as Request


        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any


        await availabilityController.getAvailableSlots(req, res)


        expect(res.status)
            .toHaveBeenCalledWith(400)


        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Faltam parâmetros obrigatórios: barberId, date, serviceId"
            })


        expect(availabilityService.getAvailableSlots)
            .not.toHaveBeenCalled()
    })


    it("should return 400 when serviceId is missing", async () => {

        const req = {
            query: {
                barberId: "2",
                date: "2026-08-20"
            }
        } as unknown as Request


        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any


        await availabilityController.getAvailableSlots(req, res)


        expect(res.status)
            .toHaveBeenCalledWith(400)


        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Faltam parâmetros obrigatórios: barberId, date, serviceId"
            })


        expect(availabilityService.getAvailableSlots)
            .not.toHaveBeenCalled()
    })


    it("should return 400 when getAvailableSlots service throws an error", async () => {

        const req = {
            query: {
                barberId: "2",
                date: "2026-08-20",
                serviceId: "1"
            }
        } as unknown as Request


        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any


        vi.mocked(availabilityService.getAvailableSlots)
            .mockRejectedValue(
                new Error("Não foi possível buscar horários")
            )


        await availabilityController.getAvailableSlots(req, res)


        expect(availabilityService.getAvailableSlots)
            .toHaveBeenCalledWith({
                barberId: 2,
                date: "2026-08-20",
                serviceId: 1
            })


        expect(res.status)
            .toHaveBeenCalledWith(400)


        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Não foi possível buscar horários"
            })
    })

})