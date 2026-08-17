import { describe, it, vi, beforeEach, expect } from 'vitest'
import { Request, Response } from 'express'

import userController from '../../controllers/user.controller'
import userService from '../../services/user.service'
import { UserRole } from '@prisma/client'


vi.mock("../../services/user.service", () => ({
    default: {
        createUser: vi.fn(),
        createBarber: vi.fn(),
        findAll: vi.fn(),
        findAllBarbers: vi.fn(),
        findById: vi.fn(),
        updateUser: vi.fn(),
        deleteUser: vi.fn()
    }
}))

describe("UserController tests", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should find all users", async () => {
        const users = [
            {
                id: 1,
                name: "joao",
                email: "joao@email.com",
                role: UserRole.CLIENT
            },
            {
                id: 2,
                name: "joao2",
                email: "joao2@email.com",
                role: UserRole.BARBER
            },
        ]

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(userService.findAll)
            .mockResolvedValue(users as any)

        await userController.getAllUsers({} as Request, res)

        expect(userService.findAll)
            .toHaveBeenCalled()

        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Usuários encontrados",
                result: users
            })

        expect(res.status)
            .toHaveBeenCalledWith(200)
    })

    it("should find all barbers", async () => {
        const users = [
            {
                id: 1,
                name: "joao",
                email: "joao@email.com",
                role: UserRole.BARBER
            },
            {
                id: 2,
                name: "joao2",
                email: "joao2@email.com",
                role: UserRole.BARBER
            },
        ]

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(userService.findAllBarbers)
            .mockResolvedValue(users as any)

        await userController.getBarbers({} as Request, res)

        expect(userService.findAllBarbers)
            .toHaveBeenCalled()

        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Usuários encontrados",
                result: users
            })

        expect(res.status)
            .toHaveBeenCalledWith(200)
    })

    it("it should create barber", async () => {

        const req = {
            body: {
                name: "Joao Silva",
                email: "joao@email.com",
                password: "123456"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(userService.createBarber)
            .mockResolvedValue({
                name: "Joao Silva",
                email: "joao@email.com",
                role: UserRole.BARBER
            } as any)

        await userController.barberRegister(req, res)
    })

    it("should update user", async () => {
        const req = {
            params: {
                id: 1
            },
            body: {
                name: "update name"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const user = {
            id: 1,
            name: "update name",
            email: "joao@email.com"
        }

        vi.mocked(userService.updateUser)
            .mockResolvedValue(user as any)

        await userController.updateUser(req, res)

        expect(userService.updateUser)
            .toHaveBeenCalledWith(req.params.id, req.body)

        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Usuário atualizado com sucesso",
                result: user
            })
    })

    it("should delete user", async () => {
        const req = {
            params: {
                id: 1
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const user = {
            id: 1,
            name: "joao",
            email: "joao@email.com"
        }

        vi.mocked(userService.deleteUser)
            .mockResolvedValue(user as any)

        await userController.deleteUser(req, res)

        expect(userService.deleteUser)
            .toHaveBeenCalledWith(req.params.id)

        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Usuário deletado com sucesso",
                result: user
            })
    })

    it("should return 400 when getAllUsers fails", async () => {
        const req = {} as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(userService.findAll)
            .mockRejectedValue(new Error("Erro ao buscar usuários"))

        await userController.getAllUsers(req, res)

        expect(userService.findAll)
            .toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Erro ao buscar usuários"
            })
    })

    it("should return 400 when getBarbers fails", async () => {
        const req = {} as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(userService.findAllBarbers)
            .mockRejectedValue(new Error("Erro ao buscar barbeiros"))

        await userController.getBarbers(req, res)

        expect(userService.findAllBarbers)
            .toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Erro ao buscar barbeiros"
            })
    })

    it("should return 400 when user data is invalid", async () => {
        const req = {
            body: {
                name: "Joao",
                email: "email-invalido",
                password: "123456"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await userController.userRegister(req, res)

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalled()

        expect(userService.createUser)
            .not.toHaveBeenCalled()
    })

    it("should return 400 when user creation fails", async () => {
        const req = {
            body: {
                name: "Joao Silva",
                email: "joao@email.com",
                password: "123456"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(userService.createUser)
            .mockRejectedValue(new Error("E-mail já cadastrado"))

        await userController.userRegister(req, res)

        expect(userService.createUser)
            .toHaveBeenCalledWith({
                name: "Joao Silva",
                email: "joao@email.com",
                password: "123456"
            })

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "E-mail já cadastrado"
            })
    })

    it("should return 400 when barber data is invalid", async () => {
        const req = {
            body: {
                name: "Joao",
                email: "email-invalido",
                password: "123456"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await userController.barberRegister(req, res)

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalled()

        expect(userService.createBarber)
            .not.toHaveBeenCalled()
    })

    it("should return 400 when barber data is invalid", async () => {
        const req = {
            body: {
                name: "Joao",
                email: "email-invalido",
                password: "123456"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await userController.barberRegister(req, res)

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalled()

        expect(userService.createBarber)
            .not.toHaveBeenCalled()
    })

    it("should return 400 when updateUser fails", async () => {
        const req = {
            params: {
                id: "1"
            },
            body: {
                name: "Novo nome"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(userService.updateUser)
            .mockRejectedValue(new Error("Usuário não encontrado"))

        await userController.updateUser(req, res)

        expect(userService.updateUser)
            .toHaveBeenCalledWith(1, {
                name: "Novo nome"
            })

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Usuário não encontrado"
            })
    })
})
