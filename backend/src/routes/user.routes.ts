import { Router } from "express";
import userController from "../controllers/user.controller";
import { roleMiddleware } from "../middlewares/role.middleware";
import { UserRole } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth.middleware";

const userRouter = Router()

userRouter.get('/all', authMiddleware, roleMiddleware(UserRole.ADMIN, UserRole.BARBER), userController.getAllUsers)
userRouter.post('/create', userController.userRegister)
userRouter.post('/create/barber', authMiddleware, roleMiddleware(UserRole.ADMIN), userController.barberRegister)
userRouter.patch('/update/:id', authMiddleware, userController.updateUser)
userRouter.delete('/delete/:id' ,authMiddleware, roleMiddleware(UserRole.ADMIN), userController.deleteUser)

export default userRouter