import { describe, it, expect, vi, beforeEach } from "vitest"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { UserRole } from "@prisma/client"

vi.mock("jsonwebtoken", () => ({
    default: {
        verify: vi.fn()
    }
}))

describe("AuthMiddleware tests", () => {

    let req: Request
    let res: Response
    let next: NextFunction

    beforeEach(() => {
        vi.clearAllMocks()

        req = {
            headers: {}
        } as Request

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        next = vi.fn()
    })


    it("should deny access when authorization header does not exist", () => {

        authMiddleware(req, res, next)

        expect(res.status)
            .toHaveBeenCalledWith(401)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Acesso Negado!"
            })

        expect(next)
            .not.toHaveBeenCalled()
    })


    it("should deny access when authorization header does not start with Bearer", () => {

        req.headers.authorization = "Basic 123456"

        authMiddleware(req, res, next)

        expect(res.status)
            .toHaveBeenCalledWith(401)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Acesso Negado!"
            })

        expect(next)
            .not.toHaveBeenCalled()
    })


    it("should deny access when token does not exist", () => {

        req.headers.authorization = "Bearer "

        authMiddleware(req, res, next)

        expect(res.status)
            .toHaveBeenCalledWith(401)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Acesso Negado!"
            })

        expect(next)
            .not.toHaveBeenCalled()
    })


    it("should authenticate user with valid token", () => {

        req.headers.authorization = "Bearer token-valido"

        vi.mocked(jwt.verify)
            .mockReturnValue({
                id: "10",
                role: UserRole.CLIENT
            } as any)

        authMiddleware(req, res, next)

        expect(jwt.verify)
            .toHaveBeenCalledWith(
                "token-valido",
                process.env.JWT_SECRET
            )

        expect(req.user)
            .toEqual({
                id: "10",
                role: UserRole.CLIENT
            })

        expect(next)
            .toHaveBeenCalled()

        expect(res.status)
            .not.toHaveBeenCalled()
    })


    it("should deny access when token is invalid", () => {

        req.headers.authorization = "Bearer token-invalido"

        vi.mocked(jwt.verify)
            .mockImplementation(() => {
                throw new Error("Token inválido")
            })

        authMiddleware(req, res, next)

        expect(res.status)
            .toHaveBeenCalledWith(401)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Token inválido ou expirado"
            })

        expect(next)
            .not.toHaveBeenCalled()
    })


    it("should deny access when token is expired", () => {

        req.headers.authorization = "Bearer token-expirado"

        vi.mocked(jwt.verify)
            .mockImplementation(() => {
                throw new jwt.TokenExpiredError(
                    "jwt expired",
                    new Date()
                )
            })

        authMiddleware(req, res, next)

        expect(res.status)
            .toHaveBeenCalledWith(401)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Token inválido ou expirado"
            })

        expect(next)
            .not.toHaveBeenCalled()
    })

})