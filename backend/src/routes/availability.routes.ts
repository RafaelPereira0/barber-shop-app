import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { UserRole } from "@prisma/client";
import availabilityController from "../controllers/availability.controller";

const availabilityRouter = Router()
availabilityRouter.use(authMiddleware)

availabilityRouter.get('/all', authMiddleware, availabilityController.getAvailableSlots)
availabilityRouter.post('/create/:barberId', authMiddleware, roleMiddleware(UserRole.ADMIN, UserRole.BARBER), availabilityController.setAvailability)
availabilityRouter.get('/barber/:barberId', authMiddleware, availabilityController.getBarberAvailability)
availabilityRouter.get('/slots', authMiddleware, availabilityController.getAvailableSlots)


export default availabilityRouter