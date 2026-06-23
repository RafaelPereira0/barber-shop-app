import { Router } from "express";

const appointmentsRouter = Router()

appointmentsRouter.get('/', () => {console.log('appointment')})

export default appointmentsRouter