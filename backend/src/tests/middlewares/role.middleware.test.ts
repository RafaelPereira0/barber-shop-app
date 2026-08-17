import { describe, it, expect, vi, beforeEach } from "vitest"
import { Request, Response, NextFunction } from "express"
import { UserRole } from "@prisma/client"
import { roleMiddleware } from "../../middlewares/role.middleware"

describe("RoleMiddleware tests", () => {

    let req: Request
    let res: Response
    let next: NextFunction

    beforeEach(() => {
        vi.clearAllMocks()

        req = {} as Request

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        next = vi.fn()
    })


    it("should allow access when user has the allowed role", () => {

        req.user = {
            id: "1",
            role: UserRole.ADMIN
        }

        const middleware = roleMiddleware(UserRole.ADMIN)

        middleware(req, res, next)

        expect(next)
            .toHaveBeenCalled()

        expect(res.status)
            .not.toHaveBeenCalled()
    })


    it("should deny access when user does not have the allowed role", () => {

        req.user = {
            id: "1",
            role: UserRole.CLIENT
        }

        const middleware = roleMiddleware(UserRole.ADMIN)

        middleware(req, res, next)

        expect(res.status)
            .toHaveBeenCalledWith(403)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Acesso negado"
            })

        expect(next)
            .not.toHaveBeenCalled()
    })


    it("should allow multiple roles", () => {

        req.user = {
            id: "1",
            role: UserRole.BARBER
        }

        const middleware = roleMiddleware(
            UserRole.ADMIN,
            UserRole.BARBER
        )

        middleware(req, res, next)

        expect(next)
            .toHaveBeenCalled()

        expect(res.status)
            .not.toHaveBeenCalled()
    })


    it("should deny access when user has no role", () => {

        req.user = {
            id: "1"
        } as any

        const middleware = roleMiddleware(UserRole.ADMIN)

        middleware(req, res, next)

        expect(res.status)
            .toHaveBeenCalledWith(403)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Acesso negado"
            })

        expect(next)
            .not.toHaveBeenCalled()
    })


    it("should deny access when no roles are allowed", () => {

        req.user = {
            id: "1",
            role: UserRole.ADMIN
        }

        const middleware = roleMiddleware()

        middleware(req, res, next)

        expect(res.status)
            .toHaveBeenCalledWith(403)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Acesso negado"
            })

        expect(next)
            .not.toHaveBeenCalled()
    })

})