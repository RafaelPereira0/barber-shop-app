import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const appointmentsRouter = Router()
appointmentsRouter.use(authMiddleware)

appointmentsRouter.get('/', () => {console.log('appointment')})

export default appointmentsRouter