import express from "express"
import userRouter from "./routes/user.routes"
import appointmentsRouter from "./routes/appointments.routes"
import authRouter from "./routes/auth.routes"

const app = express()

app.use(express.json())

app.use('/user', userRouter)
app.use('/appointment', appointmentsRouter)
app.use('/login', authRouter)

export default app