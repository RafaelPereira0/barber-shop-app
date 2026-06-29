import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import appointmentController from "../controllers/appointment.controller";

const appointmentsRouter = Router()
appointmentsRouter.use(authMiddleware)

appointmentsRouter.get('/all', appointmentController.findAll)
appointmentsRouter.post('/create', appointmentController.create)
//fazer update e delete

export default appointmentsRouter