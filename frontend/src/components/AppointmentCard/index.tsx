import type { AppointmentType } from "../../types/appointment";

interface Props {
    appointment: AppointmentType,
    canManage: boolean,
    onCancel: (id:number) => void,
    onUpdateStatus?: (id: number, status: string) => void
}


export default function AppointmentCard({
    appointment,
    canManage,
    onCancel,
    onUpdateStatus
}: Props){
    return(
        <div>
            <h2>{appointment.service?.name}</h2>

            <p>Cliente: {appointment.client?.name}</p>

            <p>Barbeiro: {appointment.barber?.name}</p>

            <p>Data: {new Date(appointment.date).toLocaleDateString()}</p>

            <p>Status: {appointment.status}</p>

            <button onClick={() => onCancel(appointment.id)}>
                Cancelar
            </button>

            {canManage && onUpdateStatus && (
                <>
                    <button onClick={() => onUpdateStatus(appointment.id, "CONFIRMED")}>
                        Confirmar
                    </button>

                    <button onClick={() => onUpdateStatus(appointment.id, "DONE")}>
                        Finalizar
                    </button>
                </>
            )}
        </div>
    )
}

