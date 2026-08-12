import { describe, vi, it, expect, beforeEach } from 'vitest'
import availabilityRepository from '../../repositories/availability.repository'
import availabilityService from '../../services/availability.service'
import serviceRepository from '../../repositories/service.repository'


vi.mock("../../repositories/availability.repository", () => ({
    default: {
        upsert: vi.fn(),
        findByBarberId: vi.fn(),
        availabilitySlot: vi.fn()
    }
}))

vi.mock("../../repositories/service.repository", () => ({
    default: {
        findById: vi.fn()
    }
}))

vi.mock("../../repositories/appointment.repository", () => ({
    findByBarberAndDate: vi.fn()
}))

describe("AvailabilityService test", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should set barber availability", async () => {
        const data = {
            dayOfWeek: 1,
            startTime: "09:00",
            endTime: "18:00"
        }

        vi.mocked(availabilityRepository.upsert)
            .mockResolvedValue({
                id: 1,
                barberId: 2,
                ...data
            } as any)

        const result = await availabilityService.setAvailability(2, data)

        expect(availabilityRepository.upsert)
            .toHaveBeenCalledWith(2, data)

        expect(result).toEqual({
            id: 1,
            barberId: 2,
            ...data
        })
    })

    it("should set barber availability", async () => {
        const data = {
            dayOfWeek: 1,
            startTime: "09:00",
            endTime: "18:00"
        }

        vi.mocked(availabilityRepository.upsert)
            .mockResolvedValue({
                id: 1,
                barberId: 2,
                ...data
            } as any)

        const result = await availabilityService.setAvailability(2, data)

        expect(availabilityRepository.upsert)
            .toHaveBeenCalledWith(2, data)

        expect(result).toEqual({
            id: 1,
            barberId: 2,
            ...data
        })
    })

    it("should throw error when time format is invalid", async () => {
        const data = {
            dayOfWeek: 1,
            startTime: "abc",
            endTime: "18:00"
        }

        await expect(
            availabilityService.setAvailability(2, data)
        ).rejects.toThrow(
            "Formato de horário inválido. Use o padrão HH:MM (ex: 09:00)."
        )

        expect(availabilityRepository.upsert)
            .not.toHaveBeenCalled()
    })

    it("should throw error when start time is greater than end time", async () => {
        const data = {
            dayOfWeek: 1,
            startTime: "18:00",
            endTime: "09:00"
        }

        await expect(
            availabilityService.setAvailability(2, data)
        ).rejects.toThrow(
            "O horário de início do atendimento não pode ser maior ou igual ao horário de término."
        )

        expect(availabilityRepository.upsert)
            .not.toHaveBeenCalled()
    })

    it("should get barber availability", async () => {
        const schedule = [
            {
                id: 1,
                barberId: 2,
                dayOfWeek: 1,
                startTime: "09:00",
                endTime: "18:00"
            }
        ]

        vi.mocked(availabilityRepository.findByBarberId)
            .mockResolvedValue(schedule as any)

        const result = await availabilityService.getBarberAvailability(2)

        expect(availabilityRepository.findByBarberId)
            .toHaveBeenCalledWith(2)

        expect(result).toEqual(schedule)
    })

    it("should throw error when barberId is not provided", async () => {

        await expect(
            availabilityService.getBarberAvailability(0)
        ).rejects.toThrow("Selecione um barbeiro.")

        expect(availabilityRepository.findByBarberId)
            .not.toHaveBeenCalled()
    })

    it("should throw error when dayOfWeek is invalid", async () => {
        const data = {
            dayOfWeek: 7,
            startTime: "09:00",
            endTime: "18:00"
        }

        await expect(
            availabilityService.setAvailability(2, data)
        ).rejects.toThrow("Dia da semana inválido")

        expect(availabilityRepository.upsert)
            .not.toHaveBeenCalled()
    })

    it("should throw error when startTime is invalid", async () => {
        const data = {
            dayOfWeek: 1,
            startTime: "abc",
            endTime: "18:00"
        }

        await expect(
            availabilityService.setAvailability(2, data)
        ).rejects.toThrow(
            "Formato de horário inválido. Use o padrão HH:MM (ex: 09:00)."
        )

        expect(availabilityRepository.upsert)
            .not.toHaveBeenCalled()
    })

    it("should throw error when endTime is invalid", async () => {
        const data = {
            dayOfWeek: 1,
            startTime: "09:00",
            endTime: "abc"
        }

        await expect(
            availabilityService.setAvailability(2, data)
        ).rejects.toThrow(
            "Formato de horário inválido. Use o padrão HH:MM (ex: 09:00)."
        )

        expect(availabilityRepository.upsert)
            .not.toHaveBeenCalled()
    })

    it("should throw error when startTime is greater than endTime", async () => {
        const data = {
            dayOfWeek: 1,
            startTime: "18:00",
            endTime: "09:00"
        }

        await expect(
            availabilityService.setAvailability(2, data)
        ).rejects.toThrow(
            "O horário de início do atendimento não pode ser maior ou igual ao horário de término."
        )

        expect(availabilityRepository.upsert)
            .not.toHaveBeenCalled()
    })

    it("should throw error when startTime equals endTime", async () => {
        const data = {
            dayOfWeek: 1,
            startTime: "09:00",
            endTime: "09:00"
        }

        await expect(
            availabilityService.setAvailability(2, data)
        ).rejects.toThrow(
            "O horário de início do atendimento não pode ser maior ou igual ao horário de término."
        )

        expect(availabilityRepository.upsert)
            .not.toHaveBeenCalled()
    })

    it("should throw error when barberId is not provided", async () => {

        await expect(
            availabilityService.getBarberAvailability(0)
        ).rejects.toThrow("Selecione um barbeiro.")

        expect(availabilityRepository.findByBarberId)
            .not.toHaveBeenCalled()
    })

    it("should throw error when service is not found", async () => {

        vi.mocked(availabilityRepository.availabilitySlot)
            .mockResolvedValue({
                startTime: "09:00",
                endTime: "18:00"
            } as any)

        vi.mocked(serviceRepository.findById)
            .mockResolvedValue(null)

        const query = {
            barberId: 2,
            date: "2026-08-13",
            serviceId: 1
        }

        await expect(
            availabilityService.getAvailableSlots(query)
        ).rejects.toThrow("Serviço não encontrado")
    })

    it("should return empty array when barber has no availability", async () => {

        vi.mocked(availabilityRepository.availabilitySlot)
            .mockResolvedValue(null)

        const query = {
            barberId: 2,
            date: "2026-08-13",
            serviceId: 1
        }

        const result = await availabilityService.getAvailableSlots(query)

        expect(result).toEqual([])

        expect(availabilityRepository.availabilitySlot)
            .toHaveBeenCalled()
    })
})