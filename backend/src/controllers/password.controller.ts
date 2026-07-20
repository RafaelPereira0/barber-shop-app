import { Request, Response } from "express";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import userRepository from "../repositories/user.repository";
import prisma from "../config/database";
import { sendResetPasswordEmail } from "../utils/mailService";

class PasswordController {
    async forgotPass(req: Request, res: Response): Promise<Response> {
        const { email } = req.body

        try {
            const user = await userRepository.findByEmail(email)

            if (!user) {
                return res.status(200).json({ message: "Se o email existir, verifique sua caixa de entrada" })
            }

            const resetToken = randomBytes(32).toString("hex")

            const expire = new Date()
            expire.setHours(expire.getHours() + 1)

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    passwordResetExpires: expire,
                    passwordResetToken: resetToken
                }
            })

            await sendResetPasswordEmail(user.email, resetToken)

            return res.status(200).json({ message: "Se o email existir, verifique sua caixa de entrada" })
        } catch (err: any) {
            return res.status(500).json({ error: "Erro ao processar solicitação de recuperação de senha." });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<Response> {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: "Token e nova senha são obrigatórios." });
        }

        try {
            const user = await prisma.user.findFirst({
                where: { passwordResetToken: token },
            });

            if (!user || !user.passwordResetExpires) {
                return res.status(400).json({ error: "Token inválido ou expirado." });
            }

            if (new Date() > user.passwordResetExpires) {
                return res.status(400).json({ error: "Token expirado. Solicite uma nova recuperação." });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 8);

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    passwordResetToken: null,
                    passwordResetExpires: null,
                },
            });

            return res.status(200).json({ message: "Senha alterada com sucesso!" });
        } catch (err: any) {
            return res.status(500).json({ error: "Erro ao redefinir a senha." });
        }
    }

}

export default new PasswordController()