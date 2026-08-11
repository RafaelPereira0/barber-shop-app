import { AppointmentStatus, Prisma, UserRole } from '@prisma/client'
import { describe, vi, it, expect, beforeEach } from 'vitest'
import userRepository from '../../repositories/user.repository'
import serviceRepository from '../../repositories/service.repository'
import appointmentRepository from '../../repositories/appointment.repository'
import appointmentService from '../../services/appointment.service'


vi.mock("../../repositories/appointment.repository", () => ({
    default: {
        create: vi.fn(),
        updateStatus: vi.fn(),
        findById: vi.fn(),
        findByBarberAndDate: vi.fn(),
        findByClient: vi.fn(),
        findByBarber: vi.fn(),
        findAll: vi.fn()
    }
}))

vi.mock("../../repositories/user.repository", () => ({
    default: {
        findById: vi.fn()
    }
}))

vi.mock("../../repositories/service.repository", () => ({
    default: {
        findById: vi.fn()
    }
}))

describe("AppointmentService test", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("shoud create new appointment", async () => {
        const date = new Date("2026-08-12T10:00:00")

        const barber = {
            id: 2,
            name: "Carlos",
            email: "carlos@email.com",
            role: UserRole.BARBER
        }

        const service = {
            id: 1,
            name: "Corte",
            price: 50,
            duration: 30
        }

        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
            date,
            status: AppointmentStatus.PENDING
        }

        vi.mocked(userRepository.findById)
            .mockResolvedValue(barber as any)

        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(service as any)

        vi.mocked(appointmentRepository.findByBarberAndDate)
            .mockResolvedValue([])

        vi.mocked(appointmentRepository.create)
            .mockResolvedValue(appointment as any)

        const result = await appointmentService.createAppointment(
            10,
            {
                date,
                barberId: 2,
                serviceId: 1
            }
        )

        expect(userRepository.findById)
            .toHaveBeenCalledWith(2)

        expect(serviceRepository.findById)
            .toHaveBeenCalledWith(1)

        expect(appointmentRepository.findByBarberAndDate)
            .toHaveBeenCalled()

        expect(appointmentRepository.create)
            .toHaveBeenCalledWith({
                clientId: 10,
                barberId: 2,
                serviceId: 1,
                date
            })

        expect(result).toEqual(appointment)
    })

    it("should update appointment", async () => {
        const date = new Date()

        const user = {
            id: 2,
            role: UserRole.BARBER
        }

        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
            date,
            status: AppointmentStatus.PENDING
        }

        const data = {
            status: AppointmentStatus.CONFIRMED
        }

        vi.mocked(appointmentRepository.findById)
            .mockResolvedValue(appointment as any)

        vi.mocked(appointmentRepository.updateStatus)
            .mockResolvedValue({
                ...appointment,
                ...data
            } as any)

        const result = await appointmentService.updateStatus(1, AppointmentStatus.CONFIRMED, user)

        expect(appointmentRepository.findById)
            .toHaveBeenCalledWith(1)

        expect(appointmentRepository.updateStatus)
            .toHaveBeenCalledWith(1, AppointmentStatus.CONFIRMED)

        expect(result).toEqual({
            status: AppointmentStatus.CONFIRMED
        })
    })

    it("should delete appointment", async () => {
        const date = new Date()

        const user = {
            id: 2,
            role: UserRole.BARBER
        }

        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
            date,
            status: AppointmentStatus.PENDING
        }

        vi.mocked(appointmentRepository.findById)
            .mockResolvedValue(appointment)

        vi.mocked(appointmentRepository.updateStatus)
            .mockResolvedValue({
                ...appointment,
                status: AppointmentStatus.CANCELED
            })

        const result = await appointmentService.cancelAppointment(1, user)

        expect(appointmentRepository.findById)
            .toHaveBeenCalledWith(1)

        expect(appointmentRepository.updateStatus)
            .toHaveBeenCalledWith(1, AppointmentStatus.CANCELED)

        expect(result).toEqual(
            {
                ...appointment,
                status: AppointmentStatus.CANCELED
            }
        )
    })

    it("should bring appointments for client", async () => {
        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
        }

        vi.mocked(appointmentRepository.findByClient)
            .mockResolvedValue(appointment as any)

        const result = await appointmentService.findAll(10, UserRole.CLIENT)

        expect(appointmentRepository.findByClient)
            .toHaveBeenCalledWith({
                clientId: 10
            })

        expect(result).toEqual(appointment)
    })

    it("should bring appointments for barbers", async () => {
        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
        }

        vi.mocked(appointmentRepository.findByBarber)
            .mockResolvedValue(appointment as any)

        const result = await appointmentService.findAll(2, UserRole.BARBER)

        expect(appointmentRepository.findByBarber)
            .toHaveBeenCalledWith({
                barberId: 2
            })

        expect(result).toEqual(appointment)
    })

    it("should bring appointments for admins", async () => {
        const appointments = [
            {
                id: 1,
                clientId: 10,
                barberId: 2,
                serviceId: 1
            },
            {
                id: 2,
                clientId: 11,
                barberId: 3,
                serviceId: 2
            }
        ]

        vi.mocked(appointmentRepository.findAll)
            .mockResolvedValue(appointments as any)

        const result = await appointmentService.findAll(1, UserRole.ADMIN)

        expect(appointmentRepository.findAll)
            .toHaveBeenCalled()

        expect(result).toEqual(appointments)
    })

    it("creating - should throw error when date less than today", async () => {
        const data = {
            date: new Date("2026-08-01T10:00:00"),
            barberId: 2,
            serviceId: 1
        }

        await expect(appointmentService.createAppointment(10, data))
            .rejects.toThrow("Não é possível fazer agendamentos em dias passados!")

        expect(serviceRepository.findById)
            .not.toHaveBeenCalled()

        expect(appointmentRepository.findByBarberAndDate)
            .not.toHaveBeenCalled()

        expect(appointmentRepository.create)
            .not.toHaveBeenCalled()
    })

    it("creating - should throw error when barber does not exists", async () => {
        const data = {
            date: new Date("2026-08-12T10:00:00"),
            barberId: 999,
            serviceId: 1
        }

        vi.mocked(userRepository.findById)
            .mockResolvedValue(null)


        await expect(appointmentService.createAppointment(10, data))
            .rejects.toThrow("Barbeiro não encontrado")

        expect(userRepository.findById)
            .toHaveBeenCalledWith(999)

        expect(appointmentRepository.create)
            .not.toHaveBeenCalled()
    })

    it("creating - should throw error when user is not barber", async () => {
        const data = {
            date: new Date("2026-08-12T10:00:00"),
            barberId: 2,
            serviceId: 1,
            role: UserRole.CLIENT
        }

        vi.mocked(userRepository.findById)
            .mockResolvedValue(data as any)

        await expect(appointmentService.createAppointment(10, data))
            .rejects.toThrow("Usuário informado não é barbeiro")

        expect(userRepository.findById)
            .toHaveBeenCalledWith(2)

        expect(appointmentRepository.create)
            .not.toHaveBeenCalled()
    })

    it("creating - should throw error when service does not exists", async () => {
        const data = {
            date: new Date("2026-08-12T10:00:00"),
            barberId: 2,
            serviceId: 999,
            role: UserRole.BARBER
        }

        vi.mocked(userRepository.findById)
            .mockResolvedValue(data as any)

        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(null)


        await expect(appointmentService.createAppointment(10, data))
            .rejects.toThrow("Serviço não encontrado")

        expect(serviceRepository.findById)
            .toHaveBeenCalledWith(999)

        expect(userRepository.findById)
            .toHaveBeenCalledWith(2)

        expect(appointmentRepository.create)
            .not.toHaveBeenCalled()
    })

    it("creating - should throw error when barber-shop is closed", async () => {

        const user = {
            id: 2,
            name: "joao",
            email: "joao@email.com",
            role: UserRole.BARBER
        }

        const service = {
            id: 999,
            name: "corte",
            price: 50,
            duration: 30
        }

        const data = {
            date: new Date("2026-08-12T02:00:00"),
            barberId: 2,
            serviceId: 999
        }

        vi.mocked(userRepository.findById)
            .mockResolvedValue(user as any)

        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(service as any)


        await expect(appointmentService.createAppointment(10, data))
            .rejects.toThrow("A barbearia funciona apenas das 09:00 às 18:00.")

        expect(serviceRepository.findById)
            .toHaveBeenCalledWith(999)

        expect(userRepository.findById)
            .toHaveBeenCalledWith(2)

        expect(appointmentRepository.create)
            .not.toHaveBeenCalled()
    })

    it("creating - should throw error when is sunday", async () => {

        const user = {
            id: 2,
            name: "joao",
            email: "joao@email.com",
            role: UserRole.BARBER
        }

        const service = {
            id: 999,
            name: "corte",
            price: 50,
            duration: 30
        }

        const data = {
            date: new Date("2026-08-16T10:00:00"),
            barberId: 2,
            serviceId: 999
        }

        vi.mocked(userRepository.findById)
            .mockResolvedValue(user as any)

        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(service as any)


        await expect(appointmentService.createAppointment(10, data))
            .rejects.toThrow("A barbearia não funciona aos domingos.")

        expect(serviceRepository.findById)
            .toHaveBeenCalledWith(999)

        expect(userRepository.findById)
            .toHaveBeenCalledWith(2)

        expect(appointmentRepository.create)
            .not.toHaveBeenCalled()
    })

    it("creating - should throw error when appointment overlaps", async () => {

        const user = {
            id: 2,
            name: "joao",
            email: "joao@email.com",
            role: UserRole.BARBER
        }

        const service = {
            id: 999,
            name: "corte",
            price: 50,
            duration: 30
        }

        const data = {
            date: new Date("2026-08-12T10:10:00"),
            barberId: 2,
            serviceId: 999
        }

        vi.mocked(userRepository.findById)
            .mockResolvedValue(user as any)

        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(service as any)

        vi.mocked(appointmentRepository.findByBarberAndDate)
            .mockResolvedValue([{
                id:5,
                clientId:20,
                barberId:2,
                serviceId:1,
                date: new Date("2026-08-12T10:00:00"),
                status: AppointmentStatus.PENDING,
                service: {
                    id: 999,
                    name: "corte",
                    price: new Prisma.Decimal(50),
                    duration: 30,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }])

        await expect(appointmentService.createAppointment(10, data))
            .rejects.toThrow("O barbeiro já possui um agendamento nesse horário.")

        expect(serviceRepository.findById)
            .toHaveBeenCalledWith(999)

        expect(userRepository.findById)
            .toHaveBeenCalledWith(2)

        expect(appointmentRepository.create)
            .not.toHaveBeenCalled()
    })

    it("updating - should throw error appointment not found", async () => {
        const date = new Date()

        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
            date,
            status: AppointmentStatus.PENDING
        }

        const user = {
            id: 2,
            role: UserRole.BARBER
        }

        vi.mocked(appointmentRepository.findById)
            .mockResolvedValue(null)

        await expect(appointmentService.updateStatus(appointment.id, appointment.status, user))
            .rejects.toThrow("Agendamento não encontrado")
    })

    it("updating - should throw error when CLIENT try to update", async () => {
        const date = new Date()

        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
            date,
            status: AppointmentStatus.CONFIRMED
        }

        const user = {
            id: 1,
            role: UserRole.CLIENT
        }

        vi.mocked(appointmentRepository.findById)
            .mockResolvedValue(appointment)

        await expect(appointmentService.updateStatus(appointment.id, appointment.status, user))
            .rejects.toThrow("Clientes não têm permissão para confirmar ou finalizar agendamentos.")
    })

    it("updating - should throw error when a BARBER try to update appointment from another BARBER", async () => {
        const date = new Date()

        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
            date,
            status: AppointmentStatus.CONFIRMED
        }

        const user = {
            id: 1,
            role: UserRole.BARBER
        }

        vi.mocked(appointmentRepository.findById)
            .mockResolvedValue(appointment)

        await expect(appointmentService.updateStatus(appointment.id, appointment.status, user))
            .rejects.toThrow("Você não pode gerenciar o agendamento de outro barbeiro.")
    })

    it("updating - should throw error when a BARBER try to update appointment from another BARBER", async () => {
        const date = new Date()

        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
            date,
            status: AppointmentStatus.CANCELED
        }

        const user = {
            id: 1,
            role: UserRole.CLIENT
        }

        vi.mocked(appointmentRepository.findById)
            .mockResolvedValue(appointment)

        await expect(appointmentService.updateStatus(appointment.id, appointment.status, user))
            .rejects.toThrow("Você não pode cancelar o agendamento de outra pessoa.")
    })

    it("canceling - should throw error when appointment not found", async () => {
        const date = new Date()

        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
            date,
            status: AppointmentStatus.PENDING
        }

        const user = {
            id: 1,
            role: UserRole.CLIENT
        }

        vi.mocked(appointmentRepository.findById)
            .mockResolvedValue(null)

        await expect(appointmentService.cancelAppointment(appointment.id, user))
            .rejects.toThrow("Agendamento não encontrado")
    })

    it("canceling - should throw error when a CLIENT try to cancel a appointment from another CLIENT", async () => {
        const date = new Date()

        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
            date,
            status: AppointmentStatus.PENDING
        }

        const user = {
            id: 1,
            role: UserRole.CLIENT
        }

        vi.mocked(appointmentRepository.findById)
            .mockResolvedValue(appointment)

        await expect(appointmentService.cancelAppointment(appointment.id, user))
            .rejects.toThrow("Você não pode cancelar esse agendamento.")
    })

    it("canceling - should throw error when a CLIENT try to cancel a appointment from another CLIENT", async () => {
        const date = new Date()

        const appointment = {
            id: 1,
            clientId: 10,
            barberId: 2,
            serviceId: 1,
            date,
            status: AppointmentStatus.FINISHED
        }

        const user = {
            id: 10,
            role: UserRole.CLIENT
        }

        vi.mocked(appointmentRepository.findById)
            .mockResolvedValue(appointment)

        await expect(appointmentService.cancelAppointment(appointment.id, user))
            .rejects.toThrow("Agendamento já finalizado.")
    })
})