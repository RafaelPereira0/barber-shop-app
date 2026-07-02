export interface ServiceType {
    id:number;
    name: string;
    price: number;
    duration: number;
}

export interface CreateServiceData {
    name: string;
    price: number;
    duration: number;
}

export interface UpdateServiceData{
    name?: string,
    price?: number,
    duration?: number
}