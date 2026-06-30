import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { UserRole } from "@prisma/client";
import serviceController from "../controllers/service.controller";

const servicesRouter = Router()

servicesRouter.use(authMiddleware)

servicesRouter.post('/create', roleMiddleware(UserRole.ADMIN), serviceController.create)
servicesRouter.get('/all', serviceController.findAll)
servicesRouter.post('/:id', serviceController.findById)
servicesRouter.patch('/update/:id', roleMiddleware(UserRole.ADMIN), serviceController.update)
servicesRouter.delete('/delete/:id', roleMiddleware(UserRole.ADMIN), serviceController.delete)

export default servicesRouter