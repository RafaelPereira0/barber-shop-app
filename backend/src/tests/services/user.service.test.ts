import { describe, expect, it, vi, beforeEach } from "vitest";
import userRepository from "../../repositories/user.repository";
import userService from "../../services/user.service";
import { emailValidator } from "../../utils/validateEmail"
import bcrypt from 'bcryptjs'

vi.mock('../../repositories/user.repository', () => ({
    default: {
        findAll: vi.fn(),
        findAllBarbers: vi.fn(),
        findById: vi.fn(),
        findByEmail: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        deleteUser: vi.fn()
    }
}))

vi.mock("../../utils/validateEmail", () => ({
    emailValidator: vi.fn()
}))


vi.mock("bcryptjs", () => ({
    default: {
        hash: vi.fn()
    }
}))


describe("UserService test", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })


    it("should bring all users", async () => {
        const user = {
            id: 1,
            name: "Jonas",
            email: "jonas@email.com",
            role: "BARBER"
        }

        vi.mocked(userRepository.findAll)
            .mockResolvedValue([user] as any)

        const result = await userService.findAll()

        expect(userRepository.findAll)
            .toHaveBeenCalled()

        expect(result).toEqual([user])
    })

    it("should bring all barbers", async () => {
        const user = {
            id: 1,
            name: "Jonas",
            email: "jonas@email.com",
        }

        vi.mocked(userRepository.findAllBarbers)
            .mockResolvedValue([user] as any)

        const result = await userService.findAllBarbers()

        expect(userRepository.findAllBarbers)
            .toHaveBeenCalled()

        expect(result).toEqual([user])
    })

    it("should create new user", async () => {
        const data = {
            name: "jonas",
            email: "jonas@email.com",
            password: "123456",
            role: "CLIENT"
        }

        vi.mocked(userRepository.findByEmail)
            .mockResolvedValue(null)

        vi.mocked(userRepository.create)
            .mockResolvedValue({
                id: 1,
                name: "jonas",
                email: "jonas@email.com",
                role: "CLIENT"
            } as any)

        vi.mocked(emailValidator)
            .mockResolvedValue(true)

        vi.mocked(bcrypt.hash)
            .mockResolvedValue("senha-hash-falsa" as never)

        const result = await userService.createUser(data as any)

        expect(bcrypt.hash)
            .toHaveBeenCalledWith("123456", 8)

        expect(emailValidator)
            .toHaveBeenCalled()

        expect(userRepository.findByEmail)
            .toHaveBeenCalled()

        expect(userRepository.create)
            .toHaveBeenCalledWith({
                name: "jonas",
                email: "jonas@email.com",
                password: "senha-hash-falsa",
                role: "CLIENT"
            })

        expect(result).toEqual({
            id: 1,
            name: "jonas",
            email: "jonas@email.com",
            role: "CLIENT"
        })
    })

    it("should create new barber", async () => {
        const data = {
            name: "jonas",
            email: "jonas@email.com",
            password: "123456",
            role: "BARBER"
        }

        vi.mocked(userRepository.findByEmail)
            .mockResolvedValue(null)

        vi.mocked(userRepository.create)
            .mockResolvedValue({
                id: 1,
                name: "jonas",
                email: "jonas@email.com",
                role: "BARBER"
            } as any)

        vi.mocked(emailValidator)
            .mockResolvedValue(true)

        vi.mocked(bcrypt.hash)
            .mockResolvedValue("senha-hash-falsa" as never)

        const result = await userService.createUser(data as any)

        expect(bcrypt.hash)
            .toHaveBeenCalledWith("123456", 8)

        expect(emailValidator)
            .toHaveBeenCalled()

        expect(userRepository.findByEmail)
            .toHaveBeenCalled()

        expect(userRepository.create)
            .toHaveBeenCalledWith({
                name: "jonas",
                email: "jonas@email.com",
                password: "senha-hash-falsa",
                role: "BARBER"
            })

        expect(result).toEqual({
            id: 1,
            name: "jonas",
            email: "jonas@email.com",
            role: "BARBER"
        })
    })

    it("should update user", async () => {
        
        const user = {
            id: 1,
            name: "Jonas",
            email: "jonas@email.com",
            password: "senha-antiga",
            role: "BARBER"
        }

        const data = {
            name: "jonas atualizado",
            password: "123456"
        }

        vi.mocked(userRepository.findById)
            .mockResolvedValue(user as any)

        vi.mocked(bcrypt.hash)
            .mockResolvedValue("senha-hash-false" as never)

        vi.mocked(userRepository.update)
            .mockResolvedValue({
                id: 1,
                name: "jonas atualizado",
                email: "jonas@email.com",
                password: "senha-hash-false",
                role: "CLIENT"
            }as any)

        const result = await userService.updateUser(1, data as any)

        expect(userRepository.findById)
            .toHaveBeenCalledWith(1)

        expect(bcrypt.hash)
            .toHaveBeenCalledWith("123456", 10)

        expect(userRepository.update)
            .toHaveBeenCalledWith(1, {
                name: "jonas atualizado",
                password: "senha-hash-false"
            })

        expect(result).toEqual({
            id: 1,
            name: "jonas atualizado",
            email: "jonas@email.com",
            role: "CLIENT"
        })

    })

    it("should delete user", async () => {
        const user = {
            id: 1,
            name: "Jonas",
            email: "jonas@email.com",
            password: "senha-antiga",
            role: "BARBER"
        }

        vi.mocked(userRepository.findById)
            .mockResolvedValue(user as any)

        vi.mocked(userRepository.deleteUser)
            .mockResolvedValue(user as any)

        const result = await userService.deleteUser(1)

        expect(userRepository.findById)
            .toHaveBeenCalledWith(1)
        
        expect(userRepository.deleteUser)
            .toHaveBeenCalledWith(1)
        
        expect(result).toEqual({
            id: 1,
            name: "Jonas",
            email: "jonas@email.com",
            role: "BARBER"
        })
    })

    it("creating - should throw error when email already exists", async () => {
        const user = {
            id: 1,
            name: "jonas",
            email: "jonas@email.com",
            password: "hash",
            role: "CLIENT"
        }

        vi.mocked(userRepository.findByEmail)
            .mockResolvedValue(user as any)

        await expect(userService.createUser({
            name:"jonas2",
            email: "jonas@email.com",
            password: "123456",
            role: "CLIENT"
        })).rejects.toThrow("E-mail já cadastrado!")

        expect(emailValidator)
            .not.toHaveBeenCalled()

        expect(bcrypt.hash)
            .not.toHaveBeenCalled()

        expect(userRepository.create)
            .not.toHaveBeenCalled()
    })

    it("creating - should throw error when invalid email", async () => {
        const data = {
            id: 1,
            name: "jonas",
            email: "jonas@email.com",
            password: "hash",
            role: "CLIENT"
        }

        vi.mocked(userRepository.findByEmail)
            .mockResolvedValue(null)

        vi.mocked(emailValidator)
            .mockResolvedValue(false)

        await expect(userService.createUser(data as any))
            .rejects.toThrow("E-mail informado é invalido!")

        expect(bcrypt.hash)
            .not.toHaveBeenCalled()

        expect(userRepository.create)
            .not.toHaveBeenCalled()
    })

    it("updating - should throw error when user does not exists", async () => {

        vi.mocked(userRepository.findById)
            .mockResolvedValue(null)
        
        await expect(userService.updateUser(999, {
            name: "Ricardo"
        }as any))
            .rejects.toThrow("Usuário não encontrado")
        
        expect(userRepository.findById)
            .toHaveBeenCalledWith(999)
        
        expect(bcrypt.hash)
            .not.toHaveBeenCalled()

        expect(userRepository.update)
            .not.toHaveBeenCalled()
    })

    it("deleting - should throw error when user does not exists", async () => {
        
        vi.mocked(userRepository.findById)
            .mockResolvedValue(null)

        await expect(userService.deleteUser(999))
            .rejects.toThrow("Usuário não encontrado")
        
        expect(userRepository.findById)
            .toHaveBeenCalledWith(999)

        expect(userRepository.deleteUser)
            .not.toHaveBeenCalled()
    })
})
