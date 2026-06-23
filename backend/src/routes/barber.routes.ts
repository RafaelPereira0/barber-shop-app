import { Router } from "express";
import barberController from "../controllers/barber.controller";

const barberRouter = Router();

barberRouter.get('/', barberController.index)


export default barberRouter