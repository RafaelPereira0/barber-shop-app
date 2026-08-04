import express from "express"
import userRouter from "./routes/user.routes"
import appointmentsRouter from "./routes/appointments.routes"
import authRouter from "./routes/auth.routes"
import servicesRouter from "./routes/services.routes"
import cors from 'cors'
import availabilityRouter from "./routes/availability.routes"
import resetPass from "./routes/resetPass.routes"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/user', userRouter)
app.use('/appointment', appointmentsRouter)
app.use('/service', servicesRouter)
app.use('/login', authRouter)
app.use('/availability', availabilityRouter)
app.use('/password', resetPass)

export default app