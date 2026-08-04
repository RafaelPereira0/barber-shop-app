import { Router } from "express";
import authController from "../controllers/auth.controller";

const authRouter = Router()

authRouter.post('/auth', authController.login)
authRouter.post('/refresh', authController.refresh)
authRouter.post('/logout', authController.logout)

export default authRouter