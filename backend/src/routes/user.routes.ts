import { Router } from "express";
import userController from "../controllers/user.controller";

const userRouter = Router()

userRouter.get('/', () => console.log('user'))
userRouter.post('/create', userController.register)

export default userRouter