import { describe, it, expect, vi, beforeEach } from "vitest"
import { Request, Response } from "express"
import { AppointmentStatus, UserRole } from "@prisma/client"

import appointmentController from "../../controllers/appointment.controller"
import appointmentService from "../../services/appointment.service"

vi.mock("../../services/appointment.service", () => ({
    default: {
        createAppointment: vi.fn(),
        updateStatus: vi.fn(),
        cancelAppointment: vi.fn(),
        findAll: vi.fn()
    }
}))

describe("AppointmentController tests", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })


    it("should create appointment", async () => {

        const date = new Date("2026-08-20T10:00:00")

        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
            date,
            status: AppointmentStatus.PENDING
        }

        const req = {
            user: {
                id: 10,
                role: UserRole.CLIENT
            },
            body: {
                date,
                barberId: 2,
                serviceId: 1
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(appointmentService.createAppointment)
            .mockResolvedValue(appointment as any)

        await appointmentController.create(req, res)

        expect(appointmentService.createAppointment)
            .toHaveBeenCalledWith(
                10,
                {
                    date,
                    barberId: 2,
                    serviceId: 1
                }
            )

        expect(res.status)
            .toHaveBeenCalledWith(201)

        expect(res.json)
            .toHaveBeenCalledWith({
                result: appointment,
                message: "Agendamento criado com sucesso!"
            })
    })


    it("should return 400 when appointment creation fails", async () => {

        const date = new Date("2026-08-20T10:00:00")

        const req = {
            user: {
                id: 10,
                role: UserRole.CLIENT
            },
            body: {
                date,
                barberId: 2,
                serviceId: 1
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(appointmentService.createAppointment)
            .mockRejectedValue(
                new Error("Serviço não encontrado")
            )

        await appointmentController.create(req, res)

        expect(appointmentService.createAppointment)
            .toHaveBeenCalledWith(
                10,
                {
                    date,
                    barberId: 2,
                    serviceId: 1
                }
            )

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Serviço não encontrado"
            })
    })


    it("should return 400 when appointment data is invalid", async () => {

        const req = {
            user: {
                id: 10,
                role: UserRole.CLIENT
            },
            body: {
                date: "data inválida",
                barberId: 2,
                serviceId: 1
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await appointmentController.create(req, res)

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalled()

        expect(appointmentService.createAppointment)
            .not.toHaveBeenCalled()
    })

    it("should update appointment status", async () => {

        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
            status: AppointmentStatus.PENDING
        }

        const updatedAppointment = {
            ...appointment,
            status: AppointmentStatus.CONFIRMED
        }

        const req = {
            params: {
                id: "1"
            },
            body: {
                status: AppointmentStatus.CONFIRMED
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

        vi.mocked(appointmentService.updateStatus)
            .mockResolvedValue(updatedAppointment as any)

        await appointmentController.updateStatus(req, res)

        expect(appointmentService.updateStatus)
            .toHaveBeenCalledWith(
                1,
                AppointmentStatus.CONFIRMED,
                {
                    id: 2,
                    role: UserRole.BARBER
                }
            )

        expect(res.status)
            .toHaveBeenCalledWith(200)

        expect(res.json)
            .toHaveBeenCalledWith(updatedAppointment)
    })


    it("should return 400 when update appointment fails", async () => {

        const req = {
            params: {
                id: "1"
            },
            body: {
                status: AppointmentStatus.CONFIRMED
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

        vi.mocked(appointmentService.updateStatus)
            .mockRejectedValue(
                new Error("Agendamento não encontrado")
            )

        await appointmentController.updateStatus(req, res)

        expect(appointmentService.updateStatus)
            .toHaveBeenCalledWith(
                1,
                AppointmentStatus.CONFIRMED,
                {
                    id: 2,
                    role: UserRole.BARBER
                }
            )

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Agendamento não encontrado"
            })
    })

    it("should cancel appointment", async () => {

        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
            status: AppointmentStatus.CANCELED
        }

        const req = {
            params: {
                id: "1"
            },
            user: {
                id: 10,
                role: UserRole.CLIENT
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(appointmentService.cancelAppointment)
            .mockResolvedValue(appointment as any)

        await appointmentController.cancelAppointment(req, res)

        expect(appointmentService.cancelAppointment)
            .toHaveBeenCalledWith(
                1,
                {
                    id: 10,
                    role: UserRole.CLIENT
                }
            )

        expect(res.status)
            .toHaveBeenCalledWith(200)

        expect(res.json)
            .toHaveBeenCalledWith({
                result: appointment,
                message: "Status do agendamento atualizado!"
            })
    })


    it("should return 400 when cancel appointment fails", async () => {

        const req = {
            params: {
                id: "1"
            },
            user: {
                id: 10,
                role: UserRole.CLIENT
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(appointmentService.cancelAppointment)
            .mockRejectedValue(
                new Error("Você não pode cancelar esse agendamento.")
            )

        await appointmentController.cancelAppointment(req, res)

        expect(appointmentService.cancelAppointment)
            .toHaveBeenCalledWith(
                1,
                {
                    id: 10,
                    role: UserRole.CLIENT
                }
            )

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Você não pode cancelar esse agendamento."
            })
    })

    it("should bring appointments", async () => {

        const appointments = [
            {
                id: 1,
                clientId: 10,
                barberId: 2,
                serviceId: 1,
                status: AppointmentStatus.PENDING
            },
            {
                id: 2,
                clientId: 11,
                barberId: 3,
                serviceId: 2,
                status: AppointmentStatus.CONFIRMED
            }
        ]

        const req = {
            user: {
                id: 10,
                role: UserRole.CLIENT
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(appointmentService.findAll)
            .mockResolvedValue(appointments as any)

        await appointmentController.findAll(req, res)

        expect(appointmentService.findAll)
            .toHaveBeenCalledWith(
                10,
                UserRole.CLIENT
            )

        expect(res.status)
            .toHaveBeenCalledWith(200)

        expect(res.json)
            .toHaveBeenCalledWith({
                result: appointments,
                message: "Agendamentos encontrados!"
            })
    })


    it("should return 400 when findAll appointments fails", async () => {

        const req = {
            user: {
                id: 10,
                role: UserRole.CLIENT
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(appointmentService.findAll)
            .mockRejectedValue(
                new Error("Erro ao buscar agendamentos")
            )

        await appointmentController.findAll(req, res)

        expect(appointmentService.findAll)
            .toHaveBeenCalledWith(
                10,
                UserRole.CLIENT
            )

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Erro ao buscar agendamentos"
            })
    })

})