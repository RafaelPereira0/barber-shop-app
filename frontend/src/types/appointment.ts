export interface AppointmentType{
    id: number,
    date: string,
    status: string,

    client?: {
        id: number,
        name: string
    }

    barber?: {
        id: number,
        name: string
    }

    service?: {
        id: number,
        name: string,
        price: number
    }
}

export interface CreateAppointmentData {
    barberId: number,
    serviceId: number,
    date: string
}

export interface GetAvailableSlotsParams {
    barberId: number,
    date: string,
    serviceId: number
}

export interface TimeSlot{
    time: string,
    available: boolean
}