import { Router } from "express";
import  passwordController  from "../controllers/password.controller";

const resetPass = Router()

resetPass.post("/forgot", passwordController.forgotPass)
resetPass.post("/reset", passwordController.resetPassword)

export default resetPass