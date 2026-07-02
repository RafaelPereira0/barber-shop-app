import { useEffect, useState } from "react"
import type { ServiceType } from "../../types/service"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getServices } from "../../api/services.api"
import { createAppointment } from "../../api/appointment.api"
import { AppointmentSchema, type AppointmentFormData } from "../../schema/appointment.schema"
import { getUsers } from "../../api/user.api"
import type { UserType } from "../../types/user"

interface Props {
    onSuccess: () => void
}

export default function AppointmentForm({onSuccess}: Props){

    const [services, setServices] = useState<ServiceType[]>([])
    const [barbers, setBarbers] = useState<UserType[]>([])

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<AppointmentFormData>({
        resolver: zodResolver(AppointmentSchema)
    })

    async function loadBarbers() {
        try{
            const response = await getUsers()
            const searchBarbers = response.filter( user => user.role === "BARBER") 
            setBarbers(searchBarbers)
        }catch(err){
            console.log(err)
        }
    }

    async function loadServices() {
        try{
            const response = await getServices()
            setServices(response)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        loadBarbers()
        loadServices()
    },[])

    async function onSubmit(data: AppointmentFormData) {
        try{
            await createAppointment(data)

            onSuccess()
        }catch(err){
            console.log(err)
        }
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)}>

            <select defaultValue="" {...register("serviceId",{
                valueAsNumber: true
            })}>
                <option value="">Selecione um serviço</option>

                {services.map(service => (
                    <option value={service.id} key={service.id}>
                        {service.name}
                    </option>
                ))}
            </select>
            <p>{errors.serviceId?.message}</p>

            <select defaultValue="" {...register("barberId",{
                valueAsNumber: true
            })}>
                <option value="">Selecione um barbeiro</option>

                {barbers.map(barber => (
                    <option value={barber.id} key={barber.id}>
                        {barber.name}
                    </option>
                ))}
            </select>
            <p>{errors.barberId?.message}</p>

            <input type="datetime-local" {...register("date")}/>
            <p>{errors.date?.message}</p>

            <button type="submit">
                Agendar
            </button>
        </form>
    )
}