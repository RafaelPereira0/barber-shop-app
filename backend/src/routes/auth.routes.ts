import { Router } from "express";
import authController from "../controllers/auth.controller";

const authRouter = Router()

authRouter.post('/auth', authController.login)

export default authRouter