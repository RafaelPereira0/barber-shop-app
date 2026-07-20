import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { UserRole } from "@prisma/client";
import availabilityController from "../controllers/availability.controller";

const availabilityRouter = Router()
availabilityRouter.use(authMiddleware)

availabilityRouter.get('/all', availabilityController.getAvailableSlots)
availabilityRouter.post('/create/:barberId', roleMiddleware(UserRole.ADMIN, UserRole.BARBER), availabilityController.setAvailability)
availabilityRouter.get('/barber/:barberId', availabilityController.getBarberAvailability)
availabilityRouter.get('/slots', availabilityController.getAvailableSlots)


export default availabilityRouter