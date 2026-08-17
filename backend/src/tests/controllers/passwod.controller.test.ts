import { describe, it, expect, vi, beforeEach } from "vitest"
import { Request, Response } from "express"

import passwordController from "../../controllers/password.controller"
import userRepository from "../../repositories/user.repository"
import prisma from "../../config/database"
import { sendResetPasswordEmail } from "../../utils/mailService"
import bcrypt from "bcrypt"

vi.mock("../../repositories/user.repository", () => ({
    default: {
        findByEmail: vi.fn()
    }
}))

vi.mock("../../config/database", () => ({
    default: {
        user: {
            update: vi.fn(),
            findFirst: vi.fn()
        }
    }
}))

vi.mock("../../utils/mailService", () => ({
    sendResetPasswordEmail: vi.fn()
}))

vi.mock("bcrypt", () => ({
    default: {
        hash: vi.fn()
    }
}))

vi.mock("crypto", () => ({
    randomBytes: vi.fn(() => ({
        toString: vi.fn(() => "reset-token-123")
    }))
}))


describe("PasswordController tests", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should send password reset email", async () => {

        const req = {
            body: {
                email: "joao@email.com"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const user = {
            id: 1,
            name: "Joao",
            email: "joao@email.com"
        }

        vi.mocked(userRepository.findByEmail)
            .mockResolvedValue(user as any)

        vi.mocked(prisma.user.update)
            .mockResolvedValue(user as any)

        vi.mocked(sendResetPasswordEmail)
            .mockResolvedValue(undefined)

        await passwordController.forgotPass(req, res)

        expect(userRepository.findByEmail)
            .toHaveBeenCalledWith("joao@email.com")

        expect(prisma.user.update)
            .toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        id: 1
                    },
                    data: expect.objectContaining({
                        passwordResetToken: "reset-token-123",
                        passwordResetExpires: expect.any(Date)
                    })
                })
            )

        expect(sendResetPasswordEmail)
            .toHaveBeenCalledWith(
                "joao@email.com",
                "reset-token-123"
            )

        expect(res.status)
            .toHaveBeenCalledWith(200)

        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Se o email existir, verifique sua caixa de entrada"
            })
    })


    it("should return 200 when email does not exist", async () => {

        const req = {
            body: {
                email: "naoexiste@email.com"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(userRepository.findByEmail)
            .mockResolvedValue(null)

        await passwordController.forgotPass(req, res)

        expect(userRepository.findByEmail)
            .toHaveBeenCalledWith("naoexiste@email.com")

        expect(prisma.user.update)
            .not.toHaveBeenCalled()

        expect(sendResetPasswordEmail)
            .not.toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(200)

        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Se o email existir, verifique sua caixa de entrada"
            })
    })


    it("should return 500 when forgot password processing fails", async () => {

        const req = {
            body: {
                email: "joao@email.com"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(userRepository.findByEmail)
            .mockRejectedValue(
                new Error("Database error")
            )

        await passwordController.forgotPass(req, res)

        expect(userRepository.findByEmail)
            .toHaveBeenCalledWith("joao@email.com")

        expect(res.status)
            .toHaveBeenCalledWith(500)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Erro ao processar solicitação de recuperação de senha."
            })
    })


    it("should return 500 when updating reset token fails", async () => {

        const req = {
            body: {
                email: "joao@email.com"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const user = {
            id: 1,
            name: "Joao",
            email: "joao@email.com"
        }

        vi.mocked(userRepository.findByEmail)
            .mockResolvedValue(user as any)

        vi.mocked(prisma.user.update)
            .mockRejectedValue(
                new Error("Database error")
            )

        await passwordController.forgotPass(req, res)

        expect(userRepository.findByEmail)
            .toHaveBeenCalledWith("joao@email.com")

        expect(prisma.user.update)
            .toHaveBeenCalled()

        expect(sendResetPasswordEmail)
            .not.toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(500)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Erro ao processar solicitação de recuperação de senha."
            })
    })


    it("should return 500 when sending reset email fails", async () => {

        const req = {
            body: {
                email: "joao@email.com"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const user = {
            id: 1,
            name: "Joao",
            email: "joao@email.com"
        }

        vi.mocked(userRepository.findByEmail)
            .mockResolvedValue(user as any)

        vi.mocked(prisma.user.update)
            .mockResolvedValue(user as any)

        vi.mocked(sendResetPasswordEmail)
            .mockRejectedValue(
                new Error("Email error")
            )

        await passwordController.forgotPass(req, res)

        expect(sendResetPasswordEmail)
            .toHaveBeenCalledWith(
                "joao@email.com",
                "reset-token-123"
            )

        expect(res.status)
            .toHaveBeenCalledWith(500)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Erro ao processar solicitação de recuperação de senha."
            })
    })


    it("should reset password successfully", async () => {

        const req = {
            body: {
                token: "reset-token-123",
                newPassword: "novaSenha123"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const user = {
            id: 1,
            email: "joao@email.com",
            passwordResetToken: "reset-token-123",
            passwordResetExpires: new Date(
                Date.now() + 60 * 60 * 1000
            )
        }

        vi.mocked(prisma.user.findFirst)
            .mockResolvedValue(user as any)

        vi.mocked(bcrypt.hash)
            .mockResolvedValue("hashed-password" as never)

        vi.mocked(prisma.user.update)
            .mockResolvedValue(user as any)

        await passwordController.resetPassword(req, res)

        expect(prisma.user.findFirst)
            .toHaveBeenCalledWith({
                where: {
                    passwordResetToken: "reset-token-123"
                }
            })

        expect(bcrypt.hash)
            .toHaveBeenCalledWith(
                "novaSenha123",
                8
            )

        expect(prisma.user.update)
            .toHaveBeenCalledWith({
                where: {
                    id: 1
                },
                data: {
                    password: "hashed-password",
                    passwordResetToken: null,
                    passwordResetExpires: null
                }
            })

        expect(res.status)
            .toHaveBeenCalledWith(200)

        expect(res.json)
            .toHaveBeenCalledWith({
                message: "Senha alterada com sucesso!"
            })
    })


    it("should return 400 when token is missing", async () => {

        const req = {
            body: {
                newPassword: "novaSenha123"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await passwordController.resetPassword(req, res)

        expect(prisma.user.findFirst)
            .not.toHaveBeenCalled()

        expect(bcrypt.hash)
            .not.toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Token e nova senha são obrigatórios."
            })
    })


    it("should return 400 when new password is missing", async () => {

        const req = {
            body: {
                token: "reset-token-123"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        await passwordController.resetPassword(req, res)

        expect(prisma.user.findFirst)
            .not.toHaveBeenCalled()

        expect(bcrypt.hash)
            .not.toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Token e nova senha são obrigatórios."
            })
    })


    it("should return 400 when user is not found by reset token", async () => {

        const req = {
            body: {
                token: "invalid-token",
                newPassword: "novaSenha123"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        vi.mocked(prisma.user.findFirst)
            .mockResolvedValue(null)

        await passwordController.resetPassword(req, res)

        expect(prisma.user.findFirst)
            .toHaveBeenCalledWith({
                where: {
                    passwordResetToken: "invalid-token"
                }
            })

        expect(bcrypt.hash)
            .not.toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Token inválido ou expirado."
            })
    })


    it("should return 400 when reset token has no expiration", async () => {

        const req = {
            body: {
                token: "reset-token-123",
                newPassword: "novaSenha123"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const user = {
            id: 1,
            passwordResetToken: "reset-token-123",
            passwordResetExpires: null
        }

        vi.mocked(prisma.user.findFirst)
            .mockResolvedValue(user as any)

        await passwordController.resetPassword(req, res)

        expect(prisma.user.findFirst)
            .toHaveBeenCalled()

        expect(bcrypt.hash)
            .not.toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Token inválido ou expirado."
            })
    })


    it("should return 400 when reset token is expired", async () => {

        const req = {
            body: {
                token: "expired-token",
                newPassword: "novaSenha123"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const user = {
            id: 1,
            passwordResetToken: "expired-token",
            passwordResetExpires: new Date(
                Date.now() - 60 * 60 * 1000
            )
        }

        vi.mocked(prisma.user.findFirst)
            .mockResolvedValue(user as any)

        await passwordController.resetPassword(req, res)

        expect(prisma.user.findFirst)
            .toHaveBeenCalledWith({
                where: {
                    passwordResetToken: "expired-token"
                }
            })

        expect(bcrypt.hash)
            .not.toHaveBeenCalled()

        expect(prisma.user.update)
            .not.toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(400)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Token expirado. Solicite uma nova recuperação."
            })
    })


    it("should return 500 when password hashing fails", async () => {

        const req = {
            body: {
                token: "reset-token-123",
                newPassword: "novaSenha123"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const user = {
            id: 1,
            passwordResetToken: "reset-token-123",
            passwordResetExpires: new Date(
                Date.now() + 60 * 60 * 1000
            )
        }

        vi.mocked(prisma.user.findFirst)
            .mockResolvedValue(user as any)

        vi.mocked(bcrypt.hash)
            .mockRejectedValue(
                new Error("Hash error")
            )

        await passwordController.resetPassword(req, res)

        expect(bcrypt.hash)
            .toHaveBeenCalledWith(
                "novaSenha123",
                8
            )

        expect(prisma.user.update)
            .not.toHaveBeenCalled()

        expect(res.status)
            .toHaveBeenCalledWith(500)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Erro ao redefinir a senha."
            })
    })


    it("should return 500 when updating password fails", async () => {

        const req = {
            body: {
                token: "reset-token-123",
                newPassword: "novaSenha123"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any

        const user = {
            id: 1,
            passwordResetToken: "reset-token-123",
            passwordResetExpires: new Date(
                Date.now() + 60 * 60 * 1000
            )
        }

        vi.mocked(prisma.user.findFirst)
            .mockResolvedValue(user as any)

        vi.mocked(bcrypt.hash)
            .mockResolvedValue("hashed-password" as never)

        vi.mocked(prisma.user.update)
            .mockRejectedValue(
                new Error("Database error")
            )

        await passwordController.resetPassword(req, res)

        expect(prisma.user.update)
            .toHaveBeenCalledWith({
                where: {
                    id: 1
                },
                data: {
                    password: "hashed-password",
                    passwordResetToken: null,
                    passwordResetExpires: null
                }
            })

        expect(res.status)
            .toHaveBeenCalledWith(500)

        expect(res.json)
            .toHaveBeenCalledWith({
                error: "Erro ao redefinir a senha."
            })
    })

})