import express from "express"
import userRouter from "./routes/user.routes"
import appointmentsRouter from "./routes/appointments.routes"
import authRouter from "./routes/auth.routes"
import servicesRouter from "./routes/services.routes"
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/user', userRouter)
app.use('/appointment', appointmentsRouter)
app.use('/service', servicesRouter)
app.use('/login', authRouter)

export default app