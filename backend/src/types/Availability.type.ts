export interface AvailabilityDTO {
    dayOfWeek: number;
    startTime: string,
    endTime: string
}

export interface SearchAvailabilityDTO {
    barberId: number,
    date: string,
    serviceId: number
}

export interface TimeSlotDTO {
    time: string,
    available: boolean
}