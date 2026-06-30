import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import appointmentController from "../controllers/appointment.controller";
import { roleMiddleware } from "../middlewares/role.middleware";
import { UserRole } from "@prisma/client";

const appointmentsRouter = Router()
appointmentsRouter.use(authMiddleware)

appointmentsRouter.get('/all', appointmentController.findAll)
appointmentsRouter.post('/create', appointmentController.create)
appointmentsRouter.patch('/update/:id', roleMiddleware(UserRole.ADMIN, UserRole.BARBER), appointmentController.updateStatus)
appointmentsRouter.patch('/cancel/:id', appointmentController.cancelAppointment)

export default appointmentsRouter