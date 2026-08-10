import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('../../repositories/user.repository', () => ({
    default: {
        findByEmail: vi.fn(),
        findById: vi.fn()
    }
}))


vi.mock("bcryptjs", () => ({
    default: {
        compare: vi.fn()
    }
}))

vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn(),
        verify: vi.fn()
    }
}))


import authService from '../../services/auth.service'
import userRepository from '../../repositories/user.repository'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


describe("AuthService test - login", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should login successfully", async () => {
        const user = {
            id: 1,
            name: "Jonas",
            email: "jonas@email.com",
            password: "hash-da-senha",
            role: "BARBER"
        }

        vi.mocked(userRepository.findByEmail)
            .mockResolvedValue(user as any)

        vi.mocked(bcrypt.compare)
            .mockResolvedValue(true as never);

        vi.mocked(jwt.sign)
            .mockReturnValue("fake-token" as any)


        const result = await authService.login({
            email: "jonas@email.com",
            password: "123456"
        })

        expect(userRepository.findByEmail)
            .toHaveBeenCalledWith("jonas@email.com")

        expect(bcrypt.compare)
            .toHaveBeenCalledWith("123456", "hash-da-senha")

        expect(result.user).toEqual({
            id: 1,
            name: "Jonas",
            email: "jonas@email.com",
            role: "BARBER"
        })

        expect(result.accessToken).toBeDefined()
        expect(result.refreshToken).toBeDefined()
    })

    it("should reject login when user does not exist", async () => {

        vi.mocked(userRepository.findByEmail)
            .mockResolvedValue(null)

        await expect(authService.login({
            email: "doesentexist@email.com",
            password: "123456"
        })).rejects.toThrow("Email ou senha inválidos")

        expect(userRepository.findByEmail)
            .toHaveBeenCalledWith("doesentexist@email.com")

        expect(bcrypt.compare)
            .not.toHaveBeenCalled()
    })

    it("should reject login when password is incorrect", async () => {

        const user = {
            id: 1,
            name: "Jonas",
            email: "jonas@email.com",
            password: "hash-da-senha",
            role: "BARBER"
        }

        vi.mocked(userRepository.findByEmail)
            .mockResolvedValue(user as any)

        vi.mocked(bcrypt.compare)
            .mockResolvedValue(false as never)

        await expect(authService.login({
            email: "jonas@email.com",
            password: "senha-errada"
        })).rejects.toThrow("Email ou senha inválidos")

        expect(userRepository.findByEmail)
            .toHaveBeenCalledWith("jonas@email.com")

        expect(bcrypt.compare)
            .toHaveBeenCalledWith("senha-errada", "hash-da-senha")
    })

    it("should refresh access token successfully", async () => {

        const user = {
            id: 1,
            name: "Jonas",
            email: "jonas@email.com",
            password: "hash-da-senha",
            role: "BARBER"
        }

        vi.mocked(jwt.verify).mockImplementation(
            ((token: any, secret: any, callback: any) => {
                callback(null, {
                    id: 1,
                    role: "BARBER"
                })
            }) as any
        )

        vi.mocked(userRepository.findById)
            .mockResolvedValue(user as any)

        vi.mocked(jwt.sign)
            .mockReturnValue("novo-access-token" as any)

        const result = await authService.refresh("refresh-token-fake")

        expect(jwt.verify)
            .toHaveBeenCalledWith(
                "refresh-token-fake",
                expect.anything(),
                expect.any(Function)
            )

        expect(userRepository.findById)
            .toHaveBeenCalledWith(1)

        expect(jwt.sign)
            .toHaveBeenCalled()

        expect(result.newAccessToken)
            .toBe("novo-access-token")
        
        expect(result.user)
            .toEqual(user)
    })

    it("should reject when refresh token is invalid", async () => {
        vi.mocked(jwt.verify).mockImplementation((
            (token: any, secret: any, callback: any) => {
                callback(new Error("Refresh inválido"), null)
            }
        )as any)

        await expect(authService.refresh("refresk-token-invalido"))
            .rejects.toThrow("Refresh inválido")
    })

    it("should reject when user does not exist", async () => {

        vi.mocked(jwt.verify).mockImplementation(
            ((token: any, secret: any, callback: any) => {
                callback(null, {
                    id: 1,
                    role: "BARBER"
                })
            }) as any
        )

        vi.mocked(userRepository.findById)
            .mockResolvedValue(null)

        await expect(authService.refresh("refresh-token-fake"))
            .rejects.toThrow("Usuário não encontrado")
    })
})

