import { describe, it, expect, vi, beforeEach } from "vitest"
import { Request, Response } from "express"

import authController from "../../controllers/auth.controller"
import authService from "../../services/auth.service"

vi.mock("../../services/auth.service", () => ({
    default: {
        login: vi.fn(),
        refresh: vi.fn()
    }
}))

describe("AuthController tests", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })


    it("should login user", async () => {

        const req = {
            body: {
                email: "joao@email.com",
                password: "123456"
            }
        } as unknown as Request

        const res = {
            cookie: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const result = {
            accessToken: "access-token",
            refreshToken: "refresh-token",
            user: {
                id: 1,
                name: "Joao",
                email: "joao@email.com"
            }
        }

        vi.mocked(authService.login)
            .mockResolvedValue(result as any)

        await authController.login(req, res)

        expect(authService.login)
            .toHaveBeenCalledWith({
                email: "joao@email.com",
                password: "123456"
            })

        expect(res.cookie)
            .toHaveBeenCalledWith(
                "refreshToken",
                "refresh-token",
                {
                    httpOnly: true,
                    sameSite: "lax",
                    maxAge: 7 * 20 * 60 * 60 * 1000
                }
            )

        expect(res.status)
            .toHaveBeenCalledWith(200)

        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Login feito com sucesso",
                accessToken: "access-token",
                user: result.user
            })
    })


    it("should return 401 when login fails", async () => {

        const req = {
            body: {
                email: "joao@email.com",
                password: "senhaerrada"
            }
        } as unknown as Request

        const res = {
            cookie: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(authService.login)
            .mockRejectedValue(
                new Error("E-mail ou senha inválidos")
            )

        await authController.login(req, res)

        expect(authService.login)
            .toHaveBeenCalledWith({
                email: "joao@email.com",
                password: "senhaerrada"
            })

        expect(res.cookie)
            .not.toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(401)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "E-mail ou senha inválidos"
            })
    })


    it("should refresh access token", async () => {

        const req = {
            cookies: {
                refreshToken: "refresh-token"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const result = {
            newAccessToken: "new-access-token",
            user: {
                id: 1,
                name: "Joao",
                email: "joao@email.com"
            }
        }

        vi.mocked(authService.refresh)
            .mockResolvedValue(result as any)

        await authController.refresh(req, res)

        expect(authService.refresh)
            .toHaveBeenCalledWith("refresh-token")

        expect(res.status)
            .toHaveBeenCalledWith(200)

        expect(res.json)
            .toHaveBeenCalledWith({
                accessToken: "new-access-token",
                user: result.user
            })
    })


    it("should return 401 when refresh token does not exist", async () => {

        const req = {
            cookies: {}
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await authController.refresh(req, res)

        expect(authService.refresh)
            .not.toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(401)

        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Refresh expirado"
            })
    })


    it("should return 401 when refresh fails", async () => {

        const req = {
            cookies: {
                refreshToken: "invalid-refresh-token"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(authService.refresh)
            .mockRejectedValue(
                new Error("Refresh token inválido ou expirado")
            )

        await authController.refresh(req, res)

        expect(authService.refresh)
            .toHaveBeenCalledWith(
                "invalid-refresh-token"
            )

        expect(res.status)
            .toHaveBeenCalledWith(401)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Refresh token inválido ou expirado"
            })
    })

    it("should logout user", async () => {

        const req = {} as Request

        const res = {
            clearCookie: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await authController.logout(req, res)

        expect(res.clearCookie)
            .toHaveBeenCalledWith(
                "refreshToken",
                {
                    httpOnly: true,
                    sameSite: "lax"
                }
            )

        expect(res.status)
            .toHaveBeenCalledWith(200)

        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Deslogado com sucesso!"
            })
    })

})