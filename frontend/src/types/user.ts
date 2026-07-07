export type UserRole =
    | "ADMIN"
    | "CLIENT"
    | "BARBER";

export interface UserType {
    id: number,
    name: string,
    email: string,
    role: UserRole
}

export interface Barber{
    name: string,
    id: number
}

export interface BarberFormData {
    name: string,
    email: string,
    password: string
}
