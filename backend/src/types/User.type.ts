import { UserRole } from "@prisma/client";

export interface UserResponseDTO {
    id: number,
    name: string,
    role: UserRole,
    email: string
}

export interface UpdateUserDTO{
    name?: string,
    email?: string,
    password?: string
}