import barberRepositoy from "../repositories/barber.repository";
import { Barber } from "../types/Barber.type";

class BarberService {
    async findAll(): Promise<Barber[]>{
        const barbers = await barberRepositoy.findAll()

        return barbers
    }
}

export default new BarberService()